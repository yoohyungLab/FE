import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
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
