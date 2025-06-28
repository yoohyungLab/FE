import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import {
    Menu,
    Home,
    TestTube,
    BarChart3,
    Info,
    User,
    LogIn,
    UserPlus,
    History,
    Settings,
    Heart,
    BookOpen,
    Users,
    MessageCircle,
} from 'lucide-react';

function Header() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const menuItems = [
        { icon: Home, label: '홈', href: '/' },
        { icon: TestTube, label: '테스트', href: '/tests' },
        { icon: BarChart3, label: '결과', href: '/results' },
        { icon: Info, label: '소개', href: '/about' },
    ];

    const userMenuItems = [
        { icon: LogIn, label: '로그인', href: '/login' },
        { icon: UserPlus, label: '회원가입', href: '/signup' },
        { icon: History, label: '내 결과들', href: '/my-results' },
        { icon: Heart, label: '즐겨찾기', href: '/favorites' },
        { icon: BookOpen, label: '테스트 히스토리', href: '/test-history' },
        { icon: Users, label: '친구들과 공유', href: '/share' },
        { icon: MessageCircle, label: '고객센터', href: '/support' },
        { icon: Settings, label: '설정', href: '/settings' },
    ];

    const handleMenuClick = (href: string) => {
        setIsDrawerOpen(false);
        // 여기서 실제 네비게이션 처리
        if (href.startsWith('/')) {
            window.location.href = href;
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* 로고 영역 */}
                    <Link to="/" className="flex items-center">
                        <img src="/icons/logo.svg" alt="로고" className="w-9 h-9 mr-2" />
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">유형연구소</h1>
                    </Link>

                    {/* 데스크톱 메뉴 */}
                    <nav className="hidden md:flex space-x-6">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className="text-gray-700 hover:text-pink-500 text-sm font-medium transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* 모바일 메뉴 버튼 */}
                    <div className="md:hidden">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-500 hover:bg-gray-100">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="h-[85vh]">
                                <DrawerHeader className="border-b border-gray-200 pb-4">
                                    <DrawerTitle className="flex items-center">
                                        <img src="/icons/logo.svg" alt="로고" className="w-8 h-8 mr-3" />
                                        <span className="text-lg font-bold text-gray-900">유형연구소</span>
                                    </DrawerTitle>
                                </DrawerHeader>

                                <div className="flex-1 overflow-y-auto px-4 py-6">
                                    {/* 메인 메뉴 */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">메뉴</h3>
                                        <div className="space-y-2">
                                            {menuItems.map((item) => (
                                                <button
                                                    key={item.href}
                                                    onClick={() => handleMenuClick(item.href)}
                                                    className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 hover:text-pink-500 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <item.icon className="w-5 h-5" />
                                                    <span className="font-medium">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 사용자 메뉴 */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">계정</h3>
                                        <div className="space-y-2">
                                            {userMenuItems.map((item) => (
                                                <button
                                                    key={item.href}
                                                    onClick={() => handleMenuClick(item.href)}
                                                    className="w-full flex items-center space-x-3 px-3 py-3 text-left text-gray-700 hover:text-pink-500 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <item.icon className="w-5 h-5" />
                                                    <span className="font-medium">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 소셜 로그인 */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">소셜 로그인</h3>
                                        <div className="space-y-3">
                                            <Button
                                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                                                onClick={() => handleMenuClick('/auth/kakao')}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">🎯</span>
                                                    <span>카카오로 로그인</span>
                                                </div>
                                            </Button>
                                            <Button variant="outline" className="w-full" onClick={() => handleMenuClick('/auth/google')}>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">🔍</span>
                                                    <span>구글로 로그인</span>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
