import { create } from 'zustand';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    provider?: 'kakao' | 'google' | 'email';
}

interface AuthState {
    user: User | null;
    loading: boolean;
    signIn: (provider: 'kakao' | 'google' | 'email', credentials?: { email: string; password: string }) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
    user: null,
    loading: true,

    signIn: async (provider, credentials) => {
        try {
            set({ loading: true });

            if (provider === 'kakao') {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'kakao',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
            } else if (provider === 'google') {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
            } else if (provider === 'email' && credentials) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (error) throw error;
                if (data.user) {
                    const userWithProfile = {
                        ...data.user,
                        name:
                            data.user.user_metadata?.name ||
                            data.user.user_metadata?.full_name ||
                            data.user.email?.split('@')[0] ||
                            '사용자',
                        avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                        provider: (data.user.app_metadata?.provider as 'kakao' | 'google' | 'email') || 'email',
                    };
                    set({ user: userWithProfile });
                }
            }
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signUp: async (email, password, name) => {
        try {
            set({ loading: true });
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name },
                },
            });
            if (error) throw error;
            if (data.user) {
                set({ user: data.user });
            }
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        const navigate = useNavigate();
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null });
            navigate('/');
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    },

    checkAuth: async () => {
        try {
            set({ loading: true });
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // 사용자 메타데이터에서 추가 정보 가져오기
                const userWithProfile = {
                    ...user,
                    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자',
                    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                    provider: (user.app_metadata?.provider as 'kakao' | 'google' | 'email') || 'email',
                };
                set({ user: userWithProfile });
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            set({ loading: false });
        }
    },
}));
