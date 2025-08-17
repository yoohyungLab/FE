import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Send, X } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth';
import { feedbackApi, spamPreventionApi } from '@/shared/api';
import { CONTENT_LIMITS, FEEDBACK_CATEGORIES } from '@/shared/constants';
import { supabase } from '@/shared/lib';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface FeedbackFormData {
    title: string;
    content: string;
    category: string;
    attached_file: File | null;
}

interface ValidationErrors {
    title?: string;
    content?: string;
    attached_file?: string;
}

export default function FeedbackNewPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState<FeedbackFormData>({
        title: '',
        content: '',
        category: 'test_idea',
        attached_file: null,
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [characterCount, setCharacterCount] = useState({ title: 0, content: 0 });

    // 로그인 체크
    if (!user) {
        navigate('/auth/login');
        return null;
    }

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

        // 파일 크기 체크 (파일이 있을 때만)
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

            // 스팸 방지 체크
            const limitCheck = await spamPreventionApi.checkWriteLimit(user.id);
            if (!limitCheck.allowed) {
                throw new Error(limitCheck.reason || '작성 제한에 도달했습니다.');
            }

            // 파일 업로드 처리 (파일이 있을 때만)
            let attachedFileUrl: string | undefined = undefined;
            if (formData.attached_file) {
                try {
                    const fileName = `${Date.now()}_${formData.attached_file.name}`;
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('feedback-files')
                        .upload(fileName, formData.attached_file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage.from('feedback-files').getPublicUrl(fileName);

                    attachedFileUrl = urlData.publicUrl;
                } catch (uploadError) {
                    console.warn('파일 업로드 실패:', uploadError);
                    // 파일 업로드 실패해도 건의사항은 제출되도록 함
                }
            }

            // 건의사항 제출 (attached_file_url 사용)
            await feedbackApi.createFeedback({
                title: formData.title.trim(),
                content: formData.content.trim(),
                category: formData.category,
                user_id: user.id,
                author_name: user.name || user.email || '익명',
                author_email: user.email || '',
                attached_file_url: attachedFileUrl,
            });

            navigate('/feedback');
            setCharacterCount({ title: 0, content: 0 });
            setValidationErrors({});
        } catch (err: any) {
            setValidationErrors({ title: err.message || '제출에 실패했습니다.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleInputChange('attached_file', file);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="mb-8">
                    <Link to="/feedback" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        건의사항 목록
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">건의사항 작성</h1>
                    <p className="mt-2 text-sm text-gray-500">제출 후에는 수정이 불가능합니다. 내용을 한 번 더 확인해주세요.</p>
                </div>

                {/* 폼 */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* 카테고리 선택 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                            <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        <div className="flex items-center gap-2">
                                            <span>{FEEDBACK_CATEGORIES?.find((cat) => cat.name === formData.category)?.emoji}</span>
                                            <span>{FEEDBACK_CATEGORIES?.find((cat) => cat.name === formData.category)?.label}</span>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {FEEDBACK_CATEGORIES?.map((category) => (
                                        <SelectItem key={category.name} value={category.name}>
                                            <div className="flex items-center gap-2">
                                                <span>{category.emoji}</span>
                                                <div>
                                                    <div className="font-medium">{category.label}</div>
                                                    <div className="text-xs text-gray-500">{category.description}</div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 제목 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="건의사항의 제목을 입력해주세요"
                                    maxLength={CONTENT_LIMITS.TITLE_MAX}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                    {characterCount.title}/{CONTENT_LIMITS.TITLE_MAX}
                                </div>
                            </div>
                            {validationErrors.title && <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>}
                        </div>

                        {/* 내용 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">상세 내용</label>
                            <div className="relative">
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    rows={8}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                        validationErrors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                    placeholder="구체적인 건의사항이나 아이디어를 자세히 설명해주세요"
                                    maxLength={CONTENT_LIMITS.CONTENT_MAX}
                                />
                                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                                    {characterCount.content}/{CONTENT_LIMITS.CONTENT_MAX}
                                </div>
                            </div>
                            {validationErrors.content && <p className="mt-1 text-sm text-red-600">{validationErrors.content}</p>}
                        </div>

                        {/* 파일 첨부 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">첨부파일 (선택사항)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                <input type="file" onChange={handleFileChange} accept="image/*" className="sr-only" id="file-upload" />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <div className="text-sm text-gray-600 mb-1">
                                        <span className="font-medium text-blue-600 hover:text-blue-500">클릭하여 파일 선택</span>
                                        <span className="text-gray-500"> 또는 드래그 앤 드롭</span>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP (최대 5MB)</p>
                                </label>
                            </div>
                            {formData.attached_file && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-green-700">📎 {formData.attached_file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('attached_file', null)}
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            {validationErrors.attached_file && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.attached_file}</p>
                            )}
                        </div>

                        {/* 제출 버튼 */}
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        제출 중...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        건의사항 제출하기
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
