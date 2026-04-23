'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ConfettiBlast from '@/components/ConfettiBlast';
import ScoreRing from '@/components/ScoreRing';
import QuestionReviewModal from '../QuestionReviewModal';

interface Question {
    $id: string;
    text: string;
    options: string[];
    correct_index: number;
}

interface Props {
    name: string;
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    grade: string;
    questions: Question[];
    userAnswers: number[];
    quizId: string;
}

export default function ResultClient({
    name, score, total, percentage, passed, grade, questions, userAnswers, quizId,
}: Props) {
    const [confetti, setConfetti] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (passed) {
            const t = setTimeout(() => setConfetti(true), 400);
            return () => clearTimeout(t);
        }
    }, [passed]);

    const stats = [
        { label: 'Correct', value: score, icon: CheckCircle2, color: '#22c55e' },
        { label: 'Wrong', value: total - score, icon: XCircle, color: '#ef4444' },
        { label: 'Total', value: total, icon: Trophy, color: '#f59e0b' },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center p-4 pt-28 pb-20" style={{ background: '#0d0520' }}>
            <ConfettiBlast active={confetti} />

            {/* Glow halo */}
            <div className="fixed inset-0 pointer-events-none flex items-start justify-center pt-20">
                <div className="w-96 h-96 rounded-full blur-3xl opacity-25 transition-all duration-1000"
                    style={{ background: passed ? '#f59e0b' : '#6d28d9' }} />
            </div>

            <div className="w-full max-w-lg relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="rounded-3xl overflow-hidden border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)' }}
                >
                    {/* Top accent band */}
                    <div className="h-1.5"
                        style={{ background: passed
                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                            : 'linear-gradient(90deg, #6d28d9, #8b5cf6)' }} />

                    <div className="p-8 md:p-10 text-center">
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5, ease: 'backOut' }}
                            className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center"
                            style={{
                                background: passed ? 'rgba(251,191,36,0.12)' : 'rgba(109,40,217,0.12)',
                                border: `2px solid ${passed ? 'rgba(251,191,36,0.35)' : 'rgba(139,92,246,0.35)'}`,
                                boxShadow: `0 0 40px ${passed ? 'rgba(251,191,36,0.2)' : 'rgba(109,40,217,0.2)'}`,
                            }}
                        >
                            {passed
                                ? <Trophy className="w-10 h-10 text-gold-400" />
                                : <RotateCcw className="w-10 h-10 text-royal-400" />}
                        </motion.div>

                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-2">Quiz Completed</p>
                        <h1 className="font-serif font-bold text-4xl text-white mb-1">{grade}</h1>
                        <p className="text-white/45 font-sans mb-8">
                            Well done, <span className="text-white font-medium">{name}</span>!
                        </p>

                        {/* Score ring */}
                        {mounted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.35, duration: 0.5 }}
                                className="mb-2"
                            >
                                <ScoreRing percentage={percentage} passed={passed} />
                            </motion.div>
                        )}
                        <p className="text-white/35 text-xs font-sans mb-8">{score} correct out of {total}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {stats.map(({ label, value, icon: Icon, color }, idx) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.4 }}
                                    className="rounded-2xl p-4"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                                >
                                    <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color }} />
                                    <div className="font-serif font-bold text-2xl text-white">{value}</div>
                                    <div className="text-white/35 text-xs font-sans">{label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Per-question indicator strip */}
                        <div className="flex items-center gap-1 mb-8 justify-center flex-wrap">
                            {userAnswers.map((ans, i) => {
                                const correct = ans === questions[i]?.correct_index;
                                const skipped = ans === -1;
                                return (
                                    <div
                                        key={i}
                                        title={`Q${i + 1}: ${skipped ? 'Skipped' : correct ? 'Correct' : 'Wrong'}`}
                                        className="w-4 h-4 rounded-sm transition-all"
                                        style={{
                                            background: skipped
                                                ? 'rgba(255,255,255,0.15)'
                                                : correct
                                                    ? '#22c55e'
                                                    : '#ef4444',
                                        }}
                                    />
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/leaderboard?quiz=${quizId}`}
                                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                            >
                                <Trophy className="w-4 h-4" />
                                View This Quiz's Leaderboard
                            </Link>
                            <Link
                                href="/quiz"
                                className="w-full py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-white/5"
                                style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.12)' }}
                            >
                                Try Another Quiz
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Question review */}
                <QuestionReviewModal questions={questions} userAnswers={userAnswers} total={total} />
            </div>
        </div>
    );
}
