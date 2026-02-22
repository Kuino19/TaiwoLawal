'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/store/useAuth';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, sessionVerified, checkSession, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const hasChecked = useRef(false);

    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) return;
        // Only call checkSession if there is no user in the store.
        // If user is already set (from localStorage after login), we trust it —
        // no need to hit Appwrite on every navigation.  This prevents the race
        // condition where account.get() briefly returns 401 right after login.
        if (!user && !hasChecked.current) {
            hasChecked.current = true;
            checkSession();
        }
    }, [pathname, user]);  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Redirect to login only after we've confirmed (via checkSession) there's no session.
        if (!isLoginPage && sessionVerified && !loading && !user) {
            router.replace('/admin/login');
        }
    }, [sessionVerified, loading, user, isLoginPage, router]);

    // Login page — return children unwrapped
    if (isLoginPage) return <>{children}</>;

    // No user yet and session check is still in flight → show spinner
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1e0a4e, #2e1065)' }}>
                <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'rgba(251,191,36,0.4)', borderTopColor: '#f59e0b' }} />
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        window.location.href = '/admin/login';
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#f8f7ff' }}>
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="px-6 py-4 flex justify-between items-center">
                        <div />
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 font-sans">{user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors font-sans"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
