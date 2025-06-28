import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useAuth } from '@/lib/auth';
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
    Heart,
    BookOpen,
    Users,
    MessageCircle,
    X,
    LogOut,
    Settings,
} from 'lucide-react';

function Header() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user, loading, signIn, signOut } = useAuth();

    const menuItems = [
        { icon: Home, label: '홈', href: '/' },
        { icon: TestTube, label: '테스트', href: '/tests' },
        { icon: BarChart3, label: '결과', href: '/results' },
        { icon: Info, label: '소개', href: '/about' },
    ];

    const userMenuItems = [
        { icon: History, label: '내 결과들', href: '/my-results' },
        { icon: Heart, label: '즐겨찾기', href: '/favorites' },
        { icon: BookOpen, label: '테스트 히스토리', href: '/test-history' },
        { icon: Users, label: '친구들과 공유', href: '/share' },
        { icon: MessageCircle, label: '고객센터', href: '/support' },
        { icon: Settings, label: '설정', href: '/settings' },
    ];

    const handleMenuClick = (href: string) => {
        setIsDrawerOpen(false);
        if (href.startsWith('/')) {
            window.location.href = href;
        }
    };

    const handleKakaoLogin = async () => {
        try {
            await signIn('kakao');
        } catch (error) {
            console.error('Kakao login failed:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <img src="/icons/logo.svg" alt="로고" className="w-9 h-9 mr-2" />
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">유형연구소</h1>
                    </Link>

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

                    <div className="md:hidden">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                            <DrawerTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-500 hover:bg-gray-100">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="h-full">
                                <DrawerHeader className="border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <DrawerTitle className="flex items-center">
                                            <img src="/icons/logo.svg" alt="로고" className="w-8 h-8 mr-3" />
                                            <span className="text-lg font-bold text-gray-900">유형연구소</span>
                                        </DrawerTitle>
                                        <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)} className="h-8 w-8">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </DrawerHeader>

                                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
                                    {/* 인증 상태에 따른 조건부 렌더링 */}
                                    {user ? (
                                        // 로그인된 상태
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name || user.email}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {user.provider === 'kakao' ? '카카오 계정' : '이메일 계정'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Button variant="outline" className="w-full" onClick={() => handleMenuClick('/profile')}>
                                                    <User className="w-4 h-4 mr-2" /> 내 프로필
                                                </Button>
                                                <Button variant="ghost" className="w-full text-red-500" onClick={handleLogout}>
                                                    <LogOut className="w-4 h-4 mr-2" /> 로그아웃
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        // 로그인되지 않은 상태
                                        <div className="space-y-3">
                                            <Button
                                                className="w-full bg-[#FEE500] hover:bg-yellow-500 text-black font-medium"
                                                onClick={handleKakaoLogin}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <img src="/icons/kakao.svg" alt="kakao" className="w-5 h-5" />
                                                    <span>카카오로 시작하기</span>
                                                </div>
                                            </Button>
                                            <Button variant="outline" className="w-full" onClick={() => handleMenuClick('/login')}>
                                                <LogIn className="w-4 h-4 mr-2" /> 로그인
                                            </Button>
                                            <Button variant="ghost" className="w-full" onClick={() => handleMenuClick('/signup')}>
                                                <UserPlus className="w-4 h-4 mr-2" /> 회원가입
                                            </Button>
                                        </div>
                                    )}

                                    {/* 메뉴 */}
                                    <div>
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

                                    {/* 사용자 메뉴 (로그인된 경우에만) */}
                                    {user && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">마이</h3>
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
                                    )}
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
