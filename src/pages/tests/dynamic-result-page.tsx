import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { testApi } from '@/shared/lib/supabase';
import { Button } from '@/shared/ui/button';
import { Share2 } from 'lucide-react';

interface TestResult {
    id: string;
    title: string;
    description: string;
    keywords: string[];
    recommendations: string[];
    background_image?: string;
}

const DynamicResultPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [testData, setTestData] = useState<any>(null);
    const [resultData, setResultData] = useState<TestResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const resultType = searchParams.get('type');
    const score = searchParams.get('score');
    const sessionId = searchParams.get('session');

    useEffect(() => {
        loadTestAndResult();
    }, [slug, resultType]);

    const loadTestAndResult = async () => {
        if (!slug) return;

        try {
            setLoading(true);
            const data = await testApi.getTestBySlug(slug);
            setTestData(data);

            if (resultType) {
                const result = data.test_results.find((r: any) => r.id === resultType);
                if (result) {
                    setResultData(result);
                }
            }
        } catch (err) {
            console.error('데이터 로드 실패:', err);
            setError('결과를 불러올 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleRestart = () => {
        navigate(`/tests/${slug}`);
    };

    const handleShare = async () => {
        const shareText = `나의 ${testData?.title} 결과는 "${resultData?.title}"이에요! 당신도 테스트해보세요 💫\n\n${window.location.origin}/tests/${slug}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: testData?.title || '테스트 결과',
                    text: shareText,
                    url: `${window.location.origin}/tests/${slug}`,
                });
            } catch (error) {
                console.log('공유가 취소되었습니다.');
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert('링크가 클립보드에 복사되었습니다!');
            } catch (error) {
                alert('공유 링크를 복사할 수 없습니다.');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">결과를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !testData || !resultData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-red-600 mb-4">{error || '결과를 찾을 수 없습니다.'}</p>
                    <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans bg-gradient-to-b from-sky-50 via-white to-blue-100">
            {/* 상단 이미지 영역 */}
            {resultData.background_image && (
                <div className="relative w-full">
                    <div
                        className="w-full bg-top bg-no-repeat bg-cover aspect-[3/4]"
                        style={{ backgroundImage: `url('${resultData.background_image}')` }}
                    ></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-white"></div>
                </div>
            )}

            {/* 콘텐츠 영역 */}
            <div className="max-w-md mx-auto px-5 pb-16 relative z-10">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold mb-2 text-blue-600">{resultData.title}</h1>
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{resultData.description}</p>
                </div>

                {/* 특징 */}
                {resultData.keywords && resultData.keywords.length > 0 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 text-base mb-4">✨ 주요 특징</h3>
                            <div className="flex flex-wrap gap-2">
                                {resultData.keywords.map((keyword, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 추천사항 */}
                {resultData.recommendations && resultData.recommendations.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
                        <h3 className="font-semibold text-gray-900 text-base mb-4">💡 추천사항</h3>
                        <ul className="text-gray-700 space-y-2 text-sm">
                            {resultData.recommendations.map((rec, i) => (
                                <li
                                    key={i}
                                    className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-gray-700"
                                >
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 점수 표시 */}
                {score && (
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 mb-6">
                        <h3 className="font-semibold text-gray-900 text-base mb-2">📊 당신의 점수</h3>
                        <div className="text-3xl font-bold text-purple-600">{score}점</div>
                    </div>
                )}

                {/* CTA 버튼 */}
                <div className="pt-8 flex gap-3">
                    <Button variant="outline" className="flex-1 text-sm py-3 rounded-lg font-medium bg-white" onClick={handleRestart}>
                        다시 테스트하기
                    </Button>
                    <Button
                        onClick={handleShare}
                        className="flex-1 text-sm py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium"
                    >
                        <Share2 className="w-4 h-4 mr-2" /> 공유하기
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DynamicResultPage;
