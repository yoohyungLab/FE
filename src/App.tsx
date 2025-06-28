import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/layout';
import HomePage from '@/pages/home-page';
import { EgenTetoTestPage, TestResultPage, TestCallbackPage } from '@/pages/tests/egen-teto';
import AuthCallbackPage from '@/pages/auth-callback-page';
import AdSense from '@/components/ads/ad-sense';
import './index.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route path="/tests/egen-teto" element={<EgenTetoTestPage />} />
                    <Route path="/tests/egen-teto/callback" element={<TestCallbackPage />} />
                    <Route path="/tests/egen-teto/result" element={<TestResultPage />} />
                    {/* 추가 테스트 페이지들 */}
                    {/* <Route path="/tests/mbti" element={<div className="p-8 text-center">MBTI 테스트 (준비 중)</div>} />
                    <Route path="/tests/enneagram" element={<div className="p-8 text-center">에니어그램 테스트 (준비 중)</div>} />
                    <Route path="/tests/iq" element={<div className="p-8 text-center">IQ 퀴즈 (준비 중)</div>} /> */}
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
