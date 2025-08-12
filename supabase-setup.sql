-- ================================================
-- Supabase 데이터베이스 스키마 설정
-- ================================================

-- 1. 사용자 프로필 테이블 (이미 존재하는 경우 컬럼만 추가)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email VARCHAR(255),
            name VARCHAR(255) NOT NULL,
            avatar_url VARCHAR(255),
            provider VARCHAR(50) DEFAULT 'email',
            kakao_id VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    ELSE
        -- 필요한 컬럼이 없는 경우 추가
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'provider') THEN
            ALTER TABLE public.profiles ADD COLUMN provider VARCHAR(50) DEFAULT 'email';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'kakao_id') THEN
            ALTER TABLE public.profiles ADD COLUMN kakao_id VARCHAR(255);
        END IF;
    END IF;
END $$;

-- 2. 테스트 결과 테이블
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'test_results') THEN
        CREATE TABLE public.test_results (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            test_type VARCHAR(100) NOT NULL,
            result_data JSONB,
            score INTEGER,
            gender VARCHAR(10),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- 3. 테스트 테이블
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
        CREATE TABLE public.tests (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            slug VARCHAR(255) UNIQUE NOT NULL,
            is_published BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- 4. 질문 테이블
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'questions') THEN
        CREATE TABLE public.questions (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
            question_text TEXT NOT NULL,
            question_order INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- 5. 질문 옵션 테이블
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'question_options') THEN
        CREATE TABLE public.question_options (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
            option_text TEXT NOT NULL,
            option_value INTEGER NOT NULL,
            option_order INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- 6. 사용자 응답 테이블
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_responses') THEN
        CREATE TABLE public.user_responses (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
            session_id VARCHAR(255) NOT NULL,
            answers JSONB NOT NULL,
            result_id UUID,
            score INTEGER,
            metadata JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- 7. 건의사항 테이블
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feedbacks') THEN
        CREATE TABLE public.feedbacks (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            category VARCHAR(50) NOT NULL DEFAULT 'other',
            visibility VARCHAR(20) NOT NULL DEFAULT 'private',
            status VARCHAR(20) NOT NULL DEFAULT 'pending',
            author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            author_name VARCHAR(255),
            author_email VARCHAR(255),
            attached_file_url VARCHAR(500),
            admin_reply TEXT,
            admin_reply_at TIMESTAMP WITH TIME ZONE,
            views INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$;

-- 8. 카테고리 테이블
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        CREATE TABLE public.categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            display_name VARCHAR(255) NOT NULL,
            description TEXT,
            order_index INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    ELSE
        -- 필요한 컬럼이 없는 경우 추가
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'display_name') THEN
            ALTER TABLE public.categories ADD COLUMN display_name VARCHAR(255) NOT NULL DEFAULT '카테고리';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'description') THEN
            ALTER TABLE public.categories ADD COLUMN description TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'order_index') THEN
            ALTER TABLE public.categories ADD COLUMN order_index INTEGER DEFAULT 0;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'is_active') THEN
            ALTER TABLE public.categories ADD COLUMN is_active BOOLEAN DEFAULT true;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'updated_at') THEN
            ALTER TABLE public.categories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
        END IF;
    END IF;
END $$;

-- ================================================
-- RLS (Row Level Security) 설정
-- ================================================

-- 1. RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. 정책 설정 (기존 정책이 있는 경우 삭제 후 재생성)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 테스트 결과 정책
DROP POLICY IF EXISTS "Users can view own test results" ON public.test_results;
DROP POLICY IF EXISTS "Users can insert own test results" ON public.test_results;

CREATE POLICY "Users can view own test results" ON public.test_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results" ON public.test_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 테스트, 질문, 옵션 정책
DROP POLICY IF EXISTS "Anyone can view published tests" ON public.tests;
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;
DROP POLICY IF EXISTS "Anyone can view question options" ON public.question_options;

CREATE POLICY "Anyone can view published tests" ON public.tests
    FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view questions" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view question options" ON public.question_options
    FOR SELECT USING (true);

-- 사용자 응답 정책
DROP POLICY IF EXISTS "Anyone can insert responses" ON public.user_responses;
DROP POLICY IF EXISTS "Anyone can view responses by session" ON public.user_responses;

CREATE POLICY "Anyone can insert responses" ON public.user_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view responses by session" ON public.user_responses
    FOR SELECT USING (true);

-- 건의사항 정책
DROP POLICY IF EXISTS "Users can view own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Users can insert own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Users can update own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Users can delete own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Admins can view all feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Admins can update all feedbacks" ON public.feedbacks;

CREATE POLICY "Users can view own feedbacks" ON public.feedbacks
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can insert own feedbacks" ON public.feedbacks
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own feedbacks" ON public.feedbacks
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own feedbacks" ON public.feedbacks
    FOR DELETE USING (auth.uid() = author_id);

-- 관리자 정책 (admin 역할을 가진 사용자)
CREATE POLICY "Admins can view all feedbacks" ON public.feedbacks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all feedbacks" ON public.feedbacks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role = 'admin'
        )
    );

-- 카테고리 정책
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;

CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role = 'admin'
        )
    );

-- ================================================
-- 트리거 함수 설정
-- ================================================

-- 1. 사용자 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, provider)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        CASE 
            WHEN NEW.app_metadata->>'provider' = 'kakao' THEN 'kakao'
            ELSE 'email'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 트리거 생성 (기존 트리거가 있는 경우 삭제 후 재생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (기존 트리거가 있는 경우 삭제 후 재생성)
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_tests ON public.tests;
DROP TRIGGER IF EXISTS handle_updated_at_feedbacks ON public.feedbacks;
DROP TRIGGER IF EXISTS handle_updated_at_categories ON public.categories;

CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_tests
    BEFORE UPDATE ON public.tests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_feedbacks
    BEFORE UPDATE ON public.feedbacks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_categories
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ================================================
-- 인덱스 생성
-- ================================================

-- 기존 인덱스가 있는 경우 삭제 후 재생성
DROP INDEX IF EXISTS idx_profiles_email;
DROP INDEX IF EXISTS idx_test_results_user_id;
DROP INDEX IF EXISTS idx_test_results_test_type;
DROP INDEX IF EXISTS idx_questions_test_id;
DROP INDEX IF EXISTS idx_question_options_question_id;
DROP INDEX IF EXISTS idx_user_responses_session_id;
DROP INDEX IF EXISTS idx_user_responses_test_id;
DROP INDEX IF EXISTS idx_feedbacks_author_id;
DROP INDEX IF EXISTS idx_feedbacks_status;
DROP INDEX IF EXISTS idx_feedbacks_category;
DROP INDEX IF EXISTS idx_feedbacks_created_at;
DROP INDEX IF EXISTS idx_categories_name;
DROP INDEX IF EXISTS idx_categories_order_index;
DROP INDEX IF EXISTS idx_categories_is_active;

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX idx_test_results_test_type ON public.test_results(test_type);
CREATE INDEX idx_questions_test_id ON public.questions(test_id);
CREATE INDEX idx_question_options_question_id ON public.question_options(question_id);
CREATE INDEX idx_user_responses_session_id ON public.user_responses(session_id);
CREATE INDEX idx_user_responses_test_id ON public.user_responses(test_id);
CREATE INDEX idx_feedbacks_author_id ON public.feedbacks(author_id);
CREATE INDEX idx_feedbacks_status ON public.feedbacks(status);
CREATE INDEX idx_feedbacks_category ON public.feedbacks(category);
CREATE INDEX idx_feedbacks_created_at ON public.feedbacks(created_at);
CREATE INDEX idx_categories_name ON public.categories(name);
CREATE INDEX idx_categories_order_index ON public.categories(order_index);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);

-- ================================================
-- 초기 데이터 삽입 (기존 데이터가 없는 경우에만)
-- ================================================

-- 기본 카테고리 데이터
INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'personality', '성격', '성격과 관련된 테스트', 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'personality');

INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'relationship', '연애/인간관계', '연애와 인간관계 관련 테스트', 2, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'relationship');

INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'emotion', '감정/멘탈', '감정과 멘탈 관련 테스트', 3, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'emotion');

INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'balance', '밸런스 게임', '밸런스 게임 형태의 테스트', 4, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'balance');

INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'thinking', '사고/결정 방식', '사고와 결정 방식 관련 테스트', 5, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'thinking');

INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'intelligence', '지능/능력', '지능과 능력 관련 테스트', 6, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'intelligence');

INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'lifestyle', '라이프스타일', '라이프스타일 관련 테스트', 7, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'lifestyle');

INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'mbti', 'MBTI 응용', 'MBTI를 응용한 테스트', 8, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'mbti');

INSERT INTO public.categories (name, display_name, description, order_index, is_active)
SELECT 'other', '기타', '기타 분류의 테스트', 9, true
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'other'); 