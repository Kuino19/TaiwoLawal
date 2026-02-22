import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { account } from '@/lib/appwrite';
import { Models } from 'appwrite';

interface AuthState {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    sessionVerified: boolean;
    checkSession: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            loading: false,
            sessionVerified: false,

            checkSession: async () => {
                set({ loading: true });
                try {
                    const user = await account.get();
                    set({ user, loading: false, sessionVerified: true });
                } catch (err: any) {
                    // Only clear the user on a definitive "not authenticated" response.
                    // Codes 401 / 'general_unauthorized_scope' / 'user_not_found' mean the session
                    // is genuinely gone.  Network errors or other transient failures should NOT
                    // log the user out — they could just be a slow connection.
                    const code = err?.code ?? err?.status ?? 0;
                    const type: string = err?.type ?? '';
                    const isAuthError =
                        code === 401 ||
                        type.includes('unauthorized') ||
                        type.includes('user_not_found') ||
                        type.includes('session_not_found');

                    if (isAuthError) {
                        set({ user: null, loading: false, sessionVerified: true });
                    } else {
                        // Transient error — keep existing user, mark verified so layout can proceed
                        set({ loading: false, sessionVerified: true });
                    }
                }
            },

            login: async (email: string, password: string) => {
                set({ loading: true });
                try {
                    // Clear any existing session first — prevents "session already exists" 401
                    try { await account.deleteSession('current'); } catch { /* no session active */ }
                    await account.createEmailPasswordSession(email, password);
                    const user = await account.get();
                    set({ user, loading: false, sessionVerified: true });
                } catch (error) {
                    set({ loading: false });
                    throw error;
                }
            },

            logout: async () => {
                set({ loading: true });
                try { await account.deleteSession('current'); } catch { /* ignore */ }
                set({ user: null, loading: false, sessionVerified: false });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            // Persist the user object so it survives page refreshes.
            // sessionVerified is intentionally NOT persisted — it resets each page load.
            partialize: (state) => ({ user: state.user }),
        }
    )
);
