'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Trophy, Play, RotateCcw, XCircle, CheckCircle2, Flame, Heart, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';

type GameMode = 'classic' | 'marathon' | 'survival';

interface TriviaItem {
    q: string;
    options: string[];
    a: number;
}

const MASSIVE_TRIVIA_POOL: TriviaItem[] = [
    // Old Testament Heroes & Events
    { q: "Who built the ark to save his family and animals from the great flood?", options: ["Moses", "David", "Noah", "Abraham"], a: 2 },
    { q: "How many days did God take to create the world before resting?", options: ["5", "6", "7", "40"], a: 1 },
    { q: "Who was swallowed by a great fish after fleeing to Tarshish?", options: ["Jonah", "Peter", "Paul", "Elijah"], a: 0 },
    { q: "What was the name of Jesus' earthly mother?", options: ["Sarah", "Elizabeth", "Mary", "Martha"], a: 2 },
    { q: "Who defeated the Philistine champion Goliath?", options: ["Saul", "Jonathan", "David", "Samson"], a: 2 },
    { q: "How many disciples did Jesus choose to follow Him closely?", options: ["10", "12", "14", "7"], a: 1 },
    { q: "What was Jesus' first miracle recorded in the Gospel of John?", options: ["Feeding 5000", "Turning water to wine", "Walking on water", "Healing a leper"], a: 1 },
    { q: "Who received the 10 Commandments on Mount Sinai?", options: ["Noah", "Abraham", "Moses", "Joshua"], a: 2 },
    { q: "What sea did Moses part by God's mighty power?", options: ["Dead Sea", "Red Sea", "Sea of Galilee", "Mediterranean Sea"], a: 1 },
    { q: "Who was the first man created by God in the Garden of Eden?", options: ["Adam", "Cain", "Abel", "Seth"], a: 0 },
    { q: "Which city's walls collapsed after Israel shouted and blew trumpets?", options: ["Jerusalem", "Bethlehem", "Jericho", "Nazareth"], a: 2 },
    { q: "Who was thrown into the den of lions for praying to God?", options: ["Daniel", "Joseph", "David", "Jeremiah"], a: 0 },
    { q: "What weapon did young David use to strike down Goliath?", options: ["Heavy sword", "Bronze spear", "Sling and stone", "Bow and arrow"], a: 2 },
    { q: "Who betrayed Jesus for thirty silver pieces?", options: ["Peter", "John", "Judas Iscariot", "Thomas"], a: 2 },
    { q: "What garden did Jesus pray in before His arrest?", options: ["Eden", "Gethsemane", "Sinai", "Carmel"], a: 1 },
    { q: "How many plagues did the Lord send upon Egypt?", options: ["7", "10", "12", "40"], a: 1 },
    { q: "Who was given a colorful coat by his father Jacob?", options: ["Benjamin", "Joseph", "Reuben", "Judah"], a: 1 },
    { q: "What bird brought back an olive leaf to Noah on the ark?", options: ["Raven", "Dove", "Eagle", "Sparrow"], a: 1 },
    { q: "Who denied Jesus three times before the rooster crowed?", options: ["Judas", "John", "Peter", "Matthew"], a: 2 },
    { q: "What is the shortest verse in the Bible?", options: ["Jesus wept.", "Pray always.", "God is love.", "Rejoice evermore."], a: 0 },

    // Patriarchs, Kings & Judges
    { q: "Who is celebrated as the father of many nations?", options: ["Isaac", "Jacob", "Abraham", "Joseph"], a: 2 },
    { q: "What was the supernatural source of Samson's strength?", options: ["His muscles", "His Nazarite vow (uncut hair)", "His diet", "His golden sword"], a: 1 },
    { q: "Who was taken up to heaven in a whirlwind and chariot of fire?", options: ["Elisha", "Enoch", "Elijah", "Moses"], a: 2 },
    { q: "Which brave queen risked her life to save the Jewish people?", options: ["Ruth", "Esther", "Deborah", "Vashti"], a: 1 },
    { q: "Who was known as the wisest king in Israel?", options: ["Saul", "David", "Solomon", "Hezekiah"], a: 2 },
    { q: "How many total brothers did Joseph have?", options: ["10", "11", "12", "7"], a: 1 },
    { q: "What miraculous bread did God provide daily in the wilderness?", options: ["Manna", "Figs", "Quail bread", "Honey cakes"], a: 0 },
    { q: "Who led Israel across the Jordan River into the Promised Land?", options: ["Moses", "Caleb", "Joshua", "Gideon"], a: 2 },
    { q: "How many men did Gideon have when he defeated Midian?", options: ["3,000", "10,000", "300", "70"], a: 2 },
    { q: "Which Moabite woman stayed loyal to her mother-in-law Naomi?", options: ["Orpah", "Ruth", "Hannah", "Leah"], a: 1 },
    { q: "Who wept and prayed for a child at Shiloh and gave birth to Samuel?", options: ["Hannah", "Sarah", "Rachel", "Elizabeth"], a: 0 },
    { q: "What musical instrument did David play to soothe King Saul?", options: ["Flute", "Harp (Lyre)", "Trumpet", "Cymbals"], a: 1 },
    { q: "What great city repented after Jonah reluctantly preached to them?", options: ["Babylon", "Nineveh", "Ur", "Tyre"], a: 1 },
    { q: "How many human souls were saved inside Noah's Ark?", options: ["4", "8", "12", "14"], a: 1 },
    { q: "Who survived being cast into a blazing fiery furnace with Christ?", options: ["Shadrach, Meshach, Abednego", "Caleb and Joshua", "Elijah and Elisha", "David and Jonathan"], a: 0 },
    { q: "What was the name of Abraham's promised son born in his old age?", options: ["Ishmael", "Isaac", "Jacob", "Esau"], a: 1 },
    { q: "Who wrestled with God until daybreak and was blessed with the name Israel?", options: ["Abraham", "Isaac", "Jacob", "Joseph"], a: 2 },
    { q: "Who was the female judge and prophetess who led Israel under a palm tree?", options: ["Esther", "Deborah", "Ruth", "Miriam"], a: 1 },
    { q: "What prophet confronted King David over his sin with Bathsheba?", options: ["Samuel", "Nathan", "Elijah", "Gad"], a: 1 },
    { q: "What giant did Caleb drive out to inherit Hebron at 85 years old?", options: ["Goliath", "Anakites", "Og of Bashan", "Sihon"], a: 1 },

    // Gospels, Jesus & Miracles
    { q: "In what town was the Lord Jesus Christ born?", options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], a: 2 },
    { q: "What meal did Jesus multiply to feed 5,000 men?", options: ["5 loaves & 2 fish", "7 loaves & 3 fish", "12 loaves of barley", "Honey and locusts"], a: 0 },
    { q: "Who was called out of the grave four days after his death?", options: ["Jairus' daughter", "Lazarus", "Stephen", "Nicodemus"], a: 1 },
    { q: "Which disciple stepped out of the boat and walked on water?", options: ["John", "Peter", "Andrew", "James"], a: 1 },
    { q: "What tax collector climbed a sycamore tree to see Jesus passing by?", options: ["Levi", "Nicodemus", "Zacchaeus", "Bartimaeus"], a: 2 },
    { q: "Who was the Roman governor who authorized Jesus' crucifixion?", options: ["Herod", "Pontius Pilate", "Caesar Augustus", "Felix"], a: 1 },
    { q: "On which day following His crucifixion did Christ rise from the dead?", options: ["First day", "Second day", "Third day", "Seventh day"], a: 2 },
    { q: "What mighty sign accompanied the Holy Spirit on the Day of Pentecost?", options: ["Tongues of fire and rushing wind", "An earthquake", "A solar eclipse", "The temple torn down"], a: 0 },
    { q: "Who encountered Jesus on the Damascus road and was converted?", options: ["Barnabas", "Saul (Paul)", "Timothy", "Silas"], a: 1 },
    { q: "What is the final book of the Christian Bible?", options: ["Jude", "Hebrews", "Revelation", "Romans"], a: 2 },
    { q: "How many books comprise the entire Holy Bible?", options: ["39", "27", "66", "70"], a: 2 },
    { q: "How many books are found in the Old Testament?", options: ["27", "39", "40", "42"], a: 1 },
    { q: "How many books are found in the New Testament?", options: ["21", "27", "33", "39"], a: 1 },
    { q: "What is the opening book of the Bible?", options: ["Exodus", "Genesis", "Matthew", "Psalms"], a: 1 },
    { q: "Which disciple was a tax collector before answering Jesus' call?", options: ["Matthew", "Luke", "Mark", "John"], a: 0 },
    { q: "What profession was the gospel writer Luke known for?", options: ["Fisherman", "Doctor (Physician)", "Tentmaker", "Carpenter"], a: 1 },
    { q: "Who requested Jesus' body and placed Him in a brand new tomb?", options: ["Nicodemus", "Joseph of Arimathea", "Simon of Cyrene", "Peter"], a: 1 },
    { q: "What man was forced by Roman soldiers to carry Jesus' cross?", options: ["Simon of Cyrene", "Joseph of Arimathea", "Barnabas", "Zacchaeus"], a: 0 },
    { q: "Who declared: 'My Lord and my God!' after feeling Jesus' nail marks?", options: ["Peter", "Thomas", "James", "Philip"], a: 1 },
    { q: "Where did Jesus ascend into heaven from?", options: ["Mount of Olives", "Mount Sinai", "Mount Carmel", "Mount Zion"], a: 0 },

    // Early Church & Acts of Apostles
    { q: "Who was the first Christian martyr stoned to death for his faith?", options: ["James", "Stephen", "Philip", "Paul"], a: 1 },
    { q: "Who explained the Isaiah prophecy to the Ethiopian official in his chariot?", options: ["Peter", "Philip", "Barnabas", "Silas"], a: 1 },
    { q: "What happened when Paul and Silas sang hymns in the Philippian prison?", options: ["An earthquake opened the doors", "The guards fell asleep", "The roof vanished", "An angel flew in"], a: 0 },
    { q: "What trade did Paul practice to support his missionary travels?", options: ["Carpenter", "Tentmaker", "Blacksmith", "Fisherman"], a: 1 },
    { q: "On what island was the Apostle John exiled when he received the Revelation?", options: ["Crete", "Patmos", "Cyprus", "Malta"], a: 1 },
    { q: "Who accompanied Paul on his first missionary journey from Antioch?", options: ["Silas", "Barnabas", "Timothy", "Titus"], a: 1 },
    { q: "What young disciple had a godly mother named Eunice and grandmother Lois?", options: ["Timothy", "Titus", "Mark", "Luke"], a: 0 },
    { q: "Which couple lied to the Holy Spirit about their land offering in Acts 5?", options: ["Aquila & Priscilla", "Ananias & Sapphira", "Zechariah & Elizabeth", "Elkanah & Hannah"], a: 1 },
    { q: "What husband and wife tentmaker team instructed Apollos more accurately?", options: ["Aquila and Priscilla", "Ananias and Sapphira", "Boaz and Ruth", "Philemon and Apphia"], a: 0 },
    { q: "Who was let down in a basket through an opening in Damascus' wall to escape?", options: ["Peter", "Paul", "Silas", "John"], a: 1 },

    // Foursquare Gospel Church Current Affairs & Milestones
    { q: "Who founded the International Church of the Foursquare Gospel?", options: ["Billy Graham", "Aimee Semple McPherson", "John Wesley", "Charles Spurgeon"], a: 1 },
    { q: "In what year was Foursquare founded globally in Los Angeles?", options: ["1914", "1923", "1955", "1960"], a: 1 },
    { q: "Where was the first Foursquare church auditorium (Angelus Temple) built?", options: ["London, UK", "Los Angeles, USA", "New York, USA", "Toronto, Canada"], a: 1 },
    { q: "In what year did the Foursquare Gospel Church officially reach Nigeria?", options: ["1923", "1955", "1960", "1975"], a: 1 },
    { q: "Who brought the Foursquare Gospel message to Nigeria as pioneer missionaries?", options: ["Rev. Harold and Mrs. Faye Curtis", "Rev. William Booth", "David Livingstone", "Rev. Sam Aboyeji"], a: 0 },
    { q: "Where did the first Foursquare gathering take place in Nigeria in 1955?", options: ["Tafawa Balewa Square", "Yankee Bar, Yaba, Lagos", "National Stadium Surulere", "Ajebo Camp"], a: 1 },
    { q: "Who is the General Overseer of Foursquare Nigeria in 2026?", options: ["Rev. Felix Meduoye", "Rev. (Dr.) Sam Aboyeji", "Rev. Wilson Badejo", "Rev. G.O. Farombi"], a: 1 },
    { q: "What did Foursquare call its 70th anniversary celebrated in 2025?", options: ["Golden Jubilee", "Silver Jubilee", "The Platinum Jubilee", "Centenary"], a: 2 },
    { q: "Where is Foursquare Nigeria's primary national camp ground situated?", options: ["Ajebo, Ogun State", "Mowe, Ogun State", "Ota, Ogun State", "Ibadan, Oyo State"], a: 0 },
    { q: "What four aspects of Jesus does the Foursquare Gospel proclaim?", options: ["Prophet, Priest, King, Judge", "Saviour, Baptizer with Holy Spirit, Healer, Soon-Coming King", "Creator, Ruler, Shepherd, Rock", "Light, Way, Truth, Life"], a: 1 },
    { q: "What is the full meaning of CFM in the Foursquare movement?", options: ["Council of Foursquare Men", "Christian Faith Mission", "Church Family Ministry", "Children & Family Mission"], a: 0 },
    { q: "What is the full meaning of FWI in the Foursquare movement?", options: ["Foursquare Women International", "Faith & Wisdom Institute", "Fellowship of Workers", "Female Workers International"], a: 0 },
    { q: "What is the full meaning of ICML in Foursquare Church?", options: ["International Children Mission League", "International Conference for Ministers and Leaders", "Institute of Christian Ministry Leadership", "Inter-Church Mission Link"], a: 1 },
    { q: "What is the name of Foursquare's quarterly night evangelistic crusade in Lagos?", options: ["Holy Ghost Night", "Refreshing Vigil", "Night of Signs", "Power Hour"], a: 1 },
    { q: "How many years does a General Overseer serve per term in Foursquare Nigeria?", options: ["3 years", "4 years", "5 years", "7 years"], a: 2 },
    { q: "Who is the current National Secretary of the Foursquare Gospel Church in Nigeria?", options: ["Rev. Joshua Olotu", "Rev. Samson Alawode", "Rev. Friday Obende", "Rev. Sam Aboyeji"], a: 1 },
    { q: "Who is the Axis Coordinator for Egbe Axis in Foursquare Nigeria?", options: ["Rev. Friday Obende", "Rev. Joshua Olotu", "Rev. Samson Alawode", "Rev. James Boyejo"], a: 0 },
    { q: "Who serves as the District Overseer of the Idimu Missionary District?", options: ["Rev. Joshua Olotu", "Rev. Friday Obende", "Rev. Samson Alawode", "Rev. Samuel Odunaike"], a: 0 },
    { q: "What was the theme of the 70th Foursquare National Convention in 2025?", options: ["Completion and Perfection", "Higher Heights", "Great Grace", "Divine Acceleration"], a: 0 },
    { q: "What is the strategic vision of Foursquare called regarding the next generation?", options: ["Decade of SOARING", "Vision 2020", "Next Gen Power", "Soar to Win"], a: 0 }
];

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
    const [mode, setMode] = useState<GameMode>('classic');
    const [timeLeft, setTimeLeft] = useState(60);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [highScores, setHighScores] = useState<Record<string, number>>({});
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [questions, setQuestions] = useState<TriviaItem[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    // Load High Scores
    useEffect(() => {
        try {
            const saved = localStorage.getItem('trivia_rush_high_scores_v2');
            if (saved) setHighScores(JSON.parse(saved));
        } catch {}
    }, []);

    const startGame = (chosenMode = mode) => {
        setMode(chosenMode);
        const shuffled = shuffleArray(MASSIVE_TRIVIA_POOL);
        setQuestions(shuffled);
        setCurrentQIndex(0);
        setScore(0);
        setStreak(0);
        setHighestStreak(0);
        setLives(3);
        setTimeLeft(chosenMode === 'marathon' ? 120 : 60);
        setGameState('playing');
        setFeedback(null);
    };

    // Timer logic for timed modes
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && mode !== 'survival' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing' && mode !== 'survival') {
            endGame();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, mode]);

    const endGame = () => {
        setGameState('end');
        setScore(currentScore => {
            const best = highScores[mode] || 0;
            if (currentScore > best) {
                const updated = { ...highScores, [mode]: currentScore };
                setHighScores(updated);
                try {
                    localStorage.setItem('trivia_rush_high_scores_v2', JSON.stringify(updated));
                } catch {}
                triggerRealisticConfetti();
            } else if (currentScore >= 80) {
                triggerRealisticConfetti();
            }
            return currentScore;
        });
    };

    const handleAnswer = (selectedIndex: number) => {
        if (feedback !== null) return;

        const isCorrect = selectedIndex === questions[currentQIndex].a;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > highestStreak) setHighestStreak(newStreak);
            const streakBonus = newStreak >= 5 ? 5 : newStreak >= 3 ? 2 : 0;
            setScore(prev => prev + 10 + streakBonus);
        } else {
            setStreak(0);
            if (mode === 'survival') {
                const nextLives = lives - 1;
                setLives(nextLives);
                if (nextLives <= 0) {
                    setTimeout(() => {
                        setFeedback(null);
                        endGame();
                    }, 500);
                    return;
                }
            } else {
                setScore(prev => Math.max(0, prev - 5));
            }
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                endGame();
            }
        }, 450);
    };

    const currentBest = highScores[mode] || 0;

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
                        <Trophy className="w-3.5 h-3.5" /> Best: {currentBest}
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
                            className="text-center space-y-6"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                                <Clock className="w-12 h-12 text-slate-950" />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" /> 80+ Bible & Church Questions
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black mb-2 uppercase tracking-tight text-white">Bible Trivia Rush</h1>
                                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                                    Test your Bible speed, recall, and discernment! Pick your battle mode below:
                                </p>
                            </div>

                            {/* Mode Selector */}
                            <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
                                {[
                                    { id: 'classic', label: 'Classic 60s', desc: 'Fast 60-second timer', icon: Clock },
                                    { id: 'marathon', label: 'Marathon 120s', desc: 'Extended 2 mins', icon: Flame },
                                    { id: 'survival', label: 'Survival Mode', desc: '3 Lives. No timer!', icon: Heart },
                                ].map((m) => {
                                    const Icon = m.icon;
                                    const isSel = mode === m.id;
                                    return (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setMode(m.id as GameMode)}
                                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                                isSel
                                                    ? 'bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border-cyan-400 text-white ring-1 ring-cyan-400'
                                                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                            }`}
                                        >
                                            <Icon className={`w-5 h-5 mb-1.5 ${isSel ? 'text-amber-400' : 'text-slate-400'}`} />
                                            <div className="font-bold text-xs text-white leading-tight">{m.label}</div>
                                            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{m.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <button 
                                    onClick={() => startGame(mode)}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 px-9 py-4 rounded-full font-black text-lg shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                    <Play className="w-6 h-6 fill-slate-950" />
                                    Launch {mode === 'classic' ? 'Classic' : mode === 'marathon' ? 'Marathon' : 'Survival'}!
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === 'playing' && questions[currentQIndex] && (
                        <motion.div 
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col justify-center"
                        >
                            {/* HUD */}
                            <div className="flex items-center justify-between mb-5 bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shadow-md">
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

                                {mode === 'survival' ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Lives</span>
                                        <div className="flex items-center gap-1 text-2xl mt-1">
                                            {[1, 2, 3].map(h => (
                                                <Heart
                                                    key={h}
                                                    className={`w-6 h-6 ${
                                                        h <= lives
                                                            ? 'text-rose-500 fill-rose-500'
                                                            : 'text-slate-600'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`flex flex-col items-end ${timeLeft <= 10 ? 'animate-pulse text-rose-400' : 'text-slate-100'}`}>
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Time</span>
                                        <span className="text-3xl font-black font-mono">{timeLeft}s</span>
                                    </div>
                                )}
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
                                            <CheckCircle2 className="w-16 h-16 text-white drop-shadow-lg mb-1" />
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
                                            <XCircle className="w-16 h-16 text-white drop-shadow-lg mb-1" />
                                            <span className="text-white font-black text-2xl uppercase tracking-wider">
                                                {mode === 'survival' ? 'Lost a Life!' : '-5 pts'}
                                            </span>
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
                                            className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-slate-700/60 hover:bg-slate-700 border-2 border-slate-600 hover:border-cyan-400 transition-all font-semibold text-base sm:text-lg cursor-pointer active:scale-98 touch-manipulation select-none"
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
                                    {mode === 'survival' && lives <= 0 ? "Out of Lives!" : "Rush Completed!"}
                                </h2>
                                <p className="text-slate-400 text-sm">You answered with wisdom and lightning speed</p>
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
                                        <span className="text-slate-400 text-xs block">Mode Record</span>
                                        <strong className="text-cyan-400 text-base">{highScores[mode] || score} pts</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                                <button 
                                    onClick={() => startGame(mode)}
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
