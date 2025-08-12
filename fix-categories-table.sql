-- ================================================
-- 카테고리 테이블 컬럼 수정 SQL
-- ================================================

-- 1. display_name 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'display_name') THEN
        ALTER TABLE public.categories ADD COLUMN display_name VARCHAR(255) NOT NULL DEFAULT '카테고리';
        RAISE NOTICE 'display_name 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'display_name 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 2. description 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'description') THEN
        ALTER TABLE public.categories ADD COLUMN description TEXT;
        RAISE NOTICE 'description 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'description 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 3. order_index 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'order_index') THEN
        ALTER TABLE public.categories ADD COLUMN order_index INTEGER DEFAULT 0;
        RAISE NOTICE 'order_index 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'order_index 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 4. is_active 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'is_active') THEN
        ALTER TABLE public.categories ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'is_active 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'is_active 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 5. updated_at 컬럼 추가
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'updated_at') THEN
        ALTER TABLE public.categories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
        RAISE NOTICE 'updated_at 컬럼이 추가되었습니다.';
    ELSE
        RAISE NOTICE 'updated_at 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 6. 기존 데이터에 display_name 설정 (name과 동일하게)
UPDATE public.categories 
SET display_name = name 
WHERE display_name = '카테고리' OR display_name IS NULL;

-- 7. 기존 데이터에 order_index 설정
UPDATE public.categories 
SET order_index = id 
WHERE order_index = 0 OR order_index IS NULL;

-- 8. 기존 데이터에 is_active 설정
UPDATE public.categories 
SET is_active = true 
WHERE is_active IS NULL;

-- 9. updated_at 트리거 생성 (기존 트리거가 있는 경우 삭제 후 재생성)
DROP TRIGGER IF EXISTS handle_updated_at_categories ON public.categories;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_categories
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. 인덱스 생성 (기존 인덱스가 있는 경우 삭제 후 재생성)
DROP INDEX IF EXISTS idx_categories_name;
DROP INDEX IF EXISTS idx_categories_order_index;
DROP INDEX IF EXISTS idx_categories_is_active;

CREATE INDEX idx_categories_name ON public.categories(name);
CREATE INDEX idx_categories_order_index ON public.categories(order_index);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);

-- 11. RLS 정책 설정 (기존 정책이 있는 경우 삭제 후 재생성)
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

-- 12. 기본 카테고리 데이터 삽입 (기존 데이터가 없는 경우에만)
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

-- 13. 결과 확인
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

-- 14. 데이터 확인
SELECT 
    id, 
    name, 
    display_name, 
    description, 
    order_index, 
    is_active, 
    created_at, 
    updated_at
FROM public.categories 
ORDER BY order_index; 