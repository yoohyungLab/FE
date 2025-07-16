import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MessageSquare, Eye, Calendar, User } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth';
import { feedbackApi } from '@/shared/api';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS, FEEDBACK_VISIBILITY } from '@/shared/constants';
import type { Feedback, FeedbackFilters } from '@/shared/types';

export default function FeedbackPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FeedbackFilters>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadFeedbacks();
    }, [filters]);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            const { data, error } = await feedbackApi.getFeedbacks(filters);

            if (error) throw error;

            // 접근 권한에 따라 피드백 필터링
            const accessibleFeedbacks = (data || []).filter((feedback) => {
                if (feedback.visibility === 'private') {
                    return feedback.author_id === user?.id; // 작성자만 볼 수 있음
                }
                return true; // public, anonymous는 모두 볼 수 있음
            });

            setFeedbacks(accessibleFeedbacks);
        } catch (err) {
            setError('피드백을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setFilters((prev) => ({ ...prev, search: searchTerm }));
    };

    const handleFilterChange = (key: keyof FeedbackFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key] === value ? undefined : value,
        }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    const getDisplayName = (feedback: Feedback) => {
        if (feedback.visibility === 'anonymous') {
            return '익명';
        }
        return feedback.author_name || '익명';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">💌 건의사항 & 개선 아이디어</h1>
                    <div className="w-24 h-1 bg-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        더 나은 유형연구소를 만들어가요!
                        <br />
                        테스트 아이디어부터 기능 개선까지 자유롭게 의견을 남겨주세요.
                    </p>
                </div>

                {/* 피드백 목록 */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">로딩 중...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 등록된 건의사항이 없습니다</h3>
                            <p className="text-gray-500 mb-6">첫 번째 건의사항을 등록해보세요!</p>
                            <Link
                                to="/feedback/new"
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>건의사항 작성하기</span>
                            </Link>
                        </div>
                    ) : (
                        feedbacks.map((feedback) => (
                            <Link
                                key={feedback.id}
                                to={`/feedback/${feedback.id}`}
                                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* 카테고리 + 상태 */}
                                        <div className="flex items-center space-x-2 mb-2">
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
                                            {feedback.visibility === 'private' && <span className="text-xs text-gray-400">🔒</span>}
                                        </div>

                                        {/* 제목 */}
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {feedback.visibility === 'private' && feedback.author_id !== user?.id
                                                ? '🔒 비밀글입니다'
                                                : feedback.title}
                                        </h3>

                                        {/* 메타 정보 */}
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
