'use client';

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, ChevronRight, Trophy, Keyboard } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
    rows: number;
    cols: number;
    clues: Clue[];
};

const LEVELS: Level[] = [
    {
        id: 1,
        title: 'The Beginning',
        rows: 4,
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
        rows: 6,
        cols: 4,
        clues: [
            { num: 1, dir: 'across', text: 'God is ___', answer: 'HOLY', row: 0, col: 0 },
            { num: 1, dir: 'down', text: 'Faith, ___, and Love', answer: 'HOPE', row: 0, col: 0 },
            { num: 2, dir: 'down', text: 'Jesus fed 5000 with these', answer: 'LOAVES', row: 0, col: 2 },
            { num: 3, dir: 'across', text: 'Talk to God', answer: 'PRAY', row: 2, col: 0 },
        ],
    },
    {
        id: 3,
        title: 'Grace & Kings',
        rows: 5,
        cols: 5,
        clues: [
            { num: 1, dir: 'across', text: 'Unmerited favor', answer: 'GRACE', row: 0, col: 0 },
            { num: 1, dir: 'down', text: 'Creator of heaven and earth', answer: 'GOD', row: 0, col: 0 },
            { num: 2, dir: 'down', text: 'The first man', answer: 'ADAM', row: 1, col: 2 },
            { num: 3, dir: 'across', text: 'A man after God\'s heart', answer: 'DAVID', row: 2, col: 0 },
        ]
    }
];

export default function CrosswordGame() {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [gridState, setGridState] = useState<Record<string, string>>({});
    const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);
    const [direction, setDirection] = useState<'across' | 'down'>('across');
    const [levelComplete, setLevelComplete] = useState(false);
    
    // Auto-focus hack for hidden input
    const inputRef = useRef<HTMLInputElement>(null);

    const level = LEVELS[currentLevel];

    // Compute grid data
    const gridInfo = () => {
        const cells = new Map<string, { letter: string; num?: number; across?: number; down?: number }>();
        level.clues.forEach(clue => {
            for (let i = 0; i < clue.answer.length; i++) {
                const r = clue.dir === 'across' ? clue.row : clue.row + i;
                const c = clue.dir === 'across' ? clue.col + i : clue.col;
                const key = `${r}-${c}`;
                
                if (!cells.has(key)) {
                    cells.set(key, { letter: clue.answer[i] });
                }
                
                const cell = cells.get(key)!;
                if (i === 0) cell.num = clue.num;
                if (clue.dir === 'across') cell.across = clue.num;
                if (clue.dir === 'down') cell.down = clue.num;
            }
        });
        return cells;
    };

    const cellsInfo = gridInfo();

    // Check win condition
    useEffect(() => {
        if (Object.keys(gridState).length === 0) return;
        
        let allCorrect = true;
        let filledCount = 0;
        
        cellsInfo.forEach((info, key) => {
            filledCount++;
            if ((gridState[key] || '').toUpperCase() !== info.letter) {
                allCorrect = false;
            }
        });

        if (allCorrect && Object.keys(gridState).length === filledCount) {
            setLevelComplete(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#f59e0b', '#d97706', '#10b981', '#3b82f6']
            });
        }
    }, [gridState, cellsInfo]);

    // Handle initial selection
    useEffect(() => {
        if (cellsInfo.size > 0 && !selectedCell && !levelComplete) {
            // Find first cell
            const firstKey = Array.from(cellsInfo.keys())[0];
            const [r, c] = firstKey.split('-').map(Number);
            setSelectedCell({ r, c });
            
            const info = cellsInfo.get(firstKey);
            if (info?.across) setDirection('across');
            else if (info?.down) setDirection('down');
        }
    }, [currentLevel, cellsInfo, selectedCell, levelComplete]);

    const handleCellClick = (r: number, c: number) => {
        const info = cellsInfo.get(`${r}-${c}`);
        if (!info) return;

        if (selectedCell?.r === r && selectedCell?.c === c) {
            // Toggle direction if cell supports both
            if (info.across && info.down) {
                setDirection(prev => prev === 'across' ? 'down' : 'across');
            }
        } else {
            setSelectedCell({ r, c });
            if (info.across && !info.down) setDirection('across');
            else if (!info.across && info.down) setDirection('down');
            else if (info.across && info.down) {
                // Keep current direction if possible, else switch
                if (direction === 'across' && !info.across) setDirection('down');
                if (direction === 'down' && !info.down) setDirection('across');
            }
        }
        inputRef.current?.focus();
    };

    const getNextCell = (r: number, c: number, dir: 'across' | 'down', step: 1 | -1 = 1) => {
        let nr = r;
        let nc = c;
        if (dir === 'across') nc += step;
        else nr += step;
        
        if (cellsInfo.has(`${nr}-${nc}`)) {
            return { r: nr, c: nc };
        }
        return null;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (levelComplete || !selectedCell) return;
        const { r, c } = selectedCell;

        if (e.key === 'Backspace') {
            if (gridState[`${r}-${c}`]) {
                setGridState(prev => { const n = { ...prev }; delete n[`${r}-${c}`]; return n; });
            } else {
                const prevCell = getNextCell(r, c, direction, -1);
                if (prevCell) {
                    setSelectedCell(prevCell);
                    setGridState(prev => { const n = { ...prev }; delete n[`${prevCell.r}-${prevCell.c}`]; return n; });
                }
            }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            let nextCell = null;
            if (e.key === 'ArrowRight') nextCell = cellsInfo.has(`${r}-${c+1}`) ? {r, c: c+1} : null;
            if (e.key === 'ArrowLeft') nextCell = cellsInfo.has(`${r}-${c-1}`) ? {r, c: c-1} : null;
            if (e.key === 'ArrowDown') nextCell = cellsInfo.has(`${r+1}-${c}`) ? {r: r+1, c} : null;
            if (e.key === 'ArrowUp') nextCell = cellsInfo.has(`${r-1}-${c}`) ? {r: r-1, c} : null;
            
            if (nextCell) {
                setSelectedCell(nextCell);
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') setDirection('across');
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') setDirection('down');
            }
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            setGridState(prev => ({ ...prev, [`${r}-${c}`]: e.key.toUpperCase() }));
            const nextCell = getNextCell(r, c, direction, 1);
            if (nextCell) setSelectedCell(nextCell);
        }
    };

    const getActiveClueNum = () => {
        if (!selectedCell) return null;
        const info = cellsInfo.get(`${selectedCell.r}-${selectedCell.c}`);
        if (!info) return null;
        return direction === 'across' ? info.across : info.down;
    };

    const activeClueNum = getActiveClueNum();

    const renderGrid = () => {
        const grid = [];
        for (let r = 0; r < level.rows; r++) {
            const row = [];
            for (let c = 0; c < level.cols; c++) {
                const key = `${r}-${c}`;
                const info = cellsInfo.get(key);
                const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                const isHighlighted = info && activeClueNum && (
                    (direction === 'across' && info.across === activeClueNum) ||
                    (direction === 'down' && info.down === activeClueNum)
                );

                if (!info) {
                    row.push(<div key={key} className="w-10 h-10 sm:w-12 sm:h-12 bg-transparent" />);
                } else {
                    row.push(
                        <div
                            key={key}
                            onClick={() => handleCellClick(r, c)}
                            className={`relative w-10 h-10 sm:w-12 sm:h-12 border-2 flex items-center justify-center text-lg sm:text-xl font-bold cursor-pointer transition-colors ${
                                isSelected 
                                    ? 'border-amber-500 bg-amber-100 text-amber-900' 
                                    : isHighlighted 
                                        ? 'border-amber-300 bg-amber-50 text-slate-800'
                                        : 'border-slate-300 bg-white text-slate-800'
                            }`}
                        >
                            {info.num && (
                                <span className="absolute top-0.5 left-1 text-[10px] text-slate-500 font-sans leading-none">{info.num}</span>
                            )}
                            {gridState[key]}
                        </div>
                    );
                }
            }
            grid.push(<div key={r} className="flex">{row}</div>);
        }
        return grid;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5" /> Back Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" />
                        <span className="font-serif font-bold text-lg text-slate-800">Bible Crossword</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        Level {currentLevel + 1}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 pt-8 pb-12">
                <div className="text-center mb-8">
                    <h1 className="font-serif font-bold text-3xl text-slate-900 mb-2">{level.title}</h1>
                    <p className="text-slate-500 text-sm">Solve the puzzle to unlock the next level.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                    {/* Grid Area */}
                    <div className="w-full lg:w-auto overflow-x-auto pb-4 flex justify-center flex-shrink-0" onClick={() => inputRef.current?.focus()}>
                        <div className="inline-flex flex-col border-2 border-slate-800 bg-slate-800 p-0.5 rounded-lg shadow-xl" style={{ touchAction: 'none' }}>
                            {renderGrid()}
                        </div>
                    </div>

                    {/* Clues Area */}
                    <div className="w-full lg:flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                            <div>
                                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                                    <span className="w-6 h-px bg-slate-200"></span> Across
                                </h3>
                                <ul className="space-y-2">
                                    {level.clues.filter(c => c.dir === 'across').map(c => {
                                        const isActive = direction === 'across' && activeClueNum === c.num;
                                        return (
                                            <li 
                                                key={c.num}
                                                onClick={() => handleCellClick(c.row, c.col)}
                                                className={`text-sm cursor-pointer transition-colors p-2 rounded-lg ${isActive ? 'bg-amber-100 text-amber-900 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <span className="font-bold mr-2">{c.num}.</span> {c.text}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs mb-3 flex items-center gap-2 mt-4 md:mt-0 lg:mt-4">
                                    <span className="w-6 h-px bg-slate-200"></span> Down
                                </h3>
                                <ul className="space-y-2">
                                    {level.clues.filter(c => c.dir === 'down').map(c => {
                                        const isActive = direction === 'down' && activeClueNum === c.num;
                                        return (
                                            <li 
                                                key={c.num}
                                                onClick={() => handleCellClick(c.row, c.col)}
                                                className={`text-sm cursor-pointer transition-colors p-2 rounded-lg ${isActive ? 'bg-amber-100 text-amber-900 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <span className="font-bold mr-2">{c.num}.</span> {c.text}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Hidden Input for Mobile Keyboard */}
            <input 
                ref={inputRef}
                type="text" 
                className="opacity-0 absolute top-0 left-0 w-1 h-1 pointer-events-none" 
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck="false"
                maxLength={1}
                value=""
                onChange={() => {}}
            />

            {/* Floating keyboard hint */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-xs flex items-center gap-2 shadow-lg opacity-80 pointer-events-none hidden md:flex">
                <Keyboard className="w-4 h-4" /> Type to fill, Arrows to navigate
            </div>

            {/* Level Complete Modal */}
            <AnimatePresence>
                {levelComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100"
                        >
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="font-serif font-bold text-2xl text-slate-900 mb-2">Level Complete!</h2>
                            <p className="text-slate-500 text-sm mb-6">Great job solving "{level.title}".</p>
                            
                            {currentLevel < LEVELS.length - 1 ? (
                                <button
                                    onClick={() => {
                                        setGridState({});
                                        setSelectedCell(null);
                                        setLevelComplete(false);
                                        setCurrentLevel(c => c + 1);
                                    }}
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    Next Level <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <Link
                                    href="/"
                                    className="w-full inline-flex bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all items-center justify-center gap-2"
                                >
                                    Finish Game <Trophy className="w-5 h-5" />
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
