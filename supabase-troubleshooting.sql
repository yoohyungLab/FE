-- ================================================
-- Supabase 500 에러 해결을 위한 진단 및 수정 스크립트
-- ================================================

-- 1. 현재 데이터베이스 상태 확인
-- ================================================

-- 테이블 존재 여부 확인
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'test_results', 'tests', 'questions', 'question_options', 'user_responses');

-- 함수 존재 여부 확인
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('handle_new_user', 'handle_updated_at');

-- 트리거 존재 여부 확인
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- RLS 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public';

-- ================================================
-- 2. 문제 해결을 위한 단계별 스크립트
-- ================================================

-- STEP 1: 기존 테이블 및 함수 정리 (필요시)
-- ================================================
/*
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_tests ON public.tests;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP TABLE IF EXISTS public.user_responses CASCADE;
DROP TABLE IF EXISTS public.question_options CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.tests CASCADE;
DROP TABLE IF EXISTS public.test_results CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
*/

-- STEP 2: 최소한의 스키마 재생성 (profiles 테이블만)
-- ================================================

-- 2-1. profiles 테이블 생성
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    provider VARCHAR(50) DEFAULT 'email',
    kakao_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2-2. RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2-3. 기본 정책 설정
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2-4. 트리거 함수 생성 (간단한 버전)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, provider)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
        CASE 
            WHEN NEW.app_metadata->>'provider' = 'kakao' THEN 'kakao'
            WHEN NEW.app_metadata->>'provider' = 'google' THEN 'google'
            ELSE 'email'
        END
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- 에러가 발생해도 사용자 생성을 막지 않음
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2-5. 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2-6. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ================================================
-- 3. 권한 확인 및 설정
-- ================================================

-- anon 역할에 필요한 권한 부여
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT INSERT ON public.profiles TO anon;

-- authenticated 역할에 필요한 권한 부여
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- ================================================
-- 4. 테스트 스크립트
-- ================================================

-- 4-1. 직접 사용자 생성 테스트 (임시)
/*
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'test@example.com',
    crypt('testpassword123', gen_salt('bf')),
    now(),
    '{"name": "테스트 사용자"}',
    now(),
    now()
);
*/

-- 4-2. profiles 테이블 확인
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;

-- 4-3. auth.users 테이블 확인
SELECT id, email, email_confirmed_at, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- ================================================
-- 5. 로그 확인을 위한 쿼리
-- ================================================

-- 최근 에러 로그 확인 (Supabase 대시보드에서 실행)
-- Logs → Postgres Logs에서 확인

-- 트리거 함수 실행 로그 확인
-- Logs → Function Logs에서 handle_new_user 함수 로그 확인 