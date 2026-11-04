'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Award, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { ALL_ACHIEVEMENTS, PlayerProfile } from '@/lib/gameProfile';
import { gameSound, triggerHaptic } from '@/lib/gameSound';

interface AchievementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: PlayerProfile;
}

export default function AchievementsModal({ isOpen, onClose, profile }: AchievementsModalProps) {
    if (!isOpen) return null;

    const unlockedSet = new Set(profile.unlockedAchievements || []);
    const unlockedCount = unlockedSet.size;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 16 }}
                    className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-white"
                >
                    {/* Header */}
                    <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-slate-900 to-purple-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-white">Trophy Cabinet</h3>
                                <p className="text-xs text-slate-400">
                                    Unlocked <span className="text-amber-400 font-bold">{unlockedCount}</span> of {ALL_ACHIEVEMENTS.length} Badges
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                gameSound.playTap();
                                onClose();
                            }}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Treasury overview bar */}
                    <div className="px-5 py-3 bg-slate-800/60 border-b border-slate-800 flex items-center justify-around text-xs">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                            <span className="text-base">🪙</span>
                            <span>{profile.talents} Talents</span>
                        </div>
                        <div className="h-4 w-px bg-slate-700" />
                        <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                            <span className="text-base">🔥</span>
                            <span>{profile.streak} Day Streak</span>
                        </div>
                        <div className="h-4 w-px bg-slate-700" />
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <span className="text-base">🎯</span>
                            <span>{profile.totalWins || 0} Victories</span>
                        </div>
                    </div>

                    {/* Achievements List */}
                    <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-800/60">
                        {ALL_ACHIEVEMENTS.map((ach) => {
                            const isUnlocked = unlockedSet.has(ach.id);
                            return (
                                <div
                                    key={ach.id}
                                    className={`pt-3 first:pt-0 flex items-start gap-3.5 transition-all ${
                                        isUnlocked ? 'opacity-100' : 'opacity-55'
                                    }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border transition-transform ${
                                            isUnlocked
                                                ? 'bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                                                : 'bg-slate-800/80 border-slate-700 text-slate-500 grayscale'
                                        }`}
                                    >
                                        {ach.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm text-white">{ach.title}</h4>
                                            {isUnlocked ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> Unlocked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                                    <Lock className="w-2.5 h-2.5" /> Locked
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                                            {ach.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Tip */}
                    <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Each unlocked badge awards <strong>+25 bonus Talents</strong> to your treasury!</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
