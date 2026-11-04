'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Trophy, Clock, Sparkles, Star, ChevronRight, Users, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';
import { gameSound, triggerHaptic } from '@/lib/gameSound';
import { earnTalents, unlockAchievement, recordGameWin } from '@/lib/gameProfile';
import GameTopBar from '@/components/games/GameTopBar';
import ShareScoreButton from '@/components/games/ShareScoreButton';

interface CardPair {
    id: number;
    character: string;
    description: string;
    emoji: string;
    category: 'patriarchs' | 'prophets' | 'apostles' | 'covenants';
}

const MASSIVE_PAIRS: CardPair[] = [
    // Patriarchs & Judges
    { id: 1, character: "Noah", description: "Built Ark of Gopher Wood", emoji: "🚢", category: 'patriarchs' },
    { id: 2, character: "Abraham", description: "Father of the Faithful", emoji: "⭐", category: 'patriarchs' },
    { id: 3, character: "Isaac", description: "Offered upon Mount Moriah", emoji: "🪵", category: 'patriarchs' },
    { id: 4, character: "Jacob", description: "Prevailed with God at Peniel", emoji: "🤼", category: 'patriarchs' },
    { id: 5, character: "Joseph", description: "Coat of Many Colours", emoji: "🧥", category: 'patriarchs' },
    { id: 6, character: "Moses", description: "Parted the Red Sea", emoji: "🌊", category: 'patriarchs' },
    { id: 7, character: "Joshua", description: "Walls of Jericho Fell Down", emoji: "🎺", category: 'patriarchs' },
    { id: 8, character: "Gideon", description: "Defeated Midian with 300 Men", emoji: "🏺", category: 'patriarchs' },
    { id: 9, character: "Samson", description: "Smote Philistines with Jawbone", emoji: "💪", category: 'patriarchs' },
    { id: 10, character: "Deborah", description: "Judge Dwelling under Palm Tree", emoji: "🌴", category: 'patriarchs' },
    { id: 11, character: "Ruth", description: "Thy People Shall Be My People", emoji: "🌾", category: 'patriarchs' },
    { id: 12, character: "Boaz", description: "The Worthy Kinsman-Redeemer", emoji: "🌾", category: 'patriarchs' },

    // Prophets & Kings
    { id: 13, character: "Samuel", description: "Anointed Saul and David", emoji: "🫒", category: 'prophets' },
    { id: 14, character: "David", description: "Slew Goliath with Sling & Stone", emoji: "🪨", category: 'prophets' },
    { id: 15, character: "Solomon", description: "Built the Holy Temple in Zion", emoji: "🏛️", category: 'prophets' },
    { id: 16, character: "Elijah", description: "Fire Fell upon Mount Carmel", emoji: "🔥", category: 'prophets' },
    { id: 17, character: "Elisha", description: "Double Portion of the Spirit", emoji: "⚡", category: 'prophets' },
    { id: 18, character: "Isaiah", description: "Saw the Lord High & Lifted Up", emoji: "📜", category: 'prophets' },
    { id: 19, character: "Jeremiah", description: "Weeping Prophet of Judah", emoji: "💧", category: 'prophets' },
    { id: 20, character: "Daniel", description: "Delivered from Lions' Den", emoji: "🦁", category: 'prophets' },
    { id: 21, character: "Ezekiel", description: "Vision of the Valley of Dry Bones", emoji: "🦴", category: 'prophets' },
    { id: 22, character: "Josiah", description: "Repaired the Temple at Eight Years", emoji: "👑", category: 'prophets' },
    { id: 23, character: "Nehemiah", description: "Rebuilt Walls in Fifty-Two Days", emoji: "🧱", category: 'prophets' },
    { id: 24, character: "Esther", description: "If I Perish, I Perish", emoji: "👑", category: 'prophets' },

    // Gospels & Apostles
    { id: 25, character: "John the Baptist", description: "Voice Crying in the Wilderness", emoji: "🕊️", category: 'apostles' },
    { id: 26, character: "Peter", description: "Walked on the Sea to Jesus", emoji: "🚶‍♂️", category: 'apostles' },
    { id: 27, character: "John", description: "The Disciple Whom Jesus Loved", emoji: "🦅", category: 'apostles' },
    { id: 28, character: "Paul", description: "Apostle unto the Gentiles", emoji: "📜", category: 'apostles' },
    { id: 29, character: "Stephen", description: "Saw Heaven Opened Being Stoned", emoji: "✨", category: 'apostles' },
    { id: 30, character: "Philip", description: "Joined the Chariot in Gaza", emoji: "📖", category: 'apostles' },
    { id: 31, character: "Barnabas", description: "Son of Consolation & Apostle", emoji: "🤝", category: 'apostles' },
    { id: 32, character: "Lazarus", description: "Came Forth from Grave After 4 Days", emoji: "🪦", category: 'apostles' },
    { id: 33, character: "Zacchaeus", description: "Climbed the Sycamore-Fig Tree", emoji: "🌳", category: 'apostles' },
    { id: 34, character: "Blind Bartimaeus", description: "Cried: Son of David, Have Mercy!", emoji: "👁️", category: 'apostles' },
    { id: 35, character: "Mary Magdalene", description: "First Witness of the Resurrected Lord", emoji: "🌅", category: 'apostles' },
    { id: 36, character: "Silas", description: "Sang Praises at Midnight in Prison", emoji: "⛓️", category: 'apostles' },

    // Parables, Covenants & Types of Christ
    { id: 37, character: "Melchizedek", description: "King of Salem, Priest of Most High", emoji: "🍞", category: 'covenants' },
    { id: 38, character: "The Brazen Serpent", description: "Lifted Up on Pole for Healing", emoji: "⚕️", category: 'covenants' },
    { id: 39, character: "Ark of the Covenant", description: "Mercy Seat Overshadowed by Cherubim", emoji: "✨", category: 'covenants' },
    { id: 40, character: "The Passover Lamb", description: "Blood Struck upon the Doorposts", emoji: "🐑", category: 'covenants' },
    { id: 41, character: "The Rock in Horeb", description: "Smitten Once to Gush Living Waters", emoji: "💧", category: 'covenants' },
    { id: 42, character: "City of Refuge", description: "Sanctuary for the Manslayer", emoji: "🏰", category: 'covenants' },
    { id: 43, character: "The Good Samaritan", description: "Bound Wounds Pouring Oil and Wine", emoji: "🩹", category: 'covenants' },
    { id: 44, character: "The Prodigal Son", description: "Returned Home to Best Robe & Ring", emoji: "🏃‍♂️", category: 'covenants' },
    { id: 45, character: "Pearl of Great Price", description: "Sold All Possessions to Buy It", emoji: "💎", category: 'covenants' },
    { id: 46, character: "The Sower", description: "Seed Fell on Good Ground Yielding 100-Fold", emoji: "🌱", category: 'covenants' },
    { id: 47, character: "The True Vine", description: "Every Branch in Me That Beareth Fruit", emoji: "🍇", category: 'covenants' },
    { id: 48, character: "The Good Shepherd", description: "Giveth His Life for the Sheep", emoji: "🐑", category: 'covenants' },
];

type CardItem = {
    uniqueId: string;
    pairId: number;
    text: string;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
};

function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function MemoryMatchGame() {
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert' | 'scholar'>('medium');
    const [themeFilter, setThemeFilter] = useState<string>('all');
    const [playMode, setPlayMode] = useState<'solo' | 'twoPlayer'>('solo');
    const [gameState, setGameState] = useState<'start' | 'playing' | 'won'>('start');
    const [cards, setCards] = useState<CardItem[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matchesFound, setMatchesFound] = useState(0);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [isLockBoard, setIsLockBoard] = useState(false);
    const [bestScores, setBestScores] = useState<Record<string, number>>({});

    // 2-Player Pass-and-Play State
    const [playerTurn, setPlayerTurn] = useState<1 | 2>(1);
    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('memory_match_best_scores_v2');
            if (saved) setBestScores(JSON.parse(saved));
        } catch {}
    }, []);

    const pairCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : difficulty === 'hard' ? 12 : difficulty === 'expert' ? 16 : 20;

    const startNewGame = (diff = difficulty, theme = themeFilter, mode = playMode) => {
        setDifficulty(diff);
        setThemeFilter(theme);
        setPlayMode(mode);
        const count = diff === 'easy' ? 6 : diff === 'medium' ? 8 : diff === 'hard' ? 12 : diff === 'expert' ? 16 : 20;

        let pool = MASSIVE_PAIRS;
        if (theme !== 'all') {
            pool = MASSIVE_PAIRS.filter(p => p.category === theme);
            if (pool.length < count) pool = MASSIVE_PAIRS;
        }

        const selectedPairs = shuffle(pool).slice(0, count);

        const cardDeck: CardItem[] = [];
        selectedPairs.forEach(p => {
            cardDeck.push({
                uniqueId: `a-${p.id}`,
                pairId: p.id,
                text: p.character,
                emoji: p.emoji,
                isFlipped: false,
                isMatched: false,
            });
            cardDeck.push({
                uniqueId: `b-${p.id}`,
                pairId: p.id,
                text: p.description,
                emoji: "✝️",
                isFlipped: false,
                isMatched: false,
            });
        });

        setCards(shuffle(cardDeck));
        setFlippedIndices([]);
        setMoves(0);
        setMatchesFound(0);
        setSecondsElapsed(0);
        setIsLockBoard(false);
        setPlayerTurn(1);
        setP1Score(0);
        setP2Score(0);
        setGameState('playing');
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState === 'playing') {
            interval = setInterval(() => {
                setSecondsElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState]);

    const handleCardClick = (index: number) => {
        if (isLockBoard) return;
        if (cards[index].isMatched || cards[index].isFlipped) return;
        if (flippedIndices.includes(index)) return;

        gameSound.playCardFlip();
        triggerHaptic('tap');

        const updated = [...cards];
        updated[index].isFlipped = true;
        setCards(updated);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setIsLockBoard(true);
            setMoves(m => m + 1);

            const [firstIdx, secondIdx] = newFlipped;
            const firstCard = cards[firstIdx];
            const secondCard = cards[secondIdx];

            if (firstCard.pairId === secondCard.pairId) {
                // MATCH FOUND!
                setTimeout(() => {
                    gameSound.playSuccess();
                    triggerHaptic('success');

                    const matchedCards = [...cards];
                    matchedCards[firstIdx].isMatched = true;
                    matchedCards[secondIdx].isMatched = true;
                    setCards(matchedCards);
                    setFlippedIndices([]);
                    setIsLockBoard(false);
                    const newMatches = matchesFound + 1;
                    setMatchesFound(newMatches);

                    if (playMode === 'twoPlayer') {
                        if (playerTurn === 1) setP1Score(s => s + 1);
                        else setP2Score(s => s + 1);
                        // Player keeps turn upon finding a match!
                    }

                    if (newMatches === pairCount) {
                        setGameState('won');
                        gameSound.playFanfare();
                        triggerHaptic('heavy');
                        triggerRealisticConfetti();
                        earnTalents(25);
                        recordGameWin('memory');

                        if (difficulty === 'hard' || difficulty === 'expert') {
                            unlockAchievement('memory_champion');
                        }

                        if (playMode === 'solo') {
                            const currentBest = bestScores[difficulty] || 999;
                            if (moves + 1 < currentBest) {
                                const newBest = { ...bestScores, [difficulty]: moves + 1 };
                                setBestScores(newBest);
                                try {
                                    localStorage.setItem('memory_match_best_scores_v2', JSON.stringify(newBest));
                                } catch {}
                            }
                        }
                    }
                }, 450);
            } else {
                // MISMATCH
                setTimeout(() => {
                    gameSound.playError();
                    triggerHaptic('error');

                    const resetCards = [...cards];
                    resetCards[firstIdx].isFlipped = false;
                    resetCards[secondIdx].isFlipped = false;
                    setCards(resetCards);
                    setFlippedIndices([]);
                    setIsLockBoard(false);

                    if (playMode === 'twoPlayer') {
                        // Pass turn to the other player
                        setPlayerTurn(prev => (prev === 1 ? 2 : 1));
                    }
                }, 850);
            }
        }
    };

    const starCount = useMemo(() => {
        if (moves <= pairCount + 3) return 3;
        if (moves <= pairCount + 8) return 2;
        return 1;
    }, [moves, pairCount]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/40 text-slate-800 flex flex-col font-sans">
            {/* Top Bar with Talents & Badges */}
            <GameTopBar
                title="Bible Memory Match"
                backHref="/games"
                backLabel="Games"
                theme="light"
                extraPill={
                    gameState === 'playing' ? (
                        <button
                            onClick={() => startNewGame()}
                            className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full hover:bg-amber-100 flex items-center gap-1 transition-all cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Reset
                        </button>
                    ) : null
                }
            />

            <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-xl mx-auto w-full text-center space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <span className="text-4xl">🃏</span>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 48 Holy Scripture Pairs (KJV)
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-2">
                                    Bible Memory Match
                                </h1>
                                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                                    Connect Scripture heroes, parables, and covenants! Play solo or challenge family in 2-Player Pass &amp; Play.
                                </p>
                            </div>

                            {/* Mode: Solo vs 2-Player Pass & Play */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Game Mode
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            gameSound.playTap();
                                            triggerHaptic('tap');
                                            setPlayMode('solo');
                                        }}
                                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                            playMode === 'solo'
                                                ? 'bg-amber-500 text-white border-amber-600 shadow-md font-bold'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="text-xs">Solo Memory</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            gameSound.playTap();
                                            triggerHaptic('tap');
                                            setPlayMode('twoPlayer');
                                        }}
                                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                            playMode === 'twoPlayer'
                                                ? 'bg-purple-600 text-white border-purple-700 shadow-md font-bold'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs">👥 2-Player Pass & Play</span>
                                    </button>
                                </div>
                            </div>

                            {/* Difficulty Selector */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Grid Size & Difficulty
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                    {[
                                        { id: 'easy', label: 'Easy (12)', count: 6 },
                                        { id: 'medium', label: 'Medium (16)', count: 8 },
                                        { id: 'hard', label: 'Hard (24)', count: 12 },
                                        { id: 'expert', label: 'Expert (32)', count: 16 },
                                        { id: 'scholar', label: 'Scholar (40)', count: 20 },
                                    ].map(d => (
                                        <button
                                            key={d.id}
                                            type="button"
                                            onClick={() => {
                                                gameSound.playTap();
                                                triggerHaptic('tap');
                                                setDifficulty(d.id as any);
                                            }}
                                            className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                                                difficulty === d.id
                                                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md font-bold'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="text-xs font-bold">{d.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Theme Filter */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Card Theme
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        { id: 'all', label: '✨ All 48 Pairs' },
                                        { id: 'patriarchs', label: '📜 Patriarchs & Judges' },
                                        { id: 'prophets', label: '👑 Prophets & Kings' },
                                        { id: 'apostles', label: '🕊️ Gospels & Apostles' },
                                        { id: 'covenants', label: '✝️ Parables & Covenants' },
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => {
                                                gameSound.playTap();
                                                triggerHaptic('tap');
                                                setThemeFilter(t.id);
                                            }}
                                            className={`p-2 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                                                themeFilter === t.id
                                                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    gameSound.playTap();
                                    triggerHaptic('tap');
                                    startNewGame(difficulty, themeFilter, playMode);
                                }}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                Start Game <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === 'playing' && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            {/* Score & Turn Banner */}
                            {playMode === 'twoPlayer' ? (
                                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                                    <div className={`p-3 rounded-2xl border text-center transition-all ${
                                        playerTurn === 1 
                                            ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400 text-blue-950 font-bold shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-500 opacity-60'
                                    }`}>
                                        <div className="text-xs">🔵 Player 1 {playerTurn === 1 && '(Your Turn!)'}</div>
                                        <div className="text-xl font-black">{p1Score} <span className="text-xs font-normal">pairs</span></div>
                                    </div>
                                    <div className={`p-3 rounded-2xl border text-center transition-all ${
                                        playerTurn === 2 
                                            ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400 text-purple-950 font-bold shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-500 opacity-60'
                                    }`}>
                                        <div className="text-xs">🟣 Player 2 {playerTurn === 2 && '(Your Turn!)'}</div>
                                        <div className="text-xl font-black">{p2Score} <span className="text-xs font-normal">pairs</span></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs max-w-md mx-auto text-xs font-bold text-slate-600">
                                    <div className="flex items-center gap-1 text-emerald-700">
                                        <span>Matches:</span>
                                        <span className="text-sm font-black">{matchesFound}/{pairCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-700">
                                        <span>Flips:</span>
                                        <span className="text-sm font-black">{moves}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-700">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="font-mono text-sm">{formatTime(secondsElapsed)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Cards Grid */}
                            <div className={`grid gap-2 sm:gap-3 mx-auto w-full ${
                                difficulty === 'easy'
                                    ? 'grid-cols-3 sm:grid-cols-4 max-w-lg'
                                    : difficulty === 'medium'
                                    ? 'grid-cols-4 max-w-xl'
                                    : difficulty === 'hard'
                                    ? 'grid-cols-4 sm:grid-cols-6 max-w-2xl'
                                    : difficulty === 'expert'
                                    ? 'grid-cols-4 sm:grid-cols-8 max-w-3xl'
                                    : 'grid-cols-5 sm:grid-cols-8 max-w-4xl'
                            }`}>
                                {cards.map((card, idx) => {
                                    const isRevealed = card.isFlipped || card.isMatched;
                                    return (
                                        <motion.div
                                            key={card.uniqueId}
                                            whileTap={{ scale: card.isMatched ? 1 : 0.96 }}
                                            onClick={() => handleCardClick(idx)}
                                            className={`aspect-[4/5] rounded-2xl p-1.5 sm:p-2.5 flex flex-col items-center justify-center text-center cursor-pointer select-none touch-manipulation transition-all duration-300 relative ${
                                                card.isMatched
                                                    ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-xs opacity-90'
                                                    : isRevealed
                                                    ? 'bg-white border-2 border-amber-500 shadow-md text-slate-900'
                                                    : 'bg-gradient-to-br from-amber-500 to-amber-600 border border-amber-600 shadow-sm text-white hover:brightness-105'
                                            }`}
                                        >
                                            {isRevealed ? (
                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                    <span className="text-xl sm:text-2xl md:text-3xl mb-0.5 sm:mb-1">{card.emoji}</span>
                                                    <span className="font-bold text-[10px] sm:text-xs md:text-sm leading-tight text-slate-900 line-clamp-3">
                                                        {card.text}
                                                    </span>
                                                    {card.isMatched && (
                                                        <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold mt-0.5 sm:mt-1">
                                                            ✓ Matched
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm mb-1">
                                                        ✝️
                                                    </div>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-100">
                                                        Tap
                                                    </span>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* WON SCREEN */}
                    {gameState === 'won' && (
                        <motion.div
                            key="won"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-md mx-auto text-center space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>

                            <div>
                                {playMode === 'twoPlayer' ? (
                                    <>
                                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-1">
                                            {p1Score > p2Score ? "🔵 Player 1 Wins!" : p2Score > p1Score ? "🟣 Player 2 Wins!" : "🤝 It's a Tie!"}
                                        </h2>
                                        <p className="text-slate-500 text-sm">
                                            Final Score: <strong>Player 1 ({p1Score})</strong> vs <strong>Player 2 ({p2Score})</strong>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-1">
                                            Praise the Lord!
                                        </h2>
                                        <p className="text-slate-500 text-sm">
                                            You matched all {pairCount} Bible pairs successfully!
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                                <span>🪙 +25 Talents Earned!</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                                <div>
                                    <span className="text-slate-400 uppercase font-bold block">Total Time</span>
                                    <div className="text-xl font-black font-mono text-slate-800">{formatTime(secondsElapsed)}</div>
                                </div>
                                <div>
                                    <span className="text-slate-400 uppercase font-bold block">Total Flips</span>
                                    <div className="text-xl font-black font-mono text-slate-800">{moves} moves</div>
                                </div>
                            </div>

                            {/* WhatsApp Challenge Share */}
                            <div>
                                <ShareScoreButton
                                    gameName="Bible Memory Match"
                                    resultDetails={
                                        playMode === 'twoPlayer'
                                            ? `Completed 2-Player Match! Player 1 (${p1Score}) vs Player 2 (${p2Score}) in ${formatTime(secondsElapsed)}!`
                                            : `Matched all ${pairCount} pairs in ${moves} moves and ${formatTime(secondsElapsed)}!`
                                    }
                                    urlPath="/games/memory"
                                    variant="whatsapp"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                                <button
                                    onClick={() => startNewGame(difficulty, themeFilter, playMode)}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                                >
                                    <RotateCcw className="w-4 h-4" /> Play Again
                                </button>
                                <button
                                    onClick={() => setGameState('start')}
                                    className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                                >
                                    Change Mode
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
