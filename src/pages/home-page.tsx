import { useFavorites } from '@/hooks';
import { useAuth } from '@/lib/auth';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const tests = [
    {
        id: 'egen-teto',
        title: '에겐·테토 테스트',
        description: '호르몬 성향으로 나를 분석해보세요',
        image: '/images/egen-teto/thumbnail.png',
        color: 'pink',
        category: '성격',
        tags: ['감성', '호르몬'],
    },
    {
        id: 'mbti',
        title: 'MBTI 테스트',
        description: '16가지 유형으로 나의 성격을 파악해보세요',
        image: '/images/egen-teto/thumbnail.png',
        color: 'blue',
        category: '성격',
        tags: ['성격', '진단'],
    },
    {
        id: 'love-style',
        title: '연애스타일 테스트',
        description: '당신의 연애 방식은 어떤 유형일까요?',
        image: '/images/egen-teto/thumbnail.png',
        color: 'rose',
        category: '연애',
        tags: ['연애', '감정'],
    },
    {
        id: 'enneagram',
        title: '에니어그램 테스트',
        description: '9가지 성격 유형으로 나를 알아보세요',
        image: '/images/egen-teto/thumbnail.png',
        color: 'purple',
        category: '성격',
        tags: ['성격', '자기계발'],
    },
    {
        id: 'iq-quiz',
        title: 'IQ 퀴즈',
        description: '지적 능력을 측정해보세요',
        image: '/images/egen-teto/thumbnail.png',
        color: 'green',
        category: '지능',
        tags: ['지능', '퀴즈'],
    },
];

// 샘플 주제
const balanceGames = [
    {
        id: 'balance-earlybird-vs-nightowl',
        title: '아침형 인간 vs 저녁형 인간',
        description: '당신의 생활 루틴은 어떤 타입인가요?',
        image: '/images/egen-teto/thumbnail.png',
    },
    {
        id: 'balance-alone-vs-party',
        title: '혼자 있는게 좋아 vs 친구랑 어울리는게 좋아',
        description: '에너지 충전 방식은 다르니까!',
        image: '/images/egen-teto/thumbnail.png',
    },
    {
        id: 'balance-fast-vs-deepthink',
        title: '빨리 결정하는 편 vs 오래 고민하는 편',
        description: '당신의 선택 스타일은?',
        image: '/images/egen-teto/thumbnail.png',
    },
];

// 샘플 주제
const topTestsByType = [
    {
        id: 'mbti',
        title: 'MBTI 테스트',
        image: '/images/egen-teto/thumbnail.png',
        tag: '성격',
    },
    {
        id: 'love-style',
        title: '연애 스타일 테스트',
        image: '/images/egen-teto/thumbnail.png',
        tag: '연애',
    },
    {
        id: 'self-esteem',
        title: '자존감 자가진단 테스트',
        image: '/images/egen-teto/thumbnail.png',
        tag: '자존감',
    },
    {
        id: 'funny-animal',
        title: '나는 어떤 동물일까 테스트',
        image: '/images/egen-teto/thumbnail.png',
        tag: '웃긴',
    },
];

const HomePage: React.FC = () => {
    const trendingTests = tests; // 모든 테스트를 트렌딩으로 사용
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
                            <CarouselItem key={test.id} className="pl-2 md:pl-4 basis-1/3">
                                <Link
                                    to={`/tests/${test.id}`}
                                    className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 block"
                                >
                                    <img src={test.image} alt={test.title} className="w-full h-36 object-cover" />

                                    {/* 찜 아이콘 */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault(); // 카드 클릭 막기
                                            toggleFavorite(test.id);
                                        }}
                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                                    >
                                        {isFavorite(test.id) ? (
                                            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                                        ) : (
                                            <Heart className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>

                                    <div className="p-4 space-y-1">
                                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{test.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{test.description}</p>
                                    </div>
                                </Link>
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
                                    <CarouselItem key={test.id} className="pl-2 md:pl-4 basis-1/3">
                                        <Link
                                            to={`/tests/${test.id}`}
                                            className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 block"
                                        >
                                            <img src={test.image} alt={test.title} className="w-full h-36 object-cover" />

                                            {/* 찜 아이콘 */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleFavorite(test.id);
                                                }}
                                                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                                            >
                                                {isFavorite(test.id) ? (
                                                    <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                                                ) : (
                                                    <Heart className="w-4 h-4 text-gray-400" />
                                                )}
                                            </button>

                                            <div className="p-4 space-y-1">
                                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{test.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">{test.description}</p>
                                            </div>
                                        </Link>
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
                            <CarouselItem key={game.id} className="pl-2 md:pl-4 basis-1/3">
                                <Link
                                    to={`/tests/${game.id}`}
                                    className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 block"
                                >
                                    <img src={game.image} alt={game.title} className="w-full h-36 object-cover" />
                                    <div className="p-4 space-y-1">
                                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{game.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{game.description}</p>
                                    </div>
                                </Link>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {topTestsByType.map((test) => (
                        <Link
                            key={test.id}
                            to={`/tests/${test.id}`}
                            className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border"
                        >
                            <img src={test.image} alt={test.title} className="w-full h-36 object-cover" />
                            <div className="absolute top-2 left-2 bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">
                                #{test.tag}
                            </div>
                            <div className="p-4">
                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{test.title}</h3>
                            </div>
                        </Link>
                    ))}
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
};

export default HomePage;
