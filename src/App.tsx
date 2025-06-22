import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EgenTetoTestPage from './pages/EgenTetoTestPage';
import ResultsPage from './components/ResultsPage';
import './index.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tests/egen-teto" element={<EgenTetoTestPage />} />
                    <Route path="/results" element={<ResultsPage onBack={() => window.history.back()} />} />
                    {/* 추가 테스트 페이지들 */}
                    {/* <Route path="/tests/mbti" element={<div className="p-8 text-center">MBTI 테스트 (준비 중)</div>} />
                    <Route path="/tests/enneagram" element={<div className="p-8 text-center">에니어그램 테스트 (준비 중)</div>} />
                    <Route path="/tests/iq" element={<div className="p-8 text-center">IQ 퀴즈 (준비 중)</div>} /> */}
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
