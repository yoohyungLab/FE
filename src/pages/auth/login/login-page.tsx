import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithKakao, supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/lib/auth';

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof LoginFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleKakaoSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const { error } = await signInWithKakao();
            if (error) {
                setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            setError('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // 1. Supabase 인증 시도
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. 프로필 상태 확인
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('status, deleted_at')
                    .eq('id', authData.user.id)
                    .single();

                if (profileError) {
                    console.error('프로필 조회 실패:', profileError);
                    // 프로필이 없으면 기본값으로 처리
                }

                // 3. 탈퇴된 계정 체크
                if (profile) {
                    if (profile.status === 'deleted' || profile.deleted_at) {
                        // 즉시 로그아웃 처리
                        await supabase.auth.signOut();
                        setError('탈퇴된 계정입니다. 새로운 계정으로 가입해주세요.');
                        return;
                    }
                }

                // 4. 정상 로그인 처리
                await signIn('email', {
                    email: formData.email,
                    password: formData.password,
                });

                navigate('/');
            }
        } catch (error: any) {
            console.error('로그인 에러:', error);

            if (error.message.includes('탈퇴한 계정')) {
                setError(error.message);
            } else if (error.message.includes('Email not confirmed') || error.code === 'email_not_confirmed') {
                setError('이메일 인증이 필요합니다. 개발 환경에서는 Supabase 대시보드에서 이메일 인증을 비활성화해주세요.');
            } else if (error.message.includes('Invalid') || error.message.includes('Invalid login credentials')) {
                setError('이메일 또는 비밀번호가 일치하지 않습니다.');
            } else {
                setError('로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isEmailValid = validateEmail(formData.email);
    const isFormValid = formData.email && formData.password && isEmailValid;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <img src="/icons/logo.svg" alt="유형연구소" className="w-12 h-12 mx-auto" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
                    <p className="text-gray-600">3초만에 시작하세요</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Kakao Login */}
                <div className="mb-6">
                    <button
                        onClick={handleKakaoSignIn}
                        disabled={isLoading}
                        className="w-full bg-[#FEE500] hover:bg-[#FDD500] text-black font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <img src="/icons/kakao.svg" alt="카카오" className="w-5 h-5" />
                                <span>카카오로 3초만에 시작하기</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500">또는</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                            formData.email && !isEmailValid ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="이메일"
                        required
                    />

                    {/* Password Input */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="비밀번호"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center space-x-2 ${
                            isFormValid && !isLoading ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>로그인 중...</span>
                            </>
                        ) : (
                            <span>로그인</span>
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        아직 계정이 없으신가요?{' '}
                        <Link to="/auth/register" className="text-pink-500 hover:text-pink-600 font-medium">
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
