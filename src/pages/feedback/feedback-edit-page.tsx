import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth';
import { feedbackApi } from '@/shared/api';
import { FEEDBACK_CATEGORIES, CONTENT_LIMITS } from '@/shared/constants';
import type { FeedbackCategory } from '@/shared/types';

interface FeedbackFormData {
    title: string;
    content: string;
    category: FeedbackCategory;
    attached_file: File | null;
}

interface ValidationErrors {
    title?: string;
    content?: string;
    attached_file?: string;
}

export default function FeedbackEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState<FeedbackFormData>({
        title: '',
        content: '',
        category: 'feature',
        attached_file: null,
    });
    const [originalFeedback, setOriginalFeedback] = useState<any>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [characterCount, setCharacterCount] = useState({ title: 0, content: 0 });

    useEffect(() => {
        if (!user) {
            navigate('/auth/login');
            return;
        }
        if (id) {
            loadFeedback();
        }
    }, [id, user, navigate]);

    const loadFeedback = async () => {
        try {
            setLoading(true);
            const { data, error } = await feedbackApi.getFeedback(id!, user?.id);

            if (error) {
                throw error;
            }

            // 본인의 피드백만 수정할 수 있도록 체크
            if (data && data.user_id !== user?.id) {
                navigate('/feedback');
                return;
            }

            setOriginalFeedback(data);
            setFormData({
                title: data.title,
                content: data.content,
                category: data.category,
                attached_file: null,
            });
            setCharacterCount({
                title: data.title.length,
                content: data.content.length,
            });
        } catch (err: any) {
            navigate('/feedback');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof FeedbackFormData, value: string | File | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // 글자 수 카운트 업데이트
        if (field === 'title') {
            setCharacterCount((prev) => ({ ...prev, title: (value as string).length }));
        } else if (field === 'content') {
            setCharacterCount((prev) => ({ ...prev, content: (value as string).length }));
        }

        // 에러 메시지 제거
        if (field in validationErrors) {
            setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};

        if (!formData.title.trim()) {
            errors.title = '제목을 입력해주세요.';
        } else if (formData.title.length > CONTENT_LIMITS.TITLE_MAX) {
            errors.title = `제목은 ${CONTENT_LIMITS.TITLE_MAX}자 이내로 입력해주세요.`;
        }

        if (!formData.content.trim()) {
            errors.content = '내용을 입력해주세요.';
        } else if (formData.content.length > CONTENT_LIMITS.CONTENT_MAX) {
            errors.content = `내용은 ${CONTENT_LIMITS.CONTENT_MAX}자 이내로 입력해주세요.`;
        }

        // 파일 크기 체크
        if (formData.attached_file) {
            if (formData.attached_file.size > CONTENT_LIMITS.FILE_SIZE_MAX) {
                errors.attached_file = '파일 크기는 5MB 이하여야 합니다.';
            }
            if (!CONTENT_LIMITS.ALLOWED_FILE_TYPES.includes(formData.attached_file.type as any)) {
                errors.attached_file = '이미지 파일만 업로드 가능합니다. (JPEG, PNG, GIF, WebP)';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsSubmitting(true);

            // 피드백 수정
            const { error } = await feedbackApi.updateFeedback(id!, user!.id, {
                ...formData,
                user_id: user!.id,
                author_name: user!.name || '익명',
            });

            if (error) throw error;

            // 성공 시 상세 페이지로 이동
            navigate(`/feedback/${id}`);
        } catch (err: any) {
            setValidationErrors({ title: err.message || '수정에 실패했습니다.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleInputChange('attached_file', file);
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">건의사항을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!originalFeedback) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-md mx-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-gray-600">❓</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">건의사항을 찾을 수 없습니다</h2>
                    <p className="text-gray-600 mb-6">요청하신 건의사항이 존재하지 않거나 삭제되었습니다.</p>
                    <Link
                        to="/feedback"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>목록으로 돌아가기</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <Link
                        to={`/feedback/${id}`}
                        className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        건의사항 상세로
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">✏️ 건의사항 수정</h1>
                    <p className="text-gray-600 text-lg">건의사항을 수정하고 더 나은 아이디어로 발전시켜보세요</p>
                </div>

                {/* 폼 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* 카테고리 선택 */}
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-gray-900 mb-4">📋 건의사항 유형</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {FEEDBACK_CATEGORIES.map((category) => (
                                    <label
                                        key={category.name}
                                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                                            formData.category === category.name
                                                ? 'border-pink-500 bg-pink-50 text-pink-700'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category.name}
                                            checked={formData.category === category.name}
                                            onChange={(e) => handleInputChange('category', e.target.value as FeedbackCategory)}
                                            className="sr-only"
                                        />
                                        <div className="text-center">
                                            <div className="text-2xl mb-2">{category.emoji}</div>
                                            <div className="text-sm font-medium">{category.label}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 제목 */}
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-gray-900 mb-3">📝 제목</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                                        validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    placeholder="건의사항의 제목을 입력해주세요"
                                    maxLength={CONTENT_LIMITS.TITLE_MAX}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                                    {characterCount.title}/{CONTENT_LIMITS.TITLE_MAX}
                                </div>
                            </div>
                            {validationErrors.title && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                    {validationErrors.title}
                                </p>
                            )}
                        </div>

                        {/* 내용 */}
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-gray-900 mb-3">✍️ 상세 내용</label>
                            <div className="relative">
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    rows={8}
                                    className={`w-full px-4 py-3 text-base border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none ${
                                        validationErrors.content ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    placeholder="구체적인 건의사항이나 아이디어를 자세히 설명해주세요&#10;&#10;예시:&#10;- 어떤 문제가 있는지&#10;- 개선이 필요한 부분&#10;- 새로운 아이디어나 제안"
                                    maxLength={CONTENT_LIMITS.CONTENT_MAX}
                                />
                                <div className="absolute right-3 bottom-3 text-sm text-gray-400">
                                    {characterCount.content}/{CONTENT_LIMITS.CONTENT_MAX}
                                </div>
                            </div>
                            {validationErrors.content && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                    {validationErrors.content}
                                </p>
                            )}
                        </div>

                        {/* 파일 첨부 */}
                        <div className="mb-8">
                            <label className="block text-lg font-semibold text-gray-900 mb-3">📎 첨부파일 (선택사항)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-pink-400 transition-colors duration-200">
                                <input type="file" onChange={handleFileChange} accept="image/*" className="sr-only" id="file-upload" />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <div className="text-gray-600 mb-2">
                                        <span className="font-medium text-pink-600 hover:text-pink-700">클릭하여 파일 선택</span>
                                        <span className="text-gray-500"> 또는 파일을 여기로 드래그</span>
                                    </div>
                                    <p className="text-sm text-gray-500">PNG, JPG, GIF, WebP 파일 (최대 5MB)</p>
                                </label>
                            </div>
                            {formData.attached_file && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-green-700">📎 {formData.attached_file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('attached_file', null)}
                                            className="text-green-600 hover:text-green-700 text-sm"
                                        >
                                            제거
                                        </button>
                                    </div>
                                </div>
                            )}
                            {validationErrors.attached_file && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                    {validationErrors.attached_file}
                                </p>
                            )}
                        </div>

                        {/* 제출 버튼 */}
                        <div className="flex justify-center space-x-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center px-8 py-4 bg-pink-500 text-white text-lg font-semibold rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        수정 중...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        건의사항 수정하기
                                    </>
                                )}
                            </button>
                            <Link
                                to={`/feedback/${id}`}
                                className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                            >
                                취소
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
