'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Trophy, Play, RotateCcw, XCircle, CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';

const TRIVIA_QUESTIONS = [
    // Bible Heroes & Stories
    { q: "Who built the ark?", options: ["Moses", "David", "Noah", "Abraham"], a: 2 },
    { q: "How many days did God take to create the world?", options: ["5", "6", "7", "40"], a: 1 },
    { q: "Who was swallowed by a great fish?", options: ["Jonah", "Peter", "Paul", "Elijah"], a: 0 },
    { q: "What was the name of Jesus' mother?", options: ["Sarah", "Elizabeth", "Mary", "Martha"], a: 2 },
    { q: "Who defeated Goliath?", options: ["Saul", "Jonathan", "David", "Samson"], a: 2 },
    { q: "How many disciples did Jesus choose?", options: ["10", "12", "14", "7"], a: 1 },
    { q: "What did Jesus turn into wine?", options: ["Bread", "Water", "Milk", "Sand"], a: 1 },
    { q: "Who received the 10 Commandments on Mount Sinai?", options: ["Noah", "Abraham", "Moses", "Joshua"], a: 2 },
    { q: "What sea did Moses part by God's power?", options: ["Dead Sea", "Red Sea", "Sea of Galilee", "Mediterranean Sea"], a: 1 },
    { q: "Who was the first man created by God?", options: ["Adam", "Cain", "Abel", "Seth"], a: 0 },
    { q: "Which city's walls fell down after the Israelites marched around them?", options: ["Jerusalem", "Bethlehem", "Jericho", "Nazareth"], a: 2 },
    { q: "Who was thrown into the den of lions?", options: ["Daniel", "Joseph", "David", "Jeremiah"], a: 0 },
    { q: "What weapon did David use to bring down Goliath?", options: ["Sword", "Spear", "Sling and stone", "Bow and arrow"], a: 2 },
    { q: "Who betrayed Jesus for thirty pieces of silver?", options: ["Peter", "John", "Judas Iscariot", "Thomas"], a: 2 },
    { q: "What garden did Jesus pray in before his arrest?", options: ["Eden", "Gethsemane", "Sinai", "Mount of Olives"], a: 1 },
    { q: "How many plagues were sent on Egypt?", options: ["7", "10", "12", "40"], a: 1 },
    { q: "Who was given a coat of many colors by his father?", options: ["Benjamin", "Joseph", "Reuben", "Judah"], a: 1 },
    { q: "What bird brought back an olive leaf to Noah?", options: ["Raven", "Dove", "Eagle", "Sparrow"], a: 1 },
    { q: "Who denied Jesus three times before the rooster crowed?", options: ["Judas", "John", "Peter", "Matthew"], a: 2 },
    { q: "What is the shortest verse in the Bible?", options: ["Jesus wept.", "Pray always.", "God is love.", "Rejoice evermore."], a: 0 },

    // More Old Testament
    { q: "Who was known as the father of many nations?", options: ["Isaac", "Jacob", "Abraham", "Joseph"], a: 2 },
    { q: "What was Samson's secret source of strength?", options: ["His muscles", "His uncut hair", "His diet", "His golden sword"], a: 1 },
    { q: "Who was taken up to heaven in a chariot of fire?", options: ["Elisha", "Enoch", "Elijah", "Moses"], a: 2 },
    { q: "What queen risked her life to save her Jewish people?", options: ["Ruth", "Esther", "Deborah", "Vashti"], a: 1 },
    { q: "Who was the wisest king in Israel?", options: ["Saul", "David", "Solomon", "Hezekiah"], a: 2 },
    { q: "How many brothers did Joseph have?", options: ["10", "11", "12", "7"], a: 1 },
    { q: "What food did God rain down from heaven in the desert?", options: ["Manna", "Figs", "Olives", "Honey bread"], a: 0 },
    { q: "Who led the Israelites across the Jordan River into Canaan?", options: ["Moses", "Caleb", "Joshua", "Gideon"], a: 2 },
    { q: "How many men did Gideon have when he defeated Midian?", options: ["3,000", "10,000", "300", "70"], a: 2 },
    { q: "Which woman remained loyal to her mother-in-law Naomi?", options: ["Orpah", "Ruth", "Hannah", "Leah"], a: 1 },
    { q: "Who prayed for a son and gave birth to Samuel?", options: ["Hannah", "Sarah", "Rachel", "Elizabeth"], a: 0 },
    { q: "What instrument did David play to soothe King Saul?", options: ["Flute", "Harp (Lyre)", "Trumpet", "Cymbals"], a: 1 },
    { q: "What was the name of the giant city Jonah preached to?", options: ["Babylon", "Nineveh", "Ur", "Tyre"], a: 1 },
    { q: "How many people were saved in Noah's Ark?", options: ["4", "8", "12", "14"], a: 1 },

    // New Testament & Jesus' Miracles
    { q: "Where was Jesus born?", options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], a: 2 },
    { q: "What did the young boy have that Jesus multiplied for 5,000 people?", options: ["5 loaves & 2 fish", "7 loaves & 3 fish", "12 baskets of bread", "3 fish & honey"], a: 0 },
    { q: "Who was raised from the dead after four days in the tomb?", options: ["Jairus' daughter", "Lazarus", "Stephen", "Eutychus"], a: 1 },
    { q: "Which disciple walked on water toward Jesus?", options: ["John", "Peter", "Andrew", "James"], a: 1 },
    { q: "Who climbed a sycamore tree to see Jesus?", options: ["Bartimaeus", "Nicodemus", "Zacchaeus", "Matthew"], a: 2 },
    { q: "Who was the Roman governor that sentenced Jesus to death?", options: ["Herod", "Pontius Pilate", "Caesar Augustus", "Felix"], a: 1 },
    { q: "On what day after His death did Jesus rise again?", options: ["First day", "Second day", "Third day", "Seventh day"], a: 2 },
    { q: "What happened on the day of Pentecost?", options: ["The Holy Spirit came with fire", "The temple fell", "A solar eclipse", "The Red Sea parted"], a: 0 },
    { q: "Who was blinded on the road to Damascus before becoming an apostle?", options: ["Barnabas", "Saul (Paul)", "Timothy", "Silas"], a: 1 },
    { q: "What is the last book of the New Testament?", options: ["Jude", "Hebrews", "Revelation", "Romans"], a: 2 },
    { q: "How many books are there in the whole Bible?", options: ["39", "27", "66", "70"], a: 2 },
    { q: "How many books are in the Old Testament?", options: ["27", "39", "40", "42"], a: 1 },
    { q: "How many books are in the New Testament?", options: ["21", "27", "33", "39"], a: 1 },
    { q: "What is the first book of the Bible?", options: ["Exodus", "Genesis", "Matthew", "Psalms"], a: 1 },

    // Foursquare Gospel Church Current Affairs & History
    { q: "Who founded the Foursquare Gospel Church?", options: ["Billy Graham", "Aimee Semple McPherson", "John Wesley", "Charles Spurgeon"], a: 1 },
    { q: "In what year was Foursquare founded globally?", options: ["1914", "1923", "1955", "1960"], a: 1 },
    { q: "Where was the Foursquare Gospel Church founded?", options: ["London, UK", "Los Angeles, USA", "New York, USA", "Toronto, Canada"], a: 1 },
    { q: "In what year did Foursquare arrive in Nigeria?", options: ["1923", "1955", "1960", "1975"], a: 1 },
    { q: "Who brought Foursquare to Nigeria?", options: ["Rev. Harold and Mrs. Faye Curtis", "Rev. William Booth", "David Livingstone", "Rev. Sam Aboyeji"], a: 0 },
    { q: "Where was the first Foursquare meeting held in Nigeria?", options: ["Tafawa Balewa Square", "Yankee Bar, Yaba, Lagos", "National Stadium", "Ajebo Camp"], a: 1 },
    { q: "Who is the General Overseer of Foursquare Nigeria in 2026?", options: ["Rev. Felix Meduoye", "Rev. (Dr.) Sam Aboyeji", "Rev. Wilson Badejo", "Rev. G.O. Farombi"], a: 1 },
    { q: "What did Foursquare call its 70th anniversary celebration in 2025?", options: ["Golden Jubilee", "Silver Jubilee", "The Platinum Jubilee", "Centenary"], a: 2 },
    { q: "Where is Foursquare's primary national camp located in Nigeria?", options: ["Ajebo, Ogun State", "Mowe, Ogun State", "Ota, Ogun State", "Ibadan, Oyo State"], a: 0 },
    { q: "What does the 4-fold Gospel represent Jesus as?", options: ["Prophet, Priest, King, Judge", "Saviour, Baptizer, Healer, Soon-Coming King", "Creator, Ruler, Shepherd, Rock", "Light, Way, Truth, Life"], a: 1 },
    { q: "What is the full meaning of CFM in Foursquare Church?", options: ["Council of Foursquare Men", "Christian Faith Mission", "Church Family Ministry", "Children & Family Mission"], a: 0 },
    { q: "What is the full meaning of FWI in Foursquare Church?", options: ["Foursquare Women International", "Faith & Wisdom Institute", "Fellowship of Workers", "Female Workers International"], a: 0 },
];

const GAME_DURATION = 60; // 60 seconds

// Fisher-Yates unbiased shuffle
function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function TriviaRushGame() {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [questions, setQuestions] = useState<typeof TRIVIA_QUESTIONS>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    // Load High Score from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('trivia_rush_high_score');
            if (saved) setHighScore(Number(saved));
        } catch {}
    }, []);

    const startGame = () => {
        const shuffled = shuffleArray(TRIVIA_QUESTIONS);
        setQuestions(shuffled);
        setCurrentQIndex(0);
        setScore(0);
        setStreak(0);
        setHighestStreak(0);
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
            endGame();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const endGame = () => {
        setGameState('end');
        setScore(currentScore => {
            if (currentScore > highScore) {
                setHighScore(currentScore);
                try {
                    localStorage.setItem('trivia_rush_high_score', String(currentScore));
                } catch {}
                triggerRealisticConfetti();
            } else if (currentScore >= 80) {
                triggerRealisticConfetti();
            }
            return currentScore;
        });
    };

    const handleAnswer = (selectedIndex: number) => {
        if (feedback !== null) return; // Prevent multiple clicks

        const isCorrect = selectedIndex === questions[currentQIndex].a;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > highestStreak) setHighestStreak(newStreak);

            // Combo bonus: +10 base + bonus for streaks of 3 or more!
            const bonus = newStreak >= 5 ? 5 : newStreak >= 3 ? 2 : 0;
            setScore(prev => prev + 10 + bonus);
        } else {
            setStreak(0);
            setScore(prev => Math.max(0, prev - 5)); // Don't go below 0
        }

        // Brief feedback delay before moving to next question
        setTimeout(() => {
            setFeedback(null);
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                endGame();
            }
        }, 500);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            {/* Header */}
            <div className="bg-slate-800/80 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Games</span>
                    </Link>
                    <div className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400">
                        ⚡ TRIVIA RUSH
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                        <Trophy className="w-3.5 h-3.5" /> Best: {highScore}
                    </div>
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
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-8"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                                <Clock className="w-12 h-12 text-slate-950" />
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-black mb-3 uppercase tracking-tight text-white">Bible Trivia Rush</h1>
                                <p className="text-slate-300 text-base max-w-md mx-auto leading-relaxed">
                                    Answer as many Bible & Church history questions as you can in <strong>60 seconds</strong>!
                                </p>
                                <div className="flex items-center justify-center gap-4 mt-4 text-xs font-bold">
                                    <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">+10 pts Correct</span>
                                    <span className="text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">-5 pts Wrong</span>
                                    <span className="text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">🔥 Streak Bonus</span>
                                </div>
                            </div>

                            {highScore > 0 && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 text-sm">
                                    <Trophy className="w-4 h-4 text-amber-400" />
                                    <span>Your Personal Best: <strong className="text-white">{highScore} pts</strong></span>
                                </div>
                            )}

                            <div>
                                <button 
                                    onClick={startGame}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 px-9 py-4 rounded-full font-black text-lg shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                    <Play className="w-6 h-6 fill-slate-950" />
                                    Start Rush!
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === 'playing' && (
                        <motion.div 
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col justify-center"
                        >
                            {/* HUD */}
                            <div className="flex items-center justify-between mb-6 bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shadow-md">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Score</span>
                                    <span className="text-3xl font-black text-cyan-400">{score}</span>
                                </div>

                                {streak >= 3 && (
                                    <motion.div 
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
                                    >
                                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span>{streak}x Combo!</span>
                                    </motion.div>
                                )}

                                <div className={`flex flex-col items-end ${timeLeft <= 10 ? 'animate-pulse text-rose-400' : 'text-slate-100'}`}>
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Time</span>
                                    <span className="text-3xl font-black font-mono">{timeLeft}s</span>
                                </div>
                            </div>

                            {/* Question Card */}
                            <motion.div 
                                key={currentQIndex}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-slate-800/95 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden"
                            >
                                {/* Feedback overlay */}
                                <AnimatePresence>
                                    {feedback === 'correct' && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-emerald-600/90 backdrop-blur-sm"
                                        >
                                            <CheckCircle2 className="w-20 h-20 text-white drop-shadow-lg mb-1" />
                                            <span className="text-white font-black text-2xl uppercase tracking-wider">Correct! +10</span>
                                        </motion.div>
                                    )}
                                    {feedback === 'incorrect' && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-rose-600/90 backdrop-blur-sm"
                                        >
                                            <XCircle className="w-20 h-20 text-white drop-shadow-lg mb-1" />
                                            <span className="text-white font-black text-2xl uppercase tracking-wider">-5 pts</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Question {currentQIndex + 1}
                                </div>

                                <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-6 text-white">
                                    {questions[currentQIndex]?.q}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {questions[currentQIndex]?.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            className="w-full text-left p-4 rounded-2xl bg-slate-700/60 hover:bg-slate-700 border-2 border-slate-600 hover:border-cyan-400 transition-all font-semibold text-base sm:text-lg cursor-pointer active:scale-98"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* END SCREEN */}
                    {gameState === 'end' && (
                        <motion.div 
                            key="end"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <Trophy className="w-10 h-10 text-slate-950" />
                            </div>
                            
                            <div>
                                <h2 className="text-3xl font-black text-white mb-1">
                                    {timeLeft === 0 ? "Time's Up!" : "Rush Completed!"}
                                </h2>
                                <p className="text-slate-400 text-sm">You answered at lightning speed</p>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 my-4">
                                    {score} <span className="text-2xl text-slate-400 font-medium">pts</span>
                                </div>

                                <div className="flex items-center justify-center gap-6 text-sm text-slate-300">
                                    <div>
                                        <span className="text-slate-400 text-xs block">Best Streak</span>
                                        <strong className="text-amber-400 text-base">{highestStreak} in a row</strong>
                                    </div>
                                    <div className="h-8 w-px bg-slate-700" />
                                    <div>
                                        <span className="text-slate-400 text-xs block">High Score</span>
                                        <strong className="text-cyan-400 text-base">{highScore} pts</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                                <button 
                                    onClick={startGame}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-950 px-7 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Play Again
                                </button>
                                <Link 
                                    href="/games"
                                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
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
