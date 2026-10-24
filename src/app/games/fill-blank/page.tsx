'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight, Sparkles, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';

interface BlankQuestion {
    id: number;
    sentenceBefore: string;
    blankWord: string;
    sentenceAfter: string;
    reference: string;
    options: string[];
    explanation?: string;
}

const MASSIVE_BLANK_QUESTIONS: BlankQuestion[] = [
    {
        id: 1,
        sentenceBefore: "In the beginning God created the",
        blankWord: "heavens",
        sentenceAfter: "and the earth.",
        reference: "Genesis 1:1",
        options: ["heavens", "oceans", "angels", "stars"],
        explanation: "Genesis 1:1 records the foundational act of God speaking the universe into existence!"
    },
    {
        id: 2,
        sentenceBefore: "The LORD is my",
        blankWord: "shepherd",
        sentenceAfter: "; I lack nothing.",
        reference: "Psalm 23:1",
        options: ["shepherd", "shield", "tower", "rock"],
        explanation: "King David reflected on his own shepherd days and saw how tenderly the Lord cares for His people."
    },
    {
        id: 3,
        sentenceBefore: "For God so loved the",
        blankWord: "world",
        sentenceAfter: "that He gave His one and only Son.",
        reference: "John 3:16",
        options: ["world", "church", "righteous", "nations"],
        explanation: "God's love is universal and unconditional — offered freely to all of humanity!"
    },
    {
        id: 4,
        sentenceBefore: "I can do all things through Christ who",
        blankWord: "strengthens",
        sentenceAfter: "me.",
        reference: "Philippians 4:13",
        options: ["strengthens", "comforts", "chooses", "watches"],
        explanation: "Apostle Paul discovered supernatural resilience in whatever circumstance he faced."
    },
    {
        id: 5,
        sentenceBefore: "Your word is a lamp for my feet, a",
        blankWord: "light",
        sentenceAfter: "on my path.",
        reference: "Psalm 119:105",
        options: ["light", "shield", "guide", "fire"],
        explanation: "God's Word illuminates each step of our daily walk in this dark world."
    },
    {
        id: 6,
        sentenceBefore: "Jesus answered, 'I am the way and the",
        blankWord: "truth",
        sentenceAfter: "and the life.'",
        reference: "John 14:6",
        options: ["truth", "light", "door", "rock"],
        explanation: "No one comes to the Father except through Jesus Christ our Lord!"
    },
    {
        id: 7,
        sentenceBefore: "Be strong and courageous. Do not be",
        blankWord: "afraid",
        sentenceAfter: "; do not be discouraged.",
        reference: "Joshua 1:9",
        options: ["afraid", "silent", "weary", "troubled"],
        explanation: "God gave this comforting promise to Joshua as he took leadership over Israel."
    },
    {
        id: 8,
        sentenceBefore: "Trust in the LORD with all your heart and lean not on your own",
        blankWord: "understanding",
        sentenceAfter: ".",
        reference: "Proverbs 3:5",
        options: ["understanding", "strength", "wealth", "knowledge"],
        explanation: "Human logic is limited, but God's wisdom is infinite and flawless."
    },
    {
        id: 9,
        sentenceBefore: "Jesus wept at the tomb of His dear friend",
        blankWord: "Lazarus",
        sentenceAfter: ".",
        reference: "John 11:35",
        options: ["Lazarus", "John", "Peter", "Zacchaeus"],
        explanation: "Showing His deep love and compassion before miraculously calling Lazarus out of the grave!"
    },
    {
        id: 10,
        sentenceBefore: "Foursquare confesses Jesus as Saviour, Baptizer with the Holy Spirit,",
        blankWord: "Healer",
        sentenceAfter: ", and Soon-Coming King.",
        reference: "Foursquare Fourfold Gospel",
        options: ["Healer", "Teacher", "Provider", "Shepherd"],
        explanation: "This is the core 4-fold doctrine founded upon Hebrews 13:8!"
    },
    {
        id: 11,
        sentenceBefore: "Rev. Harold and Mrs. Faye Curtis brought the Foursquare Gospel to Nigeria in the year",
        blankWord: "1955",
        sentenceAfter: ".",
        reference: "Foursquare History",
        options: ["1955", "1923", "1960", "1970"],
        explanation: "The historic revival began right at Yankee Bar in Yaba, Lagos in 1955."
    },
    {
        id: 12,
        sentenceBefore: "The primary national camp ground of Foursquare Nigeria is located at",
        blankWord: "Ajebo",
        sentenceAfter: "in Ogun State.",
        reference: "Church Locations",
        options: ["Ajebo", "Mowe", "Iba", "Redemption"],
        explanation: "Situated along the Lagos-Ibadan Expressway near Ajebo."
    },
    {
        id: 13,
        sentenceBefore: "The fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness,",
        blankWord: "faithfulness",
        sentenceAfter: ", gentleness and self-control.",
        reference: "Galatians 5:22-23",
        options: ["faithfulness", "holiness", "wisdom", "patience"],
        explanation: "These virtues are cultivated naturally as we abide in the Holy Spirit!"
    },
    {
        id: 14,
        sentenceBefore: "Those who hope in the LORD will renew their strength. They will soar on wings like",
        blankWord: "eagles",
        sentenceAfter: ".",
        reference: "Isaiah 40:31",
        options: ["eagles", "doves", "falcons", "hawks"],
        explanation: "They will run and not grow weary, they will walk and not faint!"
    },
    {
        id: 15,
        sentenceBefore: "Be joyful in hope, patient in affliction, faithful in",
        blankWord: "prayer",
        sentenceAfter: ".",
        reference: "Romans 12:12",
        options: ["prayer", "giving", "worship", "fasting"],
        explanation: "A practical tripartite instruction for every Christian believer."
    },
    {
        id: 16,
        sentenceBefore: "You are the",
        blankWord: "light",
        sentenceAfter: "of the world. A town built on a hill cannot be hidden.",
        reference: "Matthew 5:14",
        options: ["light", "salt", "joy", "hope"],
        explanation: "Jesus called His disciples to let their good deeds shine before everyone!"
    },
    {
        id: 17,
        sentenceBefore: "If God is for us, who can be",
        blankWord: "against",
        sentenceAfter: "us?",
        reference: "Romans 8:31",
        options: ["against", "beside", "above", "behind"],
        explanation: "Nothing can conquer a child of God when the Almighty stands with them!"
    },
    {
        id: 18,
        sentenceBefore: "We love because He",
        blankWord: "first",
        sentenceAfter: "loved us.",
        reference: "1 John 4:19",
        options: ["first", "always", "truly", "freely"],
        explanation: "Our love for God and others is an overflow of God's prior love for us."
    },
    {
        id: 19,
        sentenceBefore: "The name of the LORD is a fortified",
        blankWord: "tower",
        sentenceAfter: "; the righteous run to it and are safe.",
        reference: "Proverbs 18:10",
        options: ["tower", "shield", "temple", "mountain"],
        explanation: "God's holy name is an impenetrable refuge in times of trouble."
    },
    {
        id: 20,
        sentenceBefore: "Seek first His kingdom and His",
        blankWord: "righteousness",
        sentenceAfter: ", and all these things will be given to you as well.",
        reference: "Matthew 6:33",
        options: ["righteousness", "holiness", "peace", "grace"],
        explanation: "Put God's priorities first, and He will provide for every earthly need."
    },
    {
        id: 21,
        sentenceBefore: "Cast all your",
        blankWord: "anxiety",
        sentenceAfter: "on Him because He cares for you.",
        reference: "1 Peter 5:7",
        options: ["anxiety", "money", "sins", "fears"],
        explanation: "Do not carry worries alone; cast them upon our compassionate Father!"
    },
    {
        id: 22,
        sentenceBefore: "Faith is confidence in what we",
        blankWord: "hope",
        sentenceAfter: "for and assurance about what we do not see.",
        reference: "Hebrews 11:1",
        options: ["hope", "pray", "ask", "work"],
        explanation: "Faith turns spiritual promises into present reality."
    },
    {
        id: 23,
        sentenceBefore: "Jesus Christ is the same yesterday and today and",
        blankWord: "forever",
        sentenceAfter: ".",
        reference: "Hebrews 13:8",
        options: ["forever", "always", "in all things", "to the end"],
        explanation: "The cornerstone scripture of the Foursquare Gospel movement!"
    },
    {
        id: 24,
        sentenceBefore: "Be completely humble and gentle; be patient, bearing with one another in",
        blankWord: "love",
        sentenceAfter: ".",
        reference: "Ephesians 4:2",
        options: ["love", "peace", "joy", "truth"],
        explanation: "Paul urges believers to live worthy of the calling they have received."
    },
    {
        id: 25,
        sentenceBefore: "Foursquare Gospel Church was founded in 1923 by Aimee Semple",
        blankWord: "McPherson",
        sentenceAfter: "in Los Angeles.",
        reference: "Foursquare History",
        options: ["McPherson", "Curtis", "Moody", "Spurgeon"],
        explanation: "Sister Aimee conducted revivals and opened the historic Angelus Temple."
    },
    {
        id: 26,
        sentenceBefore: "In 2025, Foursquare Nigeria celebrated its",
        blankWord: "Platinum",
        sentenceAfter: "Jubilee mark of 70 years of fruitful ministry.",
        reference: "Foursquare Milestones",
        options: ["Platinum", "Golden", "Diamond", "Silver"],
        explanation: "Celebrating 70 years from 1955 to 2025 across Nigeria!"
    },
    {
        id: 27,
        sentenceBefore: "The thief comes only to steal and kill and destroy; I have come that they may have",
        blankWord: "life",
        sentenceAfter: ", and have it to the full.",
        reference: "John 10:10",
        options: ["life", "joy", "peace", "wealth"],
        explanation: "Jesus came to give us abundant, eternal life!"
    },
    {
        id: 28,
        sentenceBefore: "God is our refuge and",
        blankWord: "strength",
        sentenceAfter: ", an ever-present help in trouble.",
        reference: "Psalm 46:1",
        options: ["strength", "rock", "tower", "healer"],
        explanation: "Therefore we will not fear, though the earth give way."
    },
    {
        id: 29,
        sentenceBefore: "Rejoice in the Lord",
        blankWord: "always",
        sentenceAfter: ". I will say it again: Rejoice!",
        reference: "Philippians 4:4",
        options: ["always", "daily", "greatly", "forever"],
        explanation: "True joy is rooted in Christ, not temporary circumstances."
    },
    {
        id: 30,
        sentenceBefore: "For where two or three gather in my name, there am I with",
        blankWord: "them",
        sentenceAfter: ".",
        reference: "Matthew 18:20",
        options: ["them", "you", "the church", "believers"],
        explanation: "Jesus promises His living presence whenever believers assemble in His name!"
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

export default function FillInTheBlankGame() {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [roundCount, setRoundCount] = useState<10 | 20>(10);
    const [questions, setQuestions] = useState<BlankQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const startNewGame = (count = roundCount) => {
        setRoundCount(count);
        const shuffled = shuffle(MASSIVE_BLANK_QUESTIONS).slice(0, count).map(q => ({
            ...q,
            options: shuffle(q.options)
        }));
        setQuestions(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setHighestStreak(0);
        setSelectedOption(null);
        setFeedback(null);
        setGameState('playing');
    };

    const currentQ = questions[currentIndex];

    const handleSelectOption = (word: string) => {
        if (feedback !== null) return;
        setSelectedOption(word);

        const isCorrect = word.toLowerCase() === currentQ.blankWord.toLowerCase();
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
            setSelectedOption(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setGameState('end');
                triggerRealisticConfetti();
            }
        }, 1400);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Games</span>
                    </Link>
                    <div className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                        <span>✏️ Fill-in-the-Blank</span>
                    </div>
                    {gameState === 'playing' ? (
                        <div className="text-xs font-mono font-bold bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full">
                            Score: {score} pts
                        </div>
                    ) : (
                        <div className="w-16" />
                    )}
                </div>
            </div>

            <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <span className="text-4xl">✏️</span>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" /> 30+ Sacred Scripture Verses
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-2">
                                    Fill-in-the-Blank
                                </h1>
                                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                                    Recall and complete holy words in famous scriptures and Foursquare catechisms!
                                </p>
                            </div>

                            {/* Length Selector */}
                            <div className="space-y-1.5 text-left max-w-xs mx-auto">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Choose Question Count
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { count: 10, label: '10 Verses', detail: 'Quick Sprint' },
                                        { count: 20, label: '20 Verses', detail: 'Championship' }
                                    ].map(c => (
                                        <button
                                            key={c.count}
                                            type="button"
                                            onClick={() => setRoundCount(c.count as any)}
                                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                                                roundCount === c.count
                                                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="text-sm font-bold">{c.label}</div>
                                            <div className="text-[10px] text-slate-400">{c.detail}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => startNewGame(roundCount)}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                            >
                                Start Challenge <ChevronRight className="w-5 h-5" />
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
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-slate-500 font-mono">
                                    Question {currentIndex + 1} of {questions.length}
                                </span>
                                {streak >= 3 && (
                                    <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full font-bold">
                                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" /> {streak}x Streak!
                                    </span>
                                )}
                                <span className="font-bold text-slate-700">
                                    {score} Points
                                </span>
                            </div>

                            {/* Question Card */}
                            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                        📖 {currentQ.reference}
                                    </span>
                                </div>

                                <div className="text-xl sm:text-2xl font-serif text-slate-900 leading-relaxed mb-6">
                                    <span>&ldquo;{currentQ.sentenceBefore} </span>
                                    <span className={`inline-block px-3 py-0.5 rounded-xl border-2 font-bold transition-all ${
                                        feedback === 'correct'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                                            : feedback === 'wrong'
                                            ? 'bg-rose-100 border-rose-500 text-rose-900'
                                            : 'bg-amber-50 border-amber-400 text-amber-900 border-dashed'
                                    }`}>
                                        {selectedOption || '_______'}
                                    </span>
                                    <span> {currentQ.sentenceAfter}&rdquo;</span>
                                </div>

                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium mb-5 flex items-start gap-2.5 ${
                                            feedback === 'correct'
                                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                                : 'bg-rose-50 text-rose-900 border border-rose-200'
                                        }`}
                                    >
                                        {feedback === 'correct' ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <div className="font-bold">
                                                {feedback === 'correct' ? 'Correct!' : `Correct Answer: "${currentQ.blankWord}"`}
                                            </div>
                                            <p className="mt-0.5 text-xs opacity-90">{currentQ.explanation}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {currentQ.options.map((opt, oIdx) => {
                                        const isSelected = selectedOption === opt;
                                        const isActualCorrect = opt.toLowerCase() === currentQ.blankWord.toLowerCase();

                                        let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50';
                                        if (feedback && isSelected) {
                                            btnStyle = feedback === 'correct'
                                                ? 'bg-emerald-500 text-white border-emerald-600'
                                                : 'bg-rose-500 text-white border-rose-600';
                                        } else if (feedback && isActualCorrect) {
                                            btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400';
                                        }

                                        return (
                                            <button
                                                key={oIdx}
                                                type="button"
                                                disabled={feedback !== null}
                                                onClick={() => handleSelectOption(opt)}
                                                className={`p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-base sm:text-lg transition-all text-center cursor-pointer active:scale-98 touch-manipulation select-none ${btnStyle}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
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
                            className="text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-1">
                                    Challenge Completed!
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    You have hidden God&apos;s Word in your heart!
                                </p>

                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 my-4">
                                    {score} <span className="text-2xl text-slate-400 font-medium">pts</span>
                                </div>

                                <div className="text-xs text-slate-500">
                                    Best Combo Streak: <strong className="text-amber-700">{highestStreak} in a row</strong>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                                <button
                                    onClick={() => startNewGame(roundCount)}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Play Again
                                </button>
                                <Link
                                    href="/games"
                                    className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
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
