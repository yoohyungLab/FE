import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui/carousel';
import { HomeCard } from '@/shared/ui/card';
import { useAuth } from '@/shared/lib/auth';
import { useFavorites } from '@/shared/hooks/use-favorites';
import { testApi, sectionApi } from '@/shared/lib/supabase';
import { CarouselCard } from '@/shared/ui/carousel-card';
import { balanceGames, tests, topTestsByType } from '@/shared/constants/tests/egen-teto/test-list';
import {
    BalanceGameSection,
    CategoryFilter,
    DynamicTestsSection,
    MainBanner,
    RecommendedSection,
    TopTestsSection,
    TrendingSection,
} from '@/features/home';

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
            {/* 메인 배너 영역 */}
            <MainBanner />

            {/* 요즘 뜨는 테스트 */}
            <TrendingSection tests={finalTrendingTests} />

            {/* 테스트 추천 */}
            <RecommendedSection tests={finalRecommendedTests} />

            {/* 동적 테스트 섹션 */}
            {dynamicTestsAsCards.length > 0 && <DynamicTestsSection tests={dynamicTestsAsCards} />}

            {/* 일상 속 밸런스 게임 */}
            <BalanceGameSection tests={finalBalanceGameTests} />

            {/* 유형별 TOP 테스트 */}
            <TopTestsSection tests={finalTopByTypeTests} />

            {/* 카테고리별 탐색 */}
            <CategoryFilter />
        </main>
    );
}
