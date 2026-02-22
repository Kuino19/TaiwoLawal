import Link from 'next/link';
import { Plus, Trash2, Edit, Trophy, CheckCircle, Circle } from 'lucide-react';
import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { deleteQuizAction } from '@/app/actions/quiz';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function getQuizzes() {
    try {
        const r = await adminDatabases.listDocuments(DB_ID, 'quizzes', [Query.orderDesc('$createdAt')]);
        return r.documents;
    } catch { return []; }
}

export default async function AdminQuizzesPage() {
    const quizzes = await getQuizzes();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif font-bold text-3xl text-gray-900">Quizzes</h1>
                    <p className="text-gray-500 text-sm font-sans mt-1">{quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} created</p>
                </div>
                <Link href="/admin/quizzes/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #1e0a4e, #6d28d9)' }}>
                    <Plus className="w-4 h-4" /> Create Quiz
                </Link>
            </div>

            {quizzes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                        <Trophy className="w-7 h-7 text-gold-500" />
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 text-xl mb-2">No quizzes yet</h3>
                    <p className="text-gray-400 text-sm font-sans mb-6">Create your first quiz to start hosting competitions.</p>
                    <Link href="/admin/quizzes/new"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <Plus className="w-4 h-4" /> Create Quiz
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-50">
                        {quizzes.map((quiz: any) => (
                            <div key={quiz.$id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Quiz icon */}
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                        <Trophy className="w-5 h-5 text-gold-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{quiz.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${quiz.is_active
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {quiz.is_active
                                                    ? <><CheckCircle className="w-3 h-3" /> Active</>
                                                    : <><Circle className="w-3 h-3" /> Draft</>}
                                            </span>
                                            <span className="text-gray-400 text-xs font-sans">{quiz.duration} min · {quiz.question_count || 0} Qs</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <Link href={`/admin/quizzes/${quiz.$id}/edit`}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-royal-600 hover:bg-royal-50 transition-all">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        await deleteQuizAction(quiz.$id);
                                    }}>
                                        <button type="submit"
                                            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
