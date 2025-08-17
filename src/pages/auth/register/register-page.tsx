import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { supabase, signInWithKakao } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/lib/auth';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface PasswordStrength {
    strength: number;
    text: string;
    color: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const getPasswordStrength = (password: string): PasswordStrength => {
        if (!password) return { strength: 0, text: '', color: 'bg-gray-300' };

        let strength = 0;
        const checks = {
            length: password.length >= 5,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        strength = Object.values(checks).filter(Boolean).length;

        if (strength <= 2) return { strength, text: '약함', color: 'bg-red-500' };
        if (strength <= 3) return { strength, text: '보통', color: 'bg-yellow-500' };
        if (strength <= 4) return { strength, text: '강함', color: 'bg-green-500' };
        return { strength, text: '매우 강함', color: 'bg-emerald-500' };
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isTestEmail = (email: string): boolean => {
        const testDomains = ['test.com', 'example.com', 'test.test', 'fake.com', 'dummy.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        return testDomains.includes(domain);
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
        if (!isFormValid) return;

        try {
            setIsLoading(true);
            setError(null);

            // 기본 유효성 검사
            if (!validateEmail(formData.email)) {
                setError('유효한 이메일 주소를 입력해주세요.');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('비밀번호가 일치하지 않습니다.');
                return;
            }

            // 회원가입 시도 (트리거가 자동으로 프로필 생성)
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                    },
                },
            });

            if (error) {
                console.error('회원가입 에러:', error);
                setError(`회원가입에 실패했습니다: ${error.message}`);
                return;
            }

            if (data?.user) {
                setSuccessMessage('회원가입이 완료되었습니다! 메인으로 이동합니다...');

                // 자동 로그인 시도
                try {
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email: formData.email,
                        password: formData.password,
                    });

                    if (signInData?.user && !signInError) {
                        await checkAuth();
                        setTimeout(() => {
                            navigate('/', { replace: true });
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            navigate('/auth/login', { replace: true });
                        }, 2000);
                    }
                } catch (signInError) {
                    setTimeout(() => {
                        navigate('/auth/login', { replace: true });
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('회원가입 중 오류:', error);
            setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    const isEmailValid = validateEmail(formData.email);
    const isFormValid = formData.name && formData.email && formData.password && passwordsMatch && isEmailValid;

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-6">
                        <img src="/icons/logo.svg" alt="유형연구소" className="w-12 h-12 mx-auto" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
                    <p className="text-gray-600">3초만에 시작하세요</p>
                </div>

                {/* Error/Success Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <p className="text-green-700 text-sm">{successMessage}</p>
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
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="이름"
                        required
                    />

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
                    {formData.email && !isEmailValid && <p className="mt-1 text-sm text-red-600">올바른 이메일 형식을 입력해주세요</p>}

                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="비밀번호 (5자 이상)"
                                required
                                minLength={5}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {formData.password && (
                            <div className="mt-1 flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1">
                                    <div
                                        className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-600">{passwordStrength.text}</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                placeholder="비밀번호 확인"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>

                            {formData.confirmPassword && (
                                <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                                    {passwordsMatch ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />}
                                </div>
                            )}
                        </div>
                    </div>

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
                                <span>가입 중...</span>
                            </>
                        ) : (
                            <span>회원가입</span>
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        이미 계정이 있으신가요?{' '}
                        <Link to="/auth/login" className="text-pink-500 hover:text-pink-600 font-medium">
                            로그인
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
