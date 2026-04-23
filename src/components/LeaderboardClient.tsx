'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Search, Users, Star, Crown } from 'lucide-react';
import Link from 'next/link';

interface Attempt {
    $id: string;
    participant_name: string;
    quiz_title: string;
    quiz_id: string;
    score: number;
    total: number;
    percentage: number;
    $createdAt: string;
}

interface Quiz {
    id: string;
    title: string;
}

interface Props {
    attempts: Attempt[];
    quizzes: Quiz[];
    defaultQuizId?: string;
}

const PODIUM_STYLES = [
    // Silver (2nd)
    { height: 'h-28', label: 'Silver', gradient: 'linear-gradient(160deg, #64748b, #94a3b8)', border: 'rgba(148,163,184,0.4)', glow: 'rgba(148,163,184,0.25)', rank: 2 },
    // Gold (1st)
    { height: 'h-40', label: 'Gold',   gradient: 'linear-gradient(160deg, #b45309, #fbbf24)', border: 'rgba(251,191,36,0.55)', glow: 'rgba(251,191,36,0.35)',  rank: 1 },
    // Bronze (3rd)
    { height: 'h-20', label: 'Bronze', gradient: 'linear-gradient(160deg, #78350f, #b45309)', border: 'rgba(180,83,9,0.4)',   glow: 'rgba(180,83,9,0.2)',    rank: 3 },
];

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return (
        <span className="inline-flex items-center gap-1 text-gold-400">
            <Crown className="w-4 h-4" />
        </span>
    );
    if (rank === 2) return <Medal className="w-4 h-4" style={{ color: '#94a3b8' }} />;
    if (rank === 3) return <Medal className="w-4 h-4" style={{ color: '#b45309' }} />;
    return <span className="font-mono text-sm text-white/30">#{rank}</span>;
}

function Initials({ name, style }: { name: string; style?: React.CSSProperties }) {
    const parts = name.trim().split(' ');
    const ini = parts.length >= 2
        ? parts[0][0] + parts[parts.length - 1][0]
        : name.slice(0, 2);
    return (
        <div className="rounded-full flex items-center justify-center font-serif font-bold text-white"
            style={style}>
            {ini.toUpperCase()}
        </div>
    );
}

export default function LeaderboardClient({ attempts, quizzes, defaultQuizId }: Props) {
    const [activeQuizId, setActiveQuizId] = useState<string>(defaultQuizId || 'all');
    const [search, setSearch] = useState('');

    // Sync with URL
    useEffect(() => {
        if (defaultQuizId) setActiveQuizId(defaultQuizId);
    }, [defaultQuizId]);

    // Update URL when tab changes
    const switchTab = (id: string) => {
        setActiveQuizId(id);
        setSearch('');
        const url = id === 'all' ? '/leaderboard' : `/leaderboard?quiz=${id}`;
        window.history.replaceState(null, '', url);
    };

    // Filter by quiz, then search
    const filtered = attempts
        .filter((a) => activeQuizId === 'all' || a.quiz_id === activeQuizId)
        .filter((a) => a.participant_name.toLowerCase().includes(search.toLowerCase()));

    const top3 = filtered.slice(0, 3);

    // Reorder for podium display: [2nd, 1st, 3rd]
    const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : [];

    const activeQuiz = quizzes.find((q) => q.id === activeQuizId);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">

            {/* Quiz Tabs */}
            <div className="relative mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {/* All Time tab */}
                    <button
                        onClick={() => switchTab('all')}
                        className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                        style={
                            activeQuizId === 'all'
                                ? { background: 'linear-gradient(135deg, #6d28d9, #f59e0b)', color: 'white', boxShadow: '0 4px 16px rgba(109,40,217,0.4)' }
                                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.1)' }
                        }
                    >
                        🏆 All Time
                    </button>

                    {/* Per-quiz tabs */}
                    {quizzes.map((quiz) => {
                        const active = activeQuizId === quiz.id;
                        return (
                            <button
                                key={quiz.id}
                                onClick={() => switchTab(quiz.id)}
                                className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                                style={
                                    active
                                        ? { background: 'linear-gradient(135deg, #6d28d9, #f59e0b)', color: 'white', boxShadow: '0 4px 16px rgba(109,40,217,0.4)' }
                                        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.1)' }
                                }
                            >
                                {quiz.title}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search participant name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl font-sans text-sm focus:outline-none transition-all"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeQuizId + search}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {filtered.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}>
                                <Trophy className="w-8 h-8 text-gold-400" />
                            </div>
                            <h3 className="font-serif font-bold text-2xl text-white mb-2">No scores yet</h3>
                            <p className="text-white/40 font-sans mb-8">
                                {search ? 'No match found for your search.' : 'Be the first to complete a quiz!'}
                            </p>
                            {!search && (
                                <Link href="/quiz" className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                    Take a Quiz
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* ── Podium ── */}
                            {podiumOrder.length === 3 && !search && (
                                <div className="mb-14">
                                    <p className="section-label text-center mb-8">Top Performers</p>
                                    <div className="flex items-end justify-center gap-3">
                                        {podiumOrder.map((attempt, pi) => {
                                            const ps = PODIUM_STYLES[pi];
                                            return (
                                                <motion.div
                                                    key={attempt.$id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: pi * 0.12 }}
                                                    className="flex flex-col items-center"
                                                    style={{ minWidth: '90px', maxWidth: '120px' }}
                                                >
                                                    {/* Avatar */}
                                                    <div className="relative mb-2">
                                                        <Initials
                                                            name={attempt.participant_name}
                                                            style={{
                                                                width: ps.rank === 1 ? '56px' : '44px',
                                                                height: ps.rank === 1 ? '56px' : '44px',
                                                                background: ps.gradient,
                                                                border: `2px solid ${ps.border}`,
                                                                boxShadow: `0 0 20px ${ps.glow}`,
                                                                fontSize: ps.rank === 1 ? '18px' : '14px',
                                                            }}
                                                        />
                                                        {/* Crown for 1st */}
                                                        {ps.rank === 1 && (
                                                            <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 text-gold-400" />
                                                        )}
                                                    </div>
                                                    <p className="font-semibold text-white text-xs text-center truncate w-full px-1 mb-0.5">
                                                        {attempt.participant_name.split(' ')[0]}
                                                    </p>
                                                    <p className="text-xs font-sans mb-2"
                                                        style={{ color: ps.rank === 1 ? '#fbbf24' : 'rgba(255,255,255,0.45)' }}>
                                                        {attempt.percentage}%
                                                    </p>
                                                    {/* Bar */}
                                                    <div className={`w-full ${ps.height} rounded-t-2xl flex items-end justify-center pb-2.5`}
                                                        style={{ background: ps.gradient, boxShadow: `0 -4px 24px ${ps.glow}` }}>
                                                        <span className="font-serif font-bold text-white text-xl">{ps.rank}</span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ── Full Table ── */}
                            <div className="rounded-2xl overflow-hidden border border-white/8"
                                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)' }}>

                                {/* Table header */}
                                <div className="px-6 py-4 flex items-center justify-between border-b border-white/8">
                                    <h2 className="font-serif font-bold text-white text-lg">
                                        {activeQuizId === 'all' ? 'All Scores' : activeQuiz?.title || 'Scores'}
                                    </h2>
                                    <div className="flex items-center gap-2 text-white/35 text-sm font-sans">
                                        <Users className="w-4 h-4" />
                                        {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
                                    </div>
                                </div>

                                <div>
                                    {filtered.map((attempt, i) => {
                                        const rank = i + 1;
                                        const isTop = rank <= 3;
                                        const pct = attempt.percentage;
                                        const barColor = pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';

                                        return (
                                            <motion.div
                                                key={attempt.$id}
                                                initial={{ opacity: 0, x: -16 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                                                className="px-6 py-4 flex items-center gap-4 border-b last:border-0 transition-colors hover:bg-white/[0.03]"
                                                style={{
                                                    borderColor: 'rgba(255,255,255,0.05)',
                                                    background: isTop ? 'rgba(251,191,36,0.03)' : 'transparent',
                                                }}
                                            >
                                                {/* Rank */}
                                                <div className="w-8 flex-shrink-0 flex justify-center">
                                                    <RankBadge rank={rank} />
                                                </div>

                                                {/* Avatar */}
                                                <Initials
                                                    name={attempt.participant_name}
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        fontSize: '13px',
                                                        flexShrink: 0,
                                                        background: 'linear-gradient(135deg, #2e1065, #6d28d9)',
                                                        border: '1px solid rgba(109,40,217,0.3)',
                                                    }}
                                                />

                                                {/* Name + quiz */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-white text-sm truncate">{attempt.participant_name}</p>
                                                    {activeQuizId === 'all' && (
                                                        <p className="text-white/30 text-xs font-sans truncate">{attempt.quiz_title}</p>
                                                    )}
                                                </div>

                                                {/* Score bar + percentage */}
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    {/* Mini bar */}
                                                    <div className="hidden sm:block w-20 h-1.5 rounded-full bg-white/10">
                                                        <div className="h-full rounded-full transition-all"
                                                            style={{ width: `${pct}%`, background: barColor }} />
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="font-serif font-bold text-white text-base">
                                                            {attempt.score}/{attempt.total}
                                                        </div>
                                                        <div className="text-xs font-bold font-sans" style={{ color: barColor }}>
                                                            {pct}%
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Date */}
                                                <div className="text-white/25 text-xs font-sans hidden md:block flex-shrink-0">
                                                    {new Date(attempt.$createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
