'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
    Trophy, BookOpen, Zap, Clock, CheckCircle2, XCircle, RotateCcw,
    ArrowRight, ArrowLeft, Flame, Sparkles, Award, Volume2, VolumeX,
    Filter, Search, Layers, Compass, HelpCircle, Check, Eye, Shuffle
} from 'lucide-react';
import {
    PRACTICE_TRACKS, PracticeTrack, PracticeQuestion,
    getQuestionsByTrack, shuffleArray
} from '@/lib/practiceData';
import ConfettiBlast from '@/components/ConfettiBlast';

type PracticeMode = 'study' | 'test' | 'flashcards';
type QuestionLength = '10' | '25' | 'all';
type TimerOption = 'none' | '30' | '60';

export default function PracticeClient() {
    // Stage state: 'lobby' | 'active' | 'summary'
    const [stage, setStage] = useState<'lobby' | 'active' | 'summary'>('lobby');

    // Configuration
    const [selectedTrack, setSelectedTrack] = useState<string>('standard');
    const [selectedMode, setSelectedMode] = useState<PracticeMode>('study');
    const [questionCount, setQuestionCount] = useState<QuestionLength>('all');
    const [timerOption, setTimerOption] = useState<TimerOption>('none');
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

    // Active Quiz Session
    const [sessionQuestions, setSessionQuestions] = useState<PracticeQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [revealedInStudy, setRevealedInStudy] = useState<Record<number, boolean>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [currentStreak, setCurrentStreak] = useState<number>(0);
    const [maxStreak, setMaxStreak] = useState<number>(0);
    const [triggerConfetti, setTriggerConfetti] = useState<boolean>(false);

    // Flashcards / Study Browser
    const [flashcardSearch, setFlashcardSearch] = useState<string>('');
    const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Summary Review Filter
    const [summaryFilter, setSummaryFilter] = useState<'all' | 'incorrect'>('all');

    // Current track object
    const activeTrackObj = useMemo(() => {
        return PRACTICE_TRACKS.find(t => t.id === selectedTrack) || PRACTICE_TRACKS[0];
    }, [selectedTrack]);

    // Timer effect for test mode
    useEffect(() => {
        if (stage !== 'active' || selectedMode !== 'test' || timerOption === 'none' || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time up for question or quiz
                    handleNextQuestion();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [stage, selectedMode, timerOption, timeLeft]);

    // Sound effect trigger (web audio synthesis, no external assets needed!)
    const playSound = useCallback((type: 'correct' | 'wrong' | 'complete') => {
        if (!soundEnabled || typeof window === 'undefined') return;
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'correct') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
                osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } else if (type === 'wrong') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(250, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
                osc.start();
                osc.stop(ctx.currentTime + 0.25);
            } else if (type === 'complete') {
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, i) => {
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
                    g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
                    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i + 1) * 0.2);
                    o.start(ctx.currentTime + i * 0.1);
                    o.stop(ctx.currentTime + (i + 1) * 0.2);
                });
            }
        } catch {
            // Audio context not allowed or supported
        }
    }, [soundEnabled]);

    // Start practice session
    const startSession = () => {
        let pool = getQuestionsByTrack(selectedTrack);

        // Shuffle questions for practice
        pool = shuffleArray(pool);

        // Slice by question count
        if (questionCount === '10') {
            pool = pool.slice(0, 10);
        } else if (questionCount === '25') {
            pool = pool.slice(0, 25);
        }

        setSessionQuestions(pool);
        setCurrentIndex(0);
        setUserAnswers({});
        setRevealedInStudy({});
        setCurrentStreak(0);
        setMaxStreak(0);
        setTriggerConfetti(false);

        if (timerOption !== 'none') {
            setTimeLeft(parseInt(timerOption));
        }

        setStage('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle answer selection
    const handleSelectOption = (optionIndex: number) => {
        if (stage !== 'active' || sessionQuestions.length === 0) return;

        const currentQ = sessionQuestions[currentIndex];
        const isCorrect = optionIndex === currentQ.correct_index;

        // Record answer
        setUserAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));

        // Streak calculation
        if (isCorrect) {
            const nextStreak = currentStreak + 1;
            setCurrentStreak(nextStreak);
            if (nextStreak > maxStreak) setMaxStreak(nextStreak);
            playSound('correct');
        } else {
            setCurrentStreak(0);
            playSound('wrong');
        }

        // In study mode, immediately reveal answer card
        if (selectedMode === 'study') {
            setRevealedInStudy(prev => ({ ...prev, [currentIndex]: true }));
        } else {
            // In test mode, brief delay then advance
            setTimeout(() => {
                if (currentIndex < sessionQuestions.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                    if (timerOption !== 'none') {
                        setTimeLeft(parseInt(timerOption));
                    }
                } else {
                    finishSession();
                }
            }, 300);
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < sessionQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            if (timerOption !== 'none') {
                setTimeLeft(parseInt(timerOption));
            }
        } else {
            finishSession();
        }
    };

    const handlePrevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const finishSession = () => {
        setStage('summary');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Calculate score
        let score = 0;
        sessionQuestions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correct_index) score++;
        });

        const pct = sessionQuestions.length > 0 ? (score / sessionQuestions.length) * 100 : 0;
        if (pct >= 80) {
            setTriggerConfetti(true);
            playSound('complete');
        }
    };

    // Calculate score
    const scoreSummary = useMemo(() => {
        let correctCount = 0;
        sessionQuestions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correct_index) correctCount++;
        });
        const total = sessionQuestions.length;
        const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        return { correctCount, total, percentage };
    }, [sessionQuestions, userAnswers]);

    // Keyboard support
    useEffect(() => {
        if (stage !== 'active' || selectedMode === 'flashcards') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            const key = e.key.toLowerCase();
            const optionMap: Record<string, number> = { 'a': 0, '1': 0, 'b': 1, '2': 1, 'c': 2, '3': 2, 'd': 3, '4': 3 };

            if (key in optionMap) {
                const optIdx = optionMap[key];
                const currentQ = sessionQuestions[currentIndex];
                if (currentQ && optIdx < currentQ.options.length) {
                    if (selectedMode === 'study' && revealedInStudy[currentIndex]) return;
                    handleSelectOption(optIdx);
                }
            } else if (key === 'arrowright' || key === 'enter' || key === ' ') {
                if (selectedMode === 'study' && revealedInStudy[currentIndex]) {
                    e.preventDefault();
                    handleNextQuestion();
                }
            } else if (key === 'arrowleft') {
                e.preventDefault();
                handlePrevQuestion();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [stage, currentIndex, sessionQuestions, revealedInStudy, selectedMode]);

    // Current question in active quiz
    const currentQ = sessionQuestions[currentIndex];

    // Filtered flashcard list
    const allTrackQuestions = useMemo(() => {
        return getQuestionsByTrack(selectedTrack);
    }, [selectedTrack]);

    const categoriesInTrack = useMemo(() => {
        const cats = new Set<string>();
        allTrackQuestions.forEach(q => {
            if (q.category) cats.add(q.category);
        });
        return Array.from(cats);
    }, [allTrackQuestions]);

    const filteredFlashcards = useMemo(() => {
        return allTrackQuestions.filter(q => {
            const matchesSearch =
                flashcardSearch === '' ||
                q.text.toLowerCase().includes(flashcardSearch.toLowerCase()) ||
                (q.full_answer && q.full_answer.toLowerCase().includes(flashcardSearch.toLowerCase())) ||
                (q.scripture && q.scripture.toLowerCase().includes(flashcardSearch.toLowerCase()));

            const matchesCategory =
                filterCategory === 'all' || q.category === filterCategory;

            return matchesSearch && matchesCategory;
        });
    }, [allTrackQuestions, flashcardSearch, filterCategory]);

    const toggleCardFlip = (id: string) => {
        setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // OPTION LABELS
    const OPTION_LABELS = ['A', 'B', 'C', 'D'];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
            <ConfettiBlast active={triggerConfetti} />

            {/* ── Top Floating Navigation Bar ── */}
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/quiz" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Competitions
                        </Link>
                        <span className="text-slate-700">/</span>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Sparkles className="w-3 h-3" /> Foursquare Idimu
                            </span>
                            <span className="font-serif font-bold text-slate-100 hidden sm:inline">Practice Stage</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sound Toggle */}
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700 transition-all"
                            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
                        >
                            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>

                        {stage !== 'lobby' && (
                            <button
                                onClick={() => setStage('lobby')}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                            >
                                <RotateCcw className="w-3.5 h-3.5" /> Back to Setup
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               STAGE 1: SETUP & TRACK SELECTION LOBBY
            ══════════════════════════════════════════════════════ */}
            {stage === 'lobby' && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Hero Banner */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 p-8 sm:p-12 border border-slate-800 shadow-2xl mb-12">
                        {/* Background light glow */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

                        <div className="relative z-10 max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-bold tracking-widest uppercase bg-amber-400/10 text-amber-400 border border-amber-400/30">
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                Official Children's Ministry Competition Prep
                            </div>

                            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white mb-4 leading-tight">
                                Foursquare Idimu Children Quiz{' '}
                                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                    Practice Stage
                                </span>
                            </h1>

                            <p className="text-slate-300 font-sans text-base sm:text-lg mb-8 leading-relaxed">
                                Get competition-ready! Practice with comprehensive questions covering the{' '}
                                <strong className="text-amber-400 font-semibold">Book of Numbers (Chapters 1–36)</strong> and the official{' '}
                                <strong className="text-purple-300 font-semibold">Standard of Attainment</strong> catechism & scriptures.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-2xl font-black text-amber-400 font-serif">145+</div>
                                    <div className="text-xs text-slate-400">Total Questions</div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-2xl font-black text-purple-400 font-serif">45</div>
                                    <div className="text-xs text-slate-400">Standard of Attainment</div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-2xl font-black text-blue-400 font-serif">100</div>
                                    <div className="text-xs text-slate-400">Book of Numbers</div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-2xl font-black text-emerald-400 font-serif">100%</div>
                                    <div className="text-xs text-slate-400">Instant Explanations</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Select Track */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="font-serif font-bold text-2xl text-white flex items-center gap-2.5">
                                    <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center font-sans">1</span>
                                    Choose Your Practice Track
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">Select the syllabus topic you want to master.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {PRACTICE_TRACKS.map((track) => {
                                const isSelected = selectedTrack === track.id;
                                return (
                                    <div
                                        key={track.id}
                                        onClick={() => setSelectedTrack(track.id)}
                                        className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 border text-left ${
                                            isSelected
                                                ? 'bg-slate-800/90 border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                                                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                                            }`}>
                                                {track.badge}
                                            </span>
                                            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                                                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> {track.questionCount} Qs
                                            </span>
                                        </div>

                                        <h3 className="font-serif font-bold text-xl text-white mb-2 leading-snug">
                                            {track.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                                            {track.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-medium">
                                            <span className="text-amber-400/90 font-mono text-[11px]">{track.chaptersOrScope}</span>
                                            <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                                                {isSelected ? 'Selected ✓' : 'Select →'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Choose Mode & Options */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Mode selection */}
                        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6">
                            <h2 className="font-serif font-bold text-xl text-white flex items-center gap-2 mb-4">
                                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center font-sans">2</span>
                                Select Learning Mode
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div
                                    onClick={() => setSelectedMode('study')}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedMode === 'study'
                                            ? 'bg-amber-500/10 border-amber-500 text-white ring-1 ring-amber-500'
                                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-serif font-bold text-white text-base mb-1">Study Mode</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Instant feedback! See correct answer & scripture reference immediately after picking.
                                    </p>
                                </div>

                                <div
                                    onClick={() => setSelectedMode('test')}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedMode === 'test'
                                            ? 'bg-purple-500/10 border-purple-500 text-white ring-1 ring-purple-500'
                                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-serif font-bold text-white text-base mb-1">Test Simulator</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Real exam simulation! Answers revealed at the end with detailed breakdown & score ring.
                                    </p>
                                </div>

                                <div
                                    onClick={() => setSelectedMode('flashcards')}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedMode === 'flashcards'
                                            ? 'bg-blue-500/10 border-blue-500 text-white ring-1 ring-blue-500'
                                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-serif font-bold text-white text-base mb-1">Study Cards</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Read and flip catechism cards with scriptures at your own pace before taking the quiz.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Session parameters */}
                        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="font-serif font-bold text-xl text-white flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center font-sans">3</span>
                                    Settings
                                </h2>

                                {/* Question length */}
                                <div className="mb-4">
                                    <label className="text-xs text-slate-400 block mb-2 font-medium">Question Count</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { val: '10', label: '10 Qs' },
                                            { val: '25', label: '25 Qs' },
                                            { val: 'all', label: 'Full Set' },
                                        ].map(item => (
                                            <button
                                                key={item.val}
                                                type="button"
                                                onClick={() => setQuestionCount(item.val as QuestionLength)}
                                                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                                                    questionCount === item.val
                                                        ? 'bg-amber-500 text-slate-950'
                                                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Timer option */}
                                {selectedMode === 'test' && (
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-2 font-medium">Timer per Question</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { val: 'none', label: 'No Limit' },
                                                { val: '30', label: '30 Sec' },
                                                { val: '60', label: '60 Sec' },
                                            ].map(item => (
                                                <button
                                                    key={item.val}
                                                    type="button"
                                                    onClick={() => setTimerOption(item.val as TimerOption)}
                                                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                                                        timerOption === item.val
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Launch button */}
                            <button
                                onClick={startSession}
                                className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-sans font-black text-sm tracking-wide uppercase shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                            >
                                {selectedMode === 'flashcards' ? (
                                    <>Browse Flashcards ({activeTrackObj.shortTitle}) <ArrowRight className="w-4 h-4" /></>
                                ) : (
                                    <>Start Practice Now ({activeTrackObj.shortTitle}) <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               STAGE 2: FLASHCARDS / STUDY BROWSER MODE
            ══════════════════════════════════════════════════════ */}
            {stage === 'active' && selectedMode === 'flashcards' && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Study & Memorize</span>
                            <h2 className="font-serif font-bold text-3xl text-white">{activeTrackObj.title}</h2>
                            <p className="text-xs text-slate-400 mt-1">Click any card to flip and view the answer and Scripture reference.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative min-w-[260px]">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search questions, scripture..."
                                value={flashcardSearch}
                                onChange={(e) => setFlashcardSearch(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    {categoriesInTrack.length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
                            <button
                                onClick={() => setFilterCategory('all')}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                    filterCategory === 'all'
                                        ? 'bg-amber-500 text-slate-950 font-bold'
                                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                                }`}
                            >
                                All ({allTrackQuestions.length})
                            </button>
                            {categoriesInTrack.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                                        filterCategory === cat
                                            ? 'bg-amber-500 text-slate-950 font-bold'
                                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filteredFlashcards.map((card, idx) => {
                            const isFlipped = !!flippedCards[card.id];
                            return (
                                <div
                                    key={card.id}
                                    onClick={() => toggleCardFlip(card.id)}
                                    className="group rounded-2xl bg-slate-900/90 border border-slate-800 p-6 hover:border-amber-500/50 transition-all cursor-pointer shadow-lg flex flex-col justify-between min-h-[220px]"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                                                Q{idx + 1} • {card.category || card.trackLabel}
                                            </span>
                                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:text-amber-400 transition-colors">
                                                {isFlipped ? 'Hide Answer' : 'Tap to Flip'}
                                            </span>
                                        </div>

                                        <p className="font-serif font-bold text-lg text-white mb-4 leading-snug">
                                            {card.text}
                                        </p>
                                    </div>

                                    {isFlipped ? (
                                        <div className="pt-3 border-t border-slate-800/80 bg-slate-950/60 -mx-6 -mb-6 p-5 rounded-b-2xl border-t border-amber-500/20">
                                            <div className="text-xs text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Official Answer:
                                            </div>
                                            <p className="text-sm text-slate-200 leading-relaxed font-sans mb-2">
                                                {card.full_answer || card.options[card.correct_index]}
                                            </p>
                                            {card.scripture && (
                                                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                                                    📖 {card.scripture}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-2">
                                            <Eye className="w-3.5 h-3.5" /> Tap to reveal answer & scripture reference
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {filteredFlashcards.length === 0 && (
                        <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
                            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400 text-sm">No cards match your search.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               STAGE 2: ACTIVE QUIZ (STUDY OR TEST MODE)
            ══════════════════════════════════════════════════════ */}
            {stage === 'active' && selectedMode !== 'flashcards' && currentQ && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                    {/* Progress Bar & Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                            <span className="font-mono font-bold text-amber-400">
                                Question {currentIndex + 1} of {sessionQuestions.length}
                            </span>
                            <div className="flex items-center gap-4">
                                {currentStreak > 1 && (
                                    <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {currentStreak} Streak!
                                    </span>
                                )}
                                {timerOption !== 'none' && selectedMode === 'test' && (
                                    <span className={`flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded ${
                                        timeLeft <= 5 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-800 text-slate-300'
                                    }`}>
                                        <Clock className="w-3.5 h-3.5" /> {timeLeft}s
                                    </span>
                                )}
                                <span className="uppercase text-[10px] tracking-widest px-2 py-0.5 rounded bg-slate-800 font-bold text-slate-300">
                                    {selectedMode === 'study' ? 'Study Mode' : 'Test Mode'}
                                </span>
                            </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 rounded-full"
                                style={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-6">
                        {/* Top Category Badge */}
                        <div className="flex items-center justify-between gap-3 mb-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <BookOpen className="w-3 h-3" />
                                {currentQ.category || currentQ.trackLabel}
                            </span>
                            {currentQ.scripture && (
                                <span className="text-xs font-mono text-slate-500">
                                    Ref: {currentQ.scripture}
                                </span>
                            )}
                        </div>

                        {/* Question Text */}
                        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-8 leading-snug">
                            {currentQ.text}
                        </h2>

                        {/* Multiple Choice Options */}
                        <div className="space-y-3.5 mb-8">
                            {currentQ.options.map((option, optIdx) => {
                                const isUserChoice = userAnswers[currentIndex] === optIdx;
                                const isCorrectChoice = optIdx === currentQ.correct_index;
                                const isRevealed = selectedMode === 'study' && revealedInStudy[currentIndex];

                                let btnStyles = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-800/40';
                                let indicatorStyles = 'bg-slate-800 border-slate-700 text-slate-400';

                                if (isRevealed) {
                                    if (isCorrectChoice) {
                                        btnStyles = 'bg-emerald-500/15 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/40';
                                        indicatorStyles = 'bg-emerald-500 text-slate-950 border-emerald-400 font-black';
                                    } else if (isUserChoice && !isCorrectChoice) {
                                        btnStyles = 'bg-rose-500/15 border-rose-500 text-rose-200 ring-1 ring-rose-500/40';
                                        indicatorStyles = 'bg-rose-500 text-white border-rose-400 font-black';
                                    }
                                } else if (isUserChoice) {
                                    btnStyles = 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40';
                                    indicatorStyles = 'bg-amber-500 text-slate-950 border-amber-400 font-black';
                                }

                                return (
                                    <button
                                        key={optIdx}
                                        type="button"
                                        disabled={isRevealed}
                                        onClick={() => handleSelectOption(optIdx)}
                                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center gap-4 ${btnStyles}`}
                                    >
                                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 border transition-all ${indicatorStyles}`}>
                                            {OPTION_LABELS[optIdx]}
                                        </span>
                                        <span className="flex-1 font-sans text-sm sm:text-base leading-relaxed">
                                            {option}
                                        </span>
                                        {isRevealed && isCorrectChoice && (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        )}
                                        {isRevealed && isUserChoice && !isCorrectChoice && (
                                            <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Study Mode: Instant Explanation Card */}
                        {selectedMode === 'study' && revealedInStudy[currentIndex] && (
                            <div className="rounded-2xl p-5 bg-slate-950 border border-amber-500/30 mb-4 animate-in fade-in duration-300">
                                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                                    <Sparkles className="w-4 h-4" /> Official Catechism & Scripture Answer
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed font-sans mb-3">
                                    {currentQ.full_answer || currentQ.options[currentQ.correct_index]}
                                </p>
                                {currentQ.scripture && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        📖 Scripture: {currentQ.scripture}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={handlePrevQuestion}
                                disabled={currentIndex === 0}
                                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" /> Previous
                            </button>

                            <button
                                type="button"
                                onClick={handleNextQuestion}
                                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black tracking-wide uppercase flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                            >
                                {currentIndex === sessionQuestions.length - 1 ? 'Finish & View Score' : 'Next Question'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Keyboard Shortcut Hint */}
                    <p className="text-center text-xs text-slate-500 font-mono">
                        Keys: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">A</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">D</kbd> to answer • <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">→</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">Enter</kbd> for next
                    </p>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               STAGE 3: RESULTS & SCORE SUMMARY
            ══════════════════════════════════════════════════════ */}
            {stage === 'summary' && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                    {/* Score Card Header */}
                    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950 border border-slate-800 p-8 sm:p-12 text-center shadow-2xl mb-10 relative overflow-hidden">
                        <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            {scoreSummary.percentage >= 80 ? (
                                <Trophy className="w-10 h-10 text-amber-400" />
                            ) : scoreSummary.percentage >= 50 ? (
                                <Award className="w-10 h-10 text-purple-400" />
                            ) : (
                                <BookOpen className="w-10 h-10 text-blue-400" />
                            )}
                        </div>

                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 mb-2 block">
                            {activeTrackObj.title}
                        </span>

                        <h2 className="font-serif font-bold text-4xl sm:text-5xl text-white mb-3">
                            {scoreSummary.percentage >= 90
                                ? 'Outstanding! Competition Ready!'
                                : scoreSummary.percentage >= 70
                                ? 'Great Performance!'
                                : scoreSummary.percentage >= 50
                                ? 'Good Effort! Keep Practicing!'
                                : 'Study More & Try Again!'}
                        </h2>

                        <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
                            {scoreSummary.percentage >= 70
                                ? 'You have shown strong command of the questions and scriptures. Review any mistakes below!'
                                : 'Consistent practice makes champions. Review the correct catechism answers and retry!'}
                        </p>

                        {/* Big stats row */}
                        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
                            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                <div className="text-3xl font-black font-serif text-white">{scoreSummary.correctCount} / {scoreSummary.total}</div>
                                <div className="text-[11px] text-slate-400 uppercase font-bold mt-1">Score</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                <div className="text-3xl font-black font-serif text-amber-400">{scoreSummary.percentage}%</div>
                                <div className="text-[11px] text-slate-400 uppercase font-bold mt-1">Accuracy</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                                <div className="text-3xl font-black font-serif text-purple-400">{maxStreak}</div>
                                <div className="text-[11px] text-slate-400 uppercase font-bold mt-1">Best Streak</div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                                onClick={startSession}
                                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                            >
                                <RotateCcw className="w-4 h-4" /> Retake This Track
                            </button>

                            <button
                                onClick={() => setStage('lobby')}
                                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700"
                            >
                                Choose Another Track
                            </button>

                            <Link
                                href="/quiz"
                                className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold text-xs transition-all border border-slate-800"
                            >
                                View Live Competitions →
                            </Link>
                        </div>
                    </div>

                    {/* Detailed Review Section */}
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-serif font-bold text-2xl text-white">Question Review</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Study all correct answers and scripture citations.</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSummaryFilter('all')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        summaryFilter === 'all'
                                            ? 'bg-amber-500 text-slate-950'
                                            : 'bg-slate-900 border border-slate-800 text-slate-400'
                                    }`}
                                >
                                    All ({sessionQuestions.length})
                                </button>
                                <button
                                    onClick={() => setSummaryFilter('incorrect')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        summaryFilter === 'incorrect'
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-slate-900 border border-slate-800 text-slate-400'
                                    }`}
                                >
                                    Mistakes ({sessionQuestions.length - scoreSummary.correctCount})
                                </button>
                            </div>
                        </div>

                        {/* List of reviewed questions */}
                        <div className="space-y-4">
                            {sessionQuestions.map((q, idx) => {
                                const userChoice = userAnswers[idx];
                                const isCorrect = userChoice === q.correct_index;

                                if (summaryFilter === 'incorrect' && isCorrect) return null;

                                return (
                                    <div
                                        key={q.id}
                                        className={`rounded-2xl p-6 border transition-all ${
                                            isCorrect
                                                ? 'bg-slate-900/60 border-slate-800'
                                                : 'bg-slate-900/90 border-rose-900/40 ring-1 ring-rose-500/20'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <span className="text-xs font-mono font-bold text-slate-500">
                                                Question {idx + 1}
                                            </span>
                                            {isCorrect ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                                                    <XCircle className="w-3.5 h-3.5" /> Needs Review
                                                </span>
                                            )}
                                        </div>

                                        <p className="font-serif font-bold text-lg text-white mb-4 leading-snug">
                                            {q.text}
                                        </p>

                                        {/* Choices breakdown */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                            {q.options.map((opt, optIdx) => {
                                                const isUser = userChoice === optIdx;
                                                const isActual = optIdx === q.correct_index;

                                                let style = 'bg-slate-950/40 border-slate-800/80 text-slate-400';
                                                if (isActual) {
                                                    style = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold';
                                                } else if (isUser && !isActual) {
                                                    style = 'bg-rose-500/10 border-rose-500/50 text-rose-300 line-through';
                                                }

                                                return (
                                                    <div key={optIdx} className={`px-3 py-2 rounded-xl border text-xs flex items-center gap-2 ${style}`}>
                                                        <span className="font-mono font-bold text-[10px] w-5 h-5 rounded bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                            {OPTION_LABELS[optIdx]}
                                                        </span>
                                                        <span className="flex-1 truncate">{opt}</span>
                                                        {isActual && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation Note & Scripture */}
                                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                                            <div className="font-bold text-amber-400 mb-1">Textbook Reference & Scripture:</div>
                                            <p className="text-slate-300 font-sans mb-1.5 leading-relaxed">
                                                {q.full_answer || q.options[q.correct_index]}
                                            </p>
                                            {q.scripture && (
                                                <span className="inline-block text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                                    📖 {q.scripture}
                                                </span>
                                            )}
                                        </div>
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
