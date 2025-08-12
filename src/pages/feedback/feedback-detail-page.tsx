import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, MessageSquare, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth';
import { feedbackApi } from '@/shared/api';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS } from '@/shared/constants';
import type { Feedback } from '@/shared/types';

export default function FeedbackDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

            // 본인의 피드백만 볼 수 있도록 체크
            if (data && data.author_id !== user?.id) {
                setError('접근 권한이 없습니다.');
                return;
            }

            setFeedback(data);
        } catch (err: any) {
            setError(err.message || '피드백을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!feedback || !user?.id || feedback.author_id !== user.id) return;

        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const { error } = await feedbackApi.deleteFeedback(feedback.id, user.id);

            if (error) throw error;

            navigate('/feedback');
        } catch (err) {
            setError('삭제에 실패했습니다.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'replied':
                return <MessageSquare className="w-5 h-5 text-blue-600" />;
            case 'in_progress':
                return <AlertCircle className="w-5 h-5 text-blue-600" />;
            case 'rejected':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
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

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-red-100 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-red-600">⚠️</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">오류가 발생했습니다</h2>
                    <p className="text-red-600 mb-6">{error}</p>
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

    if (!feedback) {
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

    const isAuthor = feedback.author_id === user?.id;
    const canEdit = isAuthor;
    const canDelete = isAuthor;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        to="/feedback"
                        className="inline-flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>목록으로 돌아가기</span>
                    </Link>

                    {/* 작성자 메뉴 */}
                    {(canEdit || canDelete) && (
                        <div className="flex items-center space-x-2">
                            {canEdit && (
                                <Link
                                    to={`/feedback/${feedback.id}/edit`}
                                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>수정</span>
                                </Link>
                            )}
                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-all duration-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>삭제</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* 메인 콘텐츠 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* 헤더 정보 */}
                    <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-blue-50">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
                                {FEEDBACK_CATEGORIES[feedback.category]?.label || feedback.category}
                            </span>
                            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                {getStatusIcon(feedback.status)}
                                <span>{FEEDBACK_STATUS[feedback.status]?.label || feedback.status}</span>
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{feedback.title}</h1>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4" />
                                    <span>작성자: {feedback.author_name || '익명'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>작성일: {formatDate(feedback.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 본문 */}
                    <div className="p-8">
                        <div className="prose max-w-none">
                            <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">{feedback.content}</div>
                        </div>

                        {/* 첨부파일 */}
                        {feedback.attached_file_url && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">📎 첨부파일</h3>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <img
                                        src={feedback.attached_file_url}
                                        alt="첨부 이미지"
                                        className="max-w-full h-auto w-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 관리자 답변 */}
                    {feedback.admin_reply && (
                        <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200">
                            <h3 className="flex items-center space-x-3 text-xl font-semibold text-blue-900 mb-4">
                                <span className="text-2xl">🛠️</span>
                                <span>운영진 답변</span>
                            </h3>
                            <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
                                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{feedback.admin_reply}</div>
                                {feedback.admin_reply_at && (
                                    <div className="flex items-center space-x-2 text-sm text-blue-600 mt-4 pt-4 border-t border-blue-100">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(feedback.admin_reply_at)} - 운영진 일동</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 상태 변경 안내 */}
                    {feedback.status === 'pending' && (
                        <div className="p-6 bg-yellow-50 border-t border-gray-200">
                            <div className="flex items-center space-x-3 text-yellow-800">
                                <Clock className="w-5 h-5" />
                                <div>
                                    <p className="font-medium">검토 중입니다</p>
                                    <p className="text-sm text-yellow-700">운영진이 건의사항을 검토하고 있습니다. 조금만 기다려주세요!</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {feedback.status === 'completed' && (
                        <div className="p-6 bg-green-50 border-t border-gray-200">
                            <div className="flex items-center space-x-3 text-green-800">
                                <CheckCircle className="w-5 h-5" />
                                <div>
                                    <p className="font-medium">검토가 완료되었습니다</p>
                                    <p className="text-sm text-green-700">소중한 의견을 보내주셔서 감사합니다!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 하단 액션 버튼 */}
                <div className="mt-8 flex justify-center">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/feedback/new"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        >
                            <span>새 건의사항 작성</span>
                        </Link>
                        <Link
                            to="/feedback"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                        >
                            <span>목록으로 돌아가기</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
