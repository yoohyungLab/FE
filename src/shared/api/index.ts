import { supabase } from '../lib/supabase';
import type { Feedback, FeedbackComment, FeedbackFilters, FeedbackCategory, FeedbackVisibility, FeedbackStatus } from '../types';

// 피드백 API
export const feedbackApi = {
    // 피드백 목록 조회
    async getFeedbacks(filters: FeedbackFilters = {}, page = 1, limit = 20) {
        let query = supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

        // 필터 적용
        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.visibility) {
            query = query.eq('visibility', filters.visibility);
        }
        if (filters.search) {
            query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
        }

        // 페이지네이션
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;
        return { data, error, count };
    },

    // 내 피드백 목록 조회
    async getMyFeedbacks(userId: string) {
        const { data, error } = await supabase
            .from('feedbacks')
            .select('*')
            .eq('author_id', userId)
            .order('created_at', { ascending: false });

        return { data, error };
    },

    // 피드백 상세 조회 (조회수 증가)
    async getFeedback(id: string, userId?: string) {
        const { data: feedback, error } = await supabase.from('feedbacks').select('*').eq('id', id).single();

        if (error || !feedback) {
            return { data: null, error };
        }

        // 접근 권한 체크
        if (feedback.visibility === 'private' && feedback.author_id !== userId) {
            // 관리자 권한 체크 로직 추가 필요
            return { data: null, error: { message: '접근 권한이 없습니다.' } };
        }

        // 조회수 증가 (작성자가 아닌 경우)
        if (feedback.author_id !== userId) {
            await supabase
                .from('feedbacks')
                .update({ views: feedback.views + 1 })
                .eq('id', id);
            feedback.views += 1;
        }

        return { data: feedback, error: null };
    },

    // 피드백 작성
    async createFeedback(feedbackData: {
        title: string;
        content: string;
        category: FeedbackCategory;
        visibility: FeedbackVisibility;
        author_name: string;
        author_email?: string;
        author_id?: string;
        attached_file_url?: string;
    }) {
        const { data, error } = await supabase
            .from('feedbacks')
            .insert({
                ...feedbackData,
                status: 'pending' as FeedbackStatus,
                views: 0,
            })
            .select()
            .single();

        return { data, error };
    },

    // 피드백 수정 (작성자만)
    async updateFeedback(id: string, userId: string, updates: Partial<Feedback>) {
        const { data, error } = await supabase.from('feedbacks').update(updates).eq('id', id).eq('author_id', userId).select().single();

        return { data, error };
    },

    // 피드백 삭제 (작성자만)
    async deleteFeedback(id: string, userId: string) {
        const { error } = await supabase.from('feedbacks').delete().eq('id', id).eq('author_id', userId);

        return { error };
    },

    // 관리자 답변 추가
    async addAdminReply(id: string, adminId: string, reply: string) {
        const { data, error } = await supabase
            .from('feedbacks')
            .update({
                admin_reply: reply,
                admin_reply_at: new Date().toISOString(),
                admin_id: adminId,
                status: 'replied' as FeedbackStatus,
            })
            .eq('id', id)
            .select()
            .single();

        return { data, error };
    },

    // 피드백 상태 변경 (관리자만)
    async updateStatus(id: string, status: FeedbackStatus) {
        const { data, error } = await supabase.from('feedbacks').update({ status }).eq('id', id).select().single();

        return { data, error };
    },
};

// 댓글 API
export const feedbackCommentApi = {
    // 댓글 목록 조회
    async getComments(feedbackId: string) {
        const { data, error } = await supabase
            .from('feedback_comments')
            .select('*')
            .eq('feedback_id', feedbackId)
            .order('created_at', { ascending: true });

        return { data, error };
    },

    // 댓글 작성
    async createComment(commentData: {
        feedback_id: string;
        content: string;
        author_name: string;
        author_id?: string;
        is_admin?: boolean;
    }) {
        const { data, error } = await supabase
            .from('feedback_comments')
            .insert({
                ...commentData,
                is_admin: commentData.is_admin || false,
            })
            .select()
            .single();

        return { data, error };
    },

    // 댓글 삭제
    async deleteComment(id: string, userId: string) {
        const { error } = await supabase.from('feedback_comments').delete().eq('id', id).eq('author_id', userId);

        return { error };
    },
};

// 스팸 방지 API
export const spamPreventionApi = {
    // 작성 제한 체크
    async checkWriteLimit(userId?: string, userIp?: string) {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        if (userId) {
            // 회원 제한 체크
            const { count: dailyCount } = await supabase
                .from('feedbacks')
                .select('*', { count: 'exact' })
                .eq('author_id', userId)
                .gte('created_at', oneDayAgo.toISOString());

            if (dailyCount && dailyCount >= 10) {
                return { allowed: false, reason: '일일 작성 한도를 초과했습니다.' };
            }

            const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
            const { count: recentCount } = await supabase
                .from('feedbacks')
                .select('*', { count: 'exact' })
                .eq('author_id', userId)
                .gte('created_at', tenMinutesAgo.toISOString());

            if (recentCount && recentCount >= 1) {
                return { allowed: false, reason: '10분 후에 다시 작성해주세요.' };
            }
        } else {
            // 비회원 제한 체크 (IP 기반)
            // IP 기반 체크는 실제 구현 시 별도 테이블 필요
            return { allowed: true };
        }

        return { allowed: true };
    },

    // 중복 콘텐츠 체크
    async checkDuplicateContent(title: string, content: string, userId?: string) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        let query = supabase.from('feedbacks').select('id').eq('title', title).eq('content', content).gte('created_at', oneDayAgo);

        if (userId) {
            query = query.eq('author_id', userId);
        }

        const { data, error } = await query;

        if (data && data.length > 0) {
            return { isDuplicate: true, reason: '24시간 내 동일한 내용이 등록되었습니다.' };
        }

        return { isDuplicate: false };
    },

    // 금지어 체크
    checkBannedWords(text: string) {
        const bannedWords = [
            // 욕설, 비속어 등 추가
            '시발',
            '개새끼',
            '병신',
            '좆',
            '씨발',
            // 광고성 키워드
            '홍보',
            '광고',
            '마케팅',
            '판매',
            '구매',
            // 외부 링크 패턴
        ];

        const foundWords = bannedWords.filter((word) => text.toLowerCase().includes(word.toLowerCase()));

        if (foundWords.length > 0) {
            return {
                hasBannedWords: true,
                foundWords,
                reason: `금지된 단어가 포함되어 있습니다: ${foundWords.join(', ')}`,
            };
        }

        return { hasBannedWords: false };
    },

    // 외부 링크 개수 체크
    checkExternalLinks(content: string) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = content.match(urlRegex) || [];

        if (matches.length > 3) {
            return {
                tooManyLinks: true,
                linkCount: matches.length,
                reason: '외부 링크는 3개까지만 허용됩니다.',
            };
        }

        return { tooManyLinks: false, linkCount: matches.length };
    },
};
