import { useSearchParams, useNavigate } from 'react-router-dom';
import { TestResult } from '@/shared/types/result';
import { resultData } from '@/shared/constants/tests/egen-teto/result';

export function useTestResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const resultType = searchParams.get('type') as TestResult | null;
    const isShared = searchParams.get('shared') === 'true';

    const getResultData = () => {
        const storedData = sessionStorage.getItem('testResult');
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (error) {
                console.error('Failed to parse stored result data:', error);
                return null;
            }
        }
        return null;
    };

    const resultDataFromStorage = getResultData();
    const scoreParam = resultDataFromStorage?.score;
    const genderParam = resultDataFromStorage?.gender as 'male' | 'female' | null;

    const isValid = resultType && resultData[resultType] && scoreParam !== null && genderParam;

    const data = isValid ? resultData[resultType] : null;
    const totalScore = scoreParam ? parseInt(scoreParam, 10) : 0;

    const handleRestart = () => {
        sessionStorage.removeItem('testResult');
        navigate('/tests/egen-teto');
    };

    return {
        resultType,
        isShared,
        data,
        totalScore,
        genderParam,
        isValid,
        handleRestart,
    };
} 