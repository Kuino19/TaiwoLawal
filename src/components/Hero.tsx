'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, BookOpen, Trophy, Heart } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative overflow-hidden min-h-screen flex items-center bg-slate-50">
            {/* Decorative orbs */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.4]"
                    style={{ background: 'radial-gradient(circle, #fde68a, transparent 70%)' }} />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.3]"
                    style={{ background: 'radial-gradient(circle, #ddd6fe, transparent 70%)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.2]"
                    style={{ background: 'radial-gradient(circle, #fef08a, transparent 60%)' }} />
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-28 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 bg-amber-50 border border-amber-200">
                                <Star className="w-3 h-3 text-amber-500 fill-current" />
                                <span className="text-amber-700 text-xs font-semibold tracking-widest uppercase">
                                    Evangelist · Teacher · Author
                                </span>
                            </div>

                            <h1 className="font-serif font-bold leading-[1.05] mb-6">
                                <span className="block text-slate-900 text-5xl sm:text-6xl lg:text-7xl">Raising a</span>
                                <span className="block text-6xl sm:text-7xl lg:text-8xl bg-gradient-to-br from-amber-500 to-amber-600 bg-clip-text text-transparent">
                                    Godly
                                </span>
                                <span className="block text-slate-900 text-5xl sm:text-6xl lg:text-7xl">Generation</span>
                            </h1>

                            <p className="text-lg text-slate-600 font-sans font-light leading-relaxed max-w-xl mb-10">
                                Hi, I'm <strong className="text-slate-900 font-medium">Taiwo Funmilayo Lawal</strong> — a children's evangelist, teacher, and author devoted to developing faith, character, and academic excellence in young minds.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/store"
                                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20"
                                >
                                    Explore Books
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/quiz"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:bg-slate-100 text-slate-700 border border-slate-200 bg-white shadow-sm"
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
                        <div className="relative mx-auto max-w-sm">
                            {/* Glow behind card */}
                            <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40 scale-95 bg-gradient-to-br from-amber-200 to-purple-200" />

                            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
                                {/* Profile image */}
                                <div className="h-80 relative overflow-hidden">
                                    <Image
                                        src="/taiwo.jpg"
                                        alt="Mrs. Taiwo Funmilayo Lawal"
                                        fill
                                        className="object-cover object-top"
                                        priority
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-20 flex items-end px-4 pb-3 bg-gradient-to-t from-black/70 to-transparent">
                                        <div>
                                            <p className="text-white font-serif font-semibold text-base leading-tight">Mrs. Taiwo Funmilayo Lawal</p>
                                            <p className="text-amber-300 text-xs font-sans">Evangelist · Teacher · Author</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 divide-x divide-slate-100 px-2 py-4 bg-slate-50">
                                    {[
                                        { value: '5+', label: 'Books' },
                                        { value: '100+', label: 'Competitions' },
                                        { value: '500+', label: 'Children' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="text-center px-2">
                                            <div className="font-serif font-bold text-amber-600 text-xl">{stat.value}</div>
                                            <div className="text-slate-500 text-xs font-sans mt-0.5">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating badge — quiz-aware, always relevant */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-6 -right-4 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-white border border-slate-100"
                            >
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <span className="text-slate-800 text-xs font-bold">Competitions Open!</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
