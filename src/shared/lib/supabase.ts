import { createClient } from '@supabase/supabase-js';

// auth 옵션 포함 완전한 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true, // 자동 토큰 갱신
        persistSession: true, // 세션 지속
        detectSessionInUrl: true, // URL에서 세션 감지
    },
});

// 결과 저장을 위한 타입 정의
export interface TestResultData {
    id?: string;
    gender: 'male' | 'female';
    result: 'egen-male' | 'egen-female' | 'teto-male' | 'teto-female' | 'mixed';
    score: number;
    answers: number[];
    created_at?: string;
}

// 결과 저장 함수
export const saveTestResult = async (data: Omit<TestResultData, 'id' | 'created_at'>) => {
    try {
        const { data: result, error } = await supabase.from('test_results').insert([data]).select().single();

        if (error) {
            console.error('Error saving test result:', error);
            throw error;
        }

        return result;
    } catch (error) {
        console.error('Failed to save test result:', error);
        throw error;
    }
};

// 결과 조회 함수
export const getTestResults = async () => {
    try {
        const { data, error } = await supabase.from('test_results').select('*').order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching test results:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Failed to fetch test results:', error);
        throw error;
    }
};

// 카카오 OAuth 설정
export const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                prompt: 'select_account',
            },
        },
    });
    return { data, error };
};

// 타입 정의
export interface Profile {
    id: string;
    email?: string;
    name: string;
    avatar_url?: string;
    provider: 'kakao' | 'email' | 'google';
    kakao_id?: string;
    created_at: string;
    updated_at: string;
}

export interface TestResult {
    id: string;
    user_id: string;
    test_type: string;
    result_data: any;
    score: number;
    gender: 'male' | 'female';
    created_at: string;
}

// 테스트 관련 API
export const testApi = {
    // 공개된 모든 테스트 조회
    async getPublishedTests() {
        const { data, error } = await supabase
            .from('tests')
            .select(
                `
                *,
                questions:questions(
                    *,
                    question_options:question_options(*)
                ),
                test_results:test_results(*)
            `
            )
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // 특정 테스트 조회
    async getTestBySlug(slug: string) {
        const { data, error } = await supabase
            .from('tests')
            .select(
                `
                *,
                questions:questions(
                    *,
                    question_options:question_options(*)
                ),
                test_results:test_results(*)
            `
            )
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

        if (error) throw error;
        return data;
    },

    // 사용자 응답 저장
    async saveUserResponse(testId: string, sessionId: string, answers: any, resultId?: string, score?: number, metadata?: any) {
        const { data, error } = await supabase
            .from('user_responses')
            .insert([
                {
                    test_id: testId,
                    session_id: sessionId,
                    answers,
                    result_id: resultId,
                    score,
                    metadata,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 세션별 응답 조회
    async getUserResponseBySession(sessionId: string, testId: string) {
        const { data, error } = await supabase
            .from('user_responses')
            .select(
                `
                *,
                test_results:result_id(*)
            `
            )
            .eq('session_id', sessionId)
            .eq('test_id', testId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116는 데이터가 없을 때
        return data;
    },
};

// 섹션 관리 API
export const sectionApi = {
    // 섹션별 테스트 조회
    async getTestsBySection(sectionName: string) {
        const { data, error } = await supabase.rpc('get_tests_by_section', { section_name: sectionName });

        if (error) throw error;
        return data || [];
    },
};
