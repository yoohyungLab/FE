import { supabase } from '../../lib/supabase';
import type { Feedback, FeedbackFilters, FeedbackStatus } from '../../types';

export const feedbackService = {
    // 피드백 목록 조회 (필터/페이지네이션)
    async getFeedbacks(filters: FeedbackFilters = {}, page = 1, limit = 20) {
        let query = supabase.from('feedbacks').select('*').order('created_at', { ascending: false });

        if (filters.category) {
            query = query.eq('category', filters.category);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.search) {
            query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
        }

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
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        return { data, error };
    },

    // 피드백 상세 조회 (본인만 접근 가능)
    async getFeedback(id: string, userId?: string) {
        const { data: feedback, error } = await supabase.from('feedbacks').select('*').eq('id', id).single();

        if (error || !feedback) {
            return { data: null, error };
        }
        if (feedback.user_id !== userId) {
            return { data: null, error: { message: '접근 권한이 없습니다.' } } as const;
        }
        return { data: feedback as Feedback, error: null } as const;
    },

    // 피드백 생성
    async createFeedback(feedbackData: {
        title: string;
        content: string;
        category: string;
        user_id: string;
        author_name: string;
        author_email: string;
        attached_file_url?: string;
    }) {
        try {
            const { data, error } = await supabase
                .from('feedbacks')
                .insert({
                    title: feedbackData.title,
                    content: feedbackData.content,
                    category: feedbackData.category,
                    visibility: 'private',
                    status: 'pending',
                    user_id: feedbackData.user_id,
                    author_name: feedbackData.author_name,
                    author_email: feedbackData.author_email,
                    attached_file_url: feedbackData.attached_file_url || null,
                })
                .select()
                .single();

            return { data, error };
        } catch (error) {
            console.error('건의사항 생성 에러:', error);
            return { data: null, error };
        }
    },

    // 피드백 수정
    async updateFeedback(id: string, userId: string, updates: Partial<Feedback>) {
        const { data, error } = await supabase.from('feedbacks').update(updates).eq('id', id).eq('user_id', userId).select().single();
        return { data, error };
    },

    // 피드백 삭제
    async deleteFeedback(id: string, userId: string) {
        const { error } = await supabase.from('feedbacks').delete().eq('id', id).eq('user_id', userId);
        return { error };
    },

    // 관리자용: 전체 목록
    async getAllFeedbacks() {
        const { data, error } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    // 관리자용: 상태 업데이트
    async updateFeedbackStatus(id: string, status: FeedbackStatus) {
        const { data, error } = await supabase.from('feedbacks').update({ status }).eq('id', id).select().single();
        return { data, error };
    },

    // 관리자용: 답변 추가
    async addAdminReply(id: string, reply: string) {
        const { data, error } = await supabase
            .from('feedbacks')
            .update({
                admin_reply: reply,
                admin_reply_at: new Date().toISOString(),
                status: 'replied' as FeedbackStatus,
            })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    },
};
