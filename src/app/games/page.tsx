'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Gamepad2, Sparkles, Trophy, Zap, Clock, Brain, Flame, Volume2, VolumeX, Gift, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameSound, triggerHaptic } from '@/lib/gameSound';
import { getPlayerProfile, PlayerProfile, checkAndUpdateStreak, claimDailyManna } from '@/lib/gameProfile';
import AchievementsModal from '@/components/games/AchievementsModal';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';

type Game = {
    title: string;
    category: 'puzzle' | 'speed' | 'memory' | 'scripture';
    categoryLabel: string;
    description: string;
    href: string;
    emoji: string;
    badge: string;
    badgeColor: string;
    highlight: string;
    status: 'live' | 'coming_soon';
};

const GAMES: Game[] = [
    {
        title: 'Bible Crossword',
        category: 'puzzle',
        categoryLabel: 'Puzzle & Word',
        description: 'Solve crossword puzzles based on Holy Scripture across 50 progressive, paginated levels with lifelines.',
        href: '/games/crossword',
        emoji: '✝️',
        badge: '50 Levels',
        badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
        highlight: 'Hints & 50 Levels',
        status: 'live',
    },
    {
        title: 'Verse Scramble',
        category: 'scripture',
        categoryLabel: 'Scripture Memory',
        description: 'Tap and rearrange scrambled words to piece together 60 inspiring King James Version (KJV) verses with speed combo multipliers!',
        href: '/games/scramble',
        emoji: '🔤',
        badge: '60 KJV Verses',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        highlight: '6 Curated Scripture Packs',
        status: 'live',
    },
    {
        title: 'Bible Trivia Rush',
        category: 'speed',
        categoryLabel: 'Speed & Trivia',
        description: 'Answer 120+ deep general Bible trivia questions (KJV) across Genesis through Revelation before time or lives expire!',
        href: '/games/rush',
        emoji: '⏱️',
        badge: '120+ Questions',
        badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        highlight: 'Classic, Marathon & Survival',
        status: 'live',
    },
    {
        title: 'Bible Memory Match',
        category: 'memory',
        categoryLabel: 'Memory & Focus',
        description: 'Connect 48 Bible heroes, covenants, and apostles. Play solo across 5 grid tiers or challenge a friend in 2-Player Pass & Play!',
        href: '/games/memory',
        emoji: '🃏',
        badge: '48 Pairs (5 Tiers)',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        highlight: 'Solo & 2-Player Pass-and-Play',
        status: 'live',
    },
    {
        title: 'Who Am I? (Mystery)',
        category: 'memory',
        categoryLabel: 'Detective Mystery',
        description: 'Inspect progressive clues to reveal 45 secret biblical figures with unblurring silhouettes and risk-reward points!',
        href: '/games/who-am-i',
        emoji: '🕵️',
        badge: '45 Mysteries',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        highlight: 'Unblurring Silhouette & Clues',
        status: 'live',
    },
    {
        title: 'Fill-in-the-Blank',
        category: 'scripture',
        categoryLabel: 'Scripture Mastery',
        description: 'Fill in missing words from 60 classic King James Version (KJV) scriptures with hints and immediate biblical context.',
        href: '/games/fill-blank',
        emoji: '✏️',
        badge: '60 KJV Verses',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        highlight: 'Hints & Scripture Context',
        status: 'live',
    },
    {
        title: 'Bible True or False Blitz',
        category: 'speed',
        categoryLabel: 'Discernment & Speed',
        description: 'Rapid-fire test of 70+ biblical statements and discernment with instant King James scripture explanations.',
        href: '/games/true-false',
        emoji: '⚡',
        badge: '70+ Facts (KJV)',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        highlight: 'Instant Explanations',
        status: 'live',
    },
];

export default function GamesHub() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [profile, setProfile] = useState<PlayerProfile>(() => getPlayerProfile());
    const [muted, setMuted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [canClaimManna, setCanClaimManna] = useState(false);
    const [mannaClaimedNotice, setMannaClaimedNotice] = useState<string | null>(null);

    useEffect(() => {
        setMuted(gameSound.isMuted());
        const streakInfo = checkAndUpdateStreak();
        setCanClaimManna(streakInfo.canClaimManna);
        setProfile(getPlayerProfile());

        const handleProfileUpdate = (e: Event) => {
            const customEvent = e as CustomEvent<PlayerProfile>;
            if (customEvent.detail) {
                setProfile(customEvent.detail);
            } else {
                setProfile(getPlayerProfile());
            }
        };

        window.addEventListener('bible_games_profile_updated', handleProfileUpdate);
        return () => {
            window.removeEventListener('bible_games_profile_updated', handleProfileUpdate);
        };
    }, []);

    const handleToggleMute = () => {
        const next = gameSound.toggleMute();
        setMuted(next);
        triggerHaptic('tap');
    };

    const handleClaimDailyManna = () => {
        gameSound.playSuccess();
        triggerHaptic('success');
        const res = claimDailyManna();
        if (res.success) {
            triggerRealisticConfetti();
            setCanClaimManna(false);
            setMannaClaimedNotice(`+${res.bonus} Talents Claimed!`);
            setProfile(getPlayerProfile());
            setTimeout(() => setMannaClaimedNotice(null), 4000);
        }
    };

    const filteredGames = selectedCategory === 'all'
        ? GAMES
        : GAMES.filter(g => g.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/40 font-sans pb-20">
            {/* Top Player Status Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link
                        href="/"
                        onClick={() => {
                            gameSound.playTap();
                            triggerHaptic('tap');
                        }}
                        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Home
                    </Link>

                    {/* Stats & Tools */}
                    <div className="flex items-center gap-2">
                        {/* Talents pill */}
                        <div
                            title="Your Talents (Faith Coins)"
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 border border-amber-300 text-amber-900 shadow-xs"
                        >
                            <span className="text-base">🪙</span>
                            <span>{profile.talents}</span>
                        </div>

                        {/* Streak */}
                        <div
                            title={`Daily Streak: ${profile.streak} days`}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 border border-orange-200 text-orange-800"
                        >
                            <span className="text-sm">🔥</span>
                            <span>{profile.streak}d</span>
                        </div>

                        {/* Trophy Cabinet */}
                        <button
                            type="button"
                            onClick={() => {
                                gameSound.playTap();
                                triggerHaptic('tap');
                                setShowModal(true);
                            }}
                            title="Trophy Cabinet & Badges"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 border border-slate-200 transition-colors cursor-pointer"
                        >
                            <Trophy className="w-3.5 h-3.5 text-amber-600" />
                            <span className="hidden sm:inline">Badges</span>
                            <span className="bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
                                {profile.unlockedAchievements?.length || 0}
                            </span>
                        </button>

                        {/* Sound Toggle */}
                        <button
                            type="button"
                            onClick={handleToggleMute}
                            title={muted ? 'Unmute Sound' : 'Mute Sound'}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        >
                            {muted ? (
                                <VolumeX className="w-4 h-4 text-rose-500" />
                            ) : (
                                <Volume2 className="w-4 h-4 text-emerald-600" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="relative overflow-hidden pt-8 pb-6 sm:pb-8">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-purple-200/25 blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                        <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Enhanced Faith Arcade
                    </div>

                    <h1 className="font-serif font-bold text-3xl sm:text-5xl text-slate-900 mb-2 tracking-tight">
                        Bible Games Hub
                    </h1>
                    <p className="text-slate-500 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed mb-5">
                        Expand your scriptural knowledge and memory across 7 massive games packed with sound effects, lifelines, and multiplayer fun!
                    </p>

                    {/* Daily Manna Gift Banner */}
                    <div className="max-w-md mx-auto mb-6">
                        {canClaimManna ? (
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3.5 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-between gap-3 text-left"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                                        🎁
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs">Daily Manna Available!</div>
                                        <div className="text-[11px] text-amber-100">Claim today&apos;s free Talents (+25)</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClaimDailyManna}
                                    className="px-3.5 py-1.5 rounded-xl bg-white text-amber-900 font-bold text-xs shadow-sm hover:bg-amber-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                                >
                                    Claim Gift
                                </button>
                            </motion.div>
                        ) : (
                            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-2.5 px-4 flex items-center justify-between text-xs text-amber-800">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>
                                        {mannaClaimedNotice || (
                                            <>Daily Manna claimed! Current streak: <strong>{profile.streak} days 🔥</strong></>
                                        )}
                                    </span>
                                </div>
                                <span className="text-[11px] font-bold text-amber-600">Come back tomorrow</span>
                            </div>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                        {[
                            { id: 'all', label: 'All Games (7)' },
                            { id: 'speed', label: '⚡ Speed & Blitz' },
                            { id: 'scripture', label: '📖 Scripture Word' },
                            { id: 'memory', label: '🧠 Memory & Detective' },
                            { id: 'puzzle', label: '🧩 Crosswords (50 Levels)' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    gameSound.playTap();
                                    triggerHaptic('tap');
                                    setSelectedCategory(tab.id);
                                }}
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
                                onClick={() => {
                                    gameSound.playTap();
                                    triggerHaptic('tap');
                                }}
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
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${game.badgeColor}`}>
                                                {game.badge}
                                            </span>
                                        </div>
                                        <h2 className="font-serif font-bold text-slate-900 text-lg group-hover:text-amber-600 transition-colors">
                                            {game.title}
                                        </h2>
                                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-1">
                                            {game.description}
                                        </p>
                                        <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50/80 px-2.5 py-0.5 rounded-md">
                                            <span>✨ {game.highlight}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 flex-shrink-0 transition-all mt-2" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Achievements Modal */}
            <AchievementsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                profile={profile}
            />
        </div>
    );
}
