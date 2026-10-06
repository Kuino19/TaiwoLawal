'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight, Gamepad2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

type Game = {
    title: string;
    description: string;
    href: string;
    emoji: string;
    status: 'live' | 'coming_soon';
};

const GAMES: Game[] = [
    {
        title: 'Bible Crossword',
        description: 'Solve crossword puzzles based on Scripture. Multiple levels to conquer!',
        href: '/games/crossword',
        emoji: '✝️',
        status: 'live',
    },
    {
        title: 'Verse Scramble',
        description: 'Unscramble the words to reveal famous Bible verses.',
        href: '/games/scramble',
        emoji: '🔤',
        status: 'live',
    },
    {
        title: 'Bible Trivia Rush',
        description: 'Answer as many Bible trivia questions as you can before time runs out.',
        href: '/games/rush',
        emoji: '⏱️',
        status: 'live',
    },
];

export default function GamesHub() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
            {/* Hero */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-16 left-1/3 w-80 h-80 rounded-full bg-amber-200/25 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-indigo-200/20 blur-3xl" />
                </div>

                <div className="relative max-w-2xl mx-auto px-4 pt-28 pb-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back Home
                    </Link>

                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <Gamepad2 className="w-9 h-9 text-white" />
                    </div>

                    <h1 className="font-serif font-bold text-4xl sm:text-5xl text-slate-900 mb-3 tracking-tight">
                        Games
                    </h1>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                        Have fun while growing in the Word. Pick a game and challenge yourself!
                    </p>
                </div>
            </div>

            {/* Game Cards */}
            <div className="max-w-lg mx-auto px-4 pb-24 space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Available Games</p>

                {GAMES.map((game, idx) => {
                    const isLive = game.status === 'live';

                    return (
                        <motion.div
                            key={game.title}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08, duration: 0.35 }}
                        >
                            {isLive ? (
                                <Link
                                    href={game.href}
                                    className="block w-full text-left rounded-2xl p-5 border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                                            {game.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 text-base">{game.title}</h3>
                                            <p className="text-slate-400 text-sm leading-snug mt-0.5">{game.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 flex-shrink-0 transition-colors" />
                                    </div>
                                </Link>
                            ) : (
                                <div className="w-full text-left rounded-2xl p-5 border-2 border-dashed border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0 grayscale">
                                            {game.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-600 text-base flex items-center gap-2">
                                                {game.title}
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">Coming Soon</span>
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-snug mt-0.5">{game.description}</p>
                                        </div>
                                        <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
