'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Trophy, RotateCcw, ChevronRight, CheckCircle2, XCircle, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';

interface MysteryCharacter {
    id: number;
    name: string;
    clues: [string, string, string]; // [Hard 300pts, Medium 200pts, Easy 100pts]
    funFact: string;
    options: string[]; // 4 choices including correct name
}

const MYSTERY_POOL: MysteryCharacter[] = [
    {
        id: 1,
        name: "Noah",
        clues: [
            "I found grace in the eyes of the Lord in a wicked generation.",
            "I spent months with pairs of animals afloat on water.",
            "I built an enormous wooden ark that saved my family from the great flood."
        ],
        funFact: "Noah lived to be 950 years old and was a preacher of righteousness!",
        options: ["Abraham", "Noah", "Moses", "Enoch"]
    },
    {
        id: 2,
        name: "Moses",
        clues: [
            "I was hidden in a papyrus basket among the reeds along the Nile River as a baby.",
            "I spoke with God at a burning bush that was not consumed.",
            "I lifted my staff and the Red Sea parted so Israel could walk on dry ground."
        ],
        funFact: "Moses received the Ten Commandments directly on Mount Sinai!",
        options: ["Joshua", "Aaron", "Moses", "Gideon"]
    },
    {
        id: 3,
        name: "David",
        clues: [
            "I was the youngest son of Jesse and spent my youth tending sheep.",
            "I played the harp skillfully to soothe King Saul's troubled spirit.",
            "I defeated the giant Goliath with just a sling and a single stone."
        ],
        funFact: "David was called 'a man after God's own heart' and wrote many of the Psalms!",
        options: ["Solomon", "Saul", "Jonathan", "David"]
    },
    {
        id: 4,
        name: "Daniel",
        clues: [
            "I refused to eat the king's royal food and wine in Babylon.",
            "I was able to interpret King Nebuchadnezzar's mysterious dreams.",
            "I was thrown into a den of hungry lions because I prayed to God three times a day."
        ],
        funFact: "God sent His angel to shut the lions' mouths, and Daniel was completely unharmed!",
        options: ["Daniel", "Joseph", "Jeremiah", "Ezekiel"]
    },
    {
        id: 5,
        name: "Esther",
        clues: [
            "My Hebrew name was Hadassah before I entered the royal palace.",
            "My cousin Mordecai raised me and gave me wise counsel.",
            "I boldly approached King Xerxes saying: 'If I perish, I perish' to save my people."
        ],
        funFact: "Esther became Queen of Persia and saved the entire Jewish nation from destruction!",
        options: ["Ruth", "Esther", "Deborah", "Sarah"]
    },
    {
        id: 6,
        name: "Jonah",
        clues: [
            "I bought a ticket for a ship sailing to Tarshish to run away from God's calling.",
            "A violent storm arose at sea, and the sailors cast lots that pointed directly to me.",
            "I was swallowed by a great fish and spent three days and nights in its belly praying."
        ],
        funFact: "Jonah eventually preached in Nineveh, and the whole city repented in sackcloth!",
        options: ["Elijah", "Jonah", "Amos", "Hosea"]
    },
    {
        id: 7,
        name: "Samson",
        clues: [
            "I was a Nazarite from birth, and no razor was ever supposed to touch my head.",
            "I once killed a thousand Philistines with the fresh jawbone of a donkey.",
            "My immense supernatural strength left me when Delilah had my seven braids shaved off."
        ],
        funFact: "In his final prayer, Samson pushed apart the pillars of Dagon's temple!",
        options: ["Samson", "Gideon", "Jephthah", "Barak"]
    },
    {
        id: 8,
        name: "Ruth",
        clues: [
            "I was from the land of Moab, but I chose to follow the God of Israel.",
            "I told my mother-in-law: 'Where you go I will go, and where you stay I will stay.'",
            "I gleaned barley in the fields of Boaz, who became my kinsman-redeemer."
        ],
        funFact: "Ruth became the great-grandmother of King David and an ancestor of Jesus Christ!",
        options: ["Orpah", "Naomi", "Ruth", "Hannah"]
    },
    {
        id: 9,
        name: "Peter",
        clues: [
            "My original name was Simon before Jesus gave me a new name meaning 'Rock'.",
            "I stepped out of the boat in the middle of a storm and walked on water toward Jesus.",
            "I denied knowing Jesus three times before the rooster crowed."
        ],
        funFact: "Peter preached boldly on the day of Pentecost, and 3,000 souls were saved!",
        options: ["Peter", "John", "Andrew", "Thomas"]
    },
    {
        id: 10,
        name: "Paul",
        clues: [
            "I was a strict Pharisee who originally persecuted and arrested followers of Christ.",
            "A bright light from heaven blinded me on the road to Damascus as Jesus spoke to me.",
            "I became the great missionary to the Gentiles and wrote many letters in the New Testament."
        ],
        funFact: "Paul and Silas sang hymns in prison at midnight when a great earthquake shook the foundations!",
        options: ["Barnabas", "Stephen", "Paul", "Timothy"]
    },
    {
        id: 11,
        name: "Joseph",
        clues: [
            "My father loved me dearly and gifted me an ornate robe of many colors.",
            "My jealous brothers sold me to Midianite traders for twenty pieces of silver.",
            "I interpreted Pharaoh's dreams of fat and skinny cows and became the governor of Egypt."
        ],
        funFact: "Joseph told his brothers: 'You intended to harm me, but God intended it for good!'",
        options: ["Benjamin", "Joseph", "Reuben", "Judah"]
    },
    {
        id: 12,
        name: "Elijah",
        clues: [
            "Ravens brought me bread and meat by the brook Cherith during a drought.",
            "I challenged 450 prophets of Baal on Mount Carmel, and God answered with fire.",
            "I did not die a normal death, but was taken up to heaven in a fiery chariot and whirlwind."
        ],
        funFact: "Elijah's mantle fell to Elisha, who asked for a double portion of his spirit!",
        options: ["Elisha", "Elijah", "Isaiah", "Jeremiah"]
    },
    {
        id: 13,
        name: "Solomon",
        clues: [
            "When God appeared to me in a dream offering any gift, I asked for wisdom to lead His people.",
            "Two mothers brought a baby to me, and my wise judgment revealed the true mother.",
            "I built the glorious First Temple in Jerusalem decorated with gold and cedar."
        ],
        funFact: "The Queen of Sheba traveled from afar to witness Solomon's wisdom and majesty!",
        options: ["David", "Solomon", "Rehoboam", "Hezekiah"]
    },
    {
        id: 14,
        name: "Aimee Semple McPherson",
        clues: [
            "I was an anointed female evangelist who held massive revival crusades across America.",
            "I founded the Angelus Temple in Los Angeles with 5,300 seats and one of the first Christian radio stations.",
            "Under God's guidance in 1923, I founded the International Church of the Foursquare Gospel."
        ],
        funFact: "She preached Jesus as Saviour, Baptizer with the Holy Spirit, Healer, and Soon-Coming King!",
        options: ["Aimee Semple McPherson", "Kathryn Kuhlman", "Faye Curtis", "Mary Slessor"]
    },
    {
        id: 15,
        name: "Rev. Harold Curtis",
        clues: [
            "Together with my dear wife Faye, I felt a deep missionary calling to West Africa.",
            "We sailed across the Atlantic Ocean in 1955 to plant the Gospel seed in Nigeria.",
            "We hosted the historic first Foursquare meetings in Lagos at Yankee Bar, Yaba."
        ],
        funFact: "Rev. Harold & Faye Curtis faithfully served and laid the foundation for over 5,000 Foursquare churches in Nigeria today!",
        options: ["Samuel Odunaike", "Rev. Harold Curtis", "Rev. Sam Aboyeji", "James Boyejo"]
    }
];

function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function WhoAmIGame() {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [characters, setCharacters] = useState<MysteryCharacter[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clueLevel, setClueLevel] = useState<1 | 2 | 3>(1); // 1 = 300pts, 2 = 200pts, 3 = 100pts
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [roundHistory, setRoundHistory] = useState<{ char: MysteryCharacter; won: boolean; points: number }[]>([]);

    const ROUNDS_COUNT = 10;

    const startNewGame = () => {
        const shuffled = shuffle(MYSTERY_POOL).slice(0, ROUNDS_COUNT);
        setCharacters(shuffled);
        setCurrentIndex(0);
        setClueLevel(1);
        setScore(0);
        setFeedback(null);
        setSelectedName(null);
        setRoundHistory([]);
        setGameState('playing');
    };

    const currentChar = characters[currentIndex];

    const handleRevealNextClue = () => {
        if (clueLevel < 3) {
            setClueLevel((prev) => (prev + 1) as 2 | 3);
        }
    };

    const handleGuess = (guessName: string) => {
        if (feedback !== null) return;
        setSelectedName(guessName);

        const isCorrect = guessName === currentChar.name;
        const pointsAwarded = isCorrect ? (clueLevel === 1 ? 300 : clueLevel === 2 ? 200 : 100) : 0;

        setFeedback(isCorrect ? 'correct' : 'wrong');
        if (isCorrect) {
            setScore(prev => prev + pointsAwarded);
        }

        setRoundHistory(prev => [...prev, { char: currentChar, won: isCorrect, points: pointsAwarded }]);

        // Advance to next mystery after a brief celebration / reveal
        setTimeout(() => {
            setFeedback(null);
            setSelectedName(null);
            setClueLevel(1);

            if (currentIndex < characters.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setGameState('end');
                triggerRealisticConfetti();
            }
        }, 1800);
    };

    const potentialPoints = clueLevel === 1 ? 300 : clueLevel === 2 ? 200 : 100;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            {/* Header */}
            <div className="bg-slate-800/80 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/games" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Games</span>
                    </Link>
                    <div className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                        🕵️ WHO AM I?
                    </div>
                    {gameState === 'playing' ? (
                        <div className="text-xs font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full">
                            Score: {score} pts
                        </div>
                    ) : (
                        <div className="w-16" />
                    )}
                </div>
            </div>

            <div className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-6 bg-slate-800 p-8 sm:p-10 rounded-3xl border border-slate-700 shadow-2xl"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <span className="text-5xl">🕵️</span>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-3">
                                    <Sparkles className="w-3.5 h-3.5" /> Bible Mystery Detective
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
                                    Who Am I?
                                </h1>
                                <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                                    Read secret clues about famous Bible and Church heroes! Guess with fewer clues to earn up to <strong>300 points</strong> per character!
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto text-xs">
                                <div className="bg-slate-700/60 p-3 rounded-2xl border border-slate-600">
                                    <div className="text-amber-400 font-bold text-base">300 pts</div>
                                    <div className="text-slate-400 mt-0.5">Clue 1 (Hard)</div>
                                </div>
                                <div className="bg-slate-700/60 p-3 rounded-2xl border border-slate-600">
                                    <div className="text-yellow-400 font-bold text-base">200 pts</div>
                                    <div className="text-slate-400 mt-0.5">Clue 2 (Medium)</div>
                                </div>
                                <div className="bg-slate-700/60 p-3 rounded-2xl border border-slate-600">
                                    <div className="text-emerald-400 font-bold text-base">100 pts</div>
                                    <div className="text-slate-400 mt-0.5">Clue 3 (Easy)</div>
                                </div>
                            </div>

                            <button
                                onClick={startNewGame}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                            >
                                Start Investigation <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === 'playing' && currentChar && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col space-y-4"
                        >
                            {/* HUD Strip */}
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-400">
                                    Mystery {currentIndex + 1} of {characters.length}
                                </span>
                                <span className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                    Worth: {potentialPoints} pts
                                </span>
                            </div>

                            {/* Mystery Card */}
                            <div className="bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
                                {/* Feedback Overlay */}
                                <AnimatePresence>
                                    {feedback === 'correct' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-600/95 backdrop-blur-md p-6 text-center"
                                        >
                                            <CheckCircle2 className="w-16 h-16 text-white mb-2" />
                                            <h3 className="text-2xl font-black text-white mb-1">THAT&apos;S RIGHT!</h3>
                                            <p className="text-emerald-100 text-lg font-bold mb-2">I am {currentChar.name}!</p>
                                            <p className="text-xs text-emerald-200 max-w-sm">{currentChar.funFact}</p>
                                        </motion.div>
                                    )}
                                    {feedback === 'wrong' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-rose-600/95 backdrop-blur-md p-6 text-center"
                                        >
                                            <XCircle className="w-16 h-16 text-white mb-2" />
                                            <h3 className="text-2xl font-black text-white mb-1">NOT QUITE!</h3>
                                            <p className="text-rose-100 text-lg font-bold mb-2">I am actually {currentChar.name}!</p>
                                            <p className="text-xs text-rose-200 max-w-sm">{currentChar.funFact}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl">
                                        📜
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                                            Secret Identity Clues
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            {clueLevel} of 3 clues revealed
                                        </span>
                                    </div>
                                </div>

                                {/* Progressive Clues List */}
                                <div className="space-y-3 mb-6">
                                    {currentChar.clues.slice(0, clueLevel).map((clueText, cIdx) => (
                                        <motion.div
                                            key={cIdx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-slate-700/60 p-4 rounded-2xl border border-slate-600/80 flex items-start gap-3"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                                {cIdx + 1}
                                            </span>
                                            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                                                &quot;{clueText}&quot;
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>

                                {clueLevel < 3 && (
                                    <button
                                        type="button"
                                        onClick={handleRevealNextClue}
                                        className="w-full py-2.5 rounded-xl border border-dashed border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-bold transition-all mb-6 flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <HelpCircle className="w-3.5 h-3.5" /> Reveal Next Clue (Next clue lowers value to {clueLevel === 1 ? 200 : 100} pts)
                                    </button>
                                )}

                                {/* Question Title */}
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
                                    Who Am I? (Tap Your Answer)
                                </h3>

                                {/* 4 Options */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {currentChar.options.map((opt, oIdx) => (
                                        <button
                                            key={oIdx}
                                            type="button"
                                            onClick={() => handleGuess(opt)}
                                            className={`p-3.5 sm:p-4 rounded-xl border-2 text-left font-bold text-sm sm:text-base transition-all cursor-pointer ${
                                                selectedName === opt
                                                    ? 'bg-amber-500/20 border-amber-400 text-white'
                                                    : 'bg-slate-750 border-slate-650 hover:bg-slate-700 hover:border-amber-400/60 text-slate-100'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <Trophy className="w-10 h-10 text-slate-950" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-white mb-1">
                                    Investigation Complete!
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Great detective work uncovering God&apos;s heroes!
                                </p>

                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 my-4">
                                    {score} <span className="text-2xl text-slate-400 font-medium">pts</span>
                                </div>
                                <p className="text-xs text-slate-400">
                                    Solved {roundHistory.filter(r => r.won).length} out of {characters.length} mysteries correctly!
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                                <button
                                    onClick={startNewGame}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 px-7 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
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
