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
                // OAuth는 리디렉션되므로 여기서 프로필 체크 불가 - callback에서 처리
            } else if (provider === 'google') {
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                // OAuth는 리디렉션되므로 여기서 프로필 체크 불가 - callback에서 처리
            } else if (provider === 'email' && credentials) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (error) throw error;
                if (data.user) {
                    // 사용자 메타데이터에서 deleted_at 체크
                    const userDeletedAt = data.user.user_metadata?.deleted_at;

                    // 메타데이터에 deleted_at이 있으면 로그인 거부
                    if (userDeletedAt) {
                        await supabase.auth.signOut();
                        throw new Error('탈퇴한 계정입니다. 새로운 계정으로 가입해주세요.');
                    }

                    // 프로필 체크
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    // 프로필이 존재하고 deleted_at이 설정된 경우만 로그인 거부
                    if (profile && profile.deleted_at) {
                        await supabase.auth.signOut();
                        throw new Error('탈퇴한 계정입니다. 새로운 계정으로 가입해주세요.');
                    }

                    // 프로필이 없는 경우 생성 시도 (기존 사용자의 프로필이 누락된 경우)
                    let finalProfile = profile;
                    if (profileError || !profile) {
                        console.log('프로필이 없어서 새로 생성 시도');
                        const { data: newProfile, error: createError } = await supabase
                            .from('profiles')
                            .upsert({
                                id: data.user.id,
                                email: data.user.email,
                                name:
                                    data.user.user_metadata?.name ||
                                    data.user.user_metadata?.full_name ||
                                    data.user.email?.split('@')[0] ||
                                    '사용자',
                                avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                                provider: (data.user.app_metadata?.provider as 'kakao' | 'google' | 'email') || 'email',
                                created_at: new Date().toISOString(),
                            })
                            .select()
                            .single();

                        if (!createError && newProfile) {
                            finalProfile = newProfile;
                        }
                    }

                    const userWithProfile = {
                        ...data.user,
                        name:
                            finalProfile?.name ||
                            data.user.user_metadata?.name ||
                            data.user.user_metadata?.full_name ||
                            data.user.email?.split('@')[0] ||
                            '사용자',
                        avatar_url: finalProfile?.avatar_url || data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                        provider: ((finalProfile?.provider || data.user.app_metadata?.provider) as 'kakao' | 'google' | 'email') || 'email',
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
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({ user: null });
            // navigate 제거 - 컴포넌트에서 처리하도록 함
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
                // 사용자 메타데이터에서 deleted_at 체크
                const userDeletedAt = user.user_metadata?.deleted_at;

                // 메타데이터에 deleted_at이 있으면 즉시 로그아웃
                if (userDeletedAt) {
                    console.log('메타데이터에서 삭제된 사용자 감지, 로그아웃 처리');
                    await supabase.auth.signOut();
                    set({ user: null });
                    return;
                }

                // 프로필 정보 확인
                const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();

                // 프로필이 존재하고 deleted_at이 설정된 경우만 로그아웃
                if (profile && profile.deleted_at) {
                    console.log('프로필에서 삭제된 사용자 감지, 로그아웃 처리');
                    await supabase.auth.signOut();
                    set({ user: null });
                    return;
                }

                // 프로필이 없는 경우 (신규 사용자 또는 프로필 생성 필요)
                let finalProfile = profile;
                if (profileError || !profile) {
                    console.log('프로필이 없어서 새로 생성 시도');
                    // 프로필 생성 시도
                    const { data: newProfile, error: createError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: user.id,
                            email: user.email,
                            name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자',
                            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
                            provider: (user.app_metadata?.provider as 'kakao' | 'google' | 'email') || 'email',
                            created_at: new Date().toISOString(),
                        })
                        .select()
                        .single();

                    if (createError) {
                        console.error('프로필 생성 실패:', createError);
                        // 프로필 생성 실패해도 기본 사용자 정보로 진행
                        finalProfile = null;
                    } else {
                        finalProfile = newProfile;
                    }
                }

                // 사용자 정보 설정
                const userWithProfile = {
                    ...user,
                    name:
                        finalProfile?.name ||
                        user.user_metadata?.name ||
                        user.user_metadata?.full_name ||
                        user.email?.split('@')[0] ||
                        '사용자',
                    avatar_url: finalProfile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
                    provider: ((finalProfile?.provider || user.app_metadata?.provider) as 'kakao' | 'google' | 'email') || 'email',
                };
                set({ user: userWithProfile });
            } else {
                set({ user: null });
            }
        } catch (error) {
            console.error('Auth check error:', error);
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },
}));
