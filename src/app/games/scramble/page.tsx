'use client';

import { useState, useEffect, useMemo } from 'react';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';
import { ArrowLeft, CheckCircle2, RotateCcw, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const VERSES = [
    {
        reference: "Philippians 4:13",
        text: "I can do all things through Christ who strengthens me"
    },
    {
        reference: "Proverbs 3:5",
        text: "Trust in the LORD with all your heart and lean not on your own understanding"
    },
    {
        reference: "Psalm 23:1",
        text: "The LORD is my shepherd I lack nothing"
    },
    {
        reference: "John 11:35",
        text: "Jesus wept"
    },
    {
        reference: "1 Thessalonians 5:16",
        text: "Rejoice always"
    },
    {
        reference: "Psalm 119:105",
        text: "Your word is a lamp for my feet a light on my path"
    },
    {
        reference: "Romans 12:12",
        text: "Be joyful in hope patient in affliction faithful in prayer"
    },
    {
        reference: "Matthew 5:14",
        text: "You are the light of the world"
    },
    {
        reference: "Galatians 5:22",
        text: "But the fruit of the Spirit is love joy peace forbearance kindness goodness faithfulness"
    },
    {
        reference: "Ephesians 4:32",
        text: "Be kind and compassionate to one another"
    }
];

type WordObj = { id: string; word: string };

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function VerseScrambleGame() {
    const [levelIndex, setLevelIndex] = useState(0);
    const [pool, setPool] = useState<WordObj[]>([]);
    const [selected, setSelected] = useState<WordObj[]>([]);
    const [isWin, setIsWin] = useState(false);

    const currentVerse = VERSES[levelIndex];

    // Initialize the level
    useEffect(() => {
        const words = currentVerse.text.split(' ').map((w, i) => ({ id: `${i}-${w}`, word: w }));
        setPool(shuffleArray(words));
        setSelected([]);
        setIsWin(false);
    }, [currentVerse]);

    // Check for win
    useEffect(() => {
        if (selected.length > 0 && pool.length === 0) {
            const currentSentence = selected.map(s => s.word).join(' ');
            if (currentSentence === currentVerse.text) {
                setIsWin(true);
                triggerRealisticConfetti();
            }
        }
    }, [selected, pool, currentVerse]);

    const handleSelectWord = (word: WordObj) => {
        setPool(prev => prev.filter(w => w.id !== word.id));
        setSelected(prev => [...prev, word]);
    };

    const handleDeselectWord = (word: WordObj) => {
        setSelected(prev => prev.filter(w => w.id !== word.id));
        setPool(prev => [...prev, word]);
    };

    const handleReset = () => {
        const words = currentVerse.text.split(' ').map((w, i) => ({ id: `${i}-${w}`, word: w }));
        setPool(shuffleArray(words));
        setSelected([]);
        setIsWin(false);
    };

    const handleNextLevel = () => {
        if (levelIndex < VERSES.length - 1) {
            setLevelIndex(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline font-medium">Games</span>
                    </Link>
                    <div className="font-serif font-bold text-slate-800 text-lg">
                        Verse Scramble
                    </div>
                    <div className="text-sm font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                        Level {levelIndex + 1}/{VERSES.length}
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-2">
                        {currentVerse.reference}
                    </h2>
                    <p className="text-slate-500">Tap the words in the correct order to reveal the verse.</p>
                </div>

                {/* Selected Words Area */}
                <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-6 mb-8 min-h-[160px]">
                    <div className="flex flex-wrap gap-2 items-center justify-center">
                        <AnimatePresence>
                            {selected.length === 0 && (
                                <motion.span 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="text-slate-300 italic"
                                >
                                    Your verse will appear here...
                                </motion.span>
                            )}
                            {selected.map((w) => (
                                <motion.button
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    key={w.id}
                                    onClick={() => !isWin && handleDeselectWord(w)}
                                    className={`px-4 py-2 rounded-xl font-medium text-lg transition-colors ${
                                        isWin 
                                        ? 'bg-green-100 text-green-800 border border-green-200 cursor-default' 
                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 cursor-pointer shadow-sm'
                                    }`}
                                >
                                    {w.word}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Pool Words Area */}
                {!isWin && (
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-3 justify-center">
                            <AnimatePresence>
                                {pool.map((w) => (
                                    <motion.button
                                        layout
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        key={w.id}
                                        onClick={() => handleSelectWord(w)}
                                        className="px-4 py-2 bg-white rounded-xl font-medium text-lg text-slate-700 hover:text-slate-900 border-2 border-slate-200 hover:border-slate-300 shadow-sm cursor-pointer active:scale-95 transition-all"
                                    >
                                        {w.word}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Controls & Next Level */}
                <div className="mt-8 flex justify-center gap-4">
                    {!isWin && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-slate-500 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Reset
                        </button>
                    )}
                    {isWin && levelIndex < VERSES.length - 1 && (
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={handleNextLevel}
                            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/25 transition-all active:scale-95"
                        >
                            Next Level
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    )}
                    {isWin && levelIndex === VERSES.length - 1 && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-green-800 bg-green-100 border border-green-200">
                                <CheckCircle2 className="w-6 h-6" />
                                You completed all levels!
                            </div>
                            <Link 
                                href="/games"
                                className="text-slate-500 font-medium hover:text-slate-800 transition-colors underline"
                            >
                                Back to Games
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
