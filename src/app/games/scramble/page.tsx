'use client';

import { useState, useEffect, useRef } from 'react';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';
import { ArrowLeft, CheckCircle2, RotateCcw, ChevronRight, Lightbulb, Trophy, Sparkles, BookOpen, Flame, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gameSound, triggerHaptic } from '@/lib/gameSound';
import { earnTalents, unlockAchievement, recordGameWin } from '@/lib/gameProfile';
import GameTopBar from '@/components/games/GameTopBar';
import ShareScoreButton from '@/components/games/ShareScoreButton';

interface VerseData {
    id: number;
    reference: string;
    text: string;
    pack: string;
}

const MASSIVE_VERSES: VerseData[] = [
    // Pack 1: Foundations of Faith & Salvation (KJV)
    { id: 1, pack: "Faith & Salvation (KJV)", reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me" },
    { id: 2, pack: "Faith & Salvation (KJV)", reference: "Proverbs 3:5", text: "Trust in the LORD with all thine heart and lean not unto thine own understanding" },
    { id: 3, pack: "Faith & Salvation (KJV)", reference: "Psalm 23:1", text: "The LORD is my shepherd I shall not want" },
    { id: 4, pack: "Faith & Salvation (KJV)", reference: "Genesis 1:1", text: "In the beginning God created the heaven and the earth" },
    { id: 5, pack: "Faith & Salvation (KJV)", reference: "John 14:6", text: "Jesus saith unto him I am the way the truth and the life no man cometh unto the Father but by me" },
    { id: 6, pack: "Faith & Salvation (KJV)", reference: "Hebrews 11:1", text: "Now faith is the substance of things hoped for the evidence of things not seen" },
    { id: 7, pack: "Faith & Salvation (KJV)", reference: "Matthew 6:33", text: "But seek ye first the kingdom of God and his righteousness and all these things shall be added unto you" },
    { id: 8, pack: "Faith & Salvation (KJV)", reference: "Romans 1:16", text: "For I am not ashamed of the gospel of Christ for it is the power of God unto salvation" },
    { id: 9, pack: "Faith & Salvation (KJV)", reference: "Ephesians 2:8", text: "For by grace are ye saved through faith and that not of yourselves it is the gift of God" },
    { id: 10, pack: "Faith & Salvation (KJV)", reference: "2 Corinthians 5:7", text: "For we walk by faith not by sight" },

    // Pack 2: Spiritual Warfare & Courage (KJV)
    { id: 11, pack: "Spiritual Warfare (KJV)", reference: "Joshua 1:9", text: "Be strong and of a good courage be not afraid neither be thou dismayed for the LORD thy God is with thee" },
    { id: 12, pack: "Spiritual Warfare (KJV)", reference: "Ephesians 6:11", text: "Put on the whole armour of God that ye may be able to stand against the wiles of the devil" },
    { id: 13, pack: "Spiritual Warfare (KJV)", reference: "Ephesians 6:12", text: "For we wrestle not against flesh and blood but against principalities against powers against the rulers of darkness" },
    { id: 14, pack: "Spiritual Warfare (KJV)", reference: "Isaiah 40:31", text: "They that wait upon the LORD shall renew their strength they shall mount up with wings as eagles" },
    { id: 15, pack: "Spiritual Warfare (KJV)", reference: "Romans 8:31", text: "What shall we then say to these things If God be for us who can be against us" },
    { id: 16, pack: "Spiritual Warfare (KJV)", reference: "Psalm 46:1", text: "God is our refuge and strength a very present help in trouble" },
    { id: 17, pack: "Spiritual Warfare (KJV)", reference: "Psalm 27:1", text: "The LORD is my light and my salvation whom shall I fear the LORD is the strength of my life" },
    { id: 18, pack: "Spiritual Warfare (KJV)", reference: "2 Timothy 1:7", text: "For God hath not given us the spirit of fear but of power and of love and of a sound mind" },
    { id: 19, pack: "Spiritual Warfare (KJV)", reference: "1 Corinthians 16:13", text: "Watch ye stand fast in the faith quit you like men be strong" },
    { id: 20, pack: "Spiritual Warfare (KJV)", reference: "Psalm 18:2", text: "The LORD is my rock and my fortress and my deliverer my God my strength in whom I will trust" },

    // Pack 3: The Psalms of Praise & Refuge (KJV)
    { id: 21, pack: "Psalms of Refuge (KJV)", reference: "Psalm 91:1", text: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty" },
    { id: 22, pack: "Psalms of Refuge (KJV)", reference: "Psalm 91:2", text: "I will say of the LORD He is my refuge and my fortress my God in him will I trust" },
    { id: 23, pack: "Psalms of Refuge (KJV)", reference: "Psalm 119:105", text: "Thy word is a lamp unto my feet and a light unto my path" },
    { id: 24, pack: "Psalms of Refuge (KJV)", reference: "Psalm 100:1", text: "Make a joyful noise unto the LORD all ye lands Serve the LORD with gladness" },
    { id: 25, pack: "Psalms of Refuge (KJV)", reference: "Psalm 103:1", text: "Bless the LORD O my soul and all that is within me bless his holy name" },
    { id: 26, pack: "Psalms of Refuge (KJV)", reference: "Psalm 103:2", text: "Bless the LORD O my soul and forget not all his benefits Who forgiveth all thine iniquities" },
    { id: 27, pack: "Psalms of Refuge (KJV)", reference: "Psalm 118:24", text: "This is the day which the LORD hath made we will rejoice and be glad in it" },
    { id: 28, pack: "Psalms of Refuge (KJV)", reference: "Psalm 34:8", text: "O taste and see that the LORD is good blessed is the man that trusteth in him" },
    { id: 29, pack: "Psalms of Refuge (KJV)", reference: "Psalm 34:18", text: "The LORD is nigh unto them that are of a broken heart and saveth such as be of a contrite spirit" },
    { id: 30, pack: "Psalms of Refuge (KJV)", reference: "Psalm 139:14", text: "I will praise thee for I am fearfully and wonderfully made marvellous are thy works" },

    // Pack 4: Messianic Prophecy & The Cross (KJV)
    { id: 31, pack: "Messianic Prophecy (KJV)", reference: "Isaiah 53:5", text: "He was wounded for our transgressions he was bruised for our iniquities the chastisement of our peace was upon him" },
    { id: 32, pack: "Messianic Prophecy (KJV)", reference: "Isaiah 9:6", text: "For unto us a child is born unto us a son is given and the government shall be upon his shoulder" },
    { id: 33, pack: "Messianic Prophecy (KJV)", reference: "John 3:16", text: "For God so loved the world that he gave his only begotten Son that whosoever believeth in him should not perish" },
    { id: 34, pack: "Messianic Prophecy (KJV)", reference: "John 1:1", text: "In the beginning was the Word and the Word was with God and the Word was God" },
    { id: 35, pack: "Messianic Prophecy (KJV)", reference: "John 1:14", text: "And the Word was made flesh and dwelt among us and we beheld his glory the glory as of the only begotten" },
    { id: 36, pack: "Messianic Prophecy (KJV)", reference: "Romans 5:8", text: "God commendeth his love toward us in that while we were yet sinners Christ died for us" },
    { id: 37, pack: "Messianic Prophecy (KJV)", reference: "Hebrews 12:2", text: "Looking unto Jesus the author and finisher of our faith who for the joy set before him endured the cross" },
    { id: 38, pack: "Messianic Prophecy (KJV)", reference: "1 Corinthians 15:57", text: "Thanks be to God which giveth us the victory through our Lord Jesus Christ" },
    { id: 39, pack: "Messianic Prophecy (KJV)", reference: "Galatians 2:20", text: "I am crucified with Christ nevertheless I live yet not I but Christ liveth in me" },
    { id: 40, pack: "Messianic Prophecy (KJV)", reference: "Philippians 2:9", text: "Wherefore God also hath highly exalted him and given him a name which is above every name" },

    // Pack 5: Wisdom, Diligence & The Epistles (KJV)
    { id: 41, pack: "Wisdom & Epistles (KJV)", reference: "Proverbs 18:10", text: "The name of the LORD is a strong tower the righteous runneth into it and is safe" },
    { id: 42, pack: "Wisdom & Epistles (KJV)", reference: "Proverbs 4:23", text: "Keep thy heart with all diligence for out of it are the issues of life" },
    { id: 43, pack: "Wisdom & Epistles (KJV)", reference: "Proverbs 15:1", text: "A soft answer turneth away wrath but grievous words stir up anger" },
    { id: 44, pack: "Wisdom & Epistles (KJV)", reference: "James 1:5", text: "If any of you lack wisdom let him ask of God that giveth to all men liberally and upbraideth not" },
    { id: 45, pack: "Wisdom & Epistles (KJV)", reference: "1 Corinthians 13:4", text: "Charity suffereth long and is kind charity envieth not charity vaunteth not itself is not puffed up" },
    { id: 46, pack: "Wisdom & Epistles (KJV)", reference: "Romans 12:12", text: "Rejoicing in hope patient in tribulation continuing instant in prayer" },
    { id: 47, pack: "Wisdom & Epistles (KJV)", reference: "Galatians 5:22", text: "The fruit of the Spirit is love joy peace longsuffering gentleness goodness faith" },
    { id: 48, pack: "Wisdom & Epistles (KJV)", reference: "Colossians 3:23", text: "Whatsoever ye do do it heartily as to the Lord and not unto men" },
    { id: 49, pack: "Wisdom & Epistles (KJV)", reference: "1 Thessalonians 5:16", text: "Rejoice evermore Pray without ceasing In every thing give thanks" },
    { id: 50, pack: "Wisdom & Epistles (KJV)", reference: "1 John 4:19", text: "We love him because he first loved us" },

    // Pack 6: Eternal Life, Promises & Victory (KJV)
    { id: 51, pack: "Eternal Promises (KJV)", reference: "Romans 8:28", text: "All things work together for good to them that love God to them who are the called according to his purpose" },
    { id: 52, pack: "Eternal Promises (KJV)", reference: "Romans 8:38", text: "For I am persuaded that neither death nor life nor angels nor principalities nor powers shall separate us" },
    { id: 53, pack: "Eternal Promises (KJV)", reference: "Romans 6:23", text: "For the wages of sin is death but the gift of God is eternal life through Jesus Christ our Lord" },
    { id: 54, pack: "Eternal Promises (KJV)", reference: "John 10:10", text: "The thief cometh not but for to steal and to kill and to destroy I am come that they might have life" },
    { id: 55, pack: "Eternal Promises (KJV)", reference: "John 11:25", text: "Jesus said unto her I am the resurrection and the life he that believeth in me though he were dead yet shall he live" },
    { id: 56, pack: "Eternal Promises (KJV)", reference: "Matthew 11:28", text: "Come unto me all ye that labour and are heavy laden and I will give you rest" },
    { id: 57, pack: "Eternal Promises (KJV)", reference: "Philippians 4:6", text: "Be careful for nothing but in every thing by prayer and supplication with thanksgiving let your requests be made known" },
    { id: 58, pack: "Eternal Promises (KJV)", reference: "Philippians 4:7", text: "And the peace of God which passeth all understanding shall keep your hearts and minds through Christ Jesus" },
    { id: 59, pack: "Eternal Promises (KJV)", reference: "Hebrews 13:8", text: "Jesus Christ the same yesterday and to day and for ever" },
    { id: 60, pack: "Eternal Promises (KJV)", reference: "Revelation 21:4", text: "And God shall wipe away all tears from their eyes and there shall be no more death neither sorrow nor crying" }
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
    const [combo, setCombo] = useState(1);
    const lastTapTimeRef = useRef<number>(0);

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
        setCombo(1);
    }, [levelIndex, currentVerse]);

    // Check for win
    useEffect(() => {
        if (isWin) return;
        if (selected.length > 0 && pool.length === 0) {
            const currentSentence = selected.map(s => s.word.trim()).join(' ');
            if (currentSentence.toLowerCase() === currentVerse.text.toLowerCase()) {
                setIsWin(true);
                gameSound.playFanfare();
                triggerHaptic('heavy');
                triggerRealisticConfetti();
                earnTalents(20);
                recordGameWin('scramble');

                if (levelIndex >= 4) {
                    unlockAchievement('scramble_ace');
                }

                const nextLevel = levelIndex + 1;
                if (nextLevel > highestUnlocked && nextLevel < MASSIVE_VERSES.length) {
                    setHighestUnlocked(nextLevel);
                    try {
                        localStorage.setItem('verse_scramble_highest_level_v2', String(nextLevel));
                    } catch {}
                }
            } else {
                gameSound.playError();
                triggerHaptic('error');
            }
        }
    }, [selected, pool, currentVerse, isWin, levelIndex, highestUnlocked]);

    const handleSelectWord = (word: WordObj) => {
        const now = Date.now();
        const diff = now - lastTapTimeRef.current;
        lastTapTimeRef.current = now;

        let nextCombo = combo;
        if (diff > 0 && diff < 2200) {
            nextCombo = Math.min(combo + 1, 4);
            setCombo(nextCombo);
            if (nextCombo >= 3) {
                unlockAchievement('combo_master');
            }
        } else {
            nextCombo = 1;
            setCombo(1);
        }

        gameSound.playCombo(nextCombo);
        triggerHaptic('tap');

        setPool(prev => prev.filter(w => w.id !== word.id));
        setSelected(prev => [...prev, word]);
    };

    const handleDeselectWord = (word: WordObj) => {
        gameSound.playCardFlip();
        triggerHaptic('tap');
        setSelected(prev => prev.filter(w => w.id !== word.id));
        setPool(prev => [...prev, word]);
        setCombo(1);
    };

    const handleReset = () => {
        gameSound.playTap();
        triggerHaptic('tap');
        const words = currentVerse.text.split(' ').map((w, i) => ({ id: `${i}-${w}-${Math.random()}`, word: w }));
        setPool(shuffleArray(words));
        setSelected([]);
        setIsWin(false);
        setCombo(1);
    };

    const handleNextLevel = () => {
        gameSound.playTap();
        triggerHaptic('tap');
        if (levelIndex < MASSIVE_VERSES.length - 1) {
            setLevelIndex(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Top Bar with Talents & Badges */}
            <GameTopBar
                title="Verse Scramble"
                backHref="/games"
                backLabel="Games"
                theme="light"
                extraPill={
                    <select 
                        value={levelIndex} 
                        onChange={(e) => {
                            gameSound.playTap();
                            setLevelIndex(Number(e.target.value));
                        }}
                        className="bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-full cursor-pointer focus:outline-none max-w-[120px] sm:max-w-xs truncate"
                    >
                        {MASSIVE_VERSES.map((v, idx) => (
                            <option key={idx} value={idx}>
                                {idx + 1}. {v.reference}
                            </option>
                        ))}
                    </select>
                }
            />

            <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col">
                <div className="text-center mb-5">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {currentVerse.pack} • {levelIndex + 1}/{MASSIVE_VERSES.length}
                        </span>

                        {/* Combo Multiplier Badge */}
                        {combo > 1 && (
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xs ${
                                    combo >= 3 
                                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white border-amber-400 animate-pulse'
                                        : 'bg-orange-100 text-orange-800 border-orange-300'
                                }`}
                            >
                                <Zap className="w-3.5 h-3.5" /> {combo}x Speed Combo!
                            </motion.span>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-1">
                        {currentVerse.reference}
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm">
                        Tap words rapidly to assemble Holy Scripture and build your speed combo!
                    </p>
                </div>

                {/* Hint banner */}
                {showHint && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs sm:text-sm text-center mb-4"
                    >
                        <strong>Scripture Clue:</strong> The verse opens with: &quot;<em>{currentVerse.text.split(' ').slice(0, 3).join(' ')}...</em>&quot;
                    </motion.div>
                )}

                {/* Selected Words Area */}
                <div className={`bg-white rounded-2xl shadow-sm border-2 p-5 sm:p-6 mb-5 min-h-[150px] flex items-center justify-center transition-all ${
                    isWin ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'
                }`}>
                    <div className="flex flex-wrap gap-2 items-center justify-center">
                        <AnimatePresence>
                            {selected.length === 0 && (
                                <motion.span 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="text-slate-300 italic text-sm sm:text-base text-center"
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
                        className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center my-4 shadow-sm"
                    >
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-emerald-900 mb-1">Praise God! Verse Completed!</h3>
                        <p className="text-emerald-800 text-sm max-w-md mx-auto mb-3 font-medium">
                            &ldquo;{currentVerse.text}.&rdquo; — <strong>{currentVerse.reference}</strong>
                        </p>
                        
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-4">
                            <span>🪙 +20 Talents Earned!</span>
                        </div>

                        {/* WhatsApp Share Button */}
                        <div className="flex justify-center">
                            <ShareScoreButton
                                gameName="Verse Scramble"
                                resultDetails={`Assembled scripture "${currentVerse.reference}" with ${combo}x speed combo!`}
                                urlPath="/games/scramble"
                                variant="whatsapp"
                            />
                        </div>
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
                                onClick={() => {
                                    gameSound.playTap();
                                    triggerHaptic('tap');
                                    setShowHint(prev => !prev);
                                }}
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
