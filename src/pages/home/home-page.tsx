import { useFavorites } from '@/hooks';
import { useAuth } from '@/lib/auth';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CarouselCard } from '@/components/ui/carousel-card';
import { tests, balanceGames, topTestsByType } from '@/constants/tests/egen-teto';
import { Card } from '@/components/ui/card';

// export defualt, export function 차이 뭔지?
export default function HomePage() {
    const trendingTests = tests;
    const recommendedTests = tests.slice(1);
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();

    return (
        <main className="space-y-5 px-4 pt-10 pb-24 max-w-4xl mx-auto ">
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
                    <Link to="/tests" className="bg-pink-500  text-white font-semibold px-6 py-3 rounded-full transition-all shadow-lg">
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
                        {trendingTests.map((test) => (
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
                                {recommendedTests.map((test) => (
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
                <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {balanceGames.map((game) => (
                            <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3">
                                <CarouselCard
                                    id={game.id}
                                    title={game.title}
                                    description={game.description}
                                    image={game.image}
                                    isFavorite={isFavorite(game.id)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                </Carousel>
            </section>

            {/* 유형별 TOP 테스트 */}
            <section className="space-y-4 mt-12">
                <h2 className="text-xl font-bold text-gray-900">🌟 유형별 TOP 테스트</h2>
                <div className="grid grid-cols-2 gap-2">
                    {topTestsByType.map((test) => (
                        <Card
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
                    {topTestsByType.length % 2 !== 0 && <div className="hidden sm:block" />}
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
