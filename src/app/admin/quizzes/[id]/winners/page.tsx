import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import Link from 'next/link';
import { Trophy, ArrowLeft, User, Phone, Medal } from 'lucide-react';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';
export const dynamic = 'force-dynamic';

async function getTopWinners(quizId: string) {
    try {
        const r = await adminDatabases.listDocuments(DB_ID, 'attempts', [
            Query.equal('quiz_id', quizId),
            Query.orderDesc('score'),
            Query.limit(5)
        ]);
        return r.documents;
    } catch { return []; }
}

async function getQuiz(quizId: string) {
    try {
        return await adminDatabases.getDocument(DB_ID, 'quizzes', quizId);
    } catch { return null; }
}

export default async function TopWinnersPage({ params }: { params: { id: string } }) {
    const [winners, quiz] = await Promise.all([
        getTopWinners(params.id),
        getQuiz(params.id)
    ]);

    if (!quiz) {
        return (
            <div className="p-8 text-center text-gray-500">
                Quiz not found.
                <Link href="/admin/quizzes" className="block text-blue-500 mt-4">Back to Quizzes</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/admin/quizzes" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" /> Back to Quizzes
            </Link>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <Trophy className="w-6 h-6 text-gold-500" />
                </div>
                <div>
                    <h1 className="font-serif font-bold text-3xl text-gray-900">Top 5 Winners</h1>
                    <p className="text-gray-500 text-sm font-sans mt-1">{quiz.title}</p>
                </div>
            </div>

            {winners.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                    <p className="text-gray-400 font-sans">No attempts have been recorded for this quiz yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-50">
                        {winners.map((winner: any, index: number) => {
                            const percent = winner.percentage || 0;
                            const isFirst = index === 0;
                            const isSecond = index === 1;
                            const isThird = index === 2;
                            
                            let medalColor = 'text-gray-400';
                            if (isFirst) medalColor = 'text-yellow-500';
                            else if (isSecond) medalColor = 'text-gray-400';
                            else if (isThird) medalColor = 'text-amber-700';

                            return (
                                <div key={winner.$id} className="flex items-center justify-between px-6 py-5 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 font-bold text-gray-400 text-lg">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900">{winner.participant_name}</h3>
                                                {index < 3 && <Medal className={`w-4 h-4 ${medalColor}`} fill="currentColor" />}
                                            </div>
                                            {winner.participant_phone && (
                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1">
                                                    <Phone className="w-3 h-3" />
                                                    {winner.participant_phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-xl text-gray-900">{winner.score} <span className="text-sm text-gray-400">/ {winner.total}</span></div>
                                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${percent >= 70 ? 'text-emerald-700 bg-emerald-50' : percent >= 40 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50'}`}>
                                            {percent}% Score
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
