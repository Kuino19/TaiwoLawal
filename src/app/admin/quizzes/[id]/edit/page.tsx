import { adminDatabases } from '@/lib/server/appwrite';
import { updateQuizAction } from '@/app/actions/quiz';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function getQuiz(id: string) {
    try {
        return await adminDatabases.getDocument(DB_ID, 'quizzes', id);
    } catch { return null; }
}

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const quiz = await getQuiz(id);
    if (!quiz) notFound();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/quizzes"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="font-serif font-bold text-3xl text-gray-900">Edit Quiz</h1>
                    <p className="text-gray-500 text-sm font-sans mt-0.5">{quiz.title}</p>
                </div>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100"
                    style={{ background: 'rgba(251,191,36,0.04)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
                        <Trophy className="w-4 h-4 text-gold-500" />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">Quiz Details</p>
                </div>

                <form action={updateQuizAction} className="p-6 space-y-5">
                    <input type="hidden" name="quizId" value={quiz.$id} />

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quiz Title</label>
                        <input
                            name="title"
                            type="text"
                            defaultValue={quiz.title}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 font-sans text-sm focus:outline-none focus:border-royal-400 focus:ring-2 focus:ring-royal-100 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={quiz.description}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 font-sans text-sm focus:outline-none focus:border-royal-400 focus:ring-2 focus:ring-royal-100 transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration (minutes)</label>
                        <input
                            name="duration"
                            type="number"
                            min={1}
                            max={120}
                            defaultValue={quiz.duration}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 font-sans text-sm focus:outline-none focus:border-royal-400 focus:ring-2 focus:ring-royal-100 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                        <select
                            name="is_active"
                            defaultValue={quiz.is_active ? 'true' : 'false'}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 font-sans text-sm focus:outline-none focus:border-royal-400 focus:ring-2 focus:ring-royal-100 transition-all bg-white"
                        >
                            <option value="true">Active (Visible to users)</option>
                            <option value="false">Draft (Hidden)</option>
                        </select>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button type="submit"
                            className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #1e0a4e, #6d28d9)' }}>
                            Save Changes
                        </button>
                        <Link href="/admin/quizzes"
                            className="px-8 py-3 rounded-xl font-semibold text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all text-center">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>

            {/* Note */}
            <p className="mt-4 text-gray-400 text-xs font-sans max-w-2xl">
                To add or modify questions, delete this quiz and create a new one via "Create Quiz".
            </p>
        </div>
    );
}
