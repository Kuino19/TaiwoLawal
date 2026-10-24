'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
    Clock, CheckCircle2, XCircle, RotateCcw, ArrowRight,
    ArrowLeft, BookOpen, Award, Trophy, Sparkles, Check, AlertCircle
} from 'lucide-react';
import {
    PRACTICE_SUBJECTS, PracticeSubject, PracticeQuestion,
    getRandomPracticeSession
} from '@/lib/practiceData';
import ConfettiBlast from '@/components/ConfettiBlast';

export default function PracticeClient() {
    // Stage: 'select' | 'quiz' | 'result'
    const [stage, setStage] = useState<'select' | 'quiz' | 'result'>('select');
    const [selectedSubject, setSelectedSubject] = useState<'current_affairs' | 'numbers' | 'standard' | 'combined'>('current_affairs');

    // Quiz Session State
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [secondsLeft, setSecondsLeft] = useState<number>(180); // 3 minutes = 180s
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const [filterReview, setFilterReview] = useState<'all' | 'mistakes'>('all');

    // Current subject info
    const currentSubjectObj = useMemo(() => {
        return PRACTICE_SUBJECTS.find(s => s.id === selectedSubject) || PRACTICE_SUBJECTS[0];
    }, [selectedSubject]);

    // Start a fresh 10-question session from the pool
    const handleStartPractice = (subjectId: 'current_affairs' | 'numbers' | 'standard' | 'combined') => {
        const random10 = getRandomPracticeSession(subjectId);
        setSelectedSubject(subjectId);
        setQuestions(random10);
        setCurrentIndex(0);
        setAnswers({});
        setSecondsLeft(180); // 3 minutes
        setIsTimeUp(false);
        setFilterReview('all');
        setStage('quiz');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 3-Minute Countdown Timer
    useEffect(() => {
        if (stage !== 'quiz' || secondsLeft <= 0) return;

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    setIsTimeUp(true);
                    setStage('result');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [stage, secondsLeft]);

    // Format seconds to mm:ss
    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Select answer
    const handleSelectOption = (optionIndex: number) => {
        setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
    };

    // Navigation
    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Submit quiz
    const handleSubmit = () => {
        setStage('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Score calculation
    const scoreData = useMemo(() => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_index) {
                correct++;
            }
        });
        const total = questions.length || 10;
        const percentage = Math.round((correct / total) * 100);
        const answeredCount = Object.keys(answers).length;
        const timeSpent = 180 - secondsLeft;

        return { correct, total, percentage, answeredCount, timeSpent };
    }, [questions, answers, secondsLeft]);

    // Keyboard support (A-D, 1-4, Left/Right arrows)
    useEffect(() => {
        if (stage !== 'quiz') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const key = e.key.toLowerCase();
            const keyMap: Record<string, number> = { 'a': 0, '1': 0, 'b': 1, '2': 1, 'c': 2, '3': 2, 'd': 3, '4': 3 };

            if (key in keyMap) {
                const optIndex = keyMap[key];
                if (questions[currentIndex] && optIndex < questions[currentIndex].options.length) {
                    handleSelectOption(optIndex);
                }
            } else if (key === 'arrowright' || key === 'enter') {
                e.preventDefault();
                handleNext();
            } else if (key === 'arrowleft') {
                e.preventDefault();
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stage, currentIndex, questions]);

    const OPTION_LABELS = ['A', 'B', 'C', 'D'];
    const currentQ = questions[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
            {stage === 'result' && scoreData.percentage >= 80 && (
                <ConfettiBlast active={true} />
            )}

            {/* ══════════════════════════════════════════════════════
               STAGE 1: CLEAN SELECTION VIEW
            ══════════════════════════════════════════════════════ */}
            {stage === 'select' && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Foursquare Idimu Children Quiz
                        </div>
                        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-slate-900 mb-3 leading-tight">
                            Competition Practice Stage
                        </h1>
                        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                            Each practice test generates <strong>10 randomized questions</strong> with a <strong>3-minute countdown</strong>. Simplified and relaxed for children to build confidence!
                        </p>
                    </div>

                    {/* Subject Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        {PRACTICE_SUBJECTS.map((subject) => {
                            return (
                                <div
                                    key={subject.id}
                                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between text-left"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                                                {subject.badge}
                                            </span>
                                            <span className="text-xs font-bold text-amber-700 flex items-center gap-1 font-mono">
                                                <Clock className="w-3.5 h-3.5" /> {subject.timeMinutes} mins
                                            </span>
                                        </div>

                                        <h2 className="font-serif font-bold text-xl text-slate-900 mb-2 leading-snug">
                                            {subject.title}
                                        </h2>

                                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                            {subject.description}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-5 flex items-center justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Test Format</span>
                                            <span className="font-bold text-slate-800">{subject.sessionQuestions} Qs • {subject.timeMinutes} Mins</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleStartPractice(subject.id)}
                                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            Start Practice <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Info Box */}
                    <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-5 text-center text-xs text-amber-900 max-w-xl mx-auto">
                        <p className="font-semibold mb-1">⚡ Instant Practice Tips</p>
                        <p className="text-amber-800">
                            Questions and options are reshuffled on every try. After completing your 3-minute test, you will get a full answer breakdown with references to help you learn!
                        </p>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               STAGE 2: RESPONSIVE 10-QUESTION PRACTICE RUNNER
            ══════════════════════════════════════════════════════ */}
            {stage === 'quiz' && currentQ && (
                <div className="w-full">
                    {/* Fixed Sticky Header */}
                    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
                        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                            {/* Subject & Exit */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to exit this practice session? Your progress will not be saved.')) {
                                        setStage('select');
                                    }
                                }}
                                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Exit
                            </button>

                            {/* Question Counter */}
                            <span className="text-xs font-bold text-slate-700 font-mono">
                                Question {currentIndex + 1} of {questions.length}
                            </span>

                            {/* 3-Minute Timer */}
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold transition-colors ${
                                secondsLeft <= 30
                                    ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                                    : secondsLeft <= 60
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                                <Clock className="w-3.5 h-3.5" />
                                {formatTime(secondsLeft)}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-100">
                            <div
                                className="h-full bg-amber-500 transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Main Question Container */}
                    <div className="max-w-3xl mx-auto px-4 pt-6 sm:pt-8">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-5">
                            {/* Category / Scope Tag */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                    {currentQ.category || currentQ.subjectTitle}
                                </span>
                                {currentQ.scripture && (
                                    <span className="text-xs font-mono text-slate-400">
                                        📖 {currentQ.scripture}
                                    </span>
                                )}
                            </div>

                            {/* Question Title */}
                            <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 mb-6 leading-snug">
                                {currentQ.text}
                            </h2>

                            {/* 4 Large Touch-friendly Options */}
                            <div className="space-y-3 mb-6">
                                {currentQ.options.map((option, optIdx) => {
                                    const isSelected = answers[currentIndex] === optIdx;

                                    return (
                                        <button
                                            key={optIdx}
                                            type="button"
                                            onClick={() => handleSelectOption(optIdx)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                                                isSelected
                                                    ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500 shadow-xs'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                                            }`}
                                        >
                                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                                                isSelected
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                                {OPTION_LABELS[optIdx]}
                                            </span>
                                            <span className="text-sm sm:text-base font-sans flex-1 leading-snug">
                                                {option}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation Bar */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Previous
                                </button>

                                {currentIndex === questions.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                                    >
                                        Submit Practice <Check className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                                    >
                                        Next <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Question Jump Strip (1 to 10) */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                <span className="font-medium">Quick Question Navigation</span>
                                <span>{scoreData.answeredCount} of {questions.length} answered</span>
                            </div>
                            <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
                                {questions.map((_, idx) => {
                                    const isCurrent = idx === currentIndex;
                                    const isAnswered = answers[idx] !== undefined;

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`h-8 sm:h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                                                isCurrent
                                                    ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                                                    : isAnswered
                                                    ? 'bg-slate-800 text-white'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               STAGE 3: RESULTS & SCORE BREAKDOWN
            ══════════════════════════════════════════════════════ */}
            {stage === 'result' && (
                <div className="max-w-3xl mx-auto px-4 pt-20 sm:pt-24">
                    {/* Time Up Alert Banner if applicable */}
                    {isTimeUp && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                            <span><strong>Time's up!</strong> The 3-minute competition timer reached zero. Here is your practice score.</span>
                        </div>
                    )}

                    {/* Score Card Header */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center shadow-sm mb-8">
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-amber-50 border border-amber-200 text-amber-600">
                            {scoreData.percentage >= 80 ? (
                                <Trophy className="w-8 h-8" />
                            ) : (
                                <Award className="w-8 h-8" />
                            )}
                        </div>

                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 block mb-1">
                            {currentSubjectObj.title}
                        </span>

                        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-900 mb-2">
                            {scoreData.percentage >= 90
                                ? 'Outstanding! Competition Ready!'
                                : scoreData.percentage >= 70
                                ? 'Great Job! Almost Perfect!'
                                : scoreData.percentage >= 50
                                ? 'Good Effort! Keep Practicing!'
                                : 'Keep Studying & Try Again!'}
                        </h2>

                        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-6">
                            You completed {scoreData.answeredCount} of {questions.length} questions in {Math.floor(scoreData.timeSpent / 60)}m {scoreData.timeSpent % 60}s.
                        </p>

                        {/* Score stats */}
                        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="text-2xl font-black font-serif text-slate-900">{scoreData.correct} / {questions.length}</div>
                                <div className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Score</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="text-2xl font-black font-serif text-amber-600">{scoreData.percentage}%</div>
                                <div className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Accuracy</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="text-2xl font-black font-serif text-slate-800">{formatTime(scoreData.timeSpent)}</div>
                                <div className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Time</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleStartPractice(selectedSubject)}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" /> Try Again (New {questions.length} Questions)
                            </button>

                            <button
                                type="button"
                                onClick={() => setStage('select')}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                            >
                                Choose Another Subject
                            </button>
                        </div>
                    </div>

                    {/* Question by Question Review */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif font-bold text-xl text-slate-900">
                                Question Review
                            </h3>

                            {/* Filter: All vs Mistakes */}
                            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                                <button
                                    type="button"
                                    onClick={() => setFilterReview('all')}
                                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                                        filterReview === 'all'
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    All ({questions.length})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterReview('mistakes')}
                                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                                        filterReview === 'mistakes'
                                            ? 'bg-white text-rose-700 shadow-xs'
                                            : 'text-slate-500 hover:text-rose-700'
                                    }`}
                                >
                                    Mistakes ({questions.length - scoreData.correct})
                                </button>
                            </div>
                        </div>

                        {/* Review Items */}
                        <div className="space-y-4">
                            {questions.map((q, idx) => {
                                const userChoice = answers[idx];
                                const isCorrect = userChoice === q.correct_index;

                                if (filterReview === 'mistakes' && isCorrect) return null;

                                return (
                                    <div
                                        key={q.id}
                                        className={`rounded-2xl p-5 border transition-all ${
                                            isCorrect
                                                ? 'bg-white border-slate-200'
                                                : 'bg-white border-rose-200 ring-1 ring-rose-100'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-xs font-mono font-bold text-slate-400">
                                                Q{idx + 1}
                                            </span>
                                            {isCorrect ? (
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                                                    <XCircle className="w-3.5 h-3.5" /> Incorrect
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-serif font-bold text-base sm:text-lg text-slate-900 mb-3 leading-snug">
                                            {q.text}
                                        </p>

                                        {/* Correct vs Selected Option */}
                                        <div className="text-xs space-y-1.5 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="flex items-start gap-2">
                                                <span className="font-bold text-emerald-700 flex-shrink-0">Correct Answer:</span>
                                                <span className="text-slate-800 font-medium">{q.options[q.correct_index]}</span>
                                            </div>
                                            {!isCorrect && (
                                                <div className="flex items-start gap-2 text-rose-700">
                                                    <span className="font-bold flex-shrink-0">Your Answer:</span>
                                                    <span>{userChoice !== undefined ? q.options[userChoice] : 'Unanswered'}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Scripture Reference Note */}
                                        {(q.scripture || q.full_answer) && (
                                            <div className="text-[11px] text-slate-500 font-sans flex items-center gap-1.5">
                                                <span className="font-bold text-amber-700">📖 Reference:</span>
                                                <span>{q.scripture || q.full_answer}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
