'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Trophy } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden min-h-screen flex items-center" style={{
            background: 'linear-gradient(135deg, #1e0a4e 0%, #2e1065 45%, #1a0935 100%)'
        }}>
            {/* Decorative orbs */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.07]"
                    style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
                    style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
                    style={{ background: 'radial-gradient(circle, #fbbf24, transparent 60%)' }} />
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-24 pb-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
                                style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)' }}>
                                <Star className="w-3 h-3 text-gold-400 fill-current" />
                                <span className="text-gold-300 text-xs font-semibold tracking-widest uppercase">
                                    Evangelist · Teacher · Author
                                </span>
                            </div>

                            <h1 className="font-serif font-bold leading-[1.05] mb-6">
                                <span className="block text-white text-5xl sm:text-6xl lg:text-7xl">Raising a</span>
                                <span className="block text-6xl sm:text-7xl lg:text-8xl" style={{
                                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fcd34d 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                    Godly
                                </span>
                                <span className="block text-white text-5xl sm:text-6xl lg:text-7xl">Generation</span>
                            </h1>

                            <p className="text-lg text-white/60 font-sans font-light leading-relaxed max-w-xl mb-10">
                                Hi, I'm <strong className="text-white font-medium">Taiwo Funmilayo Lawal</strong> — a children's evangelist, teacher, and author devoted to developing faith, character, and academic excellence in young minds.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/store"
                                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}
                                >
                                    Explore Books
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/quiz"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white/90 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
                                >
                                    Join Competition
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        {/* Profile card */}
                        <div className="relative mx-auto max-w-sm">
                            {/* Glow behind card */}
                            <div className="absolute inset-0 rounded-3xl blur-2xl opacity-30 scale-95"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #8b5cf6)' }} />

                            <div className="relative rounded-3xl overflow-hidden border border-white/10"
                                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
                                {/* Profile image */}
                                <div className="h-80 relative overflow-hidden">
                                    <Image
                                        src="/taiwo.jpg"
                                        alt="Mrs. Taiwo Funmilayo Lawal"
                                        fill
                                        className="object-cover object-top"
                                        priority
                                    />
                                    {/* Gold gradient overlay at bottom */}
                                    <div className="absolute inset-x-0 bottom-0 h-20 flex items-end px-4 pb-3"
                                        style={{ background: 'linear-gradient(to top, rgba(30,10,78,0.85), transparent)' }}>
                                        <div>
                                            <p className="text-white font-serif font-semibold text-base leading-tight">Mrs. Taiwo Funmilayo Lawal</p>
                                            <p className="text-gold-400 text-xs font-sans">Evangelist · Teacher · Author</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 divide-x divide-white/10 px-2 py-4"
                                    style={{ background: 'rgba(0,0,0,0.3)' }}>
                                    {[
                                        { value: '5+', label: 'Books' },
                                        { value: '100+', label: 'Competitions' },
                                        { value: '500+', label: 'Children Impacted' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="text-center px-2">
                                            <div className="font-serif font-bold text-gold-400 text-xl">{stat.value}</div>
                                            <div className="text-white/50 text-xs font-sans mt-0.5">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-6 -right-4 flex items-center gap-2 px-4 py-2 rounded-full shadow-xl"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 32px rgba(245,158,11,0.5)' }}
                            >
                                <Trophy className="w-4 h-4 text-white" />
                                <span className="text-white text-xs font-bold">Quiz Active!</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
