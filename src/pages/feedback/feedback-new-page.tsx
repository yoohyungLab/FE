import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth';
import { feedbackApi, spamPreventionApi } from '@/shared/api';
import { FEEDBACK_CATEGORIES, FEEDBACK_CONTENT_LIMITS } from '@/shared/constants';
import type { FeedbackCategory } from '@/shared/types';

// 비공개만 허용하는 공개 설정
const ALLOWED_VISIBILITY = {
    private: {
        icon: '🔒',
        label: '비공개 (나와 관리자만)',
        description: '작성자와 관리자만 볼 수 있습니다',
    },
};

export default function FeedbackNewPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'other' as FeedbackCategory,
        visibility: 'private' as const, // 비공개로 고정
        author_name: user?.name || '',
        author_email: '',
        attached_file: null as File | null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // 해당 필드의 유효성 검사 에러 제거
        if (validationErrors[field]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
        setError(null);
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.title.trim()) {
            errors.title = '제목을 입력해주세요.';
        } else if (formData.title.length > FEEDBACK_CONTENT_LIMITS.TITLE_MAX) {
            errors.title = `제목은 ${FEEDBACK_CONTENT_LIMITS.TITLE_MAX}자 이내로 입력해주세요.`;
        }

        if (!formData.content.trim()) {
            errors.content = '내용을 입력해주세요.';
        } else if (formData.content.length > FEEDBACK_CONTENT_LIMITS.CONTENT_MAX) {
            errors.content = `내용은 ${FEEDBACK_CONTENT_LIMITS.CONTENT_MAX}자 이내로 입력해주세요.`;
        }

        if (!formData.author_name.trim()) {
            errors.author_name = '이름을 입력해주세요.';
        }

        if (formData.author_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.author_email)) {
            errors.author_email = '올바른 이메일 형식을 입력해주세요.';
        }

        // 금지어 체크
        const titleBannedCheck = spamPreventionApi.checkBannedWords(formData.title);
        const contentBannedCheck = spamPreventionApi.checkBannedWords(formData.content);

        if (titleBannedCheck.hasBannedWords) {
            errors.title = titleBannedCheck.reason!;
        }
        if (contentBannedCheck.hasBannedWords) {
            errors.content = contentBannedCheck.reason!;
        }

        // 외부 링크 체크
        const linkCheck = spamPreventionApi.checkExternalLinks(formData.content);
        if (linkCheck.tooManyLinks) {
            errors.content = linkCheck.reason!;
        }

        // 파일 크기 체크
        if (formData.attached_file) {
            if (formData.attached_file.size > FEEDBACK_CONTENT_LIMITS.FILE_SIZE_MAX) {
                errors.attached_file = '파일 크기는 5MB 이하여야 합니다.';
            }
            if (!FEEDBACK_CONTENT_LIMITS.ALLOWED_FILE_TYPES.includes(formData.attached_file.type)) {
                errors.attached_file = '이미지 파일만 업로드 가능합니다. (JPEG, PNG, GIF, WebP)';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleInputChange('attached_file', file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 작성 제한 체크
            const limitCheck = await spamPreventionApi.checkWriteLimit(user?.id);
            if (!limitCheck.allowed) {
                setError(limitCheck.reason!);
                return;
            }

            // 중복 콘텐츠 체크
            const duplicateCheck = await spamPreventionApi.checkDuplicateContent(formData.title, formData.content, user?.id);
            if (duplicateCheck.isDuplicate) {
                setError(duplicateCheck.reason!);
                return;
            }

            // 파일 업로드 (있는 경우)
            let attachedFileUrl = undefined;
            if (formData.attached_file) {
                // 실제 구현에서는 Supabase Storage 등을 사용
                // 여기서는 임시로 스킵
            }

            // 피드백 생성
            const { data, error: createError } = await feedbackApi.createFeedback({
                title: formData.title,
                content: formData.content,
                category: formData.category,
                visibility: formData.visibility,
                author_name: formData.author_name,
                author_email: formData.author_email || undefined,
                author_id: user?.id,
                attached_file_url: attachedFileUrl,
            });

            if (createError) {
                throw createError;
            }

            // 성공 시 상세 페이지로 이동
            navigate(`/feedback/${data.id}`);
        } catch (err: any) {
            setError(err.message || '건의사항 등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const characterCount = {
        title: formData.title.length,
        content: formData.content.length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="flex items-center mb-6">
                    <Link to="/feedback" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>목록으로</span>
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">📝 건의사항 작성</h1>
                    <p className="text-gray-600">소중한 의견을 들려주세요</p>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* 작성 폼 */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* 카테고리 선택 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 선택 *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                            {Object.entries(FEEDBACK_CATEGORIES).map(([key, category]) => (
                                <option key={key} value={key}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 제목 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            제목 * ({characterCount.title}/{FEEDBACK_CONTENT_LIMITS.TITLE_MAX})
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                validationErrors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="제목을 입력해주세요"
                            maxLength={FEEDBACK_CONTENT_LIMITS.TITLE_MAX}
                        />
                        {validationErrors.title && <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>}
                    </div>

                    {/* 내용 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            내용 * ({characterCount.content}/{FEEDBACK_CONTENT_LIMITS.CONTENT_MAX})
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            rows={8}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical ${
                                validationErrors.content ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="건의사항을 자세히 설명해주세요&#10;&#10;예시:&#10;- 어떤 문제가 있는지&#10;- 개선이 필요한 부분&#10;- 새로운 아이디어나 제안"
                            maxLength={FEEDBACK_CONTENT_LIMITS.CONTENT_MAX}
                        />
                        {validationErrors.content && <p className="mt-1 text-sm text-red-600">{validationErrors.content}</p>}
                    </div>

                    {/* 공개 설정 - 비공개로 고정 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">공개 설정</label>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">🔒</div>
                                <div>
                                    <div className="font-medium text-gray-900">비공개 (나와 관리자만)</div>
                                    <div className="text-sm text-gray-600">
                                        건의사항은 개인정보 보호를 위해 비공개로만 작성됩니다.
                                        <br />
                                        작성자와 관리자만 내용을 확인할 수 있습니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 이름 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                        <input
                            type="text"
                            value={formData.author_name}
                            onChange={(e) => handleInputChange('author_name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                validationErrors.author_name ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="이름을 입력해주세요"
                        />
                        {validationErrors.author_name && <p className="mt-1 text-sm text-red-600">{validationErrors.author_name}</p>}
                    </div>

                    {/* 이메일 (선택사항) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">이메일 (답변을 받고 싶다면, 선택사항)</label>
                        <input
                            type="email"
                            value={formData.author_email}
                            onChange={(e) => handleInputChange('author_email', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                validationErrors.author_email ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="example@email.com"
                        />
                        {validationErrors.author_email && <p className="mt-1 text-sm text-red-600">{validationErrors.author_email}</p>}
                    </div>

                    {/* 첨부파일 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">📎 스크린샷 첨부 (선택, 5MB 이하)</label>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                            <label
                                htmlFor="file-upload"
                                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <Upload className="w-5 h-5" />
                                <span>파일 선택</span>
                            </label>
                            {formData.attached_file && (
                                <span className="text-sm text-gray-600 break-words">{formData.attached_file.name}</span>
                            )}
                        </div>
                        {validationErrors.attached_file && <p className="mt-1 text-sm text-red-600">{validationErrors.attached_file}</p>}
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                <span>등록 중...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                <span>📝 등록하기</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
