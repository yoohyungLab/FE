import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/lib/auth';
import { supabase } from '@/shared/lib/supabase';

const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();

                if (error) throw error;

                if (session?.user) {
                    // 프로필 상태 확인
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('status, deleted_at')
                        .eq('id', session.user.id)
                        .single();

                    if (profileError) {
                        console.error('프로필 조회 실패:', profileError);
                    }

                    // 탈퇴된 계정 체크
                    if (profile && (profile.status === 'deleted' || profile.deleted_at)) {
                        await supabase.auth.signOut();
                        navigate('/auth/login?error=deleted_account');
                        return;
                    }

                    // 정상 로그인 처리
                    navigate('/');
                }
            } catch (error) {
                console.error('인증 콜백 처리 실패:', error);
                navigate('/auth/login?error=auth_failed');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-gray-600">로그인 처리 중...</p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
