'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Trophy, Play, RotateCcw, XCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TRIVIA_QUESTIONS = [
    { q: "Who built the ark?", options: ["Moses", "David", "Noah", "Abraham"], a: 2 },
    { q: "How many days did God take to create the world?", options: ["5", "6", "7", "40"], a: 1 },
    { q: "Who was swallowed by a great fish?", options: ["Jonah", "Peter", "Paul", "Elijah"], a: 0 },
    { q: "What was the name of Jesus' mother?", options: ["Sarah", "Elizabeth", "Mary", "Martha"], a: 2 },
    { q: "Who defeated Goliath?", options: ["Saul", "Jonathan", "David", "Samson"], a: 2 },
    { q: "How many disciples did Jesus choose?", options: ["10", "12", "14", "7"], a: 1 },
    { q: "What did Jesus turn into wine?", options: ["Bread", "Water", "Milk", "Sand"], a: 1 },
    { q: "Who received the 10 Commandments?", options: ["Noah", "Abraham", "Moses", "Joshua"], a: 2 },
    { q: "What sea did Moses part?", options: ["Dead Sea", "Red Sea", "Sea of Galilee", "Mediterranean Sea"], a: 1 },
    { q: "Who was the first man?", options: ["Adam", "Cain", "Abel", "Seth"], a: 0 },
    { q: "What city's walls fell down after marching around them?", options: ["Jerusalem", "Bethlehem", "Jericho", "Nazareth"], a: 2 },
    { q: "Who was thrown into the lion's den?", options: ["Daniel", "Joseph", "David", "Jeremiah"], a: 0 },
    { q: "What did David use to defeat Goliath?", options: ["Sword", "Spear", "Sling and stone", "Bow and arrow"], a: 2 },
    { q: "Who betrayed Jesus?", options: ["Peter", "John", "Judas", "Thomas"], a: 2 },
    { q: "What garden did Jesus pray in before his arrest?", options: ["Eden", "Gethsemane", "Sinai", "Olive"], a: 1 },
    { q: "How many plagues were sent on Egypt?", options: ["7", "10", "12", "40"], a: 1 },
    { q: "Who was sold into slavery by his brothers?", options: ["Benjamin", "Joseph", "Reuben", "Judah"], a: 1 },
    { q: "What bird returned to Noah with an olive branch?", options: ["Raven", "Dove", "Eagle", "Sparrow"], a: 1 },
    { q: "Who denied Jesus 3 times?", options: ["Judas", "John", "Peter", "Matthew"], a: 2 },
    { q: "What is the shortest verse in the Bible?", options: ["Jesus wept.", "Pray always.", "God is love.", "Rejoice evermore."], a: 0 },
];

const GAME_DURATION = 60; // seconds

export default function TriviaRushGame() {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [questions, setQuestions] = useState<typeof TRIVIA_QUESTIONS>([]);
    
    // Feedback state
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const startGame = () => {
        // Shuffle questions
        const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setCurrentQIndex(0);
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameState('playing');
        setFeedback(null);
    };

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('end');
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const handleAnswer = (selectedIndex: number) => {
        if (feedback !== null) return; // Prevent multiple clicks

        const isCorrect = selectedIndex === questions[currentQIndex].a;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            setScore(prev => prev + 10);
        } else {
            setScore(prev => Math.max(0, prev - 5)); // Don't go below 0
        }

        // Wait a bit before moving to next question
        setTimeout(() => {
            setFeedback(null);
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                // Out of questions! End game early.
                setGameState('end');
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            {/* Header */}
            <div className="bg-slate-800/50 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline font-medium">Games</span>
                    </Link>
                    <div className="font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        TRIVIA RUSH
                    </div>
                    <div className="w-8" /> {/* Spacer */}
                </div>
            </div>

            <div className="flex-1 w-full max-w-2xl mx-auto p-4 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div 
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center space-y-8"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                                <Clock className="w-12 h-12 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-black mb-4 uppercase tracking-tight">Bible Trivia Rush</h1>
                                <p className="text-slate-400 text-lg max-w-md mx-auto">
                                    Answer as many questions as you can in 60 seconds! <br/>
                                    <span className="text-green-400 font-bold">+10 pts</span> for correct, <span className="text-red-400 font-bold">-5 pts</span> for wrong.
                                </p>
                            </div>
                            <button 
                                onClick={startGame}
                                className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform"
                            >
                                <Play className="w-6 h-6 fill-slate-900" />
                                Start Rush!
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
                            className="flex-1 flex flex-col"
                        >
                            {/* HUD */}
                            <div className="flex items-center justify-between mb-8 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Score</span>
                                    <span className="text-3xl font-black text-cyan-400">{score}</span>
                                </div>
                                <div className={`flex flex-col items-end ${timeLeft <= 10 ? 'animate-pulse text-red-500' : ''}`}>
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Time Left</span>
                                    <span className="text-3xl font-black font-mono">{timeLeft}s</span>
                                </div>
                            </div>

                            {/* Question Card */}
                            <div className="flex-1 flex flex-col justify-center">
                                <motion.div 
                                    key={currentQIndex} // Animate on new question
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden"
                                >
                                    {/* Feedback overlay */}
                                    <AnimatePresence>
                                        {feedback === 'correct' && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-10 flex items-center justify-center bg-green-500/90 backdrop-blur-sm"
                                            >
                                                <CheckCircle2 className="w-24 h-24 text-white drop-shadow-lg" />
                                            </motion.div>
                                        )}
                                        {feedback === 'incorrect' && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-10 flex items-center justify-center bg-red-500/90 backdrop-blur-sm"
                                            >
                                                <XCircle className="w-24 h-24 text-white drop-shadow-lg" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-8 text-center">
                                        {questions[currentQIndex]?.q}
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        {questions[currentQIndex]?.options.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleAnswer(i)}
                                                className="w-full text-left p-4 sm:p-5 rounded-2xl bg-slate-700/50 hover:bg-slate-600 border-2 border-slate-600 hover:border-cyan-500 transition-all font-semibold text-lg"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* END SCREEN */}
                    {gameState === 'end' && (
                        <motion.div 
                            key="end"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8 bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl"
                        >
                            <div className="w-24 h-24 mx-auto bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.4)]">
                                <Trophy className="w-12 h-12 text-white" />
                            </div>
                            
                            <div>
                                <h2 className="text-3xl font-bold text-slate-300 mb-2">Time's Up!</h2>
                                <p className="text-slate-400">You scored</p>
                                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 my-4">
                                    {score}
                                </div>
                                <p className="text-slate-400">points</p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                                <button 
                                    onClick={startGame}
                                    className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-3 rounded-full font-bold transition-colors"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Play Again
                                </button>
                                <Link 
                                    href="/games"
                                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-full font-bold transition-colors"
                                >
                                    Quit
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
