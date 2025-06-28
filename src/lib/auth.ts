import { create } from 'zustand';
import { supabase } from './supabase';

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
                    set({ user: data.user });
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
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null });
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
                set({ user });
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            set({ loading: false });
        }
    },
}));
