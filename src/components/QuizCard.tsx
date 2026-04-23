'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, HelpCircle, Zap, Users } from 'lucide-react';

export interface Quiz {
    id: string;
    title: string;
    description: string;
    duration: number;
    questionCount: number;
    is_active?: boolean;
}

const palettes = [
    { from: '#6d28d9', to: '#a78bfa', glow: 'rgba(109,40,217,0.35)', text: '#c4b5fd' },
    { from: '#b45309', to: '#fbbf24', glow: 'rgba(251,191,36,0.3)',  text: '#fde68a' },
    { from: '#065f46', to: '#34d399', glow: 'rgba(52,211,153,0.28)', text: '#6ee7b7' },
    { from: '#9d174d', to: '#f472b6', glow: 'rgba(244,114,182,0.28)', text: '#fbcfe8' },
];

function getDifficulty(count: number): { label: string; color: string } {
    if (count <= 10) return { label: 'Beginner',     color: '#34d399' };
    if (count <= 20) return { label: 'Intermediate', color: '#fbbf24' };
    return               { label: 'Advanced',     color: '#f87171' };
}

export default function QuizCard({ quiz, index = 0 }: { quiz: Quiz; index?: number }) {
    const pal = palettes[index % palettes.length];
    const diff = getDifficulty(quiz.questionCount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: (index % 3) * 0.12, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.22 } }}
            className="group relative flex flex-col rounded-2xl overflow-hidden"
            style={{
                background: 'linear-gradient(145deg, rgba(30,10,78,0.95) 0%, rgba(46,16,101,0.9) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
            }}
        >
            {/* Hover glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${pal.glow}, transparent 65%)` }}
            />

            {/* Shimmer sweep */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
                    style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.045) 50%, transparent 60%)',
                    }}
                />
            </div>

            {/* Top gradient band */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${pal.from}, ${pal.to})` }} />

            <div className="p-6 flex flex-col flex-1 relative z-10">
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                    {/* Icon */}
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})`, boxShadow: `0 6px 20px ${pal.glow}` }}
                    >
                        <Zap className="w-5 h-5 text-white" />
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        {/* Live badge */}
                        {quiz.is_active && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live
                            </span>
                        )}
                        {/* Difficulty */}
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ background: `${diff.color}18`, color: diff.color, border: `1px solid ${diff.color}30` }}>
                            {diff.label}
                        </span>
                    </div>
                </div>

                <h3 className="font-serif font-bold text-xl text-white mb-2 group-hover:text-transparent transition-all duration-300"
                    style={{ backgroundImage: `linear-gradient(135deg, #fff 0%, ${pal.text} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'inherit' } as any}>
                    <span className="group-hover:text-transparent" style={{ backgroundImage: `linear-gradient(135deg, #fff 0%, ${pal.text} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'inherit' } as any}>
                        {quiz.title}
                    </span>
                </h3>
                <p className="text-white/50 text-sm font-sans leading-relaxed mb-6 flex-1">
                    {quiz.description}
                </p>

                {/* Meta chips */}
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs font-sans px-2.5 py-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{quiz.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-sans px-2.5 py-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)' }}>
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{quiz.questionCount} Questions</span>
                    </div>
                </div>

                {/* CTA */}
                <Link
                    href={`/quiz/${quiz.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:shadow-lg group/btn"
                    style={{
                        background: `linear-gradient(135deg, ${pal.from}, ${pal.to})`,
                        boxShadow: `0 0 0 0 ${pal.glow}`,
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px ${pal.glow}`;
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent';
                    }}
                >
                    Start Quiz
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}
