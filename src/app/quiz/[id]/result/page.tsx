import { CheckCircle2, XCircle, Trophy, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default async function QuizResultPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ name?: string; score?: string; total?: string }>;
}) {
    const { name: nameParam, score: scoreParam, total: totalParam } = await searchParams;
    const name = nameParam || 'Participant';
    const score = parseInt(scoreParam || '0');
    const total = parseInt(totalParam || '0');
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    const passed = percentage >= 50;
    const grade =
        percentage >= 90 ? 'Excellent!' :
            percentage >= 70 ? 'Great Job!' :
                percentage >= 50 ? 'Good Effort!' :
                    'Keep Practicing!';

    return (
        <div className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(135deg, #1e0a4e 0%, #2e1065 100%)' }}>
            <div className="w-full max-w-lg">
                {/* Glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-96 h-96 rounded-full blur-3xl opacity-20"
                        style={{ background: passed ? '#f59e0b' : '#6d28d9' }} />
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)' }}>

                    {/* Top accent */}
                    <div className="h-1.5"
                        style={{ background: passed ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #6d28d9, #8b5cf6)' }} />

                    <div className="p-10 text-center">
                        {/* Icon */}
                        <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{
                                background: passed ? 'rgba(251,191,36,0.15)' : 'rgba(109,40,217,0.15)',
                                border: `2px solid ${passed ? 'rgba(251,191,36,0.4)' : 'rgba(139,92,246,0.4)'}`,
                            }}>
                            {passed
                                ? <Trophy className="w-10 h-10 text-gold-400" />
                                : <RotateCcw className="w-10 h-10 text-royal-400" />}
                        </div>

                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-2">Quiz Completed</p>
                        <h1 className="font-serif font-bold text-4xl text-white mb-1">{grade}</h1>
                        <p className="text-white/50 font-sans mb-8">Well done, <span className="text-white font-medium">{name}</span>!</p>

                        {/* Score ring */}
                        <div className="relative w-36 h-36 mx-auto mb-8">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                                <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                                <circle
                                    cx="72" cy="72" r="60" fill="none"
                                    stroke={passed ? '#f59e0b' : '#8b5cf6'}
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 60 * percentage / 100} ${2 * Math.PI * 60}`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-serif font-bold text-4xl text-white">{percentage}%</span>
                                <span className="text-white/40 text-xs font-sans">{score}/{total}</span>
                            </div>
                        </div>

                        {/* Score breakdown */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { label: 'Correct', value: score, icon: CheckCircle2, color: '#22c55e' },
                                { label: 'Wrong', value: total - score, icon: XCircle, color: '#ef4444' },
                                { label: 'Total', value: total, icon: Trophy, color: '#f59e0b' },
                            ].map(({ label, value, icon: Icon, color }) => (
                                <div key={label} className="rounded-xl p-4"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <Icon className="w-5 h-5 mx-auto mb-1" style={{ color }} />
                                    <div className="font-serif font-bold text-2xl text-white">{value}</div>
                                    <div className="text-white/40 text-xs font-sans">{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <Link href="/leaderboard"
                                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all text-sm"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                View Leaderboard
                            </Link>
                            <Link href="/quiz"
                                className="w-full py-3.5 rounded-xl font-semibold text-white/70 border border-white/15 hover:bg-white/10 transition-all text-sm">
                                Try Another Quiz
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
