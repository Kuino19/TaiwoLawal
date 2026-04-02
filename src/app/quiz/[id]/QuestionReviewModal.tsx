'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface Question {
    $id: string;
    text: string;
    options: string[];
    correct_index: number;
}

interface QuestionReviewModalProps {
    questions: Question[];
    userAnswers: number[];
    total: number;
}

export default function QuestionReviewModal({ questions, userAnswers, total }: QuestionReviewModalProps) {
    const [showReview, setShowReview] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    if (questions.length === 0 || userAnswers.length === 0) {
        return null;
    }

    if (showReview) {
        const questionsList = questions.slice(0, total);
        const question = questionsList[currentQuestion];
        const userAnswer = userAnswers[currentQuestion];
        const isCorrect = userAnswer === question.correct_index;
        const progress = ((currentQuestion + 1) / questionsList.length) * 100;
        const correctCount = userAnswers.slice(0, total).filter((a, i) => a === questions[i]?.correct_index).length;

        return (
            <div className="fixed inset-0 flex flex-col z-50"
                style={{ background: 'linear-gradient(135deg, #1e0a4e, #2e1065)' }}>
                {/* Top bar */}
                <div className="px-4 py-4 flex items-center justify-between max-w-3xl mx-auto w-full">
                    <button
                        onClick={() => setShowReview(false)}
                        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-sans">
                        <X className="w-4 h-4" /> Close
                    </button>
                    <div className="flex items-center gap-2">
                        {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                        <span className={`font-mono font-bold text-lg ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                    </div>
                    <span className="text-white/50 text-sm font-sans">{correctCount}/{questionsList.length} correct</span>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-white/10 max-w-3xl mx-auto w-full px-4">
                    <div className="h-full rounded-full transition-all duration-300"
                        style={{
                            width: `${progress}%`,
                            background: isCorrect ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                        }} />
                </div>

                {/* Progress text */}
                <div className="px-4 pt-4 pb-2 max-w-3xl mx-auto w-full">
                    <div className="flex items-center justify-between text-xs font-sans text-white/40 mb-2">
                        <span>Question {currentQuestion + 1} of {questionsList.length}</span>
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
                                const isUserChoice = userAnswer === i;
                                const isCorrectChoice = question.correct_index === i;
                                const showAsCorrect = isCorrectChoice;
                                const showAsWrong = isUserChoice && !isCorrect;

                                return (
                                    <div
                                        key={i}
                                        className="w-full flex items-center gap-4 px-6 py-4 rounded-xl border font-sans transition-all"
                                        style={{
                                            background: showAsCorrect
                                                ? 'rgba(34,197,94,0.15)'
                                                : showAsWrong
                                                    ? 'rgba(239,68,68,0.15)'
                                                    : 'rgba(255,255,255,0.05)',
                                            border: showAsCorrect
                                                ? '1px solid rgba(34,197,94,0.4)'
                                                : showAsWrong
                                                    ? '1px solid rgba(239,68,68,0.4)'
                                                    : '1px solid rgba(255,255,255,0.1)',
                                            color: showAsCorrect ? '#22c55e' : showAsWrong ? '#ef4444' : 'rgba(255,255,255,0.7)',
                                        }}
                                    >
                                        <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                                            style={{
                                                background: showAsCorrect
                                                    ? 'rgba(34,197,94,0.3)'
                                                    : showAsWrong
                                                        ? 'rgba(239,68,68,0.3)'
                                                        : 'rgba(255,255,255,0.08)',
                                                color: showAsCorrect ? '#22c55e' : showAsWrong ? '#ef4444' : 'rgba(255,255,255,0.4)',
                                            }}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className="font-medium flex-1">{option}</span>
                                        {showAsCorrect && <CheckCircle2 className="w-5 h-5" />}
                                        {showAsWrong && <XCircle className="w-5 h-5" />}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Answer summary for incorrect */}
                        {!isCorrect && (
                            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <p className="text-amber-300 text-sm font-semibold mb-2">Your answer: <span className="text-amber-400">{question.options[userAnswer]}</span></p>
                                <p className="text-emerald-300 text-sm font-semibold">Correct answer: <span className="text-emerald-400">{question.options[question.correct_index]}</span></p>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8">
                            <button
                                onClick={() => setCurrentQuestion((c) => Math.max(0, c - 1))}
                                disabled={currentQuestion === 0}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-sans font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" /> Previous
                            </button>

                            {currentQuestion < questionsList.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestion((c) => c + 1)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
                                    style={{ background: 'linear-gradient(135deg, #2e1065, #6d28d9)' }}
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowReview(false)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                                >
                                    Done <CheckCircle2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mt-8">
            <button
                onClick={() => setShowReview(true)}
                className="w-full py-4 rounded-2xl font-semibold text-white transition-all text-base"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                Review Questions
            </button>
        </div>
    );
}
