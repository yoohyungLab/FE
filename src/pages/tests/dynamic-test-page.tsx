import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testApi } from '@/shared/lib/supabase';
import { Button } from '@/shared/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TestData {
    id: string;
    title: string;
    description: string;
    emoji: string;
    start_message: string;
    questions: Array<{
        id: string;
        text: string;
        question_options: Array<{
            id: string;
            text: string;
            score: number;
        }>;
    }>;
    test_results: Array<{
        id: string;
        title: string;
        description: string;
        condition_type: string;
        condition_value: any;
    }>;
}

interface QuestionProps {
    question: TestData['questions'][0];
    onAnswer: (score: number) => void;
    onPrevious: () => void;
    currentIndex: number;
    totalQuestions: number;
}

const QuestionComponent: React.FC<QuestionProps> = ({ question, onAnswer, onPrevious, currentIndex, totalQuestions }) => {
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    return (
        <div className="relative w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-white/40 min-h-[480px] flex flex-col">
            {/* 상단: 이전 버튼 + 진행 바 */}
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={onPrevious}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                        ${
                            currentIndex === 0
                                ? 'text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed'
                                : 'text-sky-700 bg-white/80 hover:bg-white/90 border border-sky-200 active:scale-95'
                        }
                    `}
                >
                    <ArrowLeft size={14} />
                    이전
                </button>

                <div className="flex-1 ml-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-sky-400 to-rose-300 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* 질문 텍스트 */}
            <h2 className="text-base font-bold text-center text-gray-900 mb-4 leading-relaxed min-h-[60px] flex items-center justify-center px-2">
                {question.text}
            </h2>

            {/* 옵션 카드들 */}
            <div className="flex flex-col gap-3 flex-grow">
                {question.question_options.map((option, index) => (
                    <Button
                        key={option.id}
                        variant="outline"
                        onClick={() => onAnswer(option.score)}
                        className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm p-4 min-h-[64px] text-left hover:bg-gray-50 transition-all duration-200 active:scale-95 flex items-center"
                    >
                        <div className="text-sm font-medium text-center break-words leading-snug w-full">{option.text}</div>
                    </Button>
                ))}
            </div>
        </div>
    );
};

const DynamicTestPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [testData, setTestData] = useState<TestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTest();
    }, [slug]);

    const loadTest = async () => {
        if (!slug) return;

        try {
            setLoading(true);
            const data = await testApi.getTestBySlug(slug);
            setTestData(data);
        } catch (err) {
            console.error('테스트 로드 실패:', err);
            setError('테스트를 불러올 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (score: number) => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);

        if (currentQuestionIndex < (testData?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleTestComplete(newAnswers);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setAnswers(answers.slice(0, -1));
        }
    };

    const handleTestComplete = async (finalAnswers: number[]) => {
        if (!testData) return;

        const totalScore = finalAnswers.reduce((sum, answer) => sum + answer, 0);

        // 결과 찾기
        let resultId: string | undefined;
        let result: TestData['test_results'][0] | undefined;

        for (const testResult of testData.test_results) {
            if (testResult.condition_type === 'score') {
                const { min, max } = testResult.condition_value;
                if (totalScore >= min && totalScore <= max) {
                    result = testResult;
                    resultId = testResult.id;
                    break;
                }
            }
        }

        // 세션 ID 생성
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        try {
            // 응답 저장
            await testApi.saveUserResponse(testData.id, sessionId, finalAnswers, resultId, totalScore, {
                completed_at: new Date().toISOString(),
            });

            // 결과 페이지로 이동
            if (result) {
                navigate(`/tests/${slug}/result?type=${result.id}&score=${totalScore}&session=${sessionId}`);
            } else {
                navigate(`/tests/${slug}/result?score=${totalScore}&session=${sessionId}`);
            }
        } catch (err) {
            console.error('응답 저장 실패:', err);
            // 저장 실패해도 결과 페이지로 이동
            if (result) {
                navigate(`/tests/${slug}/result?type=${result.id}&score=${totalScore}`);
            } else {
                navigate(`/tests/${slug}/result?score=${totalScore}`);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">테스트를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !testData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-red-600 mb-4">{error || '테스트를 찾을 수 없습니다.'}</p>
                    <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
                </div>
            </div>
        );
    }

    if (currentQuestionIndex === 0 && answers.length === 0) {
        // 시작 화면
        return (
            <div className="min-h-screen flex items-center justify-center px-10 bg-gradient-to-b from-sky-50 via-white to-blue-100">
                <div className="w-full max-w-[400px] bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6">
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-4">{testData.emoji}</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{testData.title}</h1>
                        <p className="text-gray-600 mb-4">{testData.description}</p>
                        {testData.start_message && (
                            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">{testData.start_message}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={() => setCurrentQuestionIndex(1)}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3"
                        >
                            테스트 시작하기
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                            돌아가기
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = testData.questions[currentQuestionIndex - 1];

    return (
        <div className="min-h-screen flex items-center justify-center px-10 bg-gradient-to-b from-sky-50 via-white to-blue-100">
            <QuestionComponent
                question={currentQuestion}
                onAnswer={handleAnswer}
                onPrevious={handlePrevious}
                currentIndex={currentQuestionIndex - 1}
                totalQuestions={testData.questions.length}
            />
        </div>
    );
};

export default DynamicTestPage;
