'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Trophy, Settings, Users } from 'lucide-react';

const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Books', href: '/admin/books', icon: BookOpen },
    { name: 'Events', href: '/admin/events', icon: Users },
    { name: 'Quizzes', href: '/admin/quizzes', icon: Trophy },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64"
                style={{ background: 'linear-gradient(180deg, #1e0a4e 0%, #160840 100%)' }}>
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-5 py-6 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                        TL
                    </div>
                    <div>
                        <p className="text-white font-serif font-bold text-sm leading-none">Taiwo Lawal</p>
                        <p className="text-white/40 text-xs font-sans mt-0.5">Admin Panel</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-sans transition-all"
                                style={{
                                    background: isActive ? 'rgba(251,191,36,0.12)' : 'transparent',
                                    color: isActive ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                                    border: isActive ? '1px solid rgba(251,191,36,0.25)' : '1px solid transparent',
                                }}
                            >
                                <item.icon className="w-4 h-4 flex-shrink-0" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom accent */}
                <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="px-3 py-2 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <p className="text-white/30 text-xs font-sans">Logged in as Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
