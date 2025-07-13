import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/shared/ui/drawer';
import { useAuth } from '@/shared/lib/auth';
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
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user, signIn, signOut } = useAuth();
    const navigate = useNavigate();

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
        navigate(href);
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
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const renderMenuGroup = (title: string, menus: any[]) => (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">{title}</h3>
            <div className="space-y-2">
                {menus.map((menu, index) => (
                    <button
                        key={index}
                        onClick={() => handleMenuClick(menu.href)}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <menu.icon className="w-4 h-4 mr-3" />
                        {menu.label}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <img src="/icons/logo.svg" alt="로고" className="w-8 h-8" />
                    <span className="text-xl font-bold text-gray-900">유형연구소</span>
                </Link>

                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button variant="outline" size="sm" className="p-2">
                            <Menu className="w-4 h-4" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-w-mobile mx-auto">
                        <DrawerHeader className="text-left">
                            <DrawerTitle className="flex items-center justify-between">
                                <span>메뉴</span>
                                <DrawerClose asChild>
                                    <Button variant="ghost" size="sm" className="p-2">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </DrawerClose>
                            </DrawerTitle>
                        </DrawerHeader>
                        <div className="px-6 pb-6">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-2" /> 로그아웃
                                    </Button>
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
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
}

export default Sidebar;
