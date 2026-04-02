'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

interface Question {
    $id: string;
    text: string;
    options: string[];
    correct_index: number;
}

interface QuestionReviewProps {
    questions: Question[];
    userAnswers: number[];
    total: number;
}

export default function QuestionReview({ questions, userAnswers, total }: QuestionReviewProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (questions.length === 0 || userAnswers.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 border-t border-white/10 pt-12">
            <h2 className="font-serif font-bold text-2xl text-white mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-gold-400" />
                Question Review
            </h2>

            <div className="space-y-3">
                {questions.slice(0, total).map((question: any, idx: number) => {
                    const userAnswer = userAnswers[idx];
                    const isCorrect = userAnswer === question.correct_index;
                    const isExpanded = expandedId === question.$id;

                    return (
                        <div
                            key={question.$id}
                            className="rounded-xl border border-white/10 overflow-hidden transition-all"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => setExpandedId(isExpanded ? null : question.$id)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4 flex-1 text-left">
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-xs font-bold font-mono text-white/50 uppercase">Q{idx + 1}</span>
                                        <p className="text-white font-medium text-sm line-clamp-1">{question.text}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                    {isCorrect ? (
                                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span className="hidden sm:inline">Correct</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-400/10 px-2 py-1 rounded-full border border-rose-400/20">
                                            <XCircle className="w-3 h-3" />
                                            <span className="hidden sm:inline">Wrong</span>
                                        </span>
                                    )}
                                    <ChevronDown
                                        className="w-4 h-4 text-white/40 transition-transform duration-200"
                                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                    />
                                </div>
                            </button>

                            {/* Accordion Content */}
                            {isExpanded && (
                                <div className="px-6 pb-6 pt-4 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="text-white/70 text-sm leading-snug">{question.text}</p>

                                    <div className="grid gap-2">
                                        {question.options.map((option: string, i: number) => {
                                            const isUserChoice = userAnswer === i;
                                            const isCorrectChoice = question.correct_index === i;

                                            let stateStyles = 'bg-white/5 border-white/10 text-white/60';
                                            if (isCorrectChoice) {
                                                stateStyles = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                                            } else if (isUserChoice && !isCorrect) {
                                                stateStyles = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
                                            }

                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm transition-all ${stateStyles}`}
                                                >
                                                    <span
                                                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border ${
                                                            isCorrectChoice
                                                                ? 'bg-emerald-500/20 border-emerald-500/40'
                                                                : isUserChoice && !isCorrect
                                                                    ? 'bg-rose-500/20 border-rose-500/40'
                                                                    : 'bg-white/10 border-white/10'
                                                        }`}
                                                    >
                                                        {String.fromCharCode(65 + i)}
                                                    </span>
                                                    <span className="flex-1">{option}</span>
                                                    {isCorrectChoice && <CheckCircle2 className="w-4 h-4" />}
                                                    {isUserChoice && !isCorrect && <XCircle className="w-4 h-4" />}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {!isCorrect && (
                                        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                            <p className="text-amber-300 text-xs font-semibold">Your answer: <span className="text-amber-400">{question.options[userAnswer]}</span></p>
                                            <p className="text-amber-300 text-xs font-semibold mt-1">Correct answer: <span className="text-emerald-400">{question.options[question.correct_index]}</span></p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
