import Link from 'next/link';
import { Plus, Trash2, Edit, Trophy, CheckCircle, Circle } from 'lucide-react';
import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { deleteQuizAction } from '@/app/actions/quiz';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export const dynamic = 'force-dynamic';

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
                    <h1 className="font-serif font-bold text-3xl text-slate-900">Quizzes</h1>
                    <p className="text-slate-500 text-sm font-sans mt-1">{quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'} created</p>
                </div>
                <Link href="/admin/quizzes/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 bg-slate-900 hover:bg-slate-800 shadow-sm">
                    <Plus className="w-4 h-4" /> Create Quiz
                </Link>
            </div>

            {quizzes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-amber-50 border border-amber-100">
                        <Trophy className="w-7 h-7 text-amber-500" />
                    </div>
                    <h3 className="font-serif font-bold text-slate-900 text-xl mb-2">No quizzes yet</h3>
                    <p className="text-slate-400 text-sm font-sans mb-6">Create your first quiz to start hosting competitions.</p>
                    <Link href="/admin/quizzes/new"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm">
                        <Plus className="w-4 h-4" /> Create Quiz
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-100">
                        {quizzes.map((quiz: any) => (
                            <div key={quiz.$id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Quiz icon */}
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-50 border border-amber-100">
                                        <Trophy className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-900 text-sm truncate">{quiz.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${quiz.is_active
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {quiz.is_active
                                                    ? <><CheckCircle className="w-3 h-3" /> Active</>
                                                    : <><Circle className="w-3 h-3" /> Draft</>}
                                            </span>
                                            <span className="text-slate-400 text-xs font-sans">{quiz.duration} min · {quiz.question_count || 0} Qs</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <Link href={`/admin/quizzes/${quiz.$id}/winners`}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                                        title="View Winners">
                                        <Trophy className="w-4 h-4" />
                                    </Link>
                                    <Link href={`/admin/quizzes/${quiz.$id}/edit`}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                                        title="Edit Quiz">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        await deleteQuizAction(quiz.$id);
                                    }}>
                                        <button type="submit"
                                            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
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
