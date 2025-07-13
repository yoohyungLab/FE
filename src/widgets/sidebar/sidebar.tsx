import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/shared/ui/drawer';
import { useAuth } from '@/shared/lib/auth';
import { supabase } from '@/shared/lib/supabase';
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
    Trash2,
    AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
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

    const handleDeleteAccount = async () => {
        if (!user) return;

        try {
            setIsDeleting(true);

            // 1. 사용자 관련 데이터 삭제 (프로필, 테스트 결과 등)
            if (user.id) {
                // 테스트 결과 삭제
                await supabase.from('test_results').delete().eq('user_id', user.id);

                // 사용자 응답 삭제
                await supabase.from('user_responses').delete().eq('user_id', user.id);

                // 프로필 삭제
                await supabase.from('profiles').delete().eq('id', user.id);
            }

            // 2. 계정 삭제 (현재 Supabase에서는 클라이언트에서 직접 계정 삭제 불가)
            // 대신 사용자 정보를 비우고 비활성화 상태로 표시
            await supabase.auth.updateUser({
                data: {
                    deleted_at: new Date().toISOString(),
                    name: null,
                    email: null,
                },
            });

            // 3. 로그아웃 처리
            await signOut();

            // 4. 메인 페이지로 이동
            navigate('/');

            alert('회원탈퇴가 완료되었습니다.');
        } catch (error) {
            console.error('회원탈퇴 실패:', error);
            alert('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setIsDrawerOpen(false);
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
                                    <div className="space-y-2">
                                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4 mr-2" /> 로그아웃
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                            onClick={() => setShowDeleteConfirm(true)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> 회원탈퇴
                                        </Button>
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
                                    <Button variant="outline" className="w-full" onClick={() => handleMenuClick('/auth/login')}>
                                        <LogIn className="w-4 h-4 mr-2" /> 로그인
                                    </Button>
                                    <Button variant="ghost" className="w-full" onClick={() => handleMenuClick('/auth/register')}>
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

            {/* 회원탈퇴 확인 다이얼로그 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">회원탈퇴</h3>
                                <p className="text-sm text-gray-600">정말로 탈퇴하시겠습니까?</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">탈퇴하면 다음 데이터가 삭제됩니다:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• 계정 정보</li>
                                <li>• 테스트 결과</li>
                                <li>• 찜한 테스트</li>
                                <li>• 테스트 히스토리</li>
                            </ul>
                        </div>
                        <div className="flex space-x-3">
                            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                                취소
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                {isDeleting ? '탈퇴 처리중...' : '탈퇴하기'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
