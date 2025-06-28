import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { useAuth } from '@/lib/auth';
import {
    Menu,
    X,
    User,
    LogOut,
    LogIn,
    UserPlus,
    Star,
    Clock,
    Pencil,
    Info,
    MessageSquare,
    Brain,
    Briefcase,
    Palette,
    Heart,
    Flame,
} from 'lucide-react';

function Header() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user, signIn, signOut } = useAuth();

    const mainMenus = [
        { icon: Brain, label: '심리 테스트', href: '/tests/psychology' },
        { icon: Briefcase, label: '직업 성향 테스트', href: '/tests/career' },
        { icon: Palette, label: '성격 유형 테스트', href: '/tests/personality' },
        { icon: Heart, label: '연애 관련 테스트', href: '/tests/love' },
        { icon: Flame, label: '요즘 인기 테스트', href: '/tests/trending' },
    ];

    const userMenus = [
        { icon: Heart, label: '찜한 테스트', href: '/favorites' },
        { icon: Clock, label: '테스트 히스토리', href: '/test-history' },
        { icon: Pencil, label: '내가 만든 테스트', href: '/my-tests' },
    ];

    const etcMenus = [{ icon: MessageSquare, label: '건의사항 작성하기', href: '/feedback' }];

    const handleMenuClick = (href: string) => {
        setIsDrawerOpen(false);
        window.location.href = href;
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

    const renderMenuGroup = (title: string, menus: any[]) => (
        <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
            <div className="space-y-2">
                {menus.map((item) => (
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
    );

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <img src="/icons/logo.svg" alt="로고" className="w-9 h-9 mr-2" />
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">유형연구소</h1>
                    </Link>

                    <div className="md:hidden">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
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
                                        <DrawerClose asChild>
                                            <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}>
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </DrawerClose>
                                    </div>
                                </DrawerHeader>

                                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
                                    {user ? (
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="프로필" className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name || '사용자'}</p>
                                                <p className="text-sm text-gray-500">
                                                    {user.provider === 'kakao' ? '카카오 계정' : '이메일 계정'}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Button
                                                className="w-full bg-[#FEE500] hover:bg-[#FEE500] text-black font-medium"
                                                onClick={handleKakaoLogin}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <img src="/icons/kakao.svg" alt="카카오" className="w-4 h-4" />
                                                    <span>카카오로 시작하기</span>
                                                </div>
                                            </Button>
                                            <div className="text-center">
                                                <span className="text-sm text-gray-500">간편하게 1초만에 시작하세요</span>
                                            </div>
                                            <Button variant="outline" className="w-full" onClick={() => handleMenuClick('/login')}>
                                                <LogIn className="w-4 h-4 mr-2" /> 로그인
                                            </Button>
                                            <Button variant="ghost" className="w-full" onClick={() => handleMenuClick('/signup')}>
                                                <UserPlus className="w-4 h-4 mr-2" /> 회원가입
                                            </Button>
                                        </div>
                                    )}

                                    {renderMenuGroup('주요 메뉴', mainMenus)}
                                    {user && renderMenuGroup('사용자 기능', userMenus)}
                                    {renderMenuGroup('기타 기능', etcMenus)}
                                    {user && (
                                        <div>
                                            <Button variant="outline" className="w-full text-red-500" onClick={handleLogout}>
                                                <LogOut className="w-4 h-4 mr-2" /> 로그아웃
                                            </Button>
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
