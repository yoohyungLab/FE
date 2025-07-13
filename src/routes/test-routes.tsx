import { EgenTetoTestPage, TestCallbackPage, TestResultPage } from '@/pages/tests/egen-teto';
import DynamicTestPage from '@/pages/tests/dynamic-test-page';
import DynamicResultPage from '@/pages/tests/dynamic-result-page';

// 테스트 라우트 설정을 객체로 관리
export const testRoutes = [
    {
        path: '/tests/egen-teto',
        element: <EgenTetoTestPage />,
    },
    {
        path: '/tests/egen-teto/callback',
        element: <TestCallbackPage />,
    },
    {
        path: '/tests/egen-teto/result',
        element: <TestResultPage />,
    },
    // 동적 테스트 라우트 (관리자에서 생성한 테스트들)
    {
        path: '/tests/:slug',
        element: <DynamicTestPage />,
    },
    {
        path: '/tests/:slug/result',
        element: <DynamicResultPage />,
    },
    // 새로운 테스트 추가 시 여기에만 추가하면 됨
    // {
    //     path: '/tests/mbti',
    //     element: <MbtiTestPage />
    // }
];
