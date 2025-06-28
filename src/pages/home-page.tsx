import React from 'react';
import { Link } from 'react-router-dom';

const tests = [
    {
        id: 'egen-teto',
        title: '에겐·테토 테스트',
        description: '호르몬 성향으로 나를 분석해보세요',
        image: '/images/egen-teto.png',
        color: 'pink',
        category: '성격',
        tags: ['감성', '호르몬'],
    },
    {
        id: 'mbti',
        title: 'MBTI 테스트',
        description: '16가지 유형으로 나의 성격을 파악해보세요',
        image: '/icons/mbti.svg',
        color: 'blue',
        category: '성격',
        tags: ['성격', '진단'],
    },
    {
        id: 'love-style',
        title: '연애스타일 테스트',
        description: '당신의 연애 방식은 어떤 유형일까요?',
        image: '/icons/love.svg',
        color: 'rose',
        category: '연애',
        tags: ['연애', '감정'],
    },
];

const HomePage: React.FC = () => {
    const trendingTests = tests.slice(0, 2);
    const recommendedTests = tests.slice(1);

    return (
        <main className="space-y-20 px-4 pt-10 pb-24 max-w-4xl mx-auto ">
            {/* 히어로 영역 */}
            <section className="text-center space-y-6 animate-fade-in-up">
                <div className="inline-block px-4 py-1.5 text-xs font-medium bg-pink-100 text-pink-700 rounded-full tracking-widest uppercase">
                    self insight
                </div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    심리로 파헤치는 나의 성향
                    <br />
                    지금 바로 테스트해보세요
                </h1>
                <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                    감성, 성격, 연애까지.
                    <br />
                    흥미롭고 가벼운 테스트를 통해 나를 재발견해보세요.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/tests"
                        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-lg"
                    >
                        전체 테스트 보기
                    </Link>
                </div>
            </section>

            {/* 요즘 뜨는 테스트 */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">🔥 요즘 뜨는 테스트</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {trendingTests.map((test) => (
                        <Link
                            key={test.id}
                            to={`/tests/${test.id}`}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                        >
                            <img src={test.image} alt={test.title} className="w-full h-36 object-cover" />
                            <div className="p-4 space-y-1">
                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{test.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{test.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 추천 테스트 */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">🎯 관심 있을 테스트</h2>
                <div className="flex flex-col gap-3">
                    {recommendedTests.map((test) => (
                        <Link
                            key={test.id}
                            to={`/tests/${test.id}`}
                            className="flex bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <img src={test.image} alt={test.title} className="w-24 h-24 object-cover flex-shrink-0" />
                            <div className="p-4 flex flex-col justify-center">
                                <span className="text-xs text-gray-400 mb-1">#{test.category}</span>
                                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{test.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{test.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 카테고리별 탐색 */}
            <section className="space-y-4">
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
