import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <img src="/cute-characters.png" alt="로고" className="w-8 h-8 mr-3" />
                        <h1 className="text-xl font-bold text-gray-900">유형연구소</h1>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="/" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                            홈
                        </a>
                        <a href="/tests" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                            테스트
                        </a>
                        <a href="/results" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                            결과
                        </a>
                        <a href="/about" className="text-gray-700 hover:text-pink-500 px-3 py-2 text-sm font-medium">
                            소개
                        </a>
                    </nav>
                    <div className="md:hidden">
                        <button className="text-gray-700 hover:text-pink-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
