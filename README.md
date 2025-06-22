# 테스트

나의 호르몬 성향을 알아보는 심리테스트입니다.

## 기술 스택

-   **Frontend**: React 19, TypeScript, Vite
-   **Styling**: Tailwind CSS, shadcn/ui
-   **Database**: Supabase (PostgreSQL)
-   **State Management**: React Hooks

## 주요 기능

-   🧠 10문항 심리테스트
-   📊 실시간 점수 계산
-   🎨 현대적인 Glassmorphism UI
-   📱 반응형 디자인
-   💾 Supabase를 통한 결과 저장
-   📈 전체 결과 통계 확인

## 프로젝트 구조

```
src/
├── components/
│   ├── ui/
│   │   └── button.tsx          # shadcn/ui Button 컴포넌트
│   ├── GenderSelection.tsx     # 성별 선택 컴포넌트
│   ├── Questionnaire.tsx       # 질문지 컴포넌트
│   ├── Result.tsx              # 개인 결과 컴포넌트
│   └── ResultsPage.tsx         # 전체 결과 페이지
├── lib/
│   ├── supabase.ts             # Supabase 클라이언트 및 함수
│   └── utils.ts                # 유틸리티 함수
├── App.tsx                     # 메인 앱 컴포넌트
└── index.css                   # Tailwind CSS 설정
```

## 배포

### Netlify 배포

1. GitHub에 코드를 푸시합니다.
2. [Netlify](https://netlify.com)에서 새 사이트를 생성합니다.
3. 환경 변수를 설정합니다.
4. 배포를 완료합니다.
