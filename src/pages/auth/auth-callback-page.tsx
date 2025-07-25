import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/lib/auth';

const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                await checkAuth();
                navigate('/', { replace: true });
            } catch (error) {
                navigate('/', { replace: true });
            }
        };

        handleAuthCallback();
    }, [checkAuth, navigate]);

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
