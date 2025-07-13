-- ================================================
-- Supabase 데이터베이스 스키마 설정
-- ================================================

-- 1. 사용자 프로필 테이블
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

-- 2. 테스트 결과 테이블
CREATE TABLE public.test_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    test_type VARCHAR(100) NOT NULL,
    result_data JSONB,
    score INTEGER,
    gender VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 테스트 테이블
CREATE TABLE public.tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 질문 테이블
CREATE TABLE public.questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. 질문 옵션 테이블
CREATE TABLE public.question_options (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_value INTEGER NOT NULL,
    option_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. 사용자 응답 테이블
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

-- 2. 정책 설정
-- 프로필: 본인만 읽기/쓰기
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 테스트 결과: 본인만 읽기/쓰기
CREATE POLICY "Users can view own test results" ON public.test_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test results" ON public.test_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 테스트, 질문, 옵션: 모든 사용자 읽기 가능
CREATE POLICY "Anyone can view published tests" ON public.tests
    FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view questions" ON public.questions
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view question options" ON public.question_options
    FOR SELECT USING (true);

-- 사용자 응답: 모든 사용자 삽입 가능 (익명 테스트 지원)
CREATE POLICY "Anyone can insert responses" ON public.user_responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view responses by session" ON public.user_responses
    FOR SELECT USING (true);

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

-- 2. 트리거 생성
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

CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_tests
    BEFORE UPDATE ON public.tests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ================================================
-- 인덱스 생성
-- ================================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX idx_test_results_test_type ON public.test_results(test_type);
CREATE INDEX idx_questions_test_id ON public.questions(test_id);
CREATE INDEX idx_question_options_question_id ON public.question_options(question_id);
CREATE INDEX idx_user_responses_session_id ON public.user_responses(session_id);
CREATE INDEX idx_user_responses_test_id ON public.user_responses(test_id); 