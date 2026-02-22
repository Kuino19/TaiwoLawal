import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { Trophy, Medal, Star } from 'lucide-react';
import Link from 'next/link';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

interface Attempt {
    $id: string;
    participant_name: string;
    quiz_title: string;
    score: number;
    total: number;
    percentage: number;
    $createdAt: string;
}

async function getAttempts(): Promise<Attempt[]> {
    try {
        const res = await adminDatabases.listDocuments(DB_ID, 'attempts', [
            Query.orderDesc('percentage'),
            Query.orderDesc('score'),
            Query.limit(50),
        ]);
        return res.documents as unknown as Attempt[];
    } catch {
        return [];
    }
}

const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-gold-400" />;
    if (rank === 2) return <Medal className="w-5 h-5" style={{ color: '#94a3b8' }} />;
    if (rank === 3) return <Medal className="w-5 h-5" style={{ color: '#cd7c2f' }} />;
    return <span className="font-serif font-bold text-gray-400 text-sm">#{rank}</span>;
};

export default async function LeaderboardPage() {
    const attempts = await getAttempts();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="relative overflow-hidden py-24 pt-36"
                style={{ background: 'linear-gradient(135deg, #1e0a4e 0%, #2e1065 100%)' }}>
                <div className="absolute inset-0"
                    style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(251,191,36,0.07), transparent 60%)' }} />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-4">Hall of Fame</p>
                    <h1 className="font-serif font-bold text-5xl md:text-6xl text-white mb-4">Leaderboard</h1>
                    <p className="text-white/50 font-sans text-lg max-w-md mx-auto">
                        Top performers across all quizzes. Can you claim the #1 spot?
                    </p>
                </div>
            </div>

            {/* Top 3 podium (if we have data) */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {attempts.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                            <Trophy className="w-8 h-8 text-gold-400" />
                        </div>
                        <h3 className="font-serif font-bold text-2xl text-gray-900 mb-2">No scores yet</h3>
                        <p className="text-gray-500 font-sans mb-6">Be the first to complete a quiz and claim the top spot!</p>
                        <Link href="/quiz"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                            Take a Quiz
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Top 3 cards */}
                        {attempts.length >= 3 && (
                            <div className="grid grid-cols-3 gap-4 mb-12 items-end">
                                {[attempts[1], attempts[0], attempts[2]].map((attempt, podiumIdx) => {
                                    const actualRank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
                                    const heights = ['h-28', 'h-36', 'h-24'];
                                    const glows = ['rgba(148,163,184,0.2)', 'rgba(251,191,36,0.2)', 'rgba(205,124,47,0.2)'];
                                    const borders = ['rgba(148,163,184,0.3)', 'rgba(251,191,36,0.4)', 'rgba(205,124,47,0.3)'];
                                    return (
                                        <div key={attempt.$id} className="text-center">
                                            <div className="mb-2">
                                                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-1"
                                                    style={{ background: glows[podiumIdx], border: `2px solid ${borders[podiumIdx]}` }}>
                                                    <RankIcon rank={actualRank} />
                                                </div>
                                                <p className="font-serif font-bold text-gray-900 text-sm truncate">{attempt.participant_name}</p>
                                                <p className="text-gray-500 text-xs font-sans">{attempt.percentage}%</p>
                                            </div>
                                            <div className={`${heights[podiumIdx]} rounded-t-xl flex items-end justify-center pb-3 font-serif font-bold text-white text-xl`}
                                                style={{
                                                    background: podiumIdx === 1
                                                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                                        : podiumIdx === 0
                                                            ? 'linear-gradient(135deg, #64748b, #94a3b8)'
                                                            : 'linear-gradient(135deg, #92400e, #b45309)',
                                                }}>
                                                {actualRank}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Full table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-serif font-bold text-gray-900 text-xl">All Scores</h2>
                                <span className="text-gray-400 text-sm font-sans">{attempts.length} entries</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {attempts.map((attempt, i) => {
                                    const rank = i + 1;
                                    const isTop3 = rank <= 3;
                                    return (
                                        <div key={attempt.$id}
                                            className={`px-6 py-4 flex items-center gap-4 transition-colors hover:bg-gray-50 ${isTop3 ? 'bg-gold-50/30' : ''}`}>
                                            {/* Rank */}
                                            <div className="w-10 flex-shrink-0 flex justify-center">
                                                <RankIcon rank={rank} />
                                            </div>

                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-serif font-bold text-white text-sm"
                                                style={{ background: 'linear-gradient(135deg, #2e1065, #6d28d9)' }}>
                                                {attempt.participant_name.charAt(0).toUpperCase()}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{attempt.participant_name}</p>
                                                <p className="text-gray-400 text-xs font-sans truncate">{attempt.quiz_title}</p>
                                            </div>

                                            {/* Score */}
                                            <div className="text-right flex-shrink-0">
                                                <div className="font-serif font-bold text-gray-900 text-lg">
                                                    {attempt.score}/{attempt.total}
                                                </div>
                                                <div className={`text-xs font-bold font-sans ${attempt.percentage >= 70 ? 'text-emerald-600' : attempt.percentage >= 50 ? 'text-gold-600' : 'text-rose-500'}`}>
                                                    {attempt.percentage}%
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <div className="text-gray-400 text-xs font-sans flex-shrink-0 hidden sm:block">
                                                {new Date(attempt.$createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
