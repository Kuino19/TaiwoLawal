'use client';

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            // Full reload so Appwrite session cookie is fresh for the admin layout
            window.location.href = '/admin';
        } catch (err: any) {
            console.error('LOGIN ERROR:', err);
            const code = err?.code ? ` [Code: ${err.code}]` : '';
            const type = err?.type ? ` (${err.type})` : '';
            setError((err?.message || 'Login failed') + code + type);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1e0a4e 0%, #2e1065 100%)' }}>
            {/* Left decorative panel — hidden on mobile */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16">
                {/* Background glow */}
                <div className="absolute inset-0">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
                        style={{ background: '#f59e0b' }} />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15"
                        style={{ background: '#8b5cf6' }} />
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                <div className="relative z-10 text-center">
                    {/* Logo */}
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center font-serif font-bold text-3xl"
                        style={{ background: 'rgba(251,191,36,0.15)', border: '2px solid rgba(251,191,36,0.35)', color: '#fbbf24' }}>
                        TL
                    </div>
                    <h1 className="font-serif font-bold text-5xl text-white mb-4 leading-tight">
                        Taiwo Lawal<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>Admin Panel</span>
                    </h1>
                    <p className="text-white/40 font-sans text-base max-w-xs mx-auto leading-relaxed">
                        Manage books, quizzes, and competitions from one place.
                    </p>

                    {/* Feature pills */}
                    <div className="mt-10 flex flex-col gap-3 items-center">
                        {['Manage Books & Store', 'Create Quiz Competitions', 'View Leaderboard'].map((f) => (
                            <div key={f} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
                                <span className="text-white/60 text-sm font-sans">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <div className="rounded-3xl overflow-hidden border border-white/10"
                        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)' }}>
                        <div className="h-1.5"
                            style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)' }} />

                        <div className="p-10">
                            {/* Mobile logo */}
                            <div className="flex items-center gap-3 mb-10 lg:hidden">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-base"
                                    style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                                    TL
                                </div>
                                <span className="font-serif font-bold text-white text-xl">Taiwo Lawal</span>
                            </div>

                            <div className="mb-8">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                    style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
                                    <Lock className="w-6 h-6 text-gold-400" />
                                </div>
                                <h2 className="font-serif font-bold text-3xl text-white mb-2">Welcome back</h2>
                                <p className="text-white/40 font-sans text-sm">Sign in to access the admin dashboard</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="email"
                                            required
                                            autoComplete="email"
                                            placeholder="admin@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/8 border text-white placeholder-white/20 font-sans text-sm focus:outline-none transition-all"
                                            style={{
                                                background: 'rgba(255,255,255,0.07)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white placeholder-white/20 font-sans text-sm focus:outline-none transition-all"
                                            style={{
                                                background: 'rgba(255,255,255,0.07)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
                                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-sans"
                                        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
                                    >
                                        <span className="text-rose-400 font-bold">!</span>
                                        {error}
                                    </motion.div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            Signing in…
                                        </span>
                                    ) : 'Sign In to Dashboard'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <p className="text-center text-white/20 text-xs font-sans mt-6">
                        Secured by Appwrite Authentication
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
