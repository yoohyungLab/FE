import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, User, MessageSquare, Edit, Trash2, Flag, Send } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth';
import { feedbackApi, feedbackCommentApi } from '@/shared/api';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS, FEEDBACK_VISIBILITY } from '@/shared/constants';
import type { Feedback, FeedbackComment } from '@/shared/types';

export default function FeedbackDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [comments, setComments] = useState<FeedbackComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadFeedback();
            loadComments();
        }
    }, [id, user]);

    const loadFeedback = async () => {
        try {
            setLoading(true);
            const { data, error } = await feedbackApi.getFeedback(id!, user?.id);

            if (error) {
                throw error;
            }

            setFeedback(data);
        } catch (err: any) {
            setError(err.message || '피드백을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            const { data, error } = await feedbackCommentApi.getComments(id!);

            if (error) throw error;

            setComments(data || []);
        } catch (err) {
            // 댓글 로딩 실패는 조용히 처리
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim()) return;

        try {
            setCommentLoading(true);

            const { data, error } = await feedbackCommentApi.createComment({
                feedback_id: id!,
                content: newComment,
                author_name: user?.name || '익명',
                author_id: user?.id,
            });

            if (error) throw error;

            setComments((prev) => [...prev, data]);
            setNewComment('');
        } catch (err) {
            setError('댓글 작성에 실패했습니다.');
        } finally {
            setCommentLoading(false);
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
        return (
            date.toLocaleDateString('ko-KR') +
            ' ' +
            date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
            })
        );
    };

    const getDisplayName = (feedback: Feedback) => {
        if (feedback.visibility === 'anonymous') {
            return '익명';
        }
        return feedback.author_name || '익명';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link to="/feedback" className="text-pink-500 hover:text-pink-600">
                        목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">피드백을 찾을 수 없습니다.</p>
                    <Link to="/feedback" className="text-pink-500 hover:text-pink-600">
                        목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // 비공개 글에 대한 접근 권한 체크
    if (feedback.visibility === 'private' && feedback.author_id !== user?.id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🔒 비밀글입니다</h2>
                    <p className="text-gray-600 mb-6">이 글은 작성자만 볼 수 있습니다.</p>
                    <Link
                        to="/feedback"
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>목록으로</span>
                    </Link>
                </div>
            </div>
        );
    }

    const isAuthor = feedback.author_id === user?.id;
    const canEdit = isAuthor;
    const canDelete = isAuthor;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <Link to="/feedback" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>목록으로</span>
                    </Link>

                    {/* 작성자 메뉴 */}
                    {(canEdit || canDelete) && (
                        <div className="flex items-center space-x-2">
                            {canEdit && (
                                <Link
                                    to={`/feedback/${feedback.id}/edit`}
                                    className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>수정</span>
                                </Link>
                            )}
                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>삭제</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* 메인 콘텐츠 */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* 헤더 정보 */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center space-x-2 mb-3">
                            <span className="text-sm text-gray-500">
                                {FEEDBACK_CATEGORIES[feedback.category]?.label || feedback.category}
                            </span>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    FEEDBACK_STATUS[feedback.status]?.color || 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {FEEDBACK_STATUS[feedback.status]?.label || feedback.status}
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{feedback.title}</h1>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{getDisplayName(feedback)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(feedback.created_at)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{feedback.views}</span>
                                </div>
                            </div>

                            {!isAuthor && (
                                <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Flag className="w-4 h-4" />
                                    <span>신고</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 본문 */}
                    <div className="p-6">
                        <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{feedback.content}</p>
                        </div>

                        {/* 첨부파일 */}
                        {feedback.attached_file_url && (
                            <div className="mt-6">
                                <img src={feedback.attached_file_url} alt="첨부 이미지" className="max-w-full h-auto rounded-lg border" />
                            </div>
                        )}
                    </div>

                    {/* 관리자 답변 */}
                    {feedback.admin_reply && (
                        <div className="p-6 bg-blue-50 border-t border-gray-200">
                            <h3 className="flex items-center space-x-2 text-lg font-medium text-blue-900 mb-3">
                                <span>🛠</span>
                                <span>운영진 답변</span>
                            </h3>
                            <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{feedback.admin_reply}</p>
                                {feedback.admin_reply_at && (
                                    <p className="text-sm text-gray-500 mt-3">{formatDate(feedback.admin_reply_at)} - 운영진 일동</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 댓글 섹션 */}
                <div className="mt-8 bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 mb-6">
                            <MessageSquare className="w-5 h-5" />
                            <span>댓글 ({comments.length})</span>
                        </h3>

                        {/* 댓글 작성 */}
                        <form onSubmit={handleCommentSubmit} className="mb-6">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="댓글을 작성해주세요..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || commentLoading}
                                    className="flex items-center space-x-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>등록</span>
                                </button>
                            </div>
                        </form>

                        {/* 댓글 목록 */}
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">첫 번째 댓글을 작성해보세요!</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="border-l-4 border-gray-200 pl-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className={`font-medium ${comment.is_admin ? 'text-blue-600' : 'text-gray-900'}`}>
                                                    {comment.is_admin ? '🛠 운영진' : comment.author_name}
                                                </span>
                                                <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
