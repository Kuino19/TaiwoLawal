'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, VolumeX, Trophy, Sparkles } from 'lucide-react';
import { gameSound, triggerHaptic } from '@/lib/gameSound';
import { getPlayerProfile, PlayerProfile, checkAndUpdateStreak } from '@/lib/gameProfile';
import AchievementsModal from './AchievementsModal';

interface GameTopBarProps {
    title: string;
    backHref?: string;
    backLabel?: string;
    theme?: 'dark' | 'light';
    extraPill?: React.ReactNode;
}

export default function GameTopBar({
    title,
    backHref = '/games',
    backLabel = 'Games',
    theme = 'dark',
    extraPill
}: GameTopBarProps) {
    const [profile, setProfile] = useState<PlayerProfile>(() => getPlayerProfile());
    const [muted, setMuted] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Init sound mute state & daily streak
        setMuted(gameSound.isMuted());
        checkAndUpdateStreak();
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

    const isDark = theme === 'dark';

    return (
        <>
            <div className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
                isDark 
                    ? 'bg-slate-900/90 border-slate-800 text-white' 
                    : 'bg-white/90 border-slate-200 text-slate-900 shadow-xs'
            }`}>
                <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
                    {/* Back link */}
                    <Link
                        href={backHref}
                        onClick={() => {
                            gameSound.playTap();
                            triggerHaptic('tap');
                        }}
                        className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold rounded-xl px-2.5 py-1.5 transition-all ${
                            isDark
                                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden xs:inline">{backLabel}</span>
                    </Link>

                    {/* Game Title */}
                    <div className="font-serif font-black text-xs sm:text-base tracking-tight truncate max-w-[140px] sm:max-w-none text-center">
                        {title}
                    </div>

                    {/* Right Action Widgets */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {extraPill}

                        {/* Talents pill */}
                        <div
                            title="Faith Talents (Virtual Currency for Lifelines)"
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${
                                isDark
                                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                    : 'bg-amber-100 border-amber-200 text-amber-800'
                            }`}
                        >
                            <span className="text-sm">🪙</span>
                            <span>{profile.talents}</span>
                        </div>

                        {/* Streak pill */}
                        <div
                            title={`Daily Manna: ${profile.streak}-day streak!`}
                            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                isDark
                                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-300'
                                    : 'bg-orange-100 border-orange-200 text-orange-800'
                            }`}
                        >
                            <span className="text-sm">🔥</span>
                            <span>{profile.streak}d</span>
                        </div>

                        {/* Trophy / Achievements button */}
                        <button
                            type="button"
                            onClick={() => {
                                gameSound.playTap();
                                triggerHaptic('tap');
                                setShowModal(true);
                            }}
                            title="Trophy Cabinet & Badges"
                            className={`p-2 rounded-xl transition-all cursor-pointer relative ${
                                isDark
                                    ? 'text-slate-300 hover:text-amber-400 hover:bg-slate-800'
                                    : 'text-slate-600 hover:text-amber-600 hover:bg-slate-100'
                            }`}
                        >
                            <Trophy className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                            {profile.unlockedAchievements.length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
                            )}
                        </button>

                        {/* Sound Toggle */}
                        <button
                            type="button"
                            onClick={handleToggleMute}
                            title={muted ? 'Unmute Sound' : 'Mute Sound'}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                                isDark
                                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {muted ? (
                                <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-400" />
                            ) : (
                                <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AchievementsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                profile={profile}
            />
        </>
    );
}
