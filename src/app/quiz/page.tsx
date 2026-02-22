import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import QuizCard, { Quiz } from '@/components/QuizCard';
import { Trophy, Zap } from 'lucide-react';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

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
    } catch {
        return [];
    }
}

export default async function QuizPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="relative overflow-hidden py-24 pt-36"
                style={{ background: 'linear-gradient(135deg, #1e0a4e 0%, #2e1065 100%)' }}>
                <div className="absolute inset-0"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251,191,36,0.06), transparent 60%)' }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-4">Competitions</p>
                    <h1 className="font-serif font-bold text-5xl md:text-6xl text-white mb-4">
                        Challenge Yourself
                    </h1>
                    <p className="text-white/50 font-sans text-lg max-w-lg mx-auto">
                        Join our quizzes, test your knowledge across faith and academics, and win amazing prizes!
                    </p>
                </div>
            </div>

            {/* Quizzes */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {quizzes.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                            <Zap className="w-8 h-8 text-royal-400" />
                        </div>
                        <h3 className="font-serif font-bold text-2xl text-gray-900 mb-2">No active quizzes</h3>
                        <p className="text-gray-500 font-sans">Check back soon for upcoming competitions!</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-10">
                            <p className="text-gray-500 font-sans">{quizzes.length} active {quizzes.length === 1 ? 'competition' : 'competitions'}</p>
                            <a href="/leaderboard"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-royal-700 hover:text-royal-900 transition-colors">
                                <Trophy className="w-4 h-4" /> View Leaderboard
                            </a>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
