'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Trophy, Clock, Sparkles, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';

interface CardPair {
    id: number;
    character: string;
    description: string;
    emoji: string;
    category: 'heroes' | 'miracles' | 'prophets' | 'foursquare';
}

const MASSIVE_PAIRS: CardPair[] = [
    // Bible Heroes
    { id: 1, character: "Noah", description: "Built the Ark", emoji: "🚢", category: 'heroes' },
    { id: 2, character: "David", description: "Defeated Goliath", emoji: "🪨", category: 'heroes' },
    { id: 3, character: "Moses", description: "Parted the Red Sea", emoji: "🌊", category: 'heroes' },
    { id: 4, character: "Jonah", description: "Swallowed by a Fish", emoji: "🐋", category: 'heroes' },
    { id: 5, character: "Daniel", description: "Survived the Lions' Den", emoji: "🦁", category: 'heroes' },
    { id: 6, character: "Abraham", description: "Father of Many Nations", emoji: "⭐", category: 'heroes' },
    { id: 7, character: "Joseph", description: "Coat of Many Colors", emoji: "🧥", category: 'heroes' },
    { id: 8, character: "Samson", description: "Unmatched Strength", emoji: "💪", category: 'heroes' },
    { id: 9, character: "Ruth", description: "Loyal Daughter-in-law", emoji: "🌾", category: 'heroes' },
    { id: 10, character: "Esther", description: "Brave Queen of Persia", emoji: "👑", category: 'heroes' },
    { id: 11, character: "Joshua", description: "Fell the Walls of Jericho", emoji: "🎺", category: 'heroes' },
    { id: 12, character: "Gideon", description: "300 Brave Warriors", emoji: "🏺", category: 'heroes' },
    { id: 13, character: "Deborah", description: "Prophetess & Judge of Israel", emoji: "🌴", category: 'heroes' },
    { id: 14, character: "Nehemiah", description: "Rebuilt Jerusalem's Walls", emoji: "🧱", category: 'heroes' },
    { id: 15, character: "Shadrach & Friends", description: "Fiery Furnace Survivors", emoji: "🔥", category: 'heroes' },

    // Miracles & New Testament
    { id: 16, character: "Peter", description: "Walked on Water", emoji: "🚶‍♂️", category: 'miracles' },
    { id: 17, character: "Paul", description: "Apostle to the Gentiles", emoji: "📜", category: 'miracles' },
    { id: 18, character: "Lazarus", description: "Raised After 4 Days", emoji: "🪦", category: 'miracles' },
    { id: 19, character: "Zacchaeus", description: "Climbed a Sycamore Tree", emoji: "🌳", category: 'miracles' },
    { id: 20, character: "Blind Bartimaeus", description: "Healed by Jesus", emoji: "👁️", category: 'miracles' },
    { id: 21, character: "Stephen", description: "First Christian Martyr", emoji: "✨", category: 'miracles' },
    { id: 22, character: "Philip", description: "Preached to Ethiopian Official", emoji: "📖", category: 'miracles' },
    { id: 23, character: "Timothy", description: "Faithful Young Pastor", emoji: "📜", category: 'miracles' },
    { id: 24, character: "John the Baptist", description: "Baptized Jesus in Jordan", emoji: "🕊️", category: 'miracles' },

    // Prophets & Kings
    { id: 25, character: "Elijah", description: "Called Fire from Heaven", emoji: "🔥", category: 'prophets' },
    { id: 26, character: "Elisha", description: "Double Portion of Spirit", emoji: "⚡", category: 'prophets' },
    { id: 27, character: "Solomon", description: "Wisest King of Israel", emoji: "🏛️", category: 'prophets' },
    { id: 28, character: "Hannah", description: "Mother of Prophet Samuel", emoji: "👶", category: 'prophets' },
    { id: 29, character: "Josiah", description: "Boy King Who Restored the Law", emoji: "👑", category: 'prophets' },
    { id: 30, character: "Isaiah", description: "Prophesied the Messiah", emoji: "📜", category: 'prophets' },

    // Foursquare Gospel Church Heritage
    { id: 31, character: "Aimee Semple McPherson", description: "Foursquare Founder (1923)", emoji: "⛪", category: 'foursquare' },
    { id: 32, character: "Rev. Harold & Faye Curtis", description: "Pioneered Nigeria in 1955", emoji: "🇳🇬", category: 'foursquare' },
    { id: 33, character: "Rev. (Dr.) Sam Aboyeji", description: "General Overseer Nigeria", emoji: "✝️", category: 'foursquare' },
    { id: 34, character: "Ajebo Camp", description: "Main National Camp in Ogun", emoji: "⛺", category: 'foursquare' },
    { id: 35, character: "4-Fold Gospel", description: "Saviour, Baptizer, Healer, King", emoji: "🛡️", category: 'foursquare' },
    { id: 36, character: "Platinum Jubilee", description: "70th Anniversary in 2025", emoji: "🎉", category: 'foursquare' },
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
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
    const [themeFilter, setThemeFilter] = useState<string>('all');
    const [gameState, setGameState] = useState<'start' | 'playing' | 'won'>('start');
    const [cards, setCards] = useState<CardItem[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matchesFound, setMatchesFound] = useState(0);
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [isLockBoard, setIsLockBoard] = useState(false);
    const [bestScores, setBestScores] = useState<Record<string, number>>({});

    useEffect(() => {
        try {
            const saved = localStorage.getItem('memory_match_best_scores_v2');
            if (saved) setBestScores(JSON.parse(saved));
        } catch {}
    }, []);

    const pairCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : difficulty === 'hard' ? 12 : 15;

    const startNewGame = (diff = difficulty, theme = themeFilter) => {
        setDifficulty(diff);
        setThemeFilter(theme);
        const count = diff === 'easy' ? 6 : diff === 'medium' ? 8 : diff === 'hard' ? 12 : 15;

        let pool = MASSIVE_PAIRS;
        if (theme !== 'all') {
            pool = MASSIVE_PAIRS.filter(p => p.category === theme);
            if (pool.length < count) pool = MASSIVE_PAIRS; // Fallback
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
                setTimeout(() => {
                    const matchedCards = [...cards];
                    matchedCards[firstIdx].isMatched = true;
                    matchedCards[secondIdx].isMatched = true;
                    setCards(matchedCards);
                    setFlippedIndices([]);
                    setIsLockBoard(false);
                    const newMatches = matchesFound + 1;
                    setMatchesFound(newMatches);

                    if (newMatches === pairCount) {
                        setGameState('won');
                        triggerRealisticConfetti();

                        const currentBest = bestScores[difficulty] || 999;
                        if (moves + 1 < currentBest) {
                            const newBest = { ...bestScores, [difficulty]: moves + 1 };
                            setBestScores(newBest);
                            try {
                                localStorage.setItem('memory_match_best_scores_v2', JSON.stringify(newBest));
                            } catch {}
                        }
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[firstIdx].isFlipped = false;
                    resetCards[secondIdx].isFlipped = false;
                    setCards(resetCards);
                    setFlippedIndices([]);
                    setIsLockBoard(false);
                }, 900);
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
            {/* Header */}
            <div className="bg-white/90 border-b border-slate-200 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Games</span>
                    </Link>
                    <div className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                        <span>🃏 Bible Memory Match</span>
                    </div>
                    {gameState === 'playing' ? (
                        <button
                            onClick={() => startNewGame()}
                            className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full hover:bg-amber-100 flex items-center gap-1 transition-all cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Restart
                        </button>
                    ) : (
                        <div className="w-16" />
                    )}
                </div>
            </div>

            <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-xl mx-auto text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <span className="text-4xl">🃏</span>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" /> 36 Bible Character Pairs
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-2">
                                    Bible Memory Match
                                </h1>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                                    Flip cards to connect each Bible & Church figure with their faith act!
                                </p>
                            </div>

                            {/* Deck Theme Selector */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Select Card Deck Theme
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                    {[
                                        { id: 'all', label: 'All Heroes (36)' },
                                        { id: 'heroes', label: 'Old Testament' },
                                        { id: 'miracles', label: 'Miracles & NT' },
                                        { id: 'foursquare', label: 'Foursquare' }
                                    ].map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setThemeFilter(t.id)}
                                            className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                                                themeFilter === t.id
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Grid Size Selector */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Choose Grid Size
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { id: 'easy', label: 'Easy', detail: '6 Pairs (12 Cards)' },
                                        { id: 'medium', label: 'Medium', detail: '8 Pairs (16 Cards)' },
                                        { id: 'hard', label: 'Hard', detail: '12 Pairs (24 Cards)' },
                                        { id: 'expert', label: 'Expert', detail: '15 Pairs (30 Cards)' },
                                    ].map(d => (
                                        <button
                                            key={d.id}
                                            type="button"
                                            onClick={() => setDifficulty(d.id as any)}
                                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                                                difficulty === d.id
                                                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="text-sm font-bold">{d.label}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{d.detail}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => startNewGame(difficulty, themeFilter)}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                            >
                                Play Now <ChevronRight className="w-5 h-5" />
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
                            className="flex flex-col"
                        >
                            {/* HUD Bar */}
                            <div className="flex items-center justify-between mb-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-slate-700 text-xs sm:text-sm font-medium">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span>Time: <strong className="font-mono text-slate-900">{formatTime(secondsElapsed)}</strong></span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="hidden xs:inline text-xs text-slate-400 uppercase font-bold mr-1">Rating:</span>
                                    {[1, 2, 3].map(s => (
                                        <Star
                                            key={s}
                                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                                s <= starCount
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-slate-200'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
                                    <span className="text-slate-600">Moves: <strong className="text-slate-900">{moves}</strong></span>
                                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] sm:text-xs">
                                        {matchesFound}/{pairCount}
                                    </span>
                                </div>
                            </div>

                            {/* Card Grid */}
                            <div
                                className={`grid gap-2 sm:gap-3.5 mx-auto w-full ${
                                    difficulty === 'easy'
                                        ? 'grid-cols-3 sm:grid-cols-4 max-w-xl'
                                        : difficulty === 'medium'
                                        ? 'grid-cols-4 max-w-2xl'
                                        : difficulty === 'hard'
                                        ? 'grid-cols-3 min-[420px]:grid-cols-4 sm:grid-cols-6 max-w-3xl'
                                        : 'grid-cols-3 min-[400px]:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 max-w-4xl'
                                }`}
                            >
                                {cards.map((card, idx) => {
                                    const isRevealed = card.isFlipped || card.isMatched;

                                    return (
                                        <motion.div
                                            key={card.uniqueId}
                                            layout
                                            whileHover={{ scale: card.isMatched ? 1 : 1.03 }}
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
                            className="max-w-md mx-auto text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-1">
                                    Praise the Lord!
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    You matched all {pairCount} Bible pairs successfully!
                                </p>
                            </div>

                            <div className="flex justify-center gap-2">
                                {[1, 2, 3].map(s => (
                                    <Star
                                        key={s}
                                        className={`w-8 h-8 ${
                                            s <= starCount
                                                ? 'text-amber-400 fill-amber-400 animate-bounce'
                                                : 'text-slate-200'
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <span className="text-xs text-slate-400 uppercase font-bold">Total Time</span>
                                    <div className="text-2xl font-black font-mono text-slate-800">{formatTime(secondsElapsed)}</div>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 uppercase font-bold">Total Flips</span>
                                    <div className="text-2xl font-black font-mono text-slate-800">{moves} moves</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    onClick={() => startNewGame(difficulty, themeFilter)}
                                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
                                >
                                    <RotateCcw className="w-4 h-4" /> Play Again
                                </button>
                                <Link
                                    href="/games"
                                    className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 flex items-center justify-center"
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
