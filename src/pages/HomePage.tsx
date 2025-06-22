import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    const tests = [
        {
            id: 'egen-teto',
            title: '에겐·테토 테스트',
            description: '나의 호르몬 성향을 알아보는 심리테스트',
            image: '/cute-characters.png',
            color: 'pink',
        },
        // {
        //     id: 'mbti',
        //     title: 'MBTI 테스트',
        //     description: '성격 유형을 알아보는 테스트',
        //     image: '/icons/mbti.svg',
        //     color: 'blue',
        // },
        // {
        //     id: 'enneagram',
        //     title: '에니어그램',
        //     description: '9가지 성격 유형 테스트',
        //     image: '/icons/enneagram.svg',
        //     color: 'purple',
        // },
        // {
        //     id: 'iq',
        //     title: 'IQ 퀴즈',
        //     description: '지능 지수 측정 퀴즈',
        //     image: '/icons/iq.svg',
        //     color: 'green',
        // },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">유형연구소에 오신 것을 환영합니다</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    다양한 심리테스트와 퀴즈를 통해 자신을 더 깊이 알아보세요. 과학적으로 검증된 테스트들로 구성되어 있습니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {tests.map((test) => (
                    <Link
                        key={test.id}
                        to={`/tests/${test.id}`}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className={`w-12 h-12 bg-${test.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                                <img src={test.image} alt={test.title} className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                            <p className="text-sm text-gray-600">{test.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">최근 테스트 결과</h2>
                <p className="text-gray-600 mb-6">다른 사용자들의 테스트 결과를 확인해보세요.</p>
                <Link
                    to="/results"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                >
                    결과 보기
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
