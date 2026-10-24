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

const MASSIVE_MYSTERY_POOL: MysteryCharacter[] = [
    {
        id: 1,
        name: "Noah",
        clues: [
            "I found grace in the eyes of the Lord in a wicked generation.",
            "I spent months with pairs of animals afloat on vast deep waters.",
            "I built an enormous gopherwood ark that saved my family from the great flood."
        ],
        funFact: "Noah lived to be 950 years old and was a preacher of righteousness!",
        options: ["Abraham", "Noah", "Moses", "Enoch"]
    },
    {
        id: 2,
        name: "Moses",
        clues: [
            "I was hidden in a papyrus basket among the reeds along the Nile River as a baby.",
            "I spoke with God at a burning bush on Mount Horeb that was never consumed.",
            "I lifted my shepherd staff and the Red Sea parted so Israel walked on dry land."
        ],
        funFact: "Moses received the Ten Commandments directly from God on Mount Sinai!",
        options: ["Joshua", "Aaron", "Moses", "Gideon"]
    },
    {
        id: 3,
        name: "David",
        clues: [
            "I was the youngest son of Jesse and spent my early youth tending sheep in Bethlehem.",
            "I played the harp skillfully to soothe King Saul's troubled spirit.",
            "I defeated the giant Goliath with just a sling and a single smooth stone."
        ],
        funFact: "David was called 'a man after God's own heart' and authored many of the Psalms!",
        options: ["Solomon", "Saul", "Jonathan", "David"]
    },
    {
        id: 4,
        name: "Daniel",
        clues: [
            "I resolved not to defile myself with the royal food and wine of Babylon.",
            "God granted me wisdom to interpret King Nebuchadnezzar's mysterious dream of a great statue.",
            "I was thrown into a den of hungry lions because I prayed to God three times a day."
        ],
        funFact: "God sent His angel to shut the lions' mouths, and Daniel was completely unharmed!",
        options: ["Daniel", "Joseph", "Jeremiah", "Ezekiel"]
    },
    {
        id: 5,
        name: "Esther",
        clues: [
            "My Hebrew name was Hadassah before I entered the royal palace of Susa.",
            "My cousin Mordecai raised me and gave me wise, godly counsel.",
            "I boldly approached King Xerxes saying: 'If I perish, I perish' to save my people."
        ],
        funFact: "Esther became Queen of Persia and saved the entire Jewish nation from destruction!",
        options: ["Ruth", "Esther", "Deborah", "Sarah"]
    },
    {
        id: 6,
        name: "Jonah",
        clues: [
            "I bought a ticket for a ship sailing to Tarshish to run away from God's assignment.",
            "A violent storm arose at sea, and the terrified sailors cast lots that pointed to me.",
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
            "I once struck down a thousand Philistines with the fresh jawbone of a donkey.",
            "My immense supernatural strength left me when Delilah had my seven braids shaved off."
        ],
        funFact: "In his final prayer, Samson pushed apart the pillars of Dagon's temple!",
        options: ["Samson", "Gideon", "Jephthah", "Barak"]
    },
    {
        id: 8,
        name: "Ruth",
        clues: [
            "I was born in the land of Moab, but I chose to follow the God of Israel.",
            "I told my mother-in-law: 'Where you go I will go, and where you stay I will stay.'",
            "I gleaned barley in the fields of Boaz, who became my honorable kinsman-redeemer."
        ],
        funFact: "Ruth became the great-grandmother of King David and an ancestor of Jesus Christ!",
        options: ["Orpah", "Naomi", "Ruth", "Hannah"]
    },
    {
        id: 9,
        name: "Peter",
        clues: [
            "My birth name was Simon before Jesus gave me a new name meaning 'Rock'.",
            "I stepped out of the fishing boat in the middle of a storm and walked on water.",
            "I denied knowing Jesus three times before the rooster crowed early in the morning."
        ],
        funFact: "Peter preached boldly on the day of Pentecost, and 3,000 souls were saved!",
        options: ["Peter", "John", "Andrew", "Thomas"]
    },
    {
        id: 10,
        name: "Paul",
        clues: [
            "I was a strict Pharisee who originally persecuted and arrested followers of Christ.",
            "A dazzling light from heaven blinded me on the road to Damascus as Jesus spoke to me.",
            "I became the great missionary to the Gentiles and wrote many letters in the New Testament."
        ],
        funFact: "Paul and Silas sang hymns in prison at midnight when a great earthquake shook the foundations!",
        options: ["Barnabas", "Stephen", "Paul", "Timothy"]
    },
    {
        id: 11,
        name: "Joseph",
        clues: [
            "My father Jacob loved me dearly and gifted me an ornate robe of many colors.",
            "My jealous brothers threw me in a cistern and sold me to Midianite traders.",
            "I interpreted Pharaoh's dreams of fat and skinny cows and became the governor of Egypt."
        ],
        funFact: "Joseph told his brothers: 'You intended to harm me, but God intended it for good!'",
        options: ["Benjamin", "Joseph", "Reuben", "Judah"]
    },
    {
        id: 12,
        name: "Elijah",
        clues: [
            "Ravens brought me bread and meat morning and evening by the brook Cherith.",
            "I challenged 450 prophets of Baal on Mount Carmel, and God answered with holy fire.",
            "I did not die a natural death, but was caught up to heaven in a fiery chariot and whirlwind."
        ],
        funFact: "Elijah's mantle fell to Elisha, who asked for a double portion of his spirit!",
        options: ["Elisha", "Elijah", "Isaiah", "Jeremiah"]
    },
    {
        id: 13,
        name: "Solomon",
        clues: [
            "When God appeared to me in a dream at Gibeon, I asked for wisdom to lead His people.",
            "Two mothers brought a dispute over a baby, and my wise judgment revealed the true mother.",
            "I built the glorious First Temple in Jerusalem decorated with pure gold and cedar of Lebanon."
        ],
        funFact: "The Queen of Sheba traveled from afar to witness Solomon's wisdom and majesty!",
        options: ["David", "Solomon", "Rehoboam", "Hezekiah"]
    },
    {
        id: 14,
        name: "Joshua",
        clues: [
            "I was one of only two spies who brought back an encouraging, faithful report about Canaan.",
            "I was Moses' faithful assistant on the mountain of God for forty days.",
            "I commanded the sun and moon to stand still in the valley of Aijalon during battle."
        ],
        funFact: "Joshua declared: 'As for me and my household, we will serve the LORD!'",
        options: ["Caleb", "Joshua", "Gideon", "Barak"]
    },
    {
        id: 15,
        name: "Gideon",
        clues: [
            "An angel of the Lord called me a 'mighty warrior' while I was hiding threshing wheat in a winepress.",
            "I put out a fleece of wool overnight twice seeking God's divine confirmation.",
            "God reduced my army from 32,000 men down to just 300 men with clay jars, torches, and trumpets."
        ],
        funFact: "Gideon's 300 men blew trumpets and broke jars shouting: 'A sword for the LORD and for Gideon!'",
        options: ["Samson", "Gideon", "Jephthah", "Saul"]
    },
    {
        id: 16,
        name: "Deborah",
        clues: [
            "I held court under a palm tree between Ramah and Bethel in the hill country of Ephraim.",
            "I summoned Barak to lead Israel's army against the Canaanite commander Sisera.",
            "I was a prophetess, judge, and poet who described myself as 'a mother in Israel'."
        ],
        funFact: "Deborah sang a magnificent song of victory celebrating God's triumph over Sisera's 900 chariots!",
        options: ["Deborah", "Esther", "Jael", "Huldah"]
    },
    {
        id: 17,
        name: "Nehemiah",
        clues: [
            "I was the royal cupbearer to King Artaxerxes in the Persian winter capital of Susa.",
            "I wept and fasted upon hearing that the walls of Jerusalem were broken down and its gates burned.",
            "I led the citizens of Jerusalem to rebuild the entire defensive wall in just 52 days!"
        ],
        funFact: "Nehemiah's builders worked with a trowel in one hand and a weapon in the other!",
        options: ["Ezra", "Nehemiah", "Zerubbabel", "Mordecai"]
    },
    {
        id: 18,
        name: "Zacchaeus",
        clues: [
            "I lived in Jericho and was wealthy as the chief tax collector of the region.",
            "Because I was short in stature, I could not see Jesus over the dense crowd.",
            "I ran ahead and climbed up into a sycamore-fig tree so I could see Jesus as He passed."
        ],
        funFact: "Jesus stayed at his house and Zacchaeus joyfully pledged half his goods to the poor!",
        options: ["Levi", "Nicodemus", "Zacchaeus", "Bartimaeus"]
    },
    {
        id: 19,
        name: "Stephen",
        clues: [
            "I was one of seven respected men chosen to oversee food distribution to widows in Jerusalem.",
            "I was full of God's grace and power, performing great wonders and signs among the people.",
            "As they stoned me, I looked up into heaven, saw Jesus at God's right hand, and prayed: 'Lord, do not hold this sin against them.'"
        ],
        funFact: "Stephen is remembered as the very first Christian martyr of the Church!",
        options: ["Philip", "Stephen", "Barnabas", "Timothy"]
    },
    {
        id: 20,
        name: "Hannah",
        clues: [
            "I was deeply grieved because I had no children, and my rival provoked me bitterly.",
            "The priest Eli saw my lips moving at the tabernacle in Shiloh and thought I was drunk.",
            "God answered my tears and gave me a son whom I dedicated to the Lord for all his life."
        ],
        funFact: "Her son Samuel grew up in the tabernacle and anointed both King Saul and King David!",
        options: ["Sarah", "Hannah", "Elizabeth", "Rachel"]
    },
    {
        id: 21,
        name: "John the Baptist",
        clues: [
            "I wore clothing made of camel's hair with a leather belt, and my food was locusts and wild honey.",
            "I was the voice of one crying in the wilderness: 'Prepare the way of the Lord, make His paths straight!'",
            "I baptized the Lord Jesus Christ in the waters of the Jordan River as the Spirit descended like a dove."
        ],
        funFact: "Jesus called him the greatest of all born of women!",
        options: ["Elijah", "John the Baptist", "James", "Peter"]
    },
    {
        id: 22,
        name: "Mary Magdalene",
        clues: [
            "Jesus delivered me from seven tormenting demons, and I became His devoted follower.",
            "I stood faithfully near the foot of the cross during the crucifixion.",
            "I was the very first person to whom the risen Lord Jesus appeared on Sunday morning at the garden tomb."
        ],
        funFact: "She ran to the disciples shouting: 'I have seen the Lord!'",
        options: ["Mary mother of Jesus", "Mary Magdalene", "Martha", "Salome"]
    },
    {
        id: 23,
        name: "Caleb",
        clues: [
            "I was of the tribe of Judah and represented my people as one of the twelve scouts sent into Canaan.",
            "Along with Joshua, I silenced the fearful crowd saying: 'We should certainly go up and take the land!'",
            "At 85 years of age, I declared: 'Give me this mountain!' and drove out the giant Anakites."
        ],
        funFact: "God commended Caleb because he had a 'different spirit' and followed the Lord wholeheartedly!",
        options: ["Joshua", "Caleb", "Othniel", "Phinehas"]
    },
    {
        id: 24,
        name: "Barnabas",
        clues: [
            "My original name was Joseph, a Levite from Cyprus, but the apostles gave me a nickname meaning 'Son of Encouragement'.",
            "I sold a field I owned and brought the money to lay at the apostles' feet.",
            "When everyone was afraid of Saul after his conversion, I took him by the hand and brought him to the apostles."
        ],
        funFact: "Barnabas later traveled with Paul to establish the early churches in Asia Minor!",
        options: ["Barnabas", "Silas", "Luke", "Apollos"]
    },
    {
        id: 25,
        name: "Aimee Semple McPherson",
        clues: [
            "I was a pioneering Canadian-American female evangelist known for dramatic, illustrated sermons.",
            "I founded the historic Angelus Temple in Los Angeles with 5,300 seats and the KFSG Christian radio station.",
            "Under God's divine guidance in 1923, I established the International Church of the Foursquare Gospel."
        ],
        funFact: "She proclaimed Jesus as Saviour, Baptizer with the Holy Spirit, Healer, and Soon-Coming King!",
        options: ["Aimee Semple McPherson", "Kathryn Kuhlman", "Faye Curtis", "Mary Slessor"]
    },
    {
        id: 26,
        name: "Rev. Harold Curtis",
        clues: [
            "Together with my wife Faye, I sailed across the ocean to bring the Foursquare message to Africa.",
            "In 1955, we established the very first Foursquare fellowship in Nigeria.",
            "Our earliest Nigerian church meetings were held at Yankee Bar in Yaba, Lagos."
        ],
        funFact: "Rev. Harold & Faye Curtis planted the seeds for over 5,000 Foursquare churches in Nigeria today!",
        options: ["Samuel Odunaike", "Rev. Harold Curtis", "Rev. Sam Aboyeji", "James Boyejo"]
    },
    {
        id: 27,
        name: "Rev. (Dr.) Sam Aboyeji",
        clues: [
            "I am an anointed servant of God who previously served in petroleum engineering and pastoral leadership.",
            "I was elected into office as the General Overseer of the Foursquare Gospel Church in Nigeria in 2019.",
            "I championed the church's strategic 'Decade of SOARING' vision and presided over the 70th Platinum Jubilee in 2025."
        ],
        funFact: "His tenure has emphasized inreach, aggressive church planting outreach, and empowering the next generation!",
        options: ["Rev. Felix Meduoye", "Rev. (Dr.) Sam Aboyeji", "Rev. Wilson Badejo", "Rev. Samson Alawode"]
    },
    {
        id: 28,
        name: "Samuel Odunaike",
        clues: [
            "I was one of the earliest prominent Nigerian converts who embraced the Foursquare Gospel in the 1950s.",
            "I served as an anointed pioneer leader, eloquent preacher, and General Supervisor of Foursquare Nigeria.",
            "My godly leadership guided Foursquare Nigeria into national prominence and independence."
        ],
        funFact: "He was also a respected corporate executive who brought exceptional administrative excellence to the church!",
        options: ["Samuel Odunaike", "James Boyejo", "Friday Osuwa", "Sam Aboyeji"]
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
    const [roundLength, setRoundLength] = useState<5 | 10 | 20>(10);
    const [characters, setCharacters] = useState<MysteryCharacter[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clueLevel, setClueLevel] = useState<1 | 2 | 3>(1);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [roundHistory, setRoundHistory] = useState<{ char: MysteryCharacter; won: boolean; points: number }[]>([]);

    const startNewGame = (len = roundLength) => {
        setRoundLength(len);
        const shuffled = shuffle(MASSIVE_MYSTERY_POOL).slice(0, len);
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
        }, 1600);
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
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" /> 28 Famous Bible & Church Heroes
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
                                    Who Am I?
                                </h1>
                                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                                    Inspect secret identity clues! Guess with fewer clues revealed to earn up to <strong>300 points</strong> per character!
                                </p>
                            </div>

                            {/* Round Length Selector */}
                            <div className="space-y-1.5 text-left max-w-sm mx-auto">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Investigation Length
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { len: 5, label: 'Quick (5)' },
                                        { len: 10, label: 'Standard (10)' },
                                        { len: 20, label: 'Marathon (20)' }
                                    ].map(r => (
                                        <button
                                            key={r.len}
                                            type="button"
                                            onClick={() => setRoundLength(r.len as any)}
                                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-bold text-xs ${
                                                roundLength === r.len
                                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                                                    : 'bg-slate-700/60 border-slate-600 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => startNewGame(roundLength)}
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
                                <AnimatePresence>
                                    {feedback === 'correct' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-600/95 backdrop-blur-md p-6 text-center"
                                        >
                                            <CheckCircle2 className="w-16 h-16 text-white mb-2" />
                                            <h3 className="text-2xl font-black text-white mb-1">CORRECT DETECTIVE!</h3>
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
                                            <p className="text-rose-100 text-lg font-bold mb-2">I am {currentChar.name}!</p>
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

                                <div className="space-y-3 mb-5">
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
                                        className="w-full py-2.5 rounded-xl border border-dashed border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-bold transition-all mb-5 flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <HelpCircle className="w-3.5 h-3.5" /> Reveal Next Clue (Next clue lowers value to {clueLevel === 1 ? 200 : 100} pts)
                                    </button>
                                )}

                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
                                    Who Am I? (Tap Your Answer)
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {currentChar.options.map((opt, oIdx) => (
                                        <button
                                            key={oIdx}
                                            type="button"
                                            onClick={() => handleGuess(opt)}
                                            className={`p-3.5 sm:p-4 rounded-xl border-2 text-left font-bold text-sm sm:text-base transition-all cursor-pointer active:scale-98 touch-manipulation select-none ${
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
                                    onClick={() => startNewGame(roundLength)}
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
