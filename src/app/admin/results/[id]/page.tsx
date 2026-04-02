import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { CheckCircle2, XCircle, Trophy, User, Calendar, ArrowLeft, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export const dynamic = 'force-dynamic';

async function getAttempt(id: string) {
    try {
        return await adminDatabases.getDocument(DB_ID, 'attempts', id);
    } catch {
        return null;
    }
}

async function getQuestions(quizId: string) {
    try {
        const res = await adminDatabases.listDocuments(DB_ID, 'questions', [
            Query.equal('quiz_id', quizId),
            Query.limit(100)
        ]);
        return res.documents;
    } catch {
        return [];
    }
}

export default async function AdminResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const attempt: any = await getAttempt(id);

    if (!attempt) {
        return notFound();
    }

    const questions = await getQuestions(attempt.quiz_id);
    const userAnswers = attempt.user_answers ? JSON.parse(attempt.user_answers) : [];

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs / Back */}
            <Link href="/admin/results" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Results
            </Link>

            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-royal-600 flex items-center justify-center text-white shadow-lg shadow-royal-200">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-3xl text-gray-900">{attempt.participant_name}</h1>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5 font-sans font-medium">
                                    <ClipboardList className="w-4 h-4 text-royal-500" /> {attempt.quiz_title}
                                </span>
                                <span className="flex items-center gap-1.5 font-sans">
                                    <Calendar className="w-4 h-4" /> {formatDate(attempt.$createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="text-center px-4 border-r border-gray-200">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Score</p>
                            <p className="font-serif font-bold text-2xl text-gray-900">{attempt.score}<span className="text-gray-300 text-lg"> / {attempt.total}</span></p>
                        </div>
                        <div className="text-center px-4">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Percentage</p>
                            <p className={`font-serif font-bold text-2xl ${attempt.percentage >= 70 ? 'text-emerald-600' : attempt.percentage >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                                {attempt.percentage}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Answer Review */}
            <div className="space-y-6">
                <h2 className="font-serif font-bold text-2xl text-gray-900 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-royal-600" /> Detailed Review
                </h2>

                {questions.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-700 text-sm font-sans italic">
                        The original questions for this quiz could not be loaded. This might happen if the quiz was deleted after the attempt.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {questions.slice(0, attempt.total).map((question: any, idx: number) => {
                            const userAnswer = userAnswers[idx];
                            const isCorrect = userAnswer === question.correct_index;
                            
                            return (
                                <div key={question.$id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <span className="text-xs font-bold font-mono text-gray-300 uppercase">Question {idx + 1}</span>
                                            {isCorrect ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-rose-600 text-xs font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                                                    <XCircle className="w-3.5 h-3.5" /> Incorrect
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-gray-900 font-bold text-lg leading-snug mb-6">{question.text}</p>
                                        
                                        <div className="grid gap-2">
                                            {question.options.map((option: string, i: number) => {
                                                const isUserChoice = userAnswer === i;
                                                const isCorrectChoice = question.correct_index === i;
                                                
                                                let stateStyles = 'bg-gray-50 border-gray-100 text-gray-400';
                                                if (isCorrectChoice) {
                                                    stateStyles = 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-sm shadow-emerald-50';
                                                } else if (isUserChoice && !isCorrect) {
                                                    stateStyles = 'bg-rose-50 border-rose-200 text-rose-700 font-bold';
                                                }

                                                return (
                                                    <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${stateStyles}`}>
                                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black border ${
                                                            isCorrectChoice ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 
                                                            isUserChoice && !isCorrect ? 'bg-rose-100 border-rose-300 text-rose-700' :
                                                            'bg-white border-gray-100 text-gray-300'
                                                        }`}>
                                                            {String.fromCharCode(65 + i)}
                                                        </span>
                                                        <span className="flex-1">{option}</span>
                                                        {isCorrectChoice && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                                        {isUserChoice && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
