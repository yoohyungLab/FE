import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <img src="/cute-characters.png" alt="로고" className="w-8 h-8 mr-3" />
                            <h3 className="text-lg font-bold text-gray-900">유형연구소</h3>
                        </div>
                        <p className="text-gray-600 text-sm">나는 누구일까? 알아보는 재미!</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">테스트</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <a href="/tests/egen-teto" className="hover:text-pink-500">
                                    에겐·테토 테스트
                                </a>
                            </li>
                            <li>
                                <a href="/tests/mbti" className="hover:text-pink-500">
                                    MBTI 테스트
                                </a>
                            </li>
                            <li>
                                <a href="/tests/enneagram" className="hover:text-pink-500">
                                    에니어그램
                                </a>
                            </li>
                            <li>
                                <a href="/tests/iq" className="hover:text-pink-500">
                                    IQ 퀴즈
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">정보</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>
                                <a href="/about" className="hover:text-pink-500">
                                    소개
                                </a>
                            </li>
                            <li>
                                <a href="/privacy" className="hover:text-pink-500">
                                    개인정보처리방침
                                </a>
                            </li>
                            <li>
                                <a href="/terms" className="hover:text-pink-500">
                                    이용약관
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="hover:text-pink-500">
                                    문의
                                </a>
                            </li>
                        </ul>
                    </div> */}
                </div>
                <div className="border-t border-gray-200 mt-8 pt-8 text-center">
                    <p className="text-sm text-gray-500">© 2024 유형연구소. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
