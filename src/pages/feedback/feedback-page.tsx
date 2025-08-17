import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth';
import { feedbackApi } from '@/shared/api';
import { FEEDBACK_CATEGORIES } from '@/shared/constants';
import type { Feedback } from '@/shared/types';
import { formatKoreanDate } from '@/shared/lib';
import { useFeedbackStatus } from '@/features/feedback';

export default function FeedbackPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getStatusIcon, getStatusText, getStatusBadgeColor } = useFeedbackStatus();

    useEffect(() => {
        if (!user) {
            navigate('/auth/login');
            return;
        }
        loadFeedbacks();
    }, [user, navigate]);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            // 본인의 피드백만 가져오기
            const { data, error } = await feedbackApi.getMyFeedbacks(user!.id);
            if (error) {
                throw error;
            }
            setFeedbacks(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : '피드백을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* 헤더 - 조건부 렌더링 */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">내 건의사항</h1>
                        <p className="text-gray-600 mt-1">작성한 건의사항을 확인하고 관리하세요</p>
                    </div>
                    {/* 건의사항이 있을 때만 버튼 표시 */}
                    {!loading && !error && feedbacks.length > 0 && (
                        <Link
                            to="/feedback/new"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            건의사항 작성
                        </Link>
                    )}
                </div>

                {/* 건의사항 목록 */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">건의사항을 불러오는 중...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl text-red-600">⚠️</span>
                            </div>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={loadFeedbacks}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                            {/* 일러스트레이션 영역 */}
                            <div className="mb-8">
                                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-12 h-12 text-blue-400" />
                                </div>
                                <div className="w-32 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded-full mx-auto"></div>
                            </div>

                            {/* 메인 메시지 */}
                            <div className="mb-8 max-w-sm mx-auto">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">첫 번째 건의사항을 작성해보세요</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    더 나은 서비스를 위한 아이디어나
                                    <br />
                                    개선사항이 있으시면 언제든 알려주세요
                                </p>
                            </div>

                            {/* CTA 버튼 */}
                            <Link
                                to="/feedback/new"
                                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                건의사항 작성하기
                            </Link>

                            {/* 부가 정보 */}
                            <div className="mt-8 text-sm text-gray-400">
                                <p>💡 모든 건의사항은 검토 후 답변드립니다</p>
                            </div>
                        </div>
                    ) : (
                        feedbacks.map((feedback) => (
                            <Link
                                key={feedback.id}
                                to={`/feedback/${feedback.id}`}
                                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border p-6 group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        {/* 상단: 카테고리 + 상태 */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                <span className="mr-1">
                                                    {FEEDBACK_CATEGORIES.find((cat) => cat.name === feedback.category)?.emoji || '📝'}
                                                </span>
                                                {FEEDBACK_CATEGORIES.find((cat) => cat.name === feedback.category)?.label ||
                                                    feedback.category}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadgeColor(
                                                    feedback.status
                                                )}`}
                                            >
                                                {getStatusIcon(feedback.status)}
                                                <span className="ml-1">{getStatusText(feedback.status)}</span>
                                            </span>
                                        </div>

                                        {/* 제목 */}
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {feedback.title}
                                        </h3>

                                        {/* 내용 미리보기 */}
                                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                                            {feedback.content.length > 120 ? `${feedback.content.substring(0, 120)}...` : feedback.content}
                                        </p>

                                        {/* 하단: 날짜 + 답변 여부 */}
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatKoreanDate(feedback.created_at)}</span>
                                            </div>
                                            {feedback.admin_reply && (
                                                <div className="flex items-center gap-1 text-blue-600">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>관리자 답변 있음</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 상태 표시점 */}
                                    <div className="ml-4 flex-shrink-0">
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                feedback.status === 'completed'
                                                    ? 'bg-green-500'
                                                    : feedback.status === 'replied'
                                                    ? 'bg-blue-500'
                                                    : 'bg-orange-500'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* 통계 정보 + 추가 작성 버튼 */}
                {feedbacks.length > 0 && (
                    <div className="mt-8 space-y-6">
                        {/* 통계 카드 */}
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">📊 건의사항 현황</h3>
                                <Link
                                    to="/feedback/new"
                                    className="inline-flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    추가 작성
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{feedbacks.length}</div>
                                    <div className="text-sm text-gray-600">전체</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {feedbacks.filter((f) => f.status === 'pending').length}
                                    </div>
                                    <div className="text-sm text-orange-700">검토중</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {feedbacks.filter((f) => f.status === 'replied').length}
                                    </div>
                                    <div className="text-sm text-blue-700">답변완료</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                        {feedbacks.filter((f) => f.status === 'completed').length}
                                    </div>
                                    <div className="text-sm text-green-700">완료</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
