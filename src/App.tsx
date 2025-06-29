import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import HomePage from '@/pages/home/home-page';
import AuthCallbackPage from '@/pages/auth/auth-callback-page';
import { testRoutes } from '@/routes/test-routes';
import AdSense from '@/components/ads/ad-sense';
import './index.css';
import { FavoritesPage } from './pages/favorites';

function App() {
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
