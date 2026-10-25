'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Clock, CheckCircle2, XCircle, RotateCcw, ArrowRight,
    ArrowLeft, BookOpen, Award, Trophy, Sparkles, Check, 
    AlertCircle, User, Church, Edit3, Crown, Shield, Flame
} from 'lucide-react';
import {
    PRACTICE_SUBJECTS, PracticeSubject, PracticeQuestion,
    getRandomPracticeSession
} from '@/lib/practiceData';
import ConfettiBlast from '@/components/ConfettiBlast';
import CompetitionLeaderboard from '@/components/CompetitionLeaderboard';

const CHURCH_DISTRICT_PRESETS = [
    'Idimu Missionary District (Host)',
    'Egbe District',
    'Association Avenue District',
    'Ikotun District',
    'Alake District',
    'Ajebo Headquarters Camp',
    'Yaba National Headquarters',
    'Other / Visiting Church'
];

export default function PracticeClient() {
    // Main View Tab: 'competition' | 'leaderboard'
    const [viewTab, setViewTab] = useState<'competition' | 'leaderboard'>('competition');

    // Contestant Registration State
    const [contestantName, setContestantName] = useState<string>('');
    const [churchDistrict, setChurchDistrict] = useState<string>('Idimu Missionary District (Host)');
    const [customChurch, setCustomChurch] = useState<string>('');
    const [ageCategory, setAgeCategory] = useState<string>('Children (Ages 6–12)');
    const [phone, setPhone] = useState<string>('');
    const [showRegModal, setShowRegModal] = useState<boolean>(false);
    const [pendingSubjectStart, setPendingSubjectStart] = useState<'current_affairs' | 'numbers' | 'standard' | 'combined' | null>(null);

    // Quiz Session State
    const [stage, setStage] = useState<'select' | 'quiz' | 'result'>('select');
    const [selectedSubject, setSelectedSubject] = useState<'current_affairs' | 'numbers' | 'standard' | 'combined'>('current_affairs');
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [secondsLeft, setSecondsLeft] = useState<number>(180); // 3 minutes = 180s
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const [filterReview, setFilterReview] = useState<'all' | 'mistakes'>('all');

    // Leaderboard submission result
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submittedAttemptId, setSubmittedAttemptId] = useState<string | null>(null);
    const [submissionRank, setSubmissionRank] = useState<{ overallRank: number; subjectRank: number; totalContestants: number } | null>(null);

    // Load contestant profile from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('foursquare_contestant_profile');
            if (saved) {
                const p = JSON.parse(saved);
                if (p.name) {
                    setContestantName(p.name);
                    setChurchDistrict(p.district || 'Idimu Missionary District (Host)');
                    setCustomChurch(p.customChurch || '');
                    setAgeCategory(p.ageCategory || 'Children (Ages 6–12)');
                    setPhone(p.phone || '');
                }
            }
        } catch {}
    }, []);

    // Current subject info
    const currentSubjectObj = useMemo(() => {
        return PRACTICE_SUBJECTS.find(s => s.id === selectedSubject) || PRACTICE_SUBJECTS[0];
    }, [selectedSubject]);

    // Save contestant profile
    const handleSaveProfile = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!contestantName.trim()) {
            alert('Please enter your full name to participate in the competition.');
            return;
        }

        const profile = {
            name: contestantName.trim(),
            district: churchDistrict,
            customChurch: customChurch.trim(),
            ageCategory,
            phone: phone.trim()
        };

        try {
            localStorage.setItem('foursquare_contestant_profile', JSON.stringify(profile));
        } catch {}

        setShowRegModal(false);

        // If a subject start was pending, proceed to launch quiz
        if (pendingSubjectStart) {
            launchQuizSession(pendingSubjectStart);
            setPendingSubjectStart(null);
        }
    };

    // Trigger quiz launch
    const handleStartCompetition = (subjectId: 'current_affairs' | 'numbers' | 'standard' | 'combined') => {
        if (!contestantName.trim()) {
            setPendingSubjectStart(subjectId);
            setShowRegModal(true);
            return;
        }
        launchQuizSession(subjectId);
    };

    const launchQuizSession = (subjectId: 'current_affairs' | 'numbers' | 'standard' | 'combined') => {
        const random10 = getRandomPracticeSession(subjectId);
        setSelectedSubject(subjectId);
        setQuestions(random10);
        setCurrentIndex(0);
        setAnswers({});
        setSecondsLeft(180); // 3 minutes
        setIsTimeUp(false);
        setFilterReview('all');
        setSubmittedAttemptId(null);
        setSubmissionRank(null);
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
                    triggerSubmit(true);
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
            triggerSubmit(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
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
        const timeSpent = Math.max(1, 180 - secondsLeft);

        return { correct, total, percentage, answeredCount, timeSpent };
    }, [questions, answers, secondsLeft]);

    // Submit Quiz & Post to Leaderboard
    const triggerSubmit = async (timeExpired = false) => {
        setStage('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Calculate score
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct_index) correct++;
        });
        const total = questions.length || 10;
        const timeSpent = Math.max(1, 180 - (timeExpired ? 0 : secondsLeft));

        // Submit to Leaderboard API
        setIsSubmitting(true);
        try {
            const actualChurch = churchDistrict === 'Other / Visiting Church' && customChurch.trim() 
                ? customChurch.trim() 
                : churchDistrict;

            const res = await fetch('/api/competition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contestantName: contestantName.trim() || 'Anonymous Contestant',
                    churchDistrict: actualChurch,
                    ageCategory,
                    phone,
                    subjectId: selectedSubject,
                    subjectTitle: currentSubjectObj.title,
                    score: correct,
                    total,
                    timeSpentSeconds: timeSpent
                })
            });

            if (res.ok) {
                const data = await res.json();
                setSubmittedAttemptId(data.attempt?.id);
                setSubmissionRank({
                    overallRank: data.overallRank,
                    subjectRank: data.subjectRank,
                    totalContestants: data.totalContestants
                });
            }
        } catch (e) {
            console.error('Error submitting attempt to leaderboard:', e);
        } finally {
            setIsSubmitting(false);
        }
    };

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

    // If viewing the Leaderboard tab directly
    if (viewTab === 'leaderboard' && stage === 'select') {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 pt-20">
                <CompetitionLeaderboard
                    onBackToQuiz={() => setViewTab('competition')}
                    highlightAttemptId={submittedAttemptId || undefined}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
            {stage === 'result' && scoreData.percentage >= 80 && (
                <ConfettiBlast active={true} />
            )}

            {/* ══════════════════════════════════════════════════════
               STAGE 1: CLEAN SELECTION VIEW & CONTESTANT HUB
            ══════════════════════════════════════════════════════ */}
            {stage === 'select' && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24">
                    {/* Official Foursquare Branding Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl mb-6 relative overflow-hidden text-center md:text-left">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-200/30 via-purple-200/20 to-transparent rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-lg bg-white flex-shrink-0">
                                    <Image
                                        src="/foursquare-logo.png"
                                        alt="Foursquare Gospel Church Logo"
                                        fill
                                        sizes="(max-width: 768px) 80px, 96px"
                                        className="object-contain p-1"
                                        priority
                                    />
                                </div>
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Official Championship Portal
                                    </div>
                                    <h1 className="font-serif font-bold text-2xl sm:text-4xl text-slate-900 leading-tight">
                                        Foursquare Children Quiz Championship
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                                        Idimu Missionary District • National Children Ministry • Foursquare Gospel Church in Nigeria
                                    </p>
                                </div>
                            </div>

                            {/* View Switcher: Contest vs Leaderboard */}
                            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-xs">
                                <button
                                    type="button"
                                    onClick={() => setViewTab('competition')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        viewTab === 'competition'
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Trophy className="w-4 h-4 text-amber-400" /> Competition
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewTab('leaderboard')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                        viewTab === 'leaderboard'
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <Crown className="w-4 h-4 text-amber-400" /> Leaderboard
                                </button>
                            </div>
                        </div>

                        {/* Foursquare 4-Fold Gospel Meaning Banner */}
                        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-red-50 text-red-900 rounded-xl p-2 border border-red-200 font-bold flex items-center justify-center gap-1.5">
                                <span>✝️</span> <span>Jesus the Saviour</span>
                            </div>
                            <div className="bg-indigo-50 text-indigo-900 rounded-xl p-2 border border-indigo-200 font-bold flex items-center justify-center gap-1.5">
                                <span>🏆</span> <span>Jesus the Great Physician</span>
                            </div>
                            <div className="bg-amber-50 text-amber-900 rounded-xl p-2 border border-amber-200 font-bold flex items-center justify-center gap-1.5">
                                <span>🕊️</span> <span>Jesus the Spirit Baptizer</span>
                            </div>
                            <div className="bg-fuchsia-50 text-fuchsia-900 rounded-xl p-2 border border-fuchsia-200 font-bold flex items-center justify-center gap-1.5">
                                <span>👑</span> <span>Jesus the Soon-Coming King</span>
                            </div>
                        </div>
                    </div>

                    {/* Contestant Registration Status Card */}
                    <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-purple-500/10 rounded-2xl border-2 border-amber-300 p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3 text-center sm:text-left">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                {contestantName.trim() ? (
                                    <>
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                                                Active Contestant
                                            </span>
                                        </div>
                                        <h3 className="font-serif font-bold text-lg text-slate-900 mt-0.5">
                                            {contestantName}
                                        </h3>
                                        <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                                            <Church className="w-3.5 h-3.5 text-amber-600" />
                                            {churchDistrict === 'Other / Visiting Church' && customChurch ? customChurch : churchDistrict} • {ageCategory}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-serif font-bold text-lg text-slate-900">
                                            Contestant Registration Required
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Please enter your name and church district so your score will appear on the official Leaderboard!
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowRegModal(true)}
                            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-amber-400 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                        >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                            {contestantName.trim() ? 'Change Contestant' : 'Register Contestant Name'}
                        </button>
                    </div>

                    {/* Section Header */}
                    <div className="text-center mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Select Competition Track
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                            Official Quiz Categories
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
                            Each championship round tests you on <strong>10 randomized questions</strong> in <strong>3 minutes</strong>. Fast, accurate answers win top spots on the leaderboard!
                        </p>
                    </div>

                    {/* Subject Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                        {PRACTICE_SUBJECTS.map((subject) => {
                            return (
                                <div
                                    key={subject.id}
                                    className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between text-left relative overflow-hidden group"
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

                                        <h3 className="font-serif font-bold text-xl text-slate-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors">
                                            {subject.title}
                                        </h3>

                                        <p className="text-xs text-slate-500 leading-relaxed mb-6">
                                            {subject.description}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-5 flex items-center justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Contest Format</span>
                                            <span className="font-bold text-slate-800">{subject.sessionQuestions} Qs • {subject.timeMinutes} Mins</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleStartCompetition(subject.id)}
                                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                        >
                                            <Trophy className="w-4 h-4 text-amber-200" /> Start Competition
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* How Winner is Decided Box */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md text-xs text-slate-700 max-w-2xl mx-auto mb-6">
                        <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                            <Crown className="w-4 h-4 text-amber-600" /> How Winners are Determined
                        </div>
                        <p className="leading-relaxed text-slate-600">
                            1. <strong>Primary Factor: Highest Score</strong> (e.g. 10/10 beats 9/10).<br />
                            2. <strong>Tie-Breaker: Fastest Time</strong> (if two contestants score 10/10, the child who completed the test in 1m 15s ranks above someone who took 2m 30s).<br />
                            3. Every completed round immediately updates the official <strong>Hall of Champions Leaderboard</strong>.
                        </p>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               STAGE 2: RESPONSIVE 10-QUESTION COMPETITION RUNNER
            ══════════════════════════════════════════════════════ */}
            {stage === 'quiz' && currentQ && (
                <div className="w-full">
                    {/* Fixed Sticky Header */}
                    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
                            {/* Exit Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to exit? Your competition score will not be saved.')) {
                                        setStage('select');
                                    }
                                }}
                                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" /> Exit
                            </button>

                            {/* Contestant Pill */}
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-amber-300 flex-shrink-0 bg-white">
                                    <Image
                                        src="/foursquare-logo.png"
                                        alt="Foursquare"
                                        fill
                                        sizes="28px"
                                        className="object-contain p-0.5"
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-800 truncate hidden xs:inline">
                                    {contestantName}
                                </span>
                            </div>

                            {/* Question Counter */}
                            <span className="text-xs font-bold text-slate-600 font-mono">
                                {currentIndex + 1} / {questions.length}
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
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Main Question Container */}
                    <div className="max-w-3xl mx-auto px-4 pt-6 sm:pt-8">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md mb-5">
                            {/* Category / Scope Tag */}
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900">
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
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 cursor-pointer touch-manipulation select-none active:scale-98 ${
                                                isSelected
                                                    ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                                            }`}
                                        >
                                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                                                isSelected
                                                    ? 'bg-amber-500 text-white shadow-xs'
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
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Previous
                                </button>

                                {currentIndex === questions.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => triggerSubmit(false)}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                                    >
                                        Submit Competition <Check className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                                    >
                                        Next <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Question Jump Strip (1 to 10) */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                <span className="font-medium">Question Navigation</span>
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
                                                    ? 'bg-amber-500 text-white ring-2 ring-amber-300 shadow-xs'
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
               STAGE 3: RESULTS, OFFICIAL LEADERBOARD RANK & REVIEW
            ══════════════════════════════════════════════════════ */}
            {stage === 'result' && (
                <div className="max-w-3xl mx-auto px-4 pt-20 sm:pt-24">
                    {/* Time Up Alert Banner if applicable */}
                    {isTimeUp && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                            <span><strong>Time&apos;s up!</strong> The 3-minute competition timer reached zero. Your answers have been submitted.</span>
                        </div>
                    )}

                    {/* Official Certificate & Result Card */}
                    <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 sm:p-10 text-center shadow-xl mb-8 relative overflow-hidden">
                        {/* Foursquare Logo on Certificate */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-2xl overflow-hidden border border-amber-300 bg-white shadow-sm">
                            <Image
                                src="/foursquare-logo.png"
                                alt="Foursquare"
                                fill
                                sizes="80px"
                                className="object-contain p-1"
                            />
                        </div>

                        <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
                            Foursquare Idimu Children Quiz Competition
                        </span>

                        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-slate-900 mb-1">
                            {contestantName}
                        </h2>
                        <p className="text-xs text-slate-500 mb-4">
                            {churchDistrict === 'Other / Visiting Church' && customChurch ? customChurch : churchDistrict} • {currentSubjectObj.title}
                        </p>

                        {/* Leaderboard Standing Announcement Banner */}
                        {isSubmitting ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-bold text-amber-900 mb-6">
                                Submitting score to the Official Live Leaderboard...
                            </div>
                        ) : submissionRank ? (
                            <div className={`p-4 rounded-2xl border-2 mb-6 ${
                                submissionRank.overallRank === 1
                                    ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 border-amber-400 text-amber-950'
                                    : submissionRank.overallRank <= 3
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                    : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}>
                                <div className="flex items-center justify-center gap-2 font-black text-base sm:text-lg">
                                    {submissionRank.overallRank === 1 ? (
                                        <>👑 OVERALL CHAMPION: RANK #1 ON LEADERBOARD!</>
                                    ) : submissionRank.overallRank <= 3 ? (
                                        <>🥇 PODIUM FINISHER: RANK #{submissionRank.overallRank} OF {submissionRank.totalContestants} CONTESTANTS</>
                                    ) : (
                                        <>🏆 OFFICIAL LEADERBOARD RANK: #{submissionRank.overallRank} OF {submissionRank.totalContestants}</>
                                    )}
                                </div>
                                <p className="text-xs text-slate-600 mt-1">
                                    Track Standing: <strong>Rank #{submissionRank.subjectRank}</strong> in {currentSubjectObj.title}
                                </p>
                            </div>
                        ) : null}

                        {/* Score stats */}
                        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="text-2xl font-black font-serif text-slate-900">{scoreData.correct} / {questions.length}</div>
                                <div className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Score</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="text-2xl font-black font-serif text-amber-600">{scoreData.percentage}%</div>
                                <div className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Accuracy</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="text-2xl font-black font-serif text-slate-800">{formatTime(scoreData.timeSpent)}</div>
                                <div className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Time Taken</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setStage('select');
                                    setViewTab('leaderboard');
                                }}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <Crown className="w-4 h-4 text-amber-200" /> View Leaderboard & Winners
                            </button>

                            <button
                                type="button"
                                onClick={() => launchQuizSession(selectedSubject)}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Retake Track
                            </button>

                            <button
                                type="button"
                                onClick={() => setStage('select')}
                                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                            >
                                All Categories
                            </button>
                        </div>
                    </div>

                    {/* Question by Question Review */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif font-bold text-xl text-slate-900">
                                Detailed Answer Review
                            </h3>

                            {/* Filter: All vs Mistakes */}
                            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                                <button
                                    type="button"
                                    onClick={() => setFilterReview('all')}
                                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
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
                                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
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
                                                Question {idx + 1}
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

            {/* ══════════════════════════════════════════════════════
               CONTESTANT REGISTRATION MODAL
            ══════════════════════════════════════════════════════ */}
            {showRegModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
                        {/* Foursquare Logo Badge */}
                        <div className="relative w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden border border-amber-300 bg-white shadow-sm">
                            <Image
                                src="/foursquare-logo.png"
                                alt="Foursquare"
                                fill
                                sizes="64px"
                                className="object-contain p-1"
                            />
                        </div>

                        <h3 className="font-serif font-bold text-2xl text-slate-900 text-center mb-1">
                            Contestant Registration
                        </h3>
                        <p className="text-xs text-slate-500 text-center mb-6">
                            Enter your details to officially participate and record your results on the live Leaderboard!
                        </p>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Contestant Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={contestantName}
                                    onChange={(e) => setContestantName(e.target.value)}
                                    placeholder="e.g. Samuel Adebayo"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Church District / Branch *
                                </label>
                                <select
                                    value={churchDistrict}
                                    onChange={(e) => setChurchDistrict(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white cursor-pointer"
                                >
                                    {CHURCH_DISTRICT_PRESETS.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            {churchDistrict === 'Other / Visiting Church' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Specify Church / Branch Name
                                    </label>
                                    <input
                                        type="text"
                                        value={customChurch}
                                        onChange={(e) => setCustomChurch(e.target.value)}
                                        placeholder="e.g. Foursquare Ikorodu Axis"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Age Category
                                </label>
                                <select
                                    value={ageCategory}
                                    onChange={(e) => setAgeCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white cursor-pointer"
                                >
                                    <option value="Children (Ages 6–12)">Children (Ages 6–12)</option>
                                    <option value="Teens / Juniors (Ages 13–16)">Teens / Juniors (Ages 13–16)</option>
                                    <option value="General Youth & Adults">General Youth & Adults</option>
                                </select>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-3">
                                {contestantName.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => setShowRegModal(false)}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                                >
                                    Save & Confirm Registration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
