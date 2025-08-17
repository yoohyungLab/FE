import { feedbackService } from './services/feedback.service';
import { categoryService } from './services/category.service';
import { supabase } from '../lib/supabase';

export const feedbackApi = feedbackService;
export const categoryApi = categoryService;

// 스팸 방지 API (유틸 성격이라 유지)
export const spamPreventionApi = {
    // 작성 제한 체크
    async checkWriteLimit(userId?: string, userIp?: string) {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        if (userId) {
            const { count: dailyCount } = await supabase
                .from('feedbacks')
                .select('*', { count: 'exact' })
                .eq('user_id', userId)
                .gte('created_at', oneDayAgo.toISOString());

            if (dailyCount && dailyCount >= 10) {
                return { allowed: false, reason: '일일 작성 한도를 초과했습니다.' } as const;
            }

            const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
            const { count: recentCount } = await supabase
                .from('feedbacks')
                .select('*', { count: 'exact' })
                .eq('user_id', userId)
                .gte('created_at', tenMinutesAgo.toISOString());

            // if (recentCount && recentCount >= 1) {
            //     return { allowed: false, reason: '10분 후에 다시 작성해주세요.' };
            // }
        } else {
            // 비회원 제한 체크 (IP 기반) — 실제 구현 시 별도 테이블 필요
            return { allowed: true } as const;
        }

        return { allowed: true } as const;
    },

    // 중복 콘텐츠 체크
    async checkDuplicateContent(title: string, content: string, userId?: string) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        let query = supabase.from('feedbacks').select('id').eq('title', title).eq('content', content).gte('created_at', oneDayAgo);
        if (userId) {
            query = query.eq('user_id', userId);
        }
        const { data } = await query;
        if (data && data.length > 0) {
            return { isDuplicate: true, reason: '24시간 내 동일한 내용이 등록되었습니다.' } as const;
        }
        return { isDuplicate: false } as const;
    },

    // 금지어 체크
    // TODO: 금지어 해야하려나?
    checkBannedWords(text: string) {
        const bannedWords = ['시발', '개새끼', '병신', '좆', '씨발', '홍보', '광고', '마케팅', '판매', '구매'];
        const foundWords = bannedWords.filter((word) => text.toLowerCase().includes(word.toLowerCase()));
        if (foundWords.length > 0) {
            return { hasBannedWords: true, foundWords, reason: `금지된 단어가 포함되어 있습니다: ${foundWords.join(', ')}` } as const;
        }
        return { hasBannedWords: false } as const;
    },

    // 외부 링크 개수 체크
    // TODO: 외부 링크 개수 체크 해야하려나?
    checkExternalLinks(content: string) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = content.match(urlRegex) || [];
        if (matches.length > 3) {
            return { tooManyLinks: true, linkCount: matches.length, reason: '외부 링크는 3개까지만 허용됩니다.' } as const;
        }
        return { tooManyLinks: false, linkCount: matches.length } as const;
    },
};
