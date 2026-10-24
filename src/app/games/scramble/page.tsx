'use client';

import { useState, useEffect } from 'react';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';
import { ArrowLeft, CheckCircle2, RotateCcw, ChevronRight, Lightbulb, Trophy, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface VerseData {
    id: number;
    reference: string;
    text: string;
    pack: string;
}

const MASSIVE_VERSES: VerseData[] = [
    // Pack 1: Faith & Foundations (1-10)
    { id: 1, pack: "Faith & Foundations", reference: "Philippians 4:13", text: "I can do all things through Christ who strengthens me" },
    { id: 2, pack: "Faith & Foundations", reference: "Proverbs 3:5", text: "Trust in the LORD with all your heart and lean not on your own understanding" },
    { id: 3, pack: "Faith & Foundations", reference: "Psalm 23:1", text: "The LORD is my shepherd I lack nothing" },
    { id: 4, pack: "Faith & Foundations", reference: "Genesis 1:1", text: "In the beginning God created the heavens and the earth" },
    { id: 5, pack: "Faith & Foundations", reference: "John 14:6", text: "I am the way and the truth and the life" },
    { id: 6, pack: "Faith & Foundations", reference: "Hebrews 11:1", text: "Now faith is confidence in what we hope for and assurance about what we do not see" },
    { id: 7, pack: "Faith & Foundations", reference: "Matthew 6:33", text: "Seek first His kingdom and His righteousness and all these things will be given to you" },
    { id: 8, pack: "Faith & Foundations", reference: "Romans 1:16", text: "For I am not ashamed of the gospel because it is the power of God that brings salvation" },
    { id: 9, pack: "Faith & Foundations", reference: "Ephesians 2:8", text: "For it is by grace you have been saved through faith and this is not from yourselves" },
    { id: 10, pack: "Faith & Foundations", reference: "2 Corinthians 5:7", text: "For we live by faith not by sight" },

    // Pack 2: Strength & Courage (11-20)
    { id: 11, pack: "Strength & Courage", reference: "Joshua 1:9", text: "Be strong and courageous do not be afraid do not be discouraged" },
    { id: 12, pack: "Strength & Courage", reference: "Isaiah 40:31", text: "Those who hope in the LORD will renew their strength they will soar on wings like eagles" },
    { id: 13, pack: "Strength & Courage", reference: "Romans 8:31", text: "If God is for us who can be against us" },
    { id: 14, pack: "Strength & Courage", reference: "Psalm 46:1", text: "God is our refuge and strength an ever present help in trouble" },
    { id: 15, pack: "Strength & Courage", reference: "Psalm 27:1", text: "The LORD is my light and my salvation whom shall I fear" },
    { id: 16, pack: "Strength & Courage", reference: "2 Timothy 1:7", text: "For God has not given us a spirit of fear but of power and of love and of a sound mind" },
    { id: 17, pack: "Strength & Courage", reference: "Deuteronomy 31:6", text: "Be strong and bold do not fear for the LORD your God goes with you" },
    { id: 18, pack: "Strength & Courage", reference: "Ephesians 6:10", text: "Be strong in the Lord and in His mighty power" },
    { id: 19, pack: "Strength & Courage", reference: "1 Corinthians 16:13", text: "Be on your guard stand firm in the faith be courageous be strong" },
    { id: 20, pack: "Strength & Courage", reference: "Psalm 18:2", text: "The LORD is my rock my fortress and my deliverer" },

    // Pack 3: Peace, Love & Wisdom (21-30)
    { id: 21, pack: "Peace, Love & Wisdom", reference: "1 John 4:19", text: "We love because He first loved us" },
    { id: 22, pack: "Peace, Love & Wisdom", reference: "Psalm 119:105", text: "Your word is a lamp for my feet a light on my path" },
    { id: 23, pack: "Peace, Love & Wisdom", reference: "Romans 12:12", text: "Be joyful in hope patient in affliction faithful in prayer" },
    { id: 24, pack: "Peace, Love & Wisdom", reference: "Galatians 5:22", text: "The fruit of the Spirit is love joy peace forbearance kindness goodness faithfulness" },
    { id: 25, pack: "Peace, Love & Wisdom", reference: "Ephesians 4:32", text: "Be kind and compassionate to one another forgiving each other" },
    { id: 26, pack: "Peace, Love & Wisdom", reference: "John 15:12", text: "My command is this Love each other as I have loved you" },
    { id: 27, pack: "Peace, Love & Wisdom", reference: "Colossians 3:14", text: "And over all these virtues put on love which binds them all together in perfect unity" },
    { id: 28, pack: "Peace, Love & Wisdom", reference: "James 1:5", text: "If any of you lacks wisdom you should ask God who gives generously to all" },
    { id: 29, pack: "Peace, Love & Wisdom", reference: "Proverbs 15:1", text: "A gentle answer turns away wrath but a harsh word stirs up anger" },
    { id: 30, pack: "Peace, Love & Wisdom", reference: "Philippians 4:7", text: "And the peace of God which transcends all understanding will guard your hearts" },

    // Pack 4: Praise, Joy & Promises (31-40)
    { id: 31, pack: "Praise, Joy & Promises", reference: "Jeremiah 29:11", text: "For I know the plans I have for you declares the LORD plans to prosper you" },
    { id: 32, pack: "Praise, Joy & Promises", reference: "Psalm 100:1", text: "Shout for joy to the LORD all the earth worship the LORD with gladness" },
    { id: 33, pack: "Praise, Joy & Promises", reference: "1 Peter 5:7", text: "Cast all your anxiety on Him because He cares for you" },
    { id: 34, pack: "Praise, Joy & Promises", reference: "Proverbs 18:10", text: "The name of the LORD is a fortified tower the righteous run to it and are safe" },
    { id: 35, pack: "Praise, Joy & Promises", reference: "Psalm 139:14", text: "I praise you because I am fearfully and wonderfully made" },
    { id: 36, pack: "Praise, Joy & Promises", reference: "Psalm 118:24", text: "This is the day the LORD has made let us rejoice and be glad in it" },
    { id: 37, pack: "Praise, Joy & Promises", reference: "Philippians 4:4", text: "Rejoice in the Lord always I will say it again Rejoice" },
    { id: 38, pack: "Praise, Joy & Promises", reference: "1 Thessalonians 5:16", text: "Rejoice always pray continually give thanks in all circumstances" },
    { id: 39, pack: "Praise, Joy & Promises", reference: "Psalm 34:8", text: "Taste and see that the LORD is good blessed is the one who takes refuge in Him" },
    { id: 40, pack: "Praise, Joy & Promises", reference: "Lamentations 3:23", text: "They are new every morning great is your faithfulness" },

    // Pack 5: Victory & Eternal Life (41-50)
    { id: 41, pack: "Victory & Eternal Life", reference: "John 3:16", text: "For God so loved the world that He gave His one and only Son" },
    { id: 42, pack: "Victory & Eternal Life", reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love Him" },
    { id: 43, pack: "Victory & Eternal Life", reference: "1 Corinthians 15:57", text: "Thanks be to God He gives us the victory through our Lord Jesus Christ" },
    { id: 44, pack: "Victory & Eternal Life", reference: "Romans 6:23", text: "For the wages of sin is death but the gift of God is eternal life in Christ Jesus" },
    { id: 45, pack: "Victory & Eternal Life", reference: "Revelation 21:4", text: "He will wipe every tear from their eyes there will be no more death or mourning" },
    { id: 46, pack: "Victory & Eternal Life", reference: "John 10:10", text: "I have come that they may have life and have it to the full" },
    { id: 47, pack: "Victory & Eternal Life", reference: "Matthew 28:20", text: "And surely I am with you always to the very end of the age" },
    { id: 48, pack: "Victory & Eternal Life", reference: "Hebrews 13:8", text: "Jesus Christ is the same yesterday and today and forever" },
    { id: 49, pack: "Victory & Eternal Life", reference: "Colossians 3:23", text: "Whatever you do work at it with all your heart as working for the Lord" },
    { id: 50, pack: "Victory & Eternal Life", reference: "Romans 8:38", text: "Neither death nor life shall be able to separate us from the love of God" }
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
    const [selectedPack, setSelectedPack] = useState<string>('All');

    // Load progress
    useEffect(() => {
        try {
            const saved = localStorage.getItem('verse_scramble_highest_level_v2');
            if (saved) {
                const lvl = Number(saved);
                setHighestUnlocked(lvl);
                if (lvl > 0 && lvl < MASSIVE_VERSES.length) setLevelIndex(lvl);
            }
        } catch {}
    }, []);

    const currentVerse = MASSIVE_VERSES[levelIndex];

    // Initialize the level
    useEffect(() => {
        const words = currentVerse.text.split(' ').map((w, i) => ({ id: `${i}-${w}-${Math.random()}`, word: w }));
        setPool(shuffleArray(words));
        setSelected([]);
        setIsWin(false);
        setShowHint(false);
    }, [levelIndex, currentVerse]);

    // Check for win
    useEffect(() => {
        if (isWin) return;
        if (selected.length > 0 && pool.length === 0) {
            const currentSentence = selected.map(s => s.word.trim()).join(' ');
            if (currentSentence.toLowerCase() === currentVerse.text.toLowerCase()) {
                setIsWin(true);
                triggerRealisticConfetti();

                const nextLevel = levelIndex + 1;
                if (nextLevel > highestUnlocked && nextLevel < MASSIVE_VERSES.length) {
                    setHighestUnlocked(nextLevel);
                    try {
                        localStorage.setItem('verse_scramble_highest_level_v2', String(nextLevel));
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
        if (levelIndex < MASSIVE_VERSES.length - 1) {
            setLevelIndex(prev => prev + 1);
        }
    };

    // Filter verses for selector
    const PACK_NAMES = [
        "All Verses",
        "Faith & Foundations",
        "Strength & Courage",
        "Peace, Love & Wisdom",
        "Praise, Joy & Promises",
        "Victory & Eternal Life"
    ];

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
                        <select 
                            value={levelIndex} 
                            onChange={(e) => setLevelIndex(Number(e.target.value))}
                            className="bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs px-2.5 py-1.5 rounded-full cursor-pointer focus:outline-none max-w-[125px] sm:max-w-xs truncate"
                        >
                            {MASSIVE_VERSES.map((v, idx) => (
                                <option key={idx} value={idx}>
                                    Verse {idx + 1}: {v.reference} ({v.pack.split('&')[0]})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col">
                <div className="text-center mb-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-2">
                        <Sparkles className="w-3.5 h-3.5" /> Pack: {currentVerse.pack} • Verse {levelIndex + 1}/50
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-1">
                        {currentVerse.reference}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Tap words to reconstruct the Holy Scripture in correct sequence!
                    </p>
                </div>

                {/* Hint banner */}
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
                <div className={`bg-white rounded-2xl shadow-sm border-2 p-6 mb-5 min-h-[160px] flex items-center justify-center transition-all ${
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
                                    Tap words below to arrange them here...
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
                                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-medium text-sm sm:text-lg transition-colors cursor-pointer select-none touch-manipulation ${
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
                        <div className="flex flex-wrap gap-1.5 sm:gap-2.5 justify-center">
                            <AnimatePresence>
                                {pool.map((w) => (
                                    <motion.button
                                        layout
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        key={w.id}
                                        onClick={() => handleSelectWord(w)}
                                        className="px-3 py-2 sm:px-4 sm:py-2.5 bg-white rounded-xl font-medium text-sm sm:text-lg text-slate-700 hover:text-slate-950 border-2 border-slate-200 hover:border-amber-400 shadow-xs cursor-pointer active:scale-95 transition-all select-none touch-manipulation"
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
                    {isWin && levelIndex < MASSIVE_VERSES.length - 1 && (
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            onClick={handleNextLevel}
                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer text-sm"
                        >
                            Next Verse ({levelIndex + 2}/{MASSIVE_VERSES.length})
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    )}
                    {isWin && levelIndex === MASSIVE_VERSES.length - 1 && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 text-sm">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                You have conquered all 50 verses in all 5 packs!
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
