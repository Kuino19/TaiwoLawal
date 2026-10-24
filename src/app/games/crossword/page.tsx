'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { triggerConfettiBurst } from '@/lib/confettiBurst';
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Trophy, Lock, Sparkles, RotateCcw, RefreshCw, Delete } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────────────────── Types ───────────────────── */

import { LEVELS, Level, Clue } from './levels';

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
    const [currentPage, setCurrentPage] = useState(0);
    const [mobileClueTab, setMobileClueTab] = useState<'across' | 'down'>('across');

    const LEVELS_PER_PAGE = 10;
    const totalPages = Math.ceil(LEVELS.length / LEVELS_PER_PAGE);

    // Keep mobile clue tab in sync with typing direction
    useEffect(() => {
        setMobileClueTab(direction);
    }, [direction]);

    // Load completed levels from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('crossword_completed_levels');
            if (saved) setCompletedLevels(JSON.parse(saved));
        } catch {}
    }, []);

    // Persist completed levels
    useEffect(() => {
        if (completedLevels.length > 0) {
            try {
                localStorage.setItem('crossword_completed_levels', JSON.stringify(completedLevels));
            } catch {}
        }
    }, [completedLevels]);

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
        if (levelComplete) return; // Guard against infinite loop
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
            triggerConfettiBurst();
        }
    }, [gridState, cellsInfo, currentLevel, levelComplete]);

    /* ── Select first cell on level start ── */
    useEffect(() => {
        if (screen === 'play' && cellsInfo.size > 0 && !levelComplete) {
            const firstClue = level.clues[0];
            setSelectedCell({ r: firstClue.row, c: firstClue.col });
            setDirection(firstClue.dir);
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
    };

    /* ── Navigation helpers ── */
    const getNextCell = (r: number, c: number, dir: 'across' | 'down', step: 1 | -1 = 1) => {
        const nr = dir === 'across' ? r : r + step;
        const nc = dir === 'across' ? c + step : c;
        return cellsInfo.has(`${nr}-${nc}`) ? { r: nr, c: nc } : null;
    };

    /* ── Key input actions (used by both hardware & on-screen keyboard) ── */
    const enterLetter = (letter: string) => {
        if (levelComplete || !selectedCell) return;
        const { r, c } = selectedCell;
        const key = `${r}-${c}`;
        const typed = letter.toUpperCase();
        const correct = cellsInfo.get(key)?.letter;
        setGridState((prev) => ({ ...prev, [key]: typed }));
        if (correct && typed !== correct) {
            setWrongCells((prev) => new Set(prev).add(key));
        } else {
            setWrongCells((prev) => { const n = new Set(prev); n.delete(key); return n; });
        }
        const nextCell = getNextCell(r, c, direction, 1);
        if (nextCell) setSelectedCell(nextCell);
    };

    const handleBackspace = () => {
        if (levelComplete || !selectedCell) return;
        const { r, c } = selectedCell;
        const key = `${r}-${c}`;
        if (gridState[key]) {
            setGridState((prev) => { const n = { ...prev }; delete n[key]; return n; });
            setWrongCells((prev) => { const n = new Set(prev); n.delete(key); return n; });
        } else {
            const prevCell = getNextCell(r, c, direction, -1);
            if (prevCell) {
                setSelectedCell(prevCell);
                setGridState((prev) => { const n = { ...prev }; delete n[`${prevCell.r}-${prevCell.c}`]; return n; });
                setWrongCells((prev) => { const n = new Set(prev); n.delete(`${prevCell.r}-${prevCell.c}`); return n; });
            }
        }
    };

    const toggleDirection = () => {
        setDirection((d) => (d === 'across' ? 'down' : 'across'));
    };

    /* ── Clue Next/Prev Navigation ── */
    const navigateClue = (step: 1 | -1) => {
        if (level.clues.length === 0) return;
        const currentIdx = level.clues.findIndex(c => c.num === activeClueNum && c.dir === direction);
        let nextIdx = (currentIdx + step + level.clues.length) % level.clues.length;
        const nextClue = level.clues[nextIdx];
        setSelectedCell({ r: nextClue.row, c: nextClue.col });
        setDirection(nextClue.dir);
    };

    /* ── Hardware Keyboard ── */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (levelComplete || !selectedCell) return;
        const { r, c } = selectedCell;

        if (e.key === 'Backspace') {
            e.preventDefault();
            handleBackspace();
        } else if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
            let next = null;
            if (e.key === 'ArrowRight') { next = cellsInfo.has(`${r}-${c + 1}`) ? { r, c: c + 1 } : null; setDirection('across'); }
            if (e.key === 'ArrowLeft') { next = cellsInfo.has(`${r}-${c - 1}`) ? { r, c: c - 1 } : null; setDirection('across'); }
            if (e.key === 'ArrowDown') { next = cellsInfo.has(`${r + 1}-${c}`) ? { r: r + 1, c } : null; setDirection('down'); }
            if (e.key === 'ArrowUp') { next = cellsInfo.has(`${r - 1}-${c}`) ? { r: r - 1, c } : null; setDirection('down'); }
            if (next) setSelectedCell(next);
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            enterLetter(e.key);
        }
    };

    /* ── Global Key Listener for Desktop ── */
    useEffect(() => {
        if (screen !== 'play' || levelComplete) return;

        const onGlobalKeyDown = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            if (e.key === 'Backspace') {
                e.preventDefault();
                handleBackspace();
            } else if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
                e.preventDefault();
                if (!selectedCell) return;
                const { r, c } = selectedCell;
                let next = null;
                if (e.key === 'ArrowRight') { next = cellsInfo.has(`${r}-${c + 1}`) ? { r, c: c + 1 } : null; setDirection('across'); }
                if (e.key === 'ArrowLeft') { next = cellsInfo.has(`${r}-${c - 1}`) ? { r, c: c - 1 } : null; setDirection('across'); }
                if (e.key === 'ArrowDown') { next = cellsInfo.has(`${r + 1}-${c}`) ? { r: r + 1, c } : null; setDirection('down'); }
                if (e.key === 'ArrowUp') { next = cellsInfo.has(`${r - 1}-${c}`) ? { r: r - 1, c } : null; setDirection('down'); }
                if (next) setSelectedCell(next);
            } else if (/^[a-zA-Z]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
                enterLetter(e.key);
            }
        };

        window.addEventListener('keydown', onGlobalKeyDown);
        return () => window.removeEventListener('keydown', onGlobalKeyDown);
    }, [screen, levelComplete, selectedCell, direction, cellsInfo, gridState]);

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
                        <Link href="/games" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-sm mb-8">
                            <ArrowLeft className="w-4 h-4" /> Back to Games
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

                {/* Progress Summary Card */}
                <div className="max-w-lg mx-auto px-4 mb-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
                            <span>Total Progress</span>
                            <span className="font-bold text-amber-700">
                                {completedLevels.length} of {LEVELS.length} Completed ({Math.round((completedLevels.length / LEVELS.length) * 100)}%)
                            </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 rounded-full"
                                style={{ width: `${(completedLevels.length / LEVELS.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Page Navigation Tabs */}
                <div className="max-w-lg mx-auto px-4 mb-4">
                    <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
                        {Array.from({ length: totalPages }).map((_, pIdx) => {
                            const start = pIdx * LEVELS_PER_PAGE + 1;
                            const end = Math.min((pIdx + 1) * LEVELS_PER_PAGE, LEVELS.length);
                            const isActive = currentPage === pIdx;
                            const pageCompletedCount = completedLevels.filter(
                                (l) => l >= pIdx * LEVELS_PER_PAGE && l < (pIdx + 1) * LEVELS_PER_PAGE
                            ).length;

                            return (
                                <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => setCurrentPage(pIdx)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                        isActive
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>{start}–{end}</span>
                                    {pageCompletedCount > 0 && (
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                            isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {pageCompletedCount}/{LEVELS_PER_PAGE}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Paginated Level Cards */}
                <div className="max-w-lg mx-auto px-4 pb-12 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                        <span>Levels {currentPage * LEVELS_PER_PAGE + 1} – {Math.min((currentPage + 1) * LEVELS_PER_PAGE, LEVELS.length)}</span>
                        <span>Page {currentPage + 1} of {totalPages}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                        >
                            {LEVELS.slice(currentPage * LEVELS_PER_PAGE, (currentPage + 1) * LEVELS_PER_PAGE).map((lv, pageIdx) => {
                                const idx = currentPage * LEVELS_PER_PAGE + pageIdx;
                                const isCompleted = completedLevels.includes(idx);
                                const isLocked = idx > 0 && !completedLevels.includes(idx - 1);

                                return (
                                    <motion.button
                                        key={lv.id}
                                        whileHover={!isLocked ? { scale: 1.01 } : {}}
                                        whileTap={!isLocked ? { scale: 0.99 } : {}}
                                        onClick={() => !isLocked && startLevel(idx)}
                                        disabled={isLocked}
                                        className={`w-full text-left rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 ${
                                            isLocked
                                                ? 'border-slate-150 bg-slate-50 opacity-50 cursor-not-allowed'
                                                : isCompleted
                                                    ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300 hover:shadow-md cursor-pointer'
                                                    : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {/* Level Number */}
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 ${
                                                isLocked
                                                    ? 'bg-slate-100 text-slate-300'
                                                    : isCompleted
                                                        ? 'bg-emerald-100 text-emerald-600'
                                                        : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {isLocked ? <Lock className="w-4 h-4" /> : isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{lv.title}</h3>
                                                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{lv.subtitle} · {lv.clues.length} clues</p>
                                            </div>

                                            {/* Status Badge / Arrow */}
                                            {!isLocked && (
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    {isCompleted && (
                                                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                                            Solved
                                                        </span>
                                                    )}
                                                    <ChevronRight className={`w-4 h-4 ${isCompleted ? 'text-emerald-500' : 'text-slate-300'}`} />
                                                </div>
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {/* Bottom Pagination Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Previous 10
                        </button>

                        <span className="text-xs font-mono font-bold text-slate-500">
                            Page {currentPage + 1} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={currentPage === totalPages - 1}
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1"
                        >
                            Next 10 <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
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
            <div className="bg-amber-50 border-b border-amber-200/80 sticky top-14 z-10 shadow-xs">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={() => navigateClue(-1)}
                        className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 active:scale-95 transition-all cursor-pointer"
                        title="Previous Clue"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div 
                        onClick={toggleDirection}
                        className="flex-1 flex items-center justify-center gap-2 cursor-pointer select-none text-center min-w-0"
                    >
                        {activeClue ? (
                            <>
                                <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-amber-500 text-white text-xs font-black uppercase tracking-wider">
                                    {activeClue.num}{activeClue.dir === 'across' ? ' Across' : ' Down'}
                                </span>
                                <span className="text-amber-950 text-xs sm:text-sm font-semibold truncate">
                                    {activeClue.text}
                                </span>
                            </>
                        ) : (
                            <span className="text-amber-700/70 text-xs sm:text-sm italic">Tap a cell to begin</span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => navigateClue(1)}
                        className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 active:scale-95 transition-all cursor-pointer"
                        title="Next Clue"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full px-3 sm:px-4 pt-4 sm:pt-6 pb-24">

                {/* Grid & Mobile On-Screen Keyboard */}
                <div className="flex-1 flex flex-col items-center">
                    {/* Grid container with responsive auto-fit */}
                    <div className="w-full flex justify-center items-center overflow-hidden py-1">
                        <div
                            className="grid gap-0 rounded-xl overflow-hidden shadow-lg border-2 border-slate-300 bg-slate-300/80"
                            style={{
                                gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
                                width: `min(100%, ${level.cols * 44}px)`,
                                maxWidth: `${level.cols * 48}px`
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
                                            className="aspect-square bg-slate-200/90"
                                        />
                                    );
                                }

                                return (
                                    <div
                                        key={key}
                                        onClick={() => handleCellClick(r, c)}
                                        className={`
                                            relative aspect-square flex items-center justify-center
                                            cursor-pointer select-none touch-manipulation transition-colors duration-150
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
                                            <span className={`absolute top-0.5 left-1 text-[8px] sm:text-[10px] font-bold leading-none ${
                                                isSelected ? 'text-white/90' : 'text-slate-400'
                                            }`}>
                                                {info.num}
                                            </span>
                                        )}

                                        {/* Letter */}
                                        <span className={`text-sm sm:text-lg md:text-xl font-black ${
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

                    {/* On-Screen Mobile Virtual Keyboard */}
                    <div className="w-full max-w-md mx-auto mt-4 px-1 select-none">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 px-1">
                            <span className="font-semibold text-slate-600 text-[11px]">
                                Typing: <strong className="text-amber-700 uppercase">{direction}</strong>
                            </span>
                            <button
                                type="button"
                                onClick={toggleDirection}
                                className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md hover:bg-amber-100 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                            >
                                <RefreshCw className="w-3 h-3" /> Turn to {direction === 'across' ? 'Down' : 'Across'}
                            </button>
                        </div>

                        {/* Keys Rows */}
                        <div className="space-y-1 sm:space-y-1.5">
                            {/* Row 1 */}
                            <div className="flex gap-1 justify-center">
                                {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((k) => (
                                    <button
                                        key={k}
                                        type="button"
                                        onClick={() => enterLetter(k)}
                                        className="flex-1 min-w-0 h-9 sm:h-11 bg-white hover:bg-amber-50 active:bg-amber-200 border border-slate-300 rounded-lg text-slate-900 font-black text-xs sm:text-sm shadow-xs touch-manipulation cursor-pointer flex items-center justify-center transition-colors"
                                    >
                                        {k}
                                    </button>
                                ))}
                            </div>

                            {/* Row 2 */}
                            <div className="flex gap-1 justify-center px-2">
                                {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((k) => (
                                    <button
                                        key={k}
                                        type="button"
                                        onClick={() => enterLetter(k)}
                                        className="flex-1 min-w-0 h-9 sm:h-11 bg-white hover:bg-amber-50 active:bg-amber-200 border border-slate-300 rounded-lg text-slate-900 font-black text-xs sm:text-sm shadow-xs touch-manipulation cursor-pointer flex items-center justify-center transition-colors"
                                    >
                                        {k}
                                    </button>
                                ))}
                            </div>

                            {/* Row 3 */}
                            <div className="flex gap-1 justify-center">
                                <button
                                    type="button"
                                    onClick={toggleDirection}
                                    className="flex-[1.3] min-w-0 h-9 sm:h-11 bg-amber-100 hover:bg-amber-200 active:bg-amber-300 border border-amber-300 rounded-lg text-amber-900 font-black text-[11px] sm:text-xs shadow-xs touch-manipulation cursor-pointer flex items-center justify-center gap-1 transition-colors px-1"
                                    title="Toggle Direction"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span className="hidden xs:inline">{direction === 'across' ? 'Down' : 'Across'}</span>
                                </button>

                                {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((k) => (
                                    <button
                                        key={k}
                                        type="button"
                                        onClick={() => enterLetter(k)}
                                        className="flex-1 min-w-0 h-9 sm:h-11 bg-white hover:bg-amber-50 active:bg-amber-200 border border-slate-300 rounded-lg text-slate-900 font-black text-xs sm:text-sm shadow-xs touch-manipulation cursor-pointer flex items-center justify-center transition-colors"
                                    >
                                        {k}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleBackspace}
                                    className="flex-[1.3] min-w-0 h-9 sm:h-11 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 border border-slate-300 rounded-lg text-slate-800 font-bold text-xs shadow-xs touch-manipulation cursor-pointer flex items-center justify-center gap-1 transition-colors px-1"
                                    title="Backspace"
                                >
                                    <Delete className="w-4 h-4" />
                                    <span className="hidden xs:inline text-[10px]">Del</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clues Panel */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4">
                        {/* Mobile Clue Tabs */}
                        <div className="lg:hidden flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
                            <button
                                type="button"
                                onClick={() => { setMobileClueTab('across'); setDirection('across'); }}
                                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                    mobileClueTab === 'across'
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Across ({level.clues.filter(c => c.dir === 'across').length})
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMobileClueTab('down'); setDirection('down'); }}
                                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                    mobileClueTab === 'down'
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                Down ({level.clues.filter(c => c.dir === 'down').length})
                            </button>
                        </div>

                        {/* Across Clues */}
                        <div className={`${mobileClueTab === 'across' ? 'block' : 'hidden lg:block'} pb-4`}>
                            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">Across</h3>
                            <div className="space-y-1 max-h-56 lg:max-h-64 overflow-y-auto pr-1">
                                {level.clues.filter((c) => c.dir === 'across').map((c) => {
                                    const isActive = direction === 'across' && activeClueNum === c.num;
                                    return (
                                        <button
                                            key={`a-${c.num}`}
                                            onClick={() => { handleCellClick(c.row, c.col); setDirection('across'); }}
                                            className={`w-full text-left text-xs sm:text-sm px-2.5 py-2 rounded-lg transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-amber-100 text-amber-950 font-bold border-l-4 border-amber-500'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className="font-bold text-slate-400 mr-1.5 inline-block">{c.num}.</span>
                                            {c.text}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="hidden lg:block h-px bg-slate-100 my-3" />

                        {/* Down Clues */}
                        <div className={`${mobileClueTab === 'down' ? 'block' : 'hidden lg:block'} pt-1`}>
                            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">Down</h3>
                            <div className="space-y-1 max-h-56 lg:max-h-64 overflow-y-auto pr-1">
                                {level.clues.filter((c) => c.dir === 'down').map((c) => {
                                    const isActive = direction === 'down' && activeClueNum === c.num;
                                    return (
                                        <button
                                            key={`d-${c.num}`}
                                            onClick={() => { handleCellClick(c.row, c.col); setDirection('down'); }}
                                            className={`w-full text-left text-xs sm:text-sm px-2.5 py-2 rounded-lg transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-amber-100 text-amber-950 font-bold border-l-4 border-amber-500'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className="font-bold text-slate-400 mr-1.5 inline-block">{c.num}.</span>
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
