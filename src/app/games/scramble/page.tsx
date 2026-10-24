'use client';

import { useState, useEffect } from 'react';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';
import { ArrowLeft, CheckCircle2, RotateCcw, ChevronRight, Lightbulb, Trophy, Sparkles } from 'lucide-react';
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
        text: "The fruit of the Spirit is love joy peace forbearance kindness goodness faithfulness"
    },
    {
        reference: "Ephesians 4:32",
        text: "Be kind and compassionate to one another forgiving each other"
    },
    {
        reference: "John 14:6",
        text: "I am the way and the truth and the life"
    },
    {
        reference: "Joshua 1:9",
        text: "Be strong and courageous do not be afraid"
    },
    {
        reference: "Isaiah 40:31",
        text: "Those who hope in the LORD will renew their strength"
    },
    {
        reference: "Romans 8:31",
        text: "If God is for us who can be against us"
    },
    {
        reference: "1 John 4:19",
        text: "We love because He first loved us"
    },
    {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you declares the LORD"
    },
    {
        reference: "Psalm 46:1",
        text: "God is our refuge and strength an ever present help in trouble"
    },
    {
        reference: "Matthew 6:33",
        text: "Seek first His kingdom and His righteousness"
    },
    {
        reference: "Psalm 100:1",
        text: "Shout for joy to the LORD all the earth"
    },
    {
        reference: "1 Peter 5:7",
        text: "Cast all your anxiety on Him because He cares for you"
    },
    {
        reference: "Hebrews 11:1",
        text: "Faith is confidence in what we hope for and assurance about what we do not see"
    },
    {
        reference: "Proverbs 18:10",
        text: "The name of the LORD is a fortified tower the righteous run to it and are safe"
    },
    {
        reference: "Psalm 139:14",
        text: "I praise you because I am fearfully and wonderfully made"
    },
    {
        reference: "Colossians 3:23",
        text: "Whatever you do work at it with all your heart as working for the Lord"
    },
    {
        reference: "John 3:16",
        text: "For God so loved the world that He gave His one and only Son"
    },
    {
        reference: "Psalm 118:24",
        text: "This is the day the LORD has made let us rejoice and be glad in it"
    },
    {
        reference: "Philippians 4:4",
        text: "Rejoice in the Lord always I will say it again Rejoice"
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
    const [highestUnlocked, setHighestUnlocked] = useState(0);
    const [pool, setPool] = useState<WordObj[]>([]);
    const [selected, setSelected] = useState<WordObj[]>([]);
    const [isWin, setIsWin] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Load progress
    useEffect(() => {
        try {
            const saved = localStorage.getItem('verse_scramble_highest_level');
            if (saved) {
                const lvl = Number(saved);
                setHighestUnlocked(lvl);
                if (lvl > 0 && lvl < VERSES.length) setLevelIndex(lvl);
            }
        } catch {}
    }, []);

    const currentVerse = VERSES[levelIndex];

    // Initialize the level
    useEffect(() => {
        const words = currentVerse.text.split(' ').map((w, i) => ({ id: `${i}-${w}-${Math.random()}`, word: w }));
        setPool(shuffleArray(words));
        setSelected([]);
        setIsWin(false);
        setShowHint(false);
    }, [levelIndex, currentVerse]);

    // Check for win by comparing reconstructed sentence
    useEffect(() => {
        if (isWin) return;
        if (selected.length > 0 && pool.length === 0) {
            const currentSentence = selected.map(s => s.word.trim()).join(' ');
            if (currentSentence.toLowerCase() === currentVerse.text.toLowerCase()) {
                setIsWin(true);
                triggerRealisticConfetti();

                // Unlock next level
                const nextLevel = levelIndex + 1;
                if (nextLevel > highestUnlocked && nextLevel < VERSES.length) {
                    setHighestUnlocked(nextLevel);
                    try {
                        localStorage.setItem('verse_scramble_highest_level', String(nextLevel));
                    } catch {}
                }
            }
        }
    }, [selected, pool, currentVerse, isWin, levelIndex, highestUnlocked]);

    const handleSelectWord = (word: WordObj) => {
        setPool(prev => prev.filter(w => w.id !== word.id));
        setSelected(prev => [...prev, word]);
    };

    const handleDeselectWord = (word: WordObj) => {
        setSelected(prev => prev.filter(w => w.id !== word.id));
        setPool(prev => [...prev, word]);
    };

    const handleReset = () => {
        const words = currentVerse.text.split(' ').map((w, i) => ({ id: `${i}-${w}-${Math.random()}`, word: w }));
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Games</span>
                    </Link>
                    <div className="font-serif font-bold text-slate-800 text-lg flex items-center gap-2">
                        <span>🔤 Verse Scramble</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Level selector */}
                        <select 
                            value={levelIndex} 
                            onChange={(e) => setLevelIndex(Number(e.target.value))}
                            className="bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-full cursor-pointer focus:outline-none"
                        >
                            {VERSES.map((v, idx) => (
                                <option key={idx} value={idx}>
                                    Level {idx + 1}: {v.reference}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-2">
                        <Sparkles className="w-3.5 h-3.5" /> Scripture Challenge
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-1">
                        {currentVerse.reference}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Tap the scrambled words in order to reveal the Holy Scripture!
                    </p>
                </div>

                {/* Hint banner if requested */}
                {showHint && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs sm:text-sm text-center mb-4"
                    >
                        <strong>Hint:</strong> The verse begins with: &quot;<em>{currentVerse.text.split(' ').slice(0, 3).join(' ')}...</em>&quot;
                    </motion.div>
                )}

                {/* Selected Words Area */}
                <div className={`bg-white rounded-2xl shadow-sm border-2 p-6 mb-6 min-h-[160px] flex items-center justify-center transition-all ${
                    isWin ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'
                }`}>
                    <div className="flex flex-wrap gap-2 items-center justify-center">
                        <AnimatePresence>
                            {selected.length === 0 && (
                                <motion.span 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="text-slate-300 italic text-sm sm:text-base"
                                >
                                    Tap words below to place them here...
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
                                    className={`px-3.5 py-2 rounded-xl font-medium text-base sm:text-lg transition-colors cursor-pointer ${
                                        isWin 
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold cursor-default' 
                                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 shadow-xs'
                                    }`}
                                >
                                    {w.word}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Pool Words Area */}
                {!isWin ? (
                    <div className="flex-1">
                        <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">
                            <AnimatePresence>
                                {pool.map((w) => (
                                    <motion.button
                                        layout
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        key={w.id}
                                        onClick={() => handleSelectWord(w)}
                                        className="px-4 py-2.5 bg-white rounded-xl font-medium text-base sm:text-lg text-slate-700 hover:text-slate-950 border-2 border-slate-200 hover:border-amber-400 shadow-xs cursor-pointer active:scale-95 transition-all"
                                    >
                                        {w.word}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center my-4"
                    >
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-emerald-900 mb-1">Praise God! Verse Completed!</h3>
                        <p className="text-emerald-700 text-sm max-w-md mx-auto">
                            &quot;{currentVerse.text}.&quot; — <strong>{currentVerse.reference}</strong>
                        </p>
                    </motion.div>
                )}

                {/* Controls & Next Level */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {!isWin && (
                        <>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Words
                            </button>
                            <button
                                onClick={() => setShowHint(prev => !prev)}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-xs transition-colors cursor-pointer"
                            >
                                <Lightbulb className="w-4 h-4" />
                                {showHint ? 'Hide Hint' : 'Show Hint'}
                            </button>
                        </>
                    )}
                    {isWin && levelIndex < VERSES.length - 1 && (
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={handleNextLevel}
                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer text-sm"
                        >
                            Next Verse ({levelIndex + 2}/{VERSES.length})
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    )}
                    {isWin && levelIndex === VERSES.length - 1 && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 text-sm">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                You have conquered all 25 verses!
                            </div>
                            <Link 
                                href="/games"
                                className="text-slate-500 font-bold hover:text-slate-800 text-xs transition-colors underline"
                            >
                                Back to All Games
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
