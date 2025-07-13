import React, { useEffect } from 'react';
import { useAuth } from '@/shared/lib/auth';
import Sidebar from '@/widgets/sidebar';
import Footer from '@/widgets/footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home/home-page';
import AuthCallbackPage from '@/pages/auth/auth-callback-page';
import FavoritesPage from '@/pages/favorites/favorites-page';
import { testRoutes } from './routing/test-routes';
import Layout from '@/widgets/layout';
import './styles/index.css';

function App() {
    const { checkAuth } = useAuth();

    useEffect(() => {
        // 앱 시작 시 인증 상태 확인
        checkAuth();
    }, [checkAuth]);

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />

                    {/* 테스트 라우트들을 동적으로 생성 */}
                    {testRoutes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}

                    <Route path="/favorites" element={<FavoritesPage />} />
                </Routes>
            </Layout>

            {/* 모바일 하단 광고 */}
            {/* <div className="md:hidden mobile-ad-bottom">
                <AdSense position="mobile-bottom" />
            </div> */}
        </Router>
    );
}

export default App;
