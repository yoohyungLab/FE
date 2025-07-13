# Supabase 디버깅 가이드

## 🚨 "email_not_confirmed" 에러 해결

### 즉시 해결 방법 (개발 환경용)

**Supabase SQL Editor에서 실행:**

```sql
-- 모든 미인증 사용자를 인증 완료 상태로 변경
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;

-- 특정 이메일만 인증 완료 처리
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'your-email@example.com'
AND email_confirmed_at IS NULL;
```

### Supabase 대시보드 설정 변경 (권장)

1. **Supabase 대시보드** → **Authentication** → **Settings**
2. **"Enable email confirmations"** → **OFF**
3. **저장**

### 임시 개발 설정

```sql
-- 개발 환경에서만 사용하는 임시 트리거
CREATE OR REPLACE FUNCTION auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
    -- 새로운 사용자 생성 시 자동으로 이메일 인증 완료
    IF NEW.email_confirmed_at IS NULL THEN
        NEW.email_confirmed_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (개발 환경에서만)
CREATE TRIGGER auto_confirm_on_signup
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auto_confirm_email();
```

**주의: 운영 환경에서는 이 트리거를 삭제하세요:**

```sql
-- 운영 환경에서는 트리거 삭제
DROP TRIGGER IF EXISTS auto_confirm_on_signup ON auth.users;
DROP FUNCTION IF EXISTS auto_confirm_email();
```

## 🚨 "Database error saving new user" 에러 해결

### 1단계: 환경 변수 확인

**`.env` 파일 확인:**

```bash
# 올바른 형식인지 확인
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...very-long-key
```

**브라우저 콘솔에서 확인:**

```javascript
// 개발자 도구 → 콘솔에 입력
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### 2단계: Supabase 프로젝트 상태 확인

1. **Supabase 대시보드** → **프로젝트 선택**
2. **Settings** → **General** → **프로젝트 상태가 "Active"인지 확인**
3. **Settings** → **API** → **URL과 anon key가 .env와 일치하는지 확인**

### 3단계: 데이터베이스 스키마 확인

**Supabase 대시보드 → SQL Editor → 다음 쿼리 실행:**

```sql
-- 테이블 존재 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'test_results', 'tests', 'questions', 'question_options', 'user_responses');

-- 트리거 함수 존재 확인
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('handle_new_user', 'handle_updated_at');

-- RLS 정책 확인
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

**결과가 비어있다면** → `supabase-setup.sql` 파일을 다시 실행하세요.

### 4단계: 이메일 설정 확인

**Supabase 대시보드 → Authentication → Settings:**

1. **"Enable email confirmations"** 설정 확인:

    - ✅ **개발용**: OFF (즉시 활성화)
    - ✅ **운영용**: ON (이메일 인증 필요)

2. **"Enable email change confirmations"**: OFF

3. **SMTP 설정** (운영 환경):
    - Gmail, SendGrid 등의 SMTP 설정
    - 개발 시에는 기본 Supabase 이메일 사용 가능

### 5단계: Auth 설정 확인

**Supabase 대시보드 → Authentication → Settings:**

```json
// Site URL 설정
Site URL: http://localhost:5173 (개발용)
Additional redirect URLs:
- http://localhost:3000
- https://your-domain.com (운영용)
```

### 6단계: 직접 테스트

**SQL Editor에서 직접 사용자 생성 테스트:**

```sql
-- 1. auth.users 테이블에 직접 삽입 테스트
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

-- 2. profiles 테이블 확인
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;
```

### 7단계: 로그 확인

**Supabase 대시보드 → Logs → Auth Logs:**

-   에러 메시지 상세 확인
-   실패한 요청의 정확한 원인 파악

### 8단계: 임시 해결책 (개발용)

**이메일 확인 비활성화:**

```sql
-- Supabase SQL Editor에서 실행
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;
```

**Supabase 대시보드에서:**

1. Authentication → Settings
2. "Enable email confirmations" → OFF

### 9단계: 프로젝트 재설정 (최후의 수단)

1. 새 Supabase 프로젝트 생성
2. 환경 변수 업데이트
3. `supabase-setup.sql` 재실행

## 🔍 일반적인 에러 원인

1. **환경 변수 오타** - 가장 흔한 원인
2. **RLS 정책 문제** - 트리거 함수가 제대로 실행되지 않음
3. **이메일 설정** - 이메일 인증 관련 설정 충돌
4. **프로젝트 상태** - Supabase 프로젝트가 일시 중지됨
5. **스키마 누락** - 테이블이나 함수가 생성되지 않음

## ✅ 성공 확인 방법

1. 회원가입 시 콘솔에 에러 없음
2. Supabase 대시보드 → Authentication → Users에서 사용자 확인
3. public.profiles 테이블에 사용자 프로필 자동 생성 확인
