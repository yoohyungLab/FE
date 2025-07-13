import React, { useEffect } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Footer from '@/components/layout/footer';
import { useAuth } from '@/lib/auth';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { checkAuth } = useAuth();

    useEffect(() => {
        // 앱 시작 시 인증 상태 확인
        checkAuth();
    }, [checkAuth]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* 모바일 우선: 중앙 정렬, 최대 너비 제한 */}
            <div className="w-full max-w-mobile mx-auto bg-white shadow-2xl">
                <Sidebar />
                <main className="flex-1 p-4 min-h-screen">{children}</main>
                <Footer />
            </div>

            {/* 애드센스 광고 영역 - 데스크톱에서만 표시 */}
            {/* <div className="hidden lg:block fixed top-0 left-0 w-48 h-full bg-gray-100 border-r border-gray-200">
                <div className="p-4">
                    <div className="text-sm text-gray-500 mb-2">광고 영역</div>
                    <div className="w-full h-96 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">좌측 광고</span>
                    </div>
                </div>
            </div> */}

            {/* <div className="hidden lg:block fixed top-0 right-0 w-48 h-full bg-gray-100 border-l border-gray-200">
                <div className="p-4">
                    <div className="text-sm text-gray-500 mb-2">광고 영역</div>
                    <div className="w-full h-96 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">우측 광고</span>
                    </div>
                </div>
            </div> */}

            {/* 하단 광고 영역 */}
            {/* <div className="hidden md:block fixed bottom-0 left-0 right-0 h-20 bg-gray-100 border-t border-gray-200">
                <div className="max-w-mobile mx-auto h-full flex items-center justify-center">
                    <span className="text-gray-400">하단 광고</span>
                </div>
            </div> */}
        </div>
    );
};

export default Layout;
