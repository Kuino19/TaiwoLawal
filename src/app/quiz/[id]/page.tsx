'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Question {
    $id: string;
    text: string;
    options: string[];
    correct_index: number;
}

interface QuizData {
    $id: string;
    title: string;
    description: string;
    duration: number;
}

async function fetchQuizData(quizId: string): Promise<{ quiz: QuizData; questions: Question[] } | null> {
    try {
        const [quizRes, questionsRes] = await Promise.all([
            fetch(`/api/quiz/${quizId}`),
            fetch(`/api/quiz/${quizId}/questions`),
        ]);
        if (!quizRes.ok) return null;
        const quiz = await quizRes.json();
        const questions = await questionsRes.json();
        return { quiz, questions };
    } catch {
        return null;
    }
}

export default function QuizInterface({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [participantName, setParticipantName] = useState('');
    const [nameEntered, setNameEntered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchQuizData(params.id).then((data) => {
            if (data) {
                setQuiz(data.quiz);
                setQuestions(data.questions);
                setAnswers(new Array(data.questions.length).fill(-1));
                setTimeLeft(data.quiz.duration * 60);
            }
            setLoading(false);
        });
    }, [params.id]);

    const handleSubmit = useCallback(async (auto = false) => {
        if (submitting) return;
        setSubmitting(true);
        const score = answers.reduce((s, a, i) => (a === questions[i]?.correct_index ? s + 1 : s), 0);

        const formData = new FormData();
        formData.append('quizId', params.id);
        formData.append('quizTitle', quiz?.title || '');
        formData.append('participantName', participantName);
        formData.append('score', String(score));
        formData.append('total', String(questions.length));

        const { submitQuizAction } = await import('@/app/actions/quiz');
        await submitQuizAction(formData);
    }, [answers, questions, participantName, params.id, quiz, submitting]);

    // Countdown timer
    useEffect(() => {
        if (!nameEntered || timeLeft <= 0 || submitted) return;
        const interval = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) { handleSubmit(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [nameEntered, timeLeft, submitted, handleSubmit]);

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const timePercent = quiz ? (timeLeft / (quiz.duration * 60)) * 100 : 100;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1e0a4e, #2e1065)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-gold-400 border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-white/60 font-sans">Loading quiz…</p>
                </div>
            </div>
        );
    }

    if (!quiz || questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1e0a4e, #2e1065)' }}>
                <div className="text-center text-white">
                    <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                    <h2 className="font-serif font-bold text-3xl mb-2">Quiz Not Found</h2>
                    <p className="text-white/50 mb-6">This quiz doesn't exist or has no questions yet.</p>
                    <Link href="/quiz" className="btn-gold">Back to Quizzes</Link>
                </div>
            </div>
        );
    }

    // Name entry screen
    if (!nameEntered) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4"
                style={{ background: 'linear-gradient(135deg, #1e0a4e, #2e1065)' }}>
                <div className="w-full max-w-md">
                    <div className="rounded-2xl p-8 border border-white/10"
                        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
                        <div className="text-center mb-8">
                            <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-3">Get Ready</p>
                            <h1 className="font-serif font-bold text-3xl text-white mb-2">{quiz.title}</h1>
                            <p className="text-white/50 text-sm font-sans">{quiz.description}</p>

                            <div className="flex items-center justify-center gap-6 mt-6 text-sm font-sans text-white/60">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{quiz.duration} minutes</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{questions.length} questions</span>
                                </div>
                            </div>
                        </div>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 font-sans text-sm focus:outline-none focus:border-gold-400 mb-4"
                        />
                        <button
                            onClick={() => { if (participantName.trim()) setNameEntered(true); }}
                            disabled={!participantName.trim()}
                            className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const answeredCount = answers.filter((a) => a !== -1).length;

    return (
        <div className="min-h-screen flex flex-col"
            style={{ background: 'linear-gradient(135deg, #1e0a4e, #2e1065)' }}>
            {/* Top bar */}
            <div className="px-4 py-4 flex items-center justify-between max-w-3xl mx-auto w-full">
                <Link href="/quiz" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-sans">
                    <ArrowLeft className="w-4 h-4" /> Exit
                </Link>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-400" />
                    <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-rose-400' : 'text-white'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
                <span className="text-white/50 text-sm font-sans">{answeredCount}/{questions.length} answered</span>
            </div>

            {/* Timer bar */}
            <div className="h-1 bg-white/10 max-w-3xl mx-auto w-full px-4">
                <div className="h-full rounded-full transition-all duration-1000"
                    style={{
                        width: `${timePercent}%`,
                        background: timePercent > 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : timePercent > 20 ? '#f59e0b' : '#ef4444',
                    }} />
            </div>

            {/* Progress */}
            <div className="px-4 pt-4 pb-2 max-w-3xl mx-auto w-full">
                <div className="flex items-center justify-between text-xs font-sans text-white/40 mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                </div>
            </div>

            {/* Question card */}
            <div className="flex-1 flex items-start justify-center px-4 py-6">
                <div className="w-full max-w-3xl">
                    <div className="rounded-2xl p-8 mb-6 border border-white/10"
                        style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
                        <h2 className="font-serif font-bold text-white text-2xl leading-snug">
                            {question.text}
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {question.options.map((option, i) => {
                            const selected = answers[currentQuestion] === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        const updated = [...answers];
                                        updated[currentQuestion] = i;
                                        setAnswers(updated);
                                    }}
                                    className="w-full text-left flex items-center gap-4 px-6 py-4 rounded-xl border transition-all duration-200 font-sans"
                                    style={{
                                        background: selected ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
                                        border: selected ? '1px solid rgba(251,191,36,0.6)' : '1px solid rgba(255,255,255,0.1)',
                                        color: selected ? '#fbbf24' : 'rgba(255,255,255,0.7)',
                                    }}
                                >
                                    <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                                        style={{
                                            background: selected ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)',
                                            color: selected ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                                        }}>
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="font-medium">{option}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={() => setCurrentQuestion((c) => Math.max(0, c - 1))}
                            disabled={currentQuestion === 0}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-sans font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {currentQuestion < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestion((c) => c + 1)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
                                style={{ background: 'linear-gradient(135deg, #2e1065, #6d28d9)' }}
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmit()}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                            >
                                {submitting ? 'Submitting…' : 'Submit Quiz'}
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
