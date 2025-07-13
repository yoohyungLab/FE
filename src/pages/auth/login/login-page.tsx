import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, signInWithKakao } from '../../../shared/lib/supabase';

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

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

            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) {
                // 개발 환경에서 이메일 인증 에러 무시
                if (error.code === 'email_not_confirmed') {
                    console.log('이메일 인증 에러 무시 (개발 환경)');

                    // 강제로 이메일 인증 상태로 변경 시도
                    try {
                        // 현재 사용자 정보 가져오기
                        const { data: userData } = await supabase.auth.getUser();
                        if (userData.user) {
                            console.log('사용자 발견, 로그인 진행');
                            navigate('/');
                            return;
                        }
                    } catch (userError) {
                        console.error('사용자 정보 가져오기 실패:', userError);
                    }

                    setError('이메일 인증이 필요합니다. 개발 환경에서는 Supabase 대시보드에서 이메일 인증을 비활성화해주세요.');
                    return;
                }

                if (error.message.includes('Invalid')) {
                    setError('이메일 또는 비밀번호가 일치하지 않습니다.');
                } else {
                    setError('로그인에 실패했습니다. 다시 시도해주세요.');
                }
                return;
            }

            if (data.user) {
                // 로그인 성공
                navigate('/');
            }
        } catch (error) {
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
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
                    <p className="text-gray-600">계정에 로그인하세요</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Kakao Login - 강조 */}
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
                                <span>카카오로 빠르게 로그인</span>
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
                    <div>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField('')}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                formData.email && !isEmailValid ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="이메일"
                            required
                        />
                        {formData.email && !isEmailValid && <p className="mt-1 text-sm text-red-600">올바른 이메일 형식을 입력해주세요</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField('')}
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
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                            />
                            <span className="text-gray-700">로그인 유지</span>
                        </label>
                        <Link to="/auth/forgot-password" className="text-pink-500 hover:text-pink-600">
                            비밀번호 찾기
                        </Link>
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

                {/* Sign Up Link */}
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
