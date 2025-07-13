import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { useTestResult, ResultHeader, ResultDetails } from '@/features/test-results';
import { ResultActions } from '@/features/test-sharing';
import { resultBgImages } from '@/shared/constants/tests/egen-teto/result-bg-images';

const TestResultPage: React.FC = () => {
    const navigate = useNavigate();
    const { resultType, isShared, data, totalScore, genderParam, isValid, handleRestart } = useTestResult();

    if (!isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <p className="text-lg font-semibold">잘못된 접근입니다.</p>
                    <Button variant="link" onClick={() => navigate('/tests/egen-teto')}>
                        테스트 다시하기
                    </Button>
                </div>
            </div>
        );
    }

    const bgImage = resultBgImages[resultType!];

    return (
        <div className="min-h-screen font-sans bg-gradient-to-b from-sky-50 via-white to-blue-100">
            <ResultHeader totalScore={totalScore} gender={genderParam!} description={data!.description} bgImage={bgImage} />
            <div className="max-w-md mx-auto px-5 -mt-20 pb-16 relative z-10">
                <ResultDetails totalScore={totalScore} characteristics={data!.characteristics} />
                <ResultActions totalScore={totalScore} gender={genderParam!} isShared={isShared} onRestart={handleRestart} />
            </div>
        </div>
    );
};

export default TestResultPage;
