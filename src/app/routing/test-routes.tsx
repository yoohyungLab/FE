import { EgenTetoTestPage, TestCallbackPage, TestResultPage } from '@/pages/tests/egen-teto';
import DynamicTestPage from '@/pages/tests/dynamic-test-page';
import DynamicResultPage from '@/pages/tests/dynamic-result-page';
import { LoginPage } from '@/pages/auth/login';
import { default as RegisterPage } from '@/pages/auth/register';
import AuthCallbackPage from '@/pages/auth/auth-callback-page';
import { FeedbackPage, FeedbackNewPage, FeedbackDetailPage } from '@/pages/feedback';

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

// 인증 라우트 설정
export const authRoutes = [
    {
        path: '/auth/login',
        element: <LoginPage />,
    },
    {
        path: '/auth/register',
        element: <RegisterPage />,
    },
    {
        path: '/auth/callback',
        element: <AuthCallbackPage />,
    },
];

// 피드백 라우트 설정
export const feedbackRoutes = [
    {
        path: '/feedback',
        element: <FeedbackPage />,
    },
    {
        path: '/feedback/new',
        element: <FeedbackNewPage />,
    },
    {
        path: '/feedback/:id',
        element: <FeedbackDetailPage />,
    },
];
