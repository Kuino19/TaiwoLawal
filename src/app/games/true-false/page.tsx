'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, RotateCcw, Trophy, Clock, Flame, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';

interface TrueFalseItem {
    id: number;
    statement: string;
    isTrue: boolean;
    explanation: string;
}

const STATEMENTS_POOL: TrueFalseItem[] = [
    {
        id: 1,
        statement: "Moses was permitted to cross over and enter the promised land of Canaan.",
        isTrue: false,
        explanation: "False! Moses viewed the promised land from Mount Nebo, but Joshua led the people in."
    },
    {
        id: 2,
        statement: "Jesus turned water into wine at a wedding feast in Cana of Galilee.",
        isTrue: true,
        explanation: "True! This was Jesus' very first miraculous sign recorded in John 2."
    },
    {
        id: 3,
        statement: "Samson's great strength was lost when his uncut hair was shaved off.",
        isTrue: true,
        explanation: "True! As a Nazarite dedicated to God, his uncut hair was the symbol of his vow."
    },
    {
        id: 4,
        statement: "David killed Goliath using King Saul's heavy bronze armor and giant sword.",
        isTrue: false,
        explanation: "False! David took off Saul's armor and defeated Goliath with a sling and stone in the name of the Lord!"
    },
    {
        id: 5,
        statement: "Foursquare Gospel Church was founded by Aimee Semple McPherson in 1923.",
        isTrue: true,
        explanation: "True! Founded in Los Angeles, California in 1923."
    },
    {
        id: 6,
        statement: "The Foursquare Church arrived in Nigeria in the year 1955.",
        isTrue: true,
        explanation: "True! Brought by missionaries Rev. Harold and Mrs. Faye Curtis."
    },
    {
        id: 7,
        statement: "Jonah was swallowed by a great fish because he immediately obeyed God's command to preach in Nineveh.",
        isTrue: false,
        explanation: "False! Jonah ran away toward Tarshish before God sent the storm and fish."
    },
    {
        id: 8,
        statement: "Daniel was unharmed in the lions' den because God sent an angel to shut the lions' mouths.",
        isTrue: true,
        explanation: "True! God delivered Daniel because he was found blameless and trusted in his God."
    },
    {
        id: 9,
        statement: "The Old Testament has 27 books and the New Testament has 39 books.",
        isTrue: false,
        explanation: "False! The Old Testament has 39 books and the New Testament has 27 books (66 total)."
    },
    {
        id: 10,
        statement: "Peter walked on water toward Jesus until he looked at the wind and began to sink.",
        isTrue: true,
        explanation: "True! Jesus immediately reached out His hand and caught him."
    },
    {
        id: 11,
        statement: "God sent 12 plagues on Egypt before Pharaoh let the Israelites go.",
        isTrue: false,
        explanation: "False! God sent exactly 10 plagues upon Egypt."
    },
    {
        id: 12,
        statement: "The shortest verse in the Holy Bible is 'Jesus wept.'",
        isTrue: true,
        explanation: "True! John 11:35 contains just two words: 'Jesus wept.'"
    },
    {
        id: 13,
        statement: "Queen Esther was afraid, but bravely risked her life to save the Jewish people.",
        isTrue: true,
        explanation: "True! She famously said: 'If I perish, I perish' and saved her nation."
    },
    {
        id: 14,
        statement: "The Foursquare main national camp in Nigeria is located at Ajebo in Ogun State.",
        isTrue: true,
        explanation: "True! Located along the Lagos-Ibadan Expressway near Ajebo."
    },
    {
        id: 15,
        statement: "Gideon defeated the huge Midianite army using 10,000 specially trained soldiers.",
        isTrue: false,
        explanation: "False! God reduced Gideon's army down to just 300 men so all glory went to God!"
    },
    {
        id: 16,
        statement: "Jesus fed 5,000 men with five loaves of bread and two small fish.",
        isTrue: true,
        explanation: "True! And twelve basketfuls of broken pieces were gathered afterward."
    },
    {
        id: 17,
        statement: "The 4-fold Gospel represents Jesus as Saviour, Baptizer with the Holy Spirit, Healer, and Soon-Coming King.",
        isTrue: true,
        explanation: "True! This is the foundational cornerstone of the Foursquare movement."
    },
    {
        id: 18,
        statement: "Paul was originally named Saul and persecuted the church before his Damascus road conversion.",
        isTrue: true,
        explanation: "True! A glorious light blinded him and Jesus called him into apostolic ministry."
    },
    {
        id: 19,
        statement: "Noah was on the Ark with animals for only 3 days and 3 nights.",
        isTrue: false,
        explanation: "False! It rained for 40 days, and Noah remained on the Ark for over a year until the ground dried!"
    },
    {
        id: 20,
        statement: "In 2025, Foursquare Gospel Church in Nigeria celebrated its Platinum Jubilee (70th Anniversary).",
        isTrue: true,
        explanation: "True! 70 fruitful years in Nigeria (1955–2025)."
    }
];

function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function TrueOrFalseGame() {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [questions, setQuestions] = useState<TrueFalseItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

    const ROUND_COUNT = 12;

    const startNewGame = () => {
        const shuffled = shuffle(STATEMENTS_POOL).slice(0, ROUND_COUNT);
        setQuestions(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setHighestStreak(0);
        setFeedback(null);
        setSelectedAnswer(null);
        setGameState('playing');
    };

    const currentQ = questions[currentIndex];

    const handleAnswer = (userChoice: boolean) => {
        if (feedback !== null) return;
        setSelectedAnswer(userChoice);

        const isCorrect = userChoice === currentQ.isTrue;
        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > highestStreak) setHighestStreak(newStreak);
            const streakBonus = newStreak >= 3 ? 5 : 0;
            setScore(prev => prev + 10 + streakBonus);
        } else {
            setStreak(0);
        }

        setTimeout(() => {
            setFeedback(null);
            setSelectedAnswer(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setGameState('end');
                triggerRealisticConfetti();
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            {/* Header */}
            <div className="bg-slate-800/80 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Games</span>
                    </Link>
                    <div className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        ⚡ TRUE OR FALSE
                    </div>
                    {gameState === 'playing' ? (
                        <div className="text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-full">
                            Score: {score} pts
                        </div>
                    ) : (
                        <div className="w-16" />
                    )}
                </div>
            </div>

            <div className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-6 bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <span className="text-5xl">⚡</span>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 mb-3">
                                    <Sparkles className="w-3.5 h-3.5" /> Rapid-Fire Judgment
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
                                    True or False?
                                </h1>
                                <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                                    Are these Bible and church statements fact or myth? Decide quickly and build massive score combos!
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs">
                                <div className="bg-slate-700/60 p-3 rounded-2xl border border-slate-600">
                                    <span className="text-emerald-400 font-bold text-base block">12 Statements</span>
                                    <span className="text-slate-400">Per Session</span>
                                </div>
                                <div className="bg-slate-700/60 p-3 rounded-2xl border border-slate-600">
                                    <span className="text-cyan-400 font-bold text-base block">+10 Pts</span>
                                    <span className="text-slate-400">Per Correct</span>
                                </div>
                            </div>

                            <button
                                onClick={startNewGame}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                            >
                                Start Blitz
                            </button>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === 'playing' && currentQ && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col space-y-4"
                        >
                            {/* HUD */}
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-400">
                                    Statement {currentIndex + 1} of {questions.length}
                                </span>
                                {streak >= 3 && (
                                    <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                                        <Flame className="w-3.5 h-3.5 fill-amber-400" /> {streak}x Streak!
                                    </span>
                                )}
                                <span className="text-emerald-400 font-bold">
                                    {score} Points
                                </span>
                            </div>

                            {/* Statement Card */}
                            <div className="bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden text-center">
                                {/* Feedback Banner */}
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-2xl text-xs sm:text-sm font-medium mb-5 text-left flex items-start gap-3 ${
                                            feedback === 'correct'
                                                ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-200'
                                                : 'bg-rose-600/30 border border-rose-500/50 text-rose-200'
                                        }`}
                                    >
                                        <span className="text-xl flex-shrink-0 mt-0.5">
                                            {feedback === 'correct' ? '✅' : '❌'}
                                        </span>
                                        <div>
                                            <strong className="block text-white text-sm">
                                                {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
                                            </strong>
                                            <p className="mt-1 leading-relaxed opacity-90">{currentQ.explanation}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Is this statement true or false?
                                </p>

                                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-relaxed mb-8">
                                    &ldquo;{currentQ.statement}&rdquo;
                                </h2>

                                {/* Large True / False Buttons */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        disabled={feedback !== null}
                                        onClick={() => handleAnswer(true)}
                                        className={`p-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                                            feedback !== null && currentQ.isTrue
                                                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50'
                                                : feedback !== null && selectedAnswer === true
                                                ? 'bg-rose-600 text-white'
                                                : 'bg-emerald-600/20 border-2 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                                        }`}
                                    >
                                        <Check className="w-6 h-6" /> TRUE
                                    </button>

                                    <button
                                        type="button"
                                        disabled={feedback !== null}
                                        onClick={() => handleAnswer(false)}
                                        className={`p-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                                            feedback !== null && !currentQ.isTrue
                                                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50'
                                                : feedback !== null && selectedAnswer === false
                                                ? 'bg-rose-600 text-white'
                                                : 'bg-rose-600/20 border-2 border-rose-500/50 text-rose-300 hover:bg-rose-600 hover:text-white'
                                        }`}
                                    >
                                        <X className="w-6 h-6" /> FALSE
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* END SCREEN */}
                    {gameState === 'end' && (
                        <motion.div
                            key="end"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Trophy className="w-10 h-10 text-slate-950" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-white mb-1">
                                    Blitz Completed!
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Awesome quick-thinking on Scripture truths!
                                </p>

                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 my-4">
                                    {score} <span className="text-2xl text-slate-400 font-medium">pts</span>
                                </div>

                                <div className="text-xs text-slate-400">
                                    Longest Streak: <strong className="text-amber-400">{highestStreak} in a row</strong>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                                <button
                                    onClick={startNewGame}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 px-7 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Play Again
                                </button>
                                <Link
                                    href="/games"
                                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                                >
                                    All Games
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
