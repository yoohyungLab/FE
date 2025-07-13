import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CarouselCard } from '@/components/ui/cards/carousel-card';
import { HomeCard } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useFavorites } from '@/hooks/use-favorites';
import { tests, balanceGames, topTestsByType } from '@/constants/tests/egen-teto';
import { testApi, sectionApi } from '@/lib/supabase';

interface DynamicTest {
    id: string;
    slug: string;
    title: string;
    description?: string;
    emoji?: string;
    thumbnail_image?: string;
    category_id?: number;
    category_name?: string;
    category_display_name?: string;
}

interface SectionTest {
    test_id: string;
    test_slug: string;
    test_title: string;
    test_description?: string;
    test_emoji?: string;
    test_thumbnail?: string;
    test_category_id?: number;
    category_name?: string;
    category_display_name?: string;
    order_index: number;
    is_featured: boolean;
}

export default function HomePage() {
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [dynamicTests, setDynamicTests] = useState<DynamicTest[]>([]);
    const [sectionTests, setSectionTests] = useState<{
        trending: SectionTest[];
        recommended: SectionTest[];
        balanceGames: SectionTest[];
        topByType: SectionTest[];
    }>({
        trending: [],
        recommended: [],
        balanceGames: [],
        topByType: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);

            // 동적 테스트 로드
            const tests = await testApi.getPublishedTests();
            setDynamicTests(tests);

            // 섹션별 테스트 로드
            const [trending, recommended, balanceGames, topByType] = await Promise.all([
                sectionApi.getTestsBySection('trending'),
                sectionApi.getTestsBySection('recommended'),
                sectionApi.getTestsBySection('balance-games'),
                sectionApi.getTestsBySection('top-by-type'),
            ]);

            setSectionTests({
                trending,
                recommended,
                balanceGames,
                topByType,
            });
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // 섹션 테스트를 카드 형식으로 변환
    const convertSectionTestsToCards = (sectionTests: SectionTest[]) => {
        return sectionTests.map((test) => ({
            id: test.test_slug,
            title: test.test_title,
            description: test.test_description || '',
            image: test.test_thumbnail || '/images/egen-teto/thumbnail.png',
            tag: test.category_display_name || '테스트',
        }));
    };

    // 동적 테스트를 기존 테스트 형식으로 변환
    const dynamicTestsAsCards = dynamicTests.map((test) => ({
        id: test.slug,
        title: test.title,
        description: test.description || '',
        image: test.thumbnail_image || '/images/egen-teto/thumbnail.png',
        tag: '동적 테스트',
    }));

    // 섹션별 테스트 데이터
    const trendingTests = convertSectionTestsToCards(sectionTests.trending);
    const recommendedTests = convertSectionTestsToCards(sectionTests.recommended);
    const balanceGameTests = convertSectionTestsToCards(sectionTests.balanceGames);
    const topByTypeTests = convertSectionTestsToCards(sectionTests.topByType);

    // 섹션이 비어있으면 기존 데이터 사용
    const finalTrendingTests =
        trendingTests.length > 0
            ? trendingTests
            : tests.slice(0, 6).map((test) => ({
                  ...test,
                  tag: test.category ? String(test.category) : '테스트',
              }));
    const finalRecommendedTests =
        recommendedTests.length > 0
            ? recommendedTests
            : tests.slice(1, 7).map((test) => ({
                  ...test,
                  tag: test.category ? String(test.category) : '테스트',
              }));
    const finalBalanceGameTests =
        balanceGameTests.length > 0
            ? balanceGameTests
            : balanceGames.map((test) => ({
                  ...test,
                  tag: test.category ? String(test.category) : '밸런스 게임',
              }));
    const finalTopByTypeTests =
        topByTypeTests.length > 0
            ? topByTypeTests
            : topTestsByType.map((test) => ({
                  ...test,
                  tag: test.tag || '테스트',
              }));

    if (loading) {
        return (
            <main className="space-y-5 px-4 pt-10 pb-24 max-w-4xl mx-auto">
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">테스트를 불러오는 중...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="space-y-5 px-4 pt-10 pb-24 max-w-4xl mx-auto">
            {/* 히어로 영역 */}
            <section className="text-center space-y-6 animate-fade-in-up pb-10">
                <div className="inline-block px-4 py-1.5 text-xs font-medium bg-pink-100 text-pink-700 rounded-full tracking-widest uppercase">
                    self insight
                </div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    심리로 파헤치는 나의 성향,
                    <br />
                    지금 바로 테스트해보세요!
                </h1>
                <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                    감성, 성격, 연애까지.
                    <br />
                    흥미롭고 가벼운 테스트를 통해 나를 재발견해보세요.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/tests" className="bg-pink-500 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-lg">
                        전체 테스트 보기
                    </Link>
                </div>
            </section>

            {/* 요즘 뜨는 테스트 */}
            <section className="space-y-4 mt-12">
                <h2 className="text-xl font-bold text-gray-900">🔥 요즘 뜨는 테스트</h2>
                <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {finalTrendingTests.map((test) => (
                            <CarouselItem key={test.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3">
                                <CarouselCard
                                    id={test.id}
                                    title={test.title}
                                    description={test.description}
                                    image={test.image}
                                    isFavorite={isFavorite(test.id)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                </Carousel>
            </section>

            {/* 추천 테스트 */}
            {user && (
                <>
                    <section className="space-y-4 mt-12">
                        <h2 className="text-xl font-bold text-gray-900">🎯 {user.name}님이 관심 있을 테스트</h2>
                        <Carousel
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {finalRecommendedTests.map((test) => (
                                    <CarouselItem key={test.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3">
                                        <CarouselCard
                                            id={test.id}
                                            title={test.title}
                                            description={test.description}
                                            image={test.image}
                                            isFavorite={isFavorite(test.id)}
                                            onToggleFavorite={toggleFavorite}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                        </Carousel>
                    </section>
                </>
            )}

            {/* 일상 속 밸런스 게임 */}
            <section className="space-y-4 mt-12">
                <h2 className="text-xl font-bold text-gray-900">⚖️ 일상 속 밸런스 게임</h2>
                <div className="grid grid-cols-2 gap-2">
                    {finalBalanceGameTests.map((test) => (
                        <HomeCard
                            key={test.id}
                            id={test.id}
                            title={test.title}
                            image={test.image}
                            tag={test.tag}
                            isFavorite={isFavorite(test.id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                    {/* 아이템 수가 홀수라면 마지막에 빈 블록 추가해서 정렬 유지 */}
                    {finalBalanceGameTests.length % 2 !== 0 && <div className="hidden sm:block" />}
                </div>
            </section>

            {/* 유형별 TOP 테스트 */}
            <section className="space-y-4 mt-12">
                <h2 className="text-xl font-bold text-gray-900">🌟 유형별 TOP 테스트</h2>
                <div className="grid grid-cols-2 gap-2">
                    {finalTopByTypeTests.map((test) => (
                        <HomeCard
                            key={test.id}
                            id={test.id}
                            title={test.title}
                            image={test.image}
                            tag={test.tag}
                            isFavorite={isFavorite(test.id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}

                    {/* 아이템 수가 홀수라면 마지막에 빈 블록 추가해서 정렬 유지 */}
                    {finalTopByTypeTests.length % 2 !== 0 && <div className="hidden sm:block" />}
                </div>
            </section>

            {/* 카테고리별 탐색 */}
            <section className="space-y-4 mt-12">
                <h2 className="text-xl font-bold text-gray-900">📂 카테고리로 찾기</h2>
                <div className="flex flex-wrap gap-2">
                    {['전체', '성격', '연애', '감정'].map((category) => (
                        <button
                            key={category}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-pink-100 text-gray-700 rounded-full transition"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}
