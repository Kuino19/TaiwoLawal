import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import QuizCard, { Quiz } from '@/components/QuizCard';
import { Trophy, Zap, BookOpen, Clock, Users } from 'lucide-react';
import Link from 'next/link';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export const dynamic = 'force-dynamic';

async function getQuizzes(): Promise<Quiz[]> {
    try {
        const res = await databases.listDocuments(DB_ID, 'quizzes', [
            Query.equal('is_active', true),
            Query.orderDesc('$createdAt'),
        ]);
        return res.documents.map((doc) => ({
            id: doc.$id,
            title: doc.title,
            description: doc.description,
            duration: doc.duration,
            questionCount: doc.question_count || 0,
            is_active: doc.is_active,
        }));
    } catch (error: any) {
        console.error('Failed to fetch quizzes:', error.message);
        return [];
    }
}

export default async function QuizPage() {
    const quizzes = await getQuizzes();
    const totalTime = quizzes.reduce((s, q) => s + q.duration, 0);
    const totalQuestions = quizzes.reduce((s, q) => s + q.questionCount, 0);

    return (
        <div className="min-h-screen" style={{ background: '#0d0520' }}>
            {/* ── Hero ── */}
            <div className="relative overflow-hidden pb-8 pt-32"
                style={{ background: 'linear-gradient(160deg, #0d0520 0%, #1e0a4e 50%, #2e1065 100%)' }}>

                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-16 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
                        style={{ background: 'radial-gradient(circle, #6d28d9, transparent 70%)' }} />
                    <div className="absolute top-8 right-1/3 w-64 h-64 rounded-full blur-3xl opacity-15"
                        style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 blur-3xl opacity-10"
                        style={{ background: '#8b5cf6' }} />
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-[0.25em] uppercase"
                        style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                        <Zap className="w-3.5 h-3.5" />
                        Live Competitions
                    </div>

                    <h1 className="font-serif font-bold text-5xl md:text-7xl text-white mb-5 leading-tight">
                        Challenge{' '}
                        <span className="text-gradient-gold">Yourself</span>
                    </h1>
                    <p className="text-white/50 font-sans text-lg max-w-xl mx-auto mb-10">
                        Test your knowledge across faith and academics — compete, learn, and win amazing prizes!
                    </p>

                    {/* Quick stats */}
                    {quizzes.length > 0 && (
                        <div className="inline-flex items-center gap-6 flex-wrap justify-center">
                            {[
                                { icon: BookOpen, label: `${quizzes.length} Active ${quizzes.length === 1 ? 'Quiz' : 'Quizzes'}` },
                                { icon: Clock, label: `Up to ${Math.round(totalTime / 60)} mins` },
                                { icon: Trophy, label: 'Win Prizes' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 text-sm font-sans"
                                    style={{ color: 'rgba(255,255,255,0.55)' }}>
                                    <Icon className="w-4 h-4 text-gold-400" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom fade into page bg */}
                <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, #0d0520)' }} />
            </div>

            {/* ── Quiz Grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {quizzes.length === 0 ? (
                    <div className="text-center py-28">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'rgba(109,40,217,0.12)', border: '1px solid rgba(109,40,217,0.25)' }}>
                            <Zap className="w-8 h-8 text-royal-400" />
                        </div>
                        <h3 className="font-serif font-bold text-2xl text-white mb-2">No active quizzes</h3>
                        <p className="text-white/40 font-sans mb-8">Check back soon for upcoming competitions!</p>
                    </div>
                ) : (
                    <>
                        {/* Section heading */}
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <p className="section-label mb-1">All Competitions</p>
                                <p className="text-white/40 font-sans text-sm">
                                    {quizzes.length} active {quizzes.length === 1 ? 'competition' : 'competitions'}
                                </p>
                            </div>
                            <Link href="/leaderboard"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                                style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                                <Trophy className="w-4 h-4" />
                                Leaderboard
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                            {quizzes.map((quiz, i) => (
                                <QuizCard key={quiz.id} quiz={quiz} index={i} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
