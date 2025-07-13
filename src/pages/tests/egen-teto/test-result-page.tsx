import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { TestResult } from '@/shared/types/result';
import { Share2 } from 'lucide-react';
import { resultBgImages } from '@/shared/constants/tests/egen-teto/result-bg-images';
import { resultData } from '@/shared/constants/tests/egen-teto/result';

const TestResultPage: React.FC = () => {
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

    if (!resultType || !resultData[resultType] || scoreParam === null || !genderParam) {
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

    const data = resultData[resultType];
    const totalScore = parseInt(scoreParam, 10);
    const bgImage = resultBgImages[resultType];

    const getPersonalityKeyword = () => {
        if (totalScore >= 4) {
            return genderParam === 'male' ? '에겐남' : '에겐녀';
        } else if (totalScore >= 1) {
            return genderParam === 'male' ? '에토남' : '에토녀';
        } else if (totalScore >= -1) {
            return genderParam === 'male' ? '테겐남' : '테겐녀';
        } else if (totalScore >= -4) {
            return genderParam === 'male' ? '테겐남' : '테겐녀';
        } else {
            return genderParam === 'male' ? '테토남' : '테토녀';
        }
    };

    const getTitleColor = () => {
        const keyword = getPersonalityKeyword();
        if (keyword.includes('에겐')) return 'text-blue-500';
        if (keyword.includes('에토')) return 'text-pink-500';
        if (keyword.includes('테겐')) return 'text-violet-600';
        if (keyword.includes('테토')) return 'text-orange-500';
        return 'text-gray-700';
    };

    const getCompatibility = () => {
        if (totalScore >= 4) {
            return ['에겐남', '에겐녀', '혼합형'];
        } else if (totalScore >= 1) {
            return ['에겐남', '에겐녀', '에토남', '에토녀', '혼합형'];
        } else if (totalScore >= -1) {
            return ['에겐남', '에겐녀', '테토남', '테토녀', '혼합형'];
        } else if (totalScore >= -4) {
            return ['테토남', '테토녀', '에토남', '에토녀', '혼합형'];
        } else {
            return ['테토남', '테토녀', '혼합형'];
        }
    };

    const getCareerSuggestions = () => {
        if (totalScore >= 4) {
            return ['유튜브 크리에이터', '웹툰 작가', '정신건강 상담사', '라이프 코치', '뷰티 크리에이터', 'ASMR 크리에이터'];
        } else if (totalScore >= 1) {
            return ['UI/UX 디자이너', '프로덕트 매니저', '디지털 마케터', '커뮤니티 매니저', '브랜드 매니저', '인플루언서 마케터'];
        } else if (totalScore >= -1) {
            return ['스타트업 창업가', '풀스택 개발자', 'ESG 컨설턴트', '메타버스 개발자', '개인 브랜딩 컨설턴트', '성장해킹 전문가'];
        } else if (totalScore >= -4) {
            return ['AI 엔지니어', '데이터 사이언티스트', '블록체인 개발자', 'DevOps 엔지니어', '벤처 캐피탈리스트', '사이버보안 전문가'];
        } else {
            return [
                '소프트웨어 아키텍트',
                '로봇 엔지니어',
                '클라우드 아키텍트',
                '자율주행차 개발자',
                '시스템 관리자',
                '데이터베이스 관리자',
            ];
        }
    };

    const handleRestart = () => {
        sessionStorage.removeItem('testResult');
        navigate('/tests/egen-teto');
    };

    const handleShare = async () => {
        const shareText = `나의 성향은 "${getPersonalityKeyword()}"이에요! 당신도 테스트해보세요 💫\n\n${
            window.location.origin
        }/tests/egen-teto`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: '테토-에겐 성향 테스트',
                    text: shareText,
                    url: window.location.origin + '/tests/egen-teto',
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

    return (
        <div className="min-h-screen font-sans bg-gradient-to-b from-sky-50 via-white to-blue-100">
            {/* 상단 이미지 영역 + 그라디언트 배경 */}
            <div className="relative w-full">
                <div className="w-full bg-top bg-no-repeat bg-cover aspect-[3/4]" style={{ backgroundImage: `url('${bgImage}')` }}></div>
                {/* 아래 그라디언트 오버레이 */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-white"></div>
            </div>
            {/* 콘텐츠 영역 */}

            <div className="max-w-md mx-auto px-5 -mt-20 pb-16 relative z-10">
                <div className="text-center mb-6">
                    <h1 className={`text-4xl font-bold mb-2 ${getTitleColor()}`}>{getPersonalityKeyword()}</h1>
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{data.description}</p>
                </div>

                {/* 특징 */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-900 text-base mb-4">✨ 주요 특징</h3>
                        <ul className="text-gray-700 space-y-2 text-sm">
                            {data.characteristics.map((char, i) => (
                                <li
                                    key={i}
                                    className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-gray-700"
                                >
                                    {char}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 잘 맞는 성향 */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-900 text-base mb-4">💛 잘 맞는 성향</h3>
                        <div className="flex flex-wrap gap-2">
                            {getCompatibility().map((type, i) => (
                                <span
                                    key={i}
                                    className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200"
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 추천 직업 */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                        <h3 className="font-semibold text-gray-900 text-base mb-4">💼 추천 직업</h3>
                        <div className="flex flex-wrap gap-2">
                            {getCareerSuggestions().map((job, i) => (
                                <span
                                    key={i}
                                    className="bg-orange-50 text-orange-600 text-xs font-medium px-3 py-1.5 rounded-full border border-orange-200"
                                >
                                    {job}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA 버튼 */}
                <div className="pt-8 flex gap-3">
                    <Button variant="outline" className="flex-1 text-sm py-3 rounded-lg font-medium bg-white" onClick={handleRestart}>
                        {isShared ? '나도 테스트해보기' : '다시 테스트하기'}
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

export default TestResultPage;
