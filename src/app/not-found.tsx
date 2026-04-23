import Link from 'next/link';
import { Home, BookOpen, Trophy, Zap } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
            style={{ background: 'linear-gradient(160deg, #0d0520 0%, #1e0a4e 50%, #2e1065 100%)' }}>

            {/* Bg blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
                    style={{ background: 'radial-gradient(circle, #6d28d9, transparent)' }} />
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-12"
                    style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
            </div>

            <div className="relative z-10">
                {/* Giant 404 */}
                <div className="font-serif font-bold text-[10rem] sm:text-[14rem] leading-none mb-0 select-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(109,40,217,0.15))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: 'none',
                    }}>
                    404
                </div>

                <p className="section-label mb-4 -mt-4">Page Not Found</p>
                <h1 className="font-serif font-bold text-3xl md:text-4xl text-white mb-4">
                    Oops! This page doesn't exist
                </h1>
                <p className="text-white/40 font-sans text-lg max-w-md mx-auto mb-12">
                    The page you're looking for may have moved, been removed, or never existed. Let's get you back on track.
                </p>

                {/* Quick nav */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {[
                        { href: '/', label: 'Home', icon: Home },
                        { href: '/store', label: 'Store', icon: BookOpen },
                        { href: '/quiz', label: 'Competitions', icon: Zap },
                        { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
                    ].map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href}
                            className="flex flex-col items-center gap-2 py-5 px-4 rounded-2xl transition-all hover:scale-[1.03]"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <Icon className="w-5 h-5 text-gold-400" />
                            <span className="text-white/70 text-sm font-sans">{label}</span>
                        </Link>
                    ))}
                </div>

                <Link href="/" className="btn-gold">
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
}
