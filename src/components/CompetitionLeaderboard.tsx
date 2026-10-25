'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
    Trophy, Medal, Crown, Search, Clock, Users, Sparkles, 
    ArrowLeft, RotateCcw, Award, CheckCircle2, Share2, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CompetitionAttempt } from '@/app/api/competition/route';

interface Props {
    onBackToQuiz?: () => void;
    highlightAttemptId?: string;
}

export default function CompetitionLeaderboard({ onBackToQuiz, highlightAttemptId }: Props) {
    const [attempts, setAttempts] = useState<CompetitionAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrack, setSelectedTrack] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [copied, setCopied] = useState(false);

    // Fetch live leaderboard data
    const fetchAttempts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/competition');
            if (res.ok) {
                const data = await res.json();
                setAttempts(data);
            }
        } catch (e) {
            console.error('Failed to fetch leaderboard:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttempts();
    }, []);

    // Filter by track and search
    const filteredAttempts = useMemo(() => {
        return attempts.filter((att) => {
            const matchesTrack = selectedTrack === 'all' || att.subjectId === selectedTrack;
            const matchesSearch = 
                att.contestantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                att.churchDistrict.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTrack && matchesSearch;
        });
    }, [attempts, selectedTrack, searchQuery]);

    // Top 3 Winners
    const top3 = useMemo(() => {
        return filteredAttempts.slice(0, 3);
    }, [filteredAttempts]);

    // Format seconds into "1m 18s"
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        if (m === 0) return `${s}s`;
        return `${m}m ${s.toString().padStart(2, '0')}s`;
    };

    const handleCopyWinners = () => {
        if (top3.length === 0) return;
        const text = `🏆 FOURSQUARE IDIMU CHILDREN QUIZ WINNERS 🏆\n` +
            top3.map((a, i) => `${i === 0 ? '🥇 1ST (CHAMPION)' : i === 1 ? '🥈 2ND PLACE' : '🥉 3RD PLACE'}: ${a.contestantName} (${a.churchDistrict}) - ${a.score}/${a.total} (${a.percentage}%) in ${formatTime(a.timeSpentSeconds)}`).join('\n') +
            `\n\nOfficial Leaderboard: Foursquare Gospel Church in Nigeria`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            {/* Header with Foursquare Logo & Branding */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl mb-8 relative overflow-hidden">
                {/* Decorative background aura */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-purple-200/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-md bg-white flex-shrink-0">
                            <Image
                                src="/foursquare-logo.png"
                                alt="Foursquare Gospel Church Logo"
                                fill
                                sizes="(max-width: 768px) 80px, 96px"
                                className="object-contain p-1"
                                priority
                            />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Official Championship Leaderboard
                            </div>
                            <h1 className="font-serif font-bold text-2xl sm:text-4xl text-slate-900 leading-tight">
                                Hall of Champions
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                                Foursquare Gospel Church in Nigeria • Idimu Missionary District Children Ministry
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap justify-center">
                        {onBackToQuiz && (
                            <button
                                type="button"
                                onClick={onBackToQuiz}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Quiz
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleCopyWinners}
                            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                            <Share2 className="w-4 h-4" /> {copied ? 'Copied Summary!' : 'Share Winners'}
                        </button>
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                            <Printer className="w-4 h-4" /> Print Results
                        </button>
                    </div>
                </div>

                {/* Foursquare 4-Fold Gospel Meaning Bar */}
                <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="bg-red-50 text-red-900 rounded-xl p-2 border border-red-200 font-semibold flex items-center justify-center gap-1">
                        <span>✝️</span> <span>Jesus the Saviour</span>
                    </div>
                    <div className="bg-indigo-50 text-indigo-900 rounded-xl p-2 border border-indigo-200 font-semibold flex items-center justify-center gap-1">
                        <span>🏆</span> <span>Jesus the Great Physician</span>
                    </div>
                    <div className="bg-amber-50 text-amber-900 rounded-xl p-2 border border-amber-200 font-semibold flex items-center justify-center gap-1">
                        <span>🕊️</span> <span>Jesus the Spirit Baptizer</span>
                    </div>
                    <div className="bg-fuchsia-50 text-fuchsia-900 rounded-xl p-2 border border-fuchsia-200 font-semibold flex items-center justify-center gap-1">
                        <span>👑</span> <span>Jesus the Soon-Coming King</span>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               PODIUM: TOP 3 CHAMPIONS
            ══════════════════════════════════════════════════════ */}
            {top3.length > 0 && (
                <div className="mb-10">
                    <div className="text-center mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Current Podium Standings
                        </span>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800">
                            Top Performing Contestants
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto">
                        {/* 🥈 2nd Place (Silver) */}
                        {top3[1] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="order-2 md:order-1 bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl border-2 border-slate-300 p-5 text-center shadow-md relative"
                            >
                                <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 border-2 border-slate-400 flex items-center justify-center font-serif font-black text-slate-700 text-lg mb-2 shadow-inner">
                                    2
                                </div>
                                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 mb-1">
                                    🥈 2nd Place Runner-Up
                                </span>
                                <h3 className="font-serif font-bold text-slate-900 text-lg leading-tight truncate">
                                    {top3[1].contestantName}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium truncate mb-3">
                                    {top3[1].churchDistrict}
                                </p>
                                <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-xs">
                                    <div className="font-black text-slate-900 text-sm">{top3[1].score}/{top3[1].total} ({top3[1].percentage}%)</div>
                                    <div className="text-slate-500 text-[11px] font-mono flex items-center justify-center gap-1 mt-0.5">
                                        <Clock className="w-3 h-3 text-slate-400" /> Time: {formatTime(top3[1].timeSpentSeconds)}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 🥇 1st Place (Gold Champion) */}
                        {top3[0] && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="order-1 md:order-2 bg-gradient-to-b from-amber-50 via-amber-100/60 to-amber-200/40 rounded-3xl border-3 border-amber-400 p-6 text-center shadow-xl relative md:-translate-y-4 ring-4 ring-amber-300/40"
                            >
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                                    <Crown className="w-4 h-4 fill-slate-950" /> OVERALL CHAMPION
                                </div>

                                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white flex items-center justify-center font-serif font-black text-slate-950 text-2xl mb-2 shadow-lg mt-2">
                                    1
                                </div>

                                <h3 className="font-serif font-bold text-slate-950 text-xl leading-tight truncate">
                                    {top3[0].contestantName}
                                </h3>
                                <p className="text-xs text-amber-900 font-semibold truncate mb-3">
                                    {top3[0].churchDistrict}
                                </p>

                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-amber-300 text-xs shadow-xs">
                                    <div className="font-black text-amber-950 text-base">
                                        {top3[0].score}/{top3[0].total} ({top3[0].percentage}%)
                                    </div>
                                    <div className="text-amber-800 text-xs font-mono font-bold flex items-center justify-center gap-1 mt-1">
                                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Time: {formatTime(top3[0].timeSpentSeconds)}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 🥉 3rd Place (Bronze) */}
                        {top3[2] && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="order-3 bg-gradient-to-b from-amber-50/50 to-orange-50/50 rounded-3xl border-2 border-amber-300/80 p-5 text-center shadow-md relative"
                            >
                                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center font-serif font-black text-amber-900 text-lg mb-2 shadow-inner">
                                    3
                                </div>
                                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 mb-1">
                                    🥉 3rd Place
                                </span>
                                <h3 className="font-serif font-bold text-slate-900 text-lg leading-tight truncate">
                                    {top3[2].contestantName}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium truncate mb-3">
                                    {top3[2].churchDistrict}
                                </p>
                                <div className="bg-white rounded-xl p-2.5 border border-amber-200 text-xs">
                                    <div className="font-black text-slate-900 text-sm">{top3[2].score}/{top3[2].total} ({top3[2].percentage}%)</div>
                                    <div className="text-slate-500 text-[11px] font-mono flex items-center justify-center gap-1 mt-0.5">
                                        <Clock className="w-3 h-3 text-slate-400" /> Time: {formatTime(top3[2].timeSpentSeconds)}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               SEARCH & TRACK FILTERS
            ══════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Track Selector Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                        { id: 'all', label: 'All Contests' },
                        { id: 'current_affairs', label: 'Current Affairs' },
                        { id: 'numbers', label: 'Book of Numbers' },
                        { id: 'standard', label: 'Catechism' },
                        { id: 'combined', label: 'Combined Mock' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedTrack(tab.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                selectedTrack === tab.id
                                    ? 'bg-slate-900 text-white shadow-xs'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search contestant or district..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               RANKINGS TABLE
            ══════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-serif font-bold text-lg text-slate-900">
                            Ranked Contestants ({filteredAttempts.length})
                        </h3>
                        <p className="text-xs text-slate-400">
                            Sorted primarily by Score, then by Completion Speed (Time)
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchAttempts}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm font-medium">
                        Loading live leaderboard...
                    </div>
                ) : filteredAttempts.length === 0 ? (
                    <div className="p-12 text-center">
                        <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-700 text-base mb-1">No Contestants Found</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Be the first contestant to enter your name and take the quiz competition!
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                    <th className="py-3.5 px-4 sm:px-6 w-16">Rank</th>
                                    <th className="py-3.5 px-4">Contestant & Church</th>
                                    <th className="py-3.5 px-4 hidden sm:table-cell">Contest Track</th>
                                    <th className="py-3.5 px-4">Score</th>
                                    <th className="py-3.5 px-4">Speed</th>
                                    <th className="py-3.5 px-4 hidden md:table-cell text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                                {filteredAttempts.map((attempt, index) => {
                                    const rank = index + 1;
                                    const isHighlighted = attempt.id === highlightAttemptId;

                                    return (
                                        <tr
                                            key={attempt.id}
                                            className={`transition-colors ${
                                                isHighlighted
                                                    ? 'bg-amber-100/60 font-semibold'
                                                    : rank === 1
                                                    ? 'bg-amber-50/40 hover:bg-amber-50/70'
                                                    : 'hover:bg-slate-50/80'
                                            }`}
                                        >
                                            {/* Rank */}
                                            <td className="py-4 px-4 sm:px-6 font-mono font-bold">
                                                {rank === 1 ? (
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                                                        🥇 1
                                                    </span>
                                                ) : rank === 2 ? (
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs">
                                                        🥈 2
                                                    </span>
                                                ) : rank === 3 ? (
                                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-200 text-amber-900 font-black text-xs">
                                                        🥉 3
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 pl-2">#{rank}</span>
                                                )}
                                            </td>

                                            {/* Contestant Name & Church */}
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                    <span>{attempt.contestantName}</span>
                                                    {isHighlighted && (
                                                        <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                                                            You
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] text-slate-500 font-medium">
                                                    {attempt.churchDistrict}
                                                </div>
                                            </td>

                                            {/* Subject */}
                                            <td className="py-4 px-4 hidden sm:table-cell">
                                                <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                                                    {attempt.subjectTitle}
                                                </span>
                                            </td>

                                            {/* Score */}
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-slate-900">
                                                    {attempt.score}/{attempt.total}
                                                </div>
                                                <div className="text-[11px] font-bold text-emerald-600">
                                                    {attempt.percentage}%
                                                </div>
                                            </td>

                                            {/* Speed */}
                                            <td className="py-4 px-4 font-mono font-bold text-slate-700 text-xs">
                                                {formatTime(attempt.timeSpentSeconds)}
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-4 hidden md:table-cell text-right text-xs text-slate-400 font-mono">
                                                {new Date(attempt.date).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
