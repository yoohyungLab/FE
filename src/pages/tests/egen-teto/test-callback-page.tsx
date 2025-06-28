import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const TestCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const resultType = searchParams.get('type');
        const score = searchParams.get('score');
        const gender = searchParams.get('gender');

        if (resultType && score && gender) {
            // 결과 데이터를 sessionStorage에 저장
            const resultData = {
                type: resultType,
                score: score,
                gender: gender,
                timestamp: Date.now(),
            };

            sessionStorage.setItem('testResult', JSON.stringify(resultData));

            // 깔끔한 URL로 redirect
            navigate(`/tests/egen-teto/result?type=${resultType}`, { replace: true });
        } else {
            // 필수 파라미터가 없으면 테스트 페이지로 이동
            navigate('/tests/egen-teto', { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">결과를 처리하고 있습니다...</p>
            </div>
        </div>
    );
};

export default TestCallbackPage;
