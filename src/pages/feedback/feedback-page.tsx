import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MessageSquare, Calendar, User, Eye, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/shared/lib/auth';
import { feedbackApi } from '@/shared/api';
import { FEEDBACK_CATEGORIES, FEEDBACK_STATUS } from '@/shared/constants';
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
        if (!user) {
            navigate('/auth/login');
            return;
        }
        loadFeedbacks();
    }, [filters, user, navigate]);

    const loadFeedbacks = async () => {
        try {
            setLoading(true);
            // 본인의 피드백만 가져오기
            const { data, error } = await feedbackApi.getMyFeedbacks(user!.id);

            if (error) throw error;

            setFeedbacks(data || []);
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
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'replied':
                return <MessageSquare className="w-4 h-4 text-blue-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">💌 내 건의사항</h1>
                    <div className="w-24 h-1 bg-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">더 나은 유형연구소를 만들어가는 소중한 의견들을 확인하세요</p>
                </div>

                {/* 검색 및 필터 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        {/* 검색 */}
                        <div className="flex-1 w-full lg:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="건의사항 제목이나 내용으로 검색..."
                                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* 필터 토글 */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                        >
                            <Filter className="w-4 h-4" />
                            <span>필터</span>
                        </button>

                        {/* 새 건의사항 작성 */}
                        <Link
                            to="/feedback/new"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5" />
                            <span>새 건의사항</span>
                        </Link>
                    </div>

                    {/* 필터 옵션들 */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* 카테고리 필터 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                                    <select
                                        value={filters.category || ''}
                                        onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    >
                                        <option value="">전체</option>
                                        {Object.entries(FEEDBACK_CATEGORIES).map(([key, category]) => (
                                            <option key={key} value={key}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* 상태 필터 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                                    <select
                                        value={filters.status || ''}
                                        onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    >
                                        <option value="">전체</option>
                                        {Object.entries(FEEDBACK_STATUS).map(([key, status]) => (
                                            <option key={key} value={key}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 피드백 목록 */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">건의사항을 불러오는 중...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl text-red-600">⚠️</span>
                            </div>
                            <p className="text-red-600 text-lg mb-4">{error}</p>
                            <button
                                onClick={loadFeedbacks}
                                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">아직 작성한 건의사항이 없습니다</h3>
                            <p className="text-gray-500 mb-8 text-lg">첫 번째 건의사항을 작성해보세요!</p>
                            <Link
                                to="/feedback/new"
                                className="inline-flex items-center space-x-3 px-8 py-4 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all duration-200 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus className="w-6 h-6" />
                                <span>건의사항 작성하기</span>
                            </Link>
                        </div>
                    ) : (
                        feedbacks.map((feedback) => (
                            <Link
                                key={feedback.id}
                                to={`/feedback/${feedback.id}`}
                                className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden group"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            {/* 카테고리 + 상태 */}
                                            <div className="flex items-center space-x-3 mb-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
                                                    {FEEDBACK_CATEGORIES[feedback.category]?.label || feedback.category}
                                                </span>
                                                <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                                    {getStatusIcon(feedback.status)}
                                                    <span>{FEEDBACK_STATUS[feedback.status]?.label || feedback.status}</span>
                                                </span>
                                            </div>

                                            {/* 제목 */}
                                            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                                                {feedback.title}
                                            </h3>

                                            {/* 내용 미리보기 */}
                                            <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                                {feedback.content.length > 100
                                                    ? `${feedback.content.substring(0, 100)}...`
                                                    : feedback.content}
                                            </p>

                                            {/* 메타 정보 */}
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(feedback.created_at)}</span>
                                                </div>
                                                {feedback.admin_reply && (
                                                    <div className="flex items-center space-x-2 text-blue-600">
                                                        <MessageSquare className="w-4 h-4" />
                                                        <span>답변 완료</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 상태 표시 */}
                                        <div className="ml-4">
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    feedback.status === 'completed'
                                                        ? 'bg-green-500'
                                                        : feedback.status === 'replied'
                                                        ? 'bg-blue-500'
                                                        : 'bg-yellow-500'
                                                }`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* 통계 정보 */}
                {feedbacks.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 건의사항 현황</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-pink-50 rounded-xl">
                                <div className="text-2xl font-bold text-pink-600">{feedbacks.length}</div>
                                <div className="text-sm text-pink-700">전체</div>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-xl">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {feedbacks.filter((f) => f.status === 'pending').length}
                                </div>
                                <div className="text-sm text-yellow-700">검토중</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-xl">
                                <div className="text-2xl font-bold text-blue-600">
                                    {feedbacks.filter((f) => f.status === 'replied').length}
                                </div>
                                <div className="text-sm text-blue-700">답변완료</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-xl">
                                <div className="text-2xl font-bold text-green-600">
                                    {feedbacks.filter((f) => f.status === 'completed').length}
                                </div>
                                <div className="text-sm text-green-700">채택됨</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
