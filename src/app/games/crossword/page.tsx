'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, ChevronRight, Trophy, Lock, Sparkles, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────────────────── Types ───────────────────── */

type Clue = {
    num: number;
    dir: 'across' | 'down';
    text: string;
    answer: string;
    row: number;
    col: number;
};

type Level = {
    id: number;
    title: string;
    subtitle: string;
    rows: number;
    cols: number;
    clues: Clue[];
};

/* ───────────────────── Levels ───────────────────── */

const LEVELS: Level[] = [
    {
        id: 1,
        title: 'The Beginning',
        subtitle: 'Genesis & Creation',
        rows: 5,
        cols: 5,
        clues: [
            { num: 1, dir: 'across', text: 'Killed Goliath', answer: 'DAVID', row: 0, col: 0 },
            { num: 2, dir: 'down', text: 'Brother of Cain', answer: 'ABEL', row: 0, col: 1 },
            { num: 3, dir: 'down', text: 'Garden of ___', answer: 'EDEN', row: 0, col: 3 },
            { num: 4, dir: 'across', text: 'First woman', answer: 'EVE', row: 2, col: 1 },
        ],
    },
    {
        id: 2,
        title: 'Faith & Miracles',
        subtitle: 'New Testament Wonders',
        rows: 6,
        cols: 6,
        clues: [
            { num: 1, dir: 'across', text: 'God is ___', answer: 'HOLY', row: 0, col: 0 },
            { num: 1, dir: 'down', text: 'Faith, ___, and Love', answer: 'HOPE', row: 0, col: 0 },
            { num: 2, dir: 'down', text: 'Jesus fed 5000 with these', answer: 'LOAVES', row: 0, col: 2 },
            { num: 3, dir: 'across', text: 'Talk to God', answer: 'PRAY', row: 2, col: 0 },
            { num: 4, dir: 'across', text: 'Jesus said "I am the ___"', answer: 'VINE', row: 4, col: 2 },
        ],
    },
    {
        id: 3,
        title: 'Grace & Kings',
        subtitle: 'Old Testament Heroes',
        rows: 5,
        cols: 5,
        clues: [
            { num: 1, dir: 'across', text: 'Unmerited favor', answer: 'GRACE', row: 0, col: 0 },
            { num: 1, dir: 'down', text: 'Creator of heaven and earth', answer: 'GOD', row: 0, col: 0 },
            { num: 2, dir: 'down', text: 'The first man', answer: 'ADAM', row: 1, col: 2 },
            { num: 3, dir: 'across', text: 'A man after God\'s heart', answer: 'DAVID', row: 2, col: 0 },
        ],
    },
];

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

/* ───────────────────── Component ───────────────────── */

export default function CrosswordGame() {
    const [screen, setScreen] = useState<'menu' | 'play'>('menu');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [gridState, setGridState] = useState<Record<string, string>>({});
    const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
    const [direction, setDirection] = useState<'across' | 'down'>('across');
    const [levelComplete, setLevelComplete] = useState(false);
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);
    const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());

    const inputRef = useRef<HTMLInputElement>(null);
    const level = LEVELS[currentLevel];

    /* ── Build cell map ── */
    const buildCellMap = useCallback(() => {
        const cells = new Map<string, { letter: string; num?: number; across?: number; down?: number }>();
        level.clues.forEach((clue) => {
            for (let i = 0; i < clue.answer.length; i++) {
                const r = clue.dir === 'across' ? clue.row : clue.row + i;
                const c = clue.dir === 'across' ? clue.col + i : clue.col;
                const key = `${r}-${c}`;
                if (!cells.has(key)) cells.set(key, { letter: clue.answer[i] });
                const cell = cells.get(key)!;
                if (i === 0) cell.num = clue.num;
                if (clue.dir === 'across') cell.across = clue.num;
                if (clue.dir === 'down') cell.down = clue.num;
            }
        });
        return cells;
    }, [level]);

    const cellsInfo = buildCellMap();

    /* ── Win check ── */
    useEffect(() => {
        if (Object.keys(gridState).length === 0) return;
        let allCorrect = true;
        let filledCount = 0;
        cellsInfo.forEach((info, key) => {
            filledCount++;
            if ((gridState[key] || '').toUpperCase() !== info.letter) allCorrect = false;
        });
        if (allCorrect && Object.keys(gridState).length >= filledCount) {
            setLevelComplete(true);
            setCompletedLevels((prev) => [...new Set([...prev, currentLevel])]);
            confetti({ particleCount: 200, spread: 80, origin: { y: 0.5 }, colors: ['#f59e0b', '#d97706', '#10b981', '#6366f1', '#ec4899'] });
        }
    }, [gridState, cellsInfo, currentLevel]);

    /* ── Select first cell on level start ── */
    useEffect(() => {
        if (screen === 'play' && cellsInfo.size > 0 && !levelComplete) {
            const firstClue = level.clues[0];
            setSelectedCell({ r: firstClue.row, c: firstClue.col });
            setDirection(firstClue.dir);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [currentLevel, screen]);

    /* ── Cell click ── */
    const handleCellClick = (r: number, c: number) => {
        const info = cellsInfo.get(`${r}-${c}`);
        if (!info) return;
        if (selectedCell?.r === r && selectedCell?.c === c) {
            if (info.across && info.down) setDirection((d) => (d === 'across' ? 'down' : 'across'));
        } else {
            setSelectedCell({ r, c });
            if (info.across && !info.down) setDirection('across');
            else if (!info.across && info.down) setDirection('down');
        }
        inputRef.current?.focus();
    };

    /* ── Navigation helpers ── */
    const getNextCell = (r: number, c: number, dir: 'across' | 'down', step: 1 | -1 = 1) => {
        const nr = dir === 'across' ? r : r + step;
        const nc = dir === 'across' ? c + step : c;
        return cellsInfo.has(`${nr}-${nc}`) ? { r: nr, c: nc } : null;
    };

    /* ── Keyboard ── */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (levelComplete || !selectedCell) return;
        const { r, c } = selectedCell;

        if (e.key === 'Backspace') {
            e.preventDefault();
            if (gridState[`${r}-${c}`]) {
                setGridState((prev) => { const n = { ...prev }; delete n[`${r}-${c}`]; return n; });
                setWrongCells((prev) => { const n = new Set(prev); n.delete(`${r}-${c}`); return n; });
            } else {
                const prevCell = getNextCell(r, c, direction, -1);
                if (prevCell) {
                    setSelectedCell(prevCell);
                    setGridState((prev) => { const n = { ...prev }; delete n[`${prevCell.r}-${prevCell.c}`]; return n; });
                    setWrongCells((prev) => { const n = new Set(prev); n.delete(`${prevCell.r}-${prevCell.c}`); return n; });
                }
            }
        } else if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
            let next = null;
            if (e.key === 'ArrowRight') { next = cellsInfo.has(`${r}-${c + 1}`) ? { r, c: c + 1 } : null; setDirection('across'); }
            if (e.key === 'ArrowLeft') { next = cellsInfo.has(`${r}-${c - 1}`) ? { r, c: c - 1 } : null; setDirection('across'); }
            if (e.key === 'ArrowDown') { next = cellsInfo.has(`${r + 1}-${c}`) ? { r: r + 1, c } : null; setDirection('down'); }
            if (e.key === 'ArrowUp') { next = cellsInfo.has(`${r - 1}-${c}`) ? { r: r - 1, c } : null; setDirection('down'); }
            if (next) setSelectedCell(next);
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            const key = `${r}-${c}`;
            const typed = e.key.toUpperCase();
            const correct = cellsInfo.get(key)?.letter;
            setGridState((prev) => ({ ...prev, [key]: typed }));
            if (correct && typed !== correct) {
                setWrongCells((prev) => new Set(prev).add(key));
            } else {
                setWrongCells((prev) => { const n = new Set(prev); n.delete(key); return n; });
            }
            const nextCell = getNextCell(r, c, direction, 1);
            if (nextCell) setSelectedCell(nextCell);
        }
    };

    /* ── Active clue ── */
    const getActiveClueNum = () => {
        if (!selectedCell) return null;
        const info = cellsInfo.get(`${selectedCell.r}-${selectedCell.c}`);
        if (!info) return null;
        return direction === 'across' ? info.across : info.down;
    };
    const activeClueNum = getActiveClueNum();

    /* ── Active clue text ── */
    const activeClue = level.clues.find(
        (c) => c.num === activeClueNum && c.dir === direction
    );

    /* ── Reset level ── */
    const resetLevel = () => {
        setGridState({});
        setSelectedCell(null);
        setLevelComplete(false);
        setWrongCells(new Set());
    };

    /* ── Start a level ── */
    const startLevel = (idx: number) => {
        setCurrentLevel(idx);
        setGridState({});
        setSelectedCell(null);
        setLevelComplete(false);
        setWrongCells(new Set());
        setScreen('play');
    };

    /* ═══════════════════ MENU SCREEN ═══════════════════ */
    if (screen === 'menu') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
                {/* Hero */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-200/20 blur-3xl" />
                    </div>

                    <div className="relative max-w-2xl mx-auto px-4 pt-24 pb-12 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm mb-8">
                            <ArrowLeft className="w-4 h-4" /> Back Home
                        </Link>

                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <span className="text-3xl">✝️</span>
                        </div>

                        <h1 className="font-serif font-bold text-4xl sm:text-5xl text-slate-900 mb-3 tracking-tight">
                            Bible Crossword
                        </h1>
                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                            Test your knowledge of the Scriptures. Solve crossword puzzles across multiple levels!
                        </p>
                    </div>
                </div>

                {/* Level Cards */}
                <div className="max-w-lg mx-auto px-4 pb-24 space-y-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Select a Level</p>
                    {LEVELS.map((lv, idx) => {
                        const isCompleted = completedLevels.includes(idx);
                        const isLocked = idx > 0 && !completedLevels.includes(idx - 1);

                        return (
                            <motion.button
                                key={lv.id}
                                whileHover={!isLocked ? { scale: 1.02 } : {}}
                                whileTap={!isLocked ? { scale: 0.98 } : {}}
                                onClick={() => !isLocked && startLevel(idx)}
                                disabled={isLocked}
                                className={`w-full text-left rounded-2xl p-5 border-2 transition-all duration-200 ${
                                    isLocked
                                        ? 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                                        : isCompleted
                                            ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 hover:shadow-md cursor-pointer'
                                            : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Level Number */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                                        isLocked
                                            ? 'bg-slate-100 text-slate-300'
                                            : isCompleted
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {isLocked ? <Lock className="w-5 h-5" /> : isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 text-base">{lv.title}</h3>
                                        <p className="text-slate-400 text-sm">{lv.subtitle} · {lv.clues.length} clues</p>
                                    </div>

                                    {/* Arrow */}
                                    {!isLocked && (
                                        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isCompleted ? 'text-emerald-400' : 'text-slate-300'}`} />
                                    )}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        );
    }

    /* ═══════════════════ PLAY SCREEN ═══════════════════ */
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex flex-col">

            {/* Top Bar */}
            <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <button
                        onClick={() => { resetLevel(); setScreen('menu'); }}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Levels
                    </button>

                    <h2 className="font-serif font-bold text-slate-800 text-base">
                        {level.title}
                    </h2>

                    <button
                        onClick={resetLevel}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors text-sm"
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Active Clue Banner */}
            <div className="bg-amber-50 border-b border-amber-100">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
                    {activeClue ? (
                        <>
                            <span className="flex-shrink-0 px-2.5 py-1 rounded-md bg-amber-200/60 text-amber-800 text-xs font-bold uppercase">
                                {activeClue.num}{activeClue.dir === 'across' ? 'A' : 'D'}
                            </span>
                            <span className="text-amber-900 text-sm font-medium">{activeClue.text}</span>
                        </>
                    ) : (
                        <span className="text-amber-600/60 text-sm italic">Tap a cell to start</span>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full px-4 pt-6 pb-24">

                {/* Grid */}
                <div className="flex justify-center lg:justify-start" onClick={() => inputRef.current?.focus()}>
                    <div className="inline-block">
                        {/* Grid container */}
                        <div
                            className="inline-grid gap-0 rounded-xl overflow-hidden shadow-xl border border-slate-200"
                            style={{
                                gridTemplateColumns: `repeat(${level.cols}, 1fr)`,
                            }}
                        >
                            {Array.from({ length: level.rows * level.cols }, (_, idx) => {
                                const r = Math.floor(idx / level.cols);
                                const c = idx % level.cols;
                                const key = `${r}-${c}`;
                                const info = cellsInfo.get(key);
                                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                                const isHighlighted = info && activeClueNum && (
                                    (direction === 'across' && info.across === activeClueNum) ||
                                    (direction === 'down' && info.down === activeClueNum)
                                );
                                const isWrong = wrongCells.has(key);
                                const isFilled = !!gridState[key];
                                const isCorrectlyFilled = isFilled && gridState[key] === info?.letter;

                                if (!info) {
                                    return (
                                        <div
                                            key={key}
                                            className="w-11 h-11 sm:w-14 sm:h-14"
                                            style={{ background: '#e2e8f0' }}
                                        />
                                    );
                                }

                                return (
                                    <div
                                        key={key}
                                        onClick={() => handleCellClick(r, c)}
                                        className={`
                                            relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center
                                            cursor-pointer select-none transition-colors duration-150
                                            border border-slate-200
                                            ${isSelected
                                                ? 'bg-amber-400 text-white z-10 ring-2 ring-amber-500 ring-offset-1'
                                                : isHighlighted
                                                    ? 'bg-amber-100 text-slate-900'
                                                    : 'bg-white text-slate-800'
                                            }
                                        `}
                                    >
                                        {/* Number label */}
                                        {info.num && (
                                            <span className={`absolute top-0.5 left-1 text-[9px] sm:text-[10px] font-bold leading-none ${
                                                isSelected ? 'text-white/80' : 'text-slate-400'
                                            }`}>
                                                {info.num}
                                            </span>
                                        )}

                                        {/* Letter */}
                                        <span className={`text-base sm:text-xl font-bold ${
                                            isSelected
                                                ? 'text-white'
                                                : isWrong
                                                    ? 'text-red-500'
                                                    : isCorrectlyFilled
                                                        ? 'text-emerald-600'
                                                        : 'text-slate-800'
                                        }`}>
                                            {gridState[key] || ''}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Clues Panel */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Across */}
                        <div className="p-5 pb-4">
                            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">Across</h3>
                            <div className="space-y-1">
                                {level.clues.filter((c) => c.dir === 'across').map((c) => {
                                    const isActive = direction === 'across' && activeClueNum === c.num;
                                    return (
                                        <button
                                            key={`a-${c.num}`}
                                            onClick={() => { handleCellClick(c.row, c.col); setDirection('across'); }}
                                            className={`w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all ${
                                                isActive
                                                    ? 'bg-amber-100 text-amber-900 font-semibold'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className="font-bold text-slate-400 mr-2 w-5 inline-block">{c.num}.</span>
                                            {c.text}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 mx-5" />

                        {/* Down */}
                        <div className="p-5 pt-4">
                            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">Down</h3>
                            <div className="space-y-1">
                                {level.clues.filter((c) => c.dir === 'down').map((c) => {
                                    const isActive = direction === 'down' && activeClueNum === c.num;
                                    return (
                                        <button
                                            key={`d-${c.num}`}
                                            onClick={() => { handleCellClick(c.row, c.col); setDirection('down'); }}
                                            className={`w-full text-left text-sm px-3 py-2.5 rounded-lg transition-all ${
                                                isActive
                                                    ? 'bg-amber-100 text-amber-900 font-semibold'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className="font-bold text-slate-400 mr-2 w-5 inline-block">{c.num}.</span>
                                            {c.text}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Hidden input for keyboard */}
            <input
                ref={inputRef}
                type="text"
                className="sr-only"
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                value=""
                onChange={() => {}}
            />

            {/* Level Complete Modal */}
            <AnimatePresence>
                {levelComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.85, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <Sparkles className="w-9 h-9 text-white" />
                            </div>

                            <h2 className="font-serif font-bold text-3xl text-slate-900 mb-1">Brilliant!</h2>
                            <p className="text-slate-500 text-sm mb-8">You completed "{level.title}"</p>

                            {currentLevel < LEVELS.length - 1 ? (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => startLevel(currentLevel + 1)}
                                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 text-base"
                                    >
                                        Next Level <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => { resetLevel(); setScreen('menu'); }}
                                        className="w-full text-slate-500 hover:text-slate-700 font-medium py-2 text-sm transition-colors"
                                    >
                                        Back to Levels
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-2">
                                        <Trophy className="w-4 h-4" /> All Levels Complete!
                                    </div>
                                    <button
                                        onClick={() => { resetLevel(); setScreen('menu'); }}
                                        className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold py-4 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base"
                                    >
                                        Back to Menu
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
