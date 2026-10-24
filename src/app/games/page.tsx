'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Gamepad2, Sparkles, Trophy, Zap, Clock, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

type Game = {
    title: string;
    category: 'puzzle' | 'speed' | 'memory' | 'scripture';
    categoryLabel: string;
    description: string;
    href: string;
    emoji: string;
    badge?: string;
    badgeColor?: string;
    status: 'live' | 'coming_soon';
};

const GAMES: Game[] = [
    {
        title: 'Bible Crossword',
        category: 'puzzle',
        categoryLabel: 'Puzzle & Word',
        description: 'Solve crossword puzzles based on Holy Scripture across 50 progressive levels.',
        href: '/games/crossword',
        emoji: '✝️',
        badge: '50 Levels',
        badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
        status: 'live',
    },
    {
        title: 'Verse Scramble',
        category: 'scripture',
        categoryLabel: 'Scripture Memory',
        description: 'Tap and rearrange scrambled words to piece together 25 inspiring Bible verses.',
        href: '/games/scramble',
        emoji: '🔤',
        badge: '25 Verses',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        status: 'live',
    },
    {
        title: 'Bible Trivia Rush',
        category: 'speed',
        categoryLabel: 'Speed & Trivia',
        description: 'Answer as many Bible & Church history questions as you can before the 60-second timer expires!',
        href: '/games/rush',
        emoji: '⏱️',
        badge: '60s Blitz',
        badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        status: 'live',
    },
    {
        title: 'Bible Memory Match',
        category: 'memory',
        categoryLabel: 'Memory & Focus',
        description: 'Flip cards to connect each Bible hero with their biblical deed in Easy, Medium, or Hard grids.',
        href: '/games/memory',
        emoji: '🃏',
        badge: 'New!',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        status: 'live',
    },
    {
        title: 'Who Am I? (Mystery)',
        category: 'memory',
        categoryLabel: 'Detective Mystery',
        description: 'Read progressive clues about Bible and Foursquare heroes to guess their secret identity!',
        href: '/games/who-am-i',
        emoji: '🕵️',
        badge: 'New!',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        status: 'live',
    },
    {
        title: 'Fill-in-the-Blank',
        category: 'scripture',
        categoryLabel: 'Scripture Mastery',
        description: 'Fill in the missing words from famous Bible scriptures and Foursquare catechism truths.',
        href: '/games/fill-blank',
        emoji: '✏️',
        badge: 'New!',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        status: 'live',
    },
    {
        title: 'Bible True or False Blitz',
        category: 'speed',
        categoryLabel: 'Discernment & Speed',
        description: 'Rapid-fire statements about biblical events and church history. Is it fact or fiction?',
        href: '/games/true-false',
        emoji: '⚡',
        badge: 'New!',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        status: 'live',
    },
];

export default function GamesHub() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredGames = selectedCategory === 'all'
        ? GAMES
        : GAMES.filter(g => g.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/40 font-sans pb-20">
            {/* Hero */}
            <div className="relative overflow-hidden pt-24 pb-8 sm:pb-12">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-purple-200/25 blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm mb-6">
                        <ArrowLeft className="w-4 h-4" /> Back Home
                    </Link>

                    <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <Gamepad2 className="w-10 h-10 text-white" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Faith & Fun Arcade
                    </div>

                    <h1 className="font-serif font-bold text-4xl sm:text-6xl text-slate-900 mb-3 tracking-tight">
                        Bible Games Hub
                    </h1>
                    <p className="text-slate-500 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-6">
                        Learn God&apos;s Word, exercise your brain, and have wholesome Christian fun! Choose any of our 7 interactive games.
                    </p>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                        {[
                            { id: 'all', label: 'All Games (7)' },
                            { id: 'speed', label: '⚡ Speed & Blitz' },
                            { id: 'scripture', label: '📖 Scripture Word' },
                            { id: 'memory', label: '🧠 Memory & Detective' },
                            { id: 'puzzle', label: '🧩 Crosswords' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setSelectedCategory(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedCategory === tab.id
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Game Cards Grid */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGames.map((game, idx) => (
                        <motion.div
                            key={game.title}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                        >
                            <Link
                                href={game.href}
                                className="block w-full text-left rounded-3xl p-5 sm:p-6 border border-slate-200 bg-white hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 group relative overflow-hidden"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-108 transition-transform shadow-xs">
                                        {game.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                {game.categoryLabel}
                                            </span>
                                            {game.badge && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${game.badgeColor}`}>
                                                    {game.badge}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="font-serif font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                                            {game.title}
                                        </h2>
                                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-1">
                                            {game.description}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 flex-shrink-0 transition-all mt-2" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
