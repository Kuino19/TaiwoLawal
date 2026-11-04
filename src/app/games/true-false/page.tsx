'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, RotateCcw, Trophy, Clock, Flame, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';
import { gameSound, triggerHaptic } from '@/lib/gameSound';
import { earnTalents, recordGameWin } from '@/lib/gameProfile';
import GameTopBar from '@/components/games/GameTopBar';
import ShareScoreButton from '@/components/games/ShareScoreButton';

interface TrueFalseItem {
    id: number;
    statement: string;
    isTrue: boolean;
    explanation: string;
}

const MASSIVE_STATEMENTS_POOL: TrueFalseItem[] = [
    {
        id: 1,
        statement: "Moses was permitted to cross over and enter the promised land of Canaan before he died.",
        isTrue: false,
        explanation: "False! Moses viewed Canaan from Mount Nebo (Pisgah), but died there and Joshua led the children of Israel across Jordan (Deut 34:1-5)."
    },
    {
        id: 2,
        statement: "Jesus turned water into wine at a wedding feast in Cana of Galilee.",
        isTrue: true,
        explanation: "True! John 2:11 records this as the beginning of miracles which Jesus did in Cana of Galilee."
    },
    {
        id: 3,
        statement: "Samson lost his supernatural physical strength when the seven locks of his head were shaven.",
        isTrue: true,
        explanation: "True! His Nazarite consecration unto God was broken, and the LORD departed from him (Judges 16:19-20)."
    },
    {
        id: 4,
        statement: "David slew Goliath wearing King Saul's royal bronze coat of mail and helmet.",
        isTrue: false,
        explanation: "False! David put off Saul's armor because he had not proved them, choosing five smooth stones and a sling (1 Sam 17:38-40)."
    },
    {
        id: 5,
        statement: "The King James Bible states that 'money is the root of all evil.'",
        isTrue: false,
        explanation: "False! 1 Timothy 6:10 explicitly states that 'the LOVE of money is the root of all evil.'"
    },
    {
        id: 6,
        statement: "The Bible specifically names three wise men who visited young Jesus with gifts.",
        isTrue: false,
        explanation: "False! Matthew 2 mentions wise men from the east and three gifts (gold, frankincense, myrrh), but never gives their number or names."
    },
    {
        id: 7,
        statement: "Jonah was swallowed by a great fish because he initially fled toward Tarshish from the presence of the LORD.",
        isTrue: true,
        explanation: "True! Jonah rebelled against preaching in Nineveh until God prepared a great fish to swallow him (Jonah 1:1-17)."
    },
    {
        id: 8,
        statement: "Daniel was unharmed in the lions' den because God sent His angel to shut the lions' mouths.",
        isTrue: true,
        explanation: "True! Daniel 6:22 records: 'My God hath sent his angel, and hath shut the lions' mouths, that they have not hurt me.'"
    },
    {
        id: 9,
        statement: "The Old Testament contains 39 books and the New Testament contains 27 books.",
        isTrue: true,
        explanation: "True! The Protestant biblical canon contains exactly 66 books (39 in the Old and 27 in the New Testament)."
    },
    {
        id: 10,
        statement: "Peter walked on the water to go to Jesus until he saw the wind boisterous and began to sink.",
        isTrue: true,
        explanation: "True! Matthew 14:29-30 shows Peter walking on water until fear overcame him, and Jesus stretched forth His hand."
    },
    {
        id: 11,
        statement: "God sent twelve plagues upon Pharaoh and the land of Egypt before the Exodus.",
        isTrue: false,
        explanation: "False! God visited Egypt with exactly ten plagues, culminating in the death of the firstborn."
    },
    {
        id: 12,
        statement: "The shortest verse in the King James Bible is 'Jesus wept.' (John 11:35).",
        isTrue: true,
        explanation: "True! Consisting of just two words and nine letters in English."
    },
    {
        id: 13,
        statement: "Queen Esther broke Persian court law by entering the inner court uncalled to plead for her people.",
        isTrue: true,
        explanation: "True! Esther 4:16 records her brave resolve: 'so will I go in unto the king, which is not according to the law: and if I perish, I perish.'"
    },
    {
        id: 14,
        statement: "Gideon defeated the Midianite host with an army of thirty-two thousand men.",
        isTrue: false,
        explanation: "False! God whittled Gideon's army down from 32,000 to just 300 men so Israel could not vaunt itself (Judges 7:2-7)."
    },
    {
        id: 15,
        statement: "Jesus fed about five thousand men with five barley loaves and two small fishes.",
        isTrue: true,
        explanation: "True! And they took up twelve baskets full of the fragments that remained (John 6:9-13)."
    },
    {
        id: 16,
        statement: "Saul of Tarsus was blinded by a great light on the road to Damascus for three days.",
        isTrue: true,
        explanation: "True! Acts 9:9 notes he was three days without sight, and neither did eat nor drink."
    },
    {
        id: 17,
        statement: "Noah stayed inside the Ark for only forty days and forty nights.",
        isTrue: false,
        explanation: "False! The rain lasted 40 days, but Noah and the animals remained in the ark for over a year (approx. 370 days) until the earth dried (Gen 7–8)."
    },
    {
        id: 18,
        statement: "Lazarus of Bethany had been in the grave four days when Jesus commanded him to come forth.",
        isTrue: true,
        explanation: "True! Martha warned that by this time he stinketh, for he had been dead four days (John 11:39)."
    },
    {
        id: 19,
        statement: "The Apostle John wrote the Book of Revelation while imprisoned in the city of Rome.",
        isTrue: false,
        explanation: "False! John was banished unto the isle that is called Patmos for the word of God and testimony of Jesus Christ (Rev 1:9)."
    },
    {
        id: 20,
        statement: "King Solomon built the First Temple in Jerusalem upon Mount Moriah.",
        isTrue: true,
        explanation: "True! 2 Chronicles 3:1 records that Solomon began to build the house of the LORD in Jerusalem in mount Moriah."
    },
    {
        id: 21,
        statement: "Apostle Paul was a Roman citizen by birth.",
        isTrue: true,
        explanation: "True! In Acts 22:28, the chief captain said 'With a great sum obtained I this freedom,' but Paul answered 'But I was free born.'"
    },
    {
        id: 22,
        statement: "Zacchaeus was a tall Pharisee who walked at the head of Jesus' procession.",
        isTrue: false,
        explanation: "False! Zacchaeus was chief among the publicans, rich, and little of stature, which is why he climbed a sycomore tree (Luke 19:2-4)."
    },
    {
        id: 23,
        statement: "In Galatians 5:22-23 (KJV), the fruit of the Spirit begins with 'love, joy, peace, longsuffering'.",
        isTrue: true,
        explanation: "True! 'The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.'"
    },
    {
        id: 24,
        statement: "Shadrach, Meshach, and Abednego bowed down to King Nebuchadnezzar's golden image to preserve their lives.",
        isTrue: false,
        explanation: "False! They refused to worship the golden image and were cast into the burning fiery furnace, where the Son of God walked with them (Dan 3)."
    },
    {
        id: 25,
        statement: "Ravens brought Elijah bread and flesh in the morning and evening at the brook Cherith.",
        isTrue: true,
        explanation: "True! 1 Kings 17:6 confirms God commanded the ravens to feed Elijah during the famine."
    },
    {
        id: 26,
        statement: "Stephen was the first of the seven chosen deacons to be martyred by stoning.",
        isTrue: true,
        explanation: "True! Acts 7:59-60 describes Stephen praying 'Lord Jesus, receive my spirit' as they stoned him."
    },
    {
        id: 27,
        statement: "The walls of Jericho fell outward after the people shouted when the priests blew the trumpets on the seventh day.",
        isTrue: true,
        explanation: "True! Joshua 6:20 records the wall fell down flat so that the people went up into the city."
    },
    {
        id: 28,
        statement: "Judas Iscariot identified Jesus to the mob in Gethsemane by anointing His feet with oil.",
        isTrue: false,
        explanation: "False! Judas gave them a token sign saying 'Whomsoever I shall kiss, that same is he; hold him fast' (Matt 26:48)."
    },
    {
        id: 29,
        statement: "The child Samuel heard the voice of the LORD calling him four times before answering Eli's counsel.",
        isTrue: true,
        explanation: "True! The LORD called three times, and the fourth time the LORD came and stood and called 'Samuel, Samuel' (1 Sam 3:10)."
    },
    {
        id: 30,
        statement: "Genesis identifies the forbidden fruit in Eden specifically as an apple.",
        isTrue: false,
        explanation: "False! Genesis 2–3 describes it only as 'the fruit of the tree of the knowledge of good and evil'; apples are never named."
    },
    {
        id: 31,
        statement: "Methuselah died in the same year that the Great Flood came upon the earth.",
        isTrue: true,
        explanation: "True! Biblical chronology calculates Methuselah was 187 at Lamech's birth, Lamech was 182 at Noah's birth, and the flood came in Noah's 600th year (187 + 182 + 600 = 969)."
    },
    {
        id: 32,
        statement: "King David was the first king who ever reigned over Israel.",
        isTrue: false,
        explanation: "False! Saul the son of Kish of the tribe of Benjamin was the first anointed king of Israel (1 Sam 10:1)."
    },
    {
        id: 33,
        statement: "Elijah never tasted physical death, but was caught up into heaven by a whirlwind in a chariot of fire.",
        isTrue: true,
        explanation: "True! 2 Kings 2:11 records that Elijah went up by a whirlwind into heaven."
    },
    {
        id: 34,
        statement: "The Ark of the Covenant was captured by the Philistines during the days of Eli the priest.",
        isTrue: true,
        explanation: "True! 1 Samuel 4:11 records that the ark of God was taken and Hophni and Phinehas were slain."
    },
    {
        id: 35,
        statement: "In the KJV, Psalm 119 is the longest chapter in the entire Bible with 176 verses.",
        isTrue: true,
        explanation: "True! Psalm 119 has 176 verses divided into 22 eight-verse sections corresponding to the Hebrew alphabet."
    },
    {
        id: 36,
        statement: "Psalm 117 is both the shortest chapter and the middle chapter of the Bible.",
        isTrue: true,
        explanation: "True! Psalm 117 has only two verses praising the LORD."
    },
    {
        id: 37,
        statement: "The Apostle Peter was crucified upside down according to explicit verses in the Book of Acts.",
        isTrue: false,
        explanation: "False! While ancient church tradition (Origen/Eusebius) records this, the Book of Acts never describes Peter's martyrdom."
    },
    {
        id: 38,
        statement: "King Hezekiah was granted fifteen additional years of life after praying on his deathbed.",
        isTrue: true,
        explanation: "True! God heard his tears and Isaiah declared that fifteen years would be added to his life (2 Kings 20:6)."
    },
    {
        id: 39,
        statement: "The shadow on the sundial of Ahaz moved forward ten degrees as a sign to King Hezekiah.",
        isTrue: false,
        explanation: "False! The miraculous sign was that the shadow returned backward ten degrees (2 Kings 20:11)."
    },
    {
        id: 40,
        statement: "Deborah was both a prophetess and a judge over Israel before the era of the kings.",
        isTrue: true,
        explanation: "True! Judges 4:4 states: 'And Deborah, a prophetess, the wife of Lapidoth, she judged Israel at that time.'"
    },
    {
        id: 41,
        statement: "King Solomon had seven hundred wives, princesses, and three hundred concubines.",
        isTrue: true,
        explanation: "True! 1 Kings 11:3 confirms he had 700 wives and 300 concubines, who turned away his heart after other gods."
    },
    {
        id: 42,
        statement: "Joseph's brothers sold him to the Ishmeelites for thirty pieces of gold.",
        isTrue: false,
        explanation: "False! Genesis 37:28 states they sold Joseph for twenty pieces of silver."
    },
    {
        id: 43,
        statement: "Melchizedek is described in Hebrews as having neither beginning of days, nor end of life.",
        isTrue: true,
        explanation: "True! Hebrews 7:3 describes Melchizedek as 'without father, without mother, without descent, made like unto the Son of God.'"
    },
    {
        id: 44,
        statement: "The Book of Esther contains the name of God mentioned explicitly more than twenty times.",
        isTrue: false,
        explanation: "False! The name of God (Yahweh or Elohim) is never explicitly mentioned in the entire text of Esther, though His providence is everywhere evident."
    },
    {
        id: 45,
        statement: "Jesus had four half-brothers named James, Joses, Simon, and Judas in the Gospels.",
        isTrue: true,
        explanation: "True! Matthew 13:55 records the townsfolk saying: 'Is not his mother called Mary? and his brethren, James, and Joses, and Simon, and Judas?'"
    },
    {
        id: 46,
        statement: "Nicodemus assisted Joseph of Arimathaea in preparing Jesus' body for burial with about an hundred pound weight of myrrh and aloes.",
        isTrue: true,
        explanation: "True! John 19:39 notes Nicodemus brought a mixture of myrrh and aloes, about an hundred pound weight."
    },
    {
        id: 47,
        statement: "Noah released a raven first from the Ark, and afterward sent forth a dove three times.",
        isTrue: true,
        explanation: "True! Genesis 8:7-12 details the raven flying to and fro, followed by the dove returning, bringing an olive leaf, and finally remaining on earth."
    },
    {
        id: 48,
        statement: "The Ten Commandments were spoken by God from Mount Sinai in Exodus chapter 20.",
        isTrue: true,
        explanation: "True! Exodus 20 records the audible giving of the Decalogue to Israel."
    },
    {
        id: 49,
        statement: "Balaam's ass spoke when she saw the angel of the LORD standing in the way with his sword drawn.",
        isTrue: true,
        explanation: "True! Numbers 22:28 records the LORD opened the mouth of the ass, and she said unto Balaam: 'What have I done unto thee?'"
    },
    {
        id: 50,
        statement: "King Nebuchadnezzar of Babylon ate grass like an ox for seven times until he acknowledged the Most High.",
        isTrue: true,
        explanation: "True! Daniel 4:33 records he was driven from men and did eat grass as oxen until his hair grew like eagles' feathers."
    },
    {
        id: 51,
        statement: "The Apostle Thomas was present with the other disciples the first time the risen Jesus appeared on resurrection evening.",
        isTrue: false,
        explanation: "False! John 20:24 explicitly says: 'But Thomas, one of the twelve, called Didymus, was not with them when Jesus came.'"
    },
    {
        id: 52,
        statement: "God provided both manna in the morning and quails in the evening for Israel to eat in the wilderness.",
        isTrue: true,
        explanation: "True! Exodus 16:13 states that at even the quails came up and covered the camp, and in the morning the dew lay."
    },
    {
        id: 53,
        statement: "Cain was the younger brother and Abel was the firstborn of Adam and Eve.",
        isTrue: false,
        explanation: "False! Cain was the firstborn son of Adam and Eve, and Abel was born after him (Gen 4:1-2)."
    },
    {
        id: 54,
        statement: "The golden calf fashioned at the foot of Mount Sinai was made by Aaron at the people's demand.",
        isTrue: true,
        explanation: "True! Aaron received their golden earrings and fashioned it with a graving tool into a molten calf (Exodus 32:2-4)."
    },
    {
        id: 55,
        statement: "Ezekiel saw the vision of a valley full of dry bones that stood upon their feet as an exceeding great army.",
        isTrue: true,
        explanation: "True! Ezekiel 37:1-10 describes the bones coming together, sinews and flesh coming upon them, and breath entering into them."
    },
    {
        id: 56,
        statement: "Paul was shipwrecked on the island of Crete on his way to appear before Caesar in Rome.",
        isTrue: false,
        explanation: "False! Paul's ship ran aground on the island of Melita (modern Malta), recorded in Acts 28:1."
    },
    {
        id: 57,
        statement: "Barnabas sold land he owned and laid the money at the apostles' feet in Acts 4.",
        isTrue: true,
        explanation: "True! Acts 4:36-37 names Joses, who by the apostles was surnamed Barnabas, having land, sold it, and brought the money."
    },
    {
        id: 58,
        statement: "The New Jerusalem described in Revelation 21 has twelve gates made of solid gold.",
        isTrue: false,
        explanation: "False! Revelation 21:21 says the twelve gates were twelve pearls; every several gate was of one pearl, while the street of the city was pure gold."
    },
    {
        id: 59,
        statement: "The High Priest of Israel entered into the Holy of Holies only once every year on the Day of Atonement.",
        isTrue: true,
        explanation: "True! Hebrews 9:7 and Leviticus 16 confirm the High Priest went alone once a year, not without blood."
    },
    {
        id: 60,
        statement: "Jesus healed ten lepers, but only one, a Samaritan, returned to give glory to God.",
        isTrue: true,
        explanation: "True! Luke 17:15-18 notes the grateful Samaritan fell down on his face at Jesus' feet, giving Him thanks."
    },
    {
        id: 61,
        statement: "King Belshazzar saw the mysterious handwriting on the wall while drinking wine from the golden vessels of the temple.",
        isTrue: true,
        explanation: "True! Daniel 5:2-5 confirms Belshazzar used the holy vessels of the house of God to toast his gods when the fingers appeared."
    },
    {
        id: 62,
        statement: "The prophet Habakkuk was cast into a muddy dungeon where he sank into the mire.",
        isTrue: false,
        explanation: "False! It was Jeremiah who was cast into the dungeon of Malchiah and sank in the mire (Jeremiah 38:6)."
    },
    {
        id: 63,
        statement: "According to KJV Hebrews 11:1, 'Faith is the substance of things hoped for, the evidence of things not seen.'",
        isTrue: true,
        explanation: "True! This is the timeless definition of faith in King James scripture."
    },
    {
        id: 64,
        statement: "Jephthah made a vow unto the LORD and was met on his return by his only daughter dancing with timbrels.",
        isTrue: true,
        explanation: "True! Judges 11:34 confirms she was his only child; beside her he had neither son nor daughter."
    },
    {
        id: 65,
        statement: "John the Baptist performed many mighty miracles during his wilderness ministry.",
        isTrue: false,
        explanation: "False! John 10:41 explicitly says: 'John did no miracle: but all things that John spake of this man were true.'"
    },
    {
        id: 66,
        statement: "The walls of Jerusalem were rebuilt by Nehemiah and the people in fifty-two days.",
        isTrue: true,
        explanation: "True! Nehemiah 6:15 records: 'So the wall was finished... in fifty and two days.'"
    },
    {
        id: 67,
        statement: "Absalom, King David's son, was caught by his thick hair in the boughs of a great oak while riding a mule.",
        isTrue: true,
        explanation: "True! 2 Samuel 18:9 describes his head catching hold of the oak, and he was taken up between heaven and earth."
    },
    {
        id: 68,
        statement: "The Book of James declares that faith without works is dead.",
        isTrue: true,
        explanation: "True! James 2:20 asserts: 'wilt thou know, O vain man, that faith without works is dead?'"
    },
    {
        id: 69,
        statement: "The Roman governor who condemned Jesus was Felix.",
        isTrue: false,
        explanation: "False! Pontius Pilate was the governor of Judaea who authorized Jesus' crucifixion; Felix was governor years later when Paul was tried in Acts 24."
    },
    {
        id: 70,
        statement: "In Revelation, the Lion of the tribe of Judah is the only One found worthy to open the book and loose the seven seals.",
        isTrue: true,
        explanation: "True! Revelation 5:5 declares: 'weep not: behold, the Lion of the tribe of Juda, the Root of David, hath prevailed to open the book.'"
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

export default function TrueOrFalseGame() {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [roundCount, setRoundCount] = useState<12 | 20 | 30>(12);
    const [questions, setQuestions] = useState<TrueFalseItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

    const startNewGame = (count = roundCount) => {
        setRoundCount(count);
        const shuffled = shuffle(MASSIVE_STATEMENTS_POOL).slice(0, count);
        setQuestions(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setHighestStreak(0);
        setFeedback(null);
        setSelectedAnswer(null);
        setGameState('playing');
    };

    const currentQ = questions[currentIndex];

    const handleAnswer = (userChoice: boolean) => {
        if (feedback !== null) return;
        setSelectedAnswer(userChoice);

        const isCorrect = userChoice === currentQ.isTrue;
        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            gameSound.playSuccess();
            triggerHaptic('success');
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > highestStreak) setHighestStreak(newStreak);
            const streakBonus = newStreak >= 3 ? 5 : 0;
            setScore(prev => prev + 10 + streakBonus);
        } else {
            gameSound.playError();
            triggerHaptic('error');
            setStreak(0);
        }

        setTimeout(() => {
            setFeedback(null);
            setSelectedAnswer(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setGameState('end');
                gameSound.playFanfare();
                triggerHaptic('heavy');
                triggerRealisticConfetti();
                earnTalents(20);
                recordGameWin('true_false');
            }
        }, 1400);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            {/* Top Bar with Profile Stats */}
            <GameTopBar
                title="True or False Blitz"
                backHref="/games"
                backLabel="Games"
                theme="dark"
                extraPill={
                    gameState === 'playing' ? (
                        <div className="text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-full">
                            {score} pts
                        </div>
                    ) : null
                }
            />

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
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <span className="text-5xl">⚡</span>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" /> 70+ Deep Biblical Truths (KJV)
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
                                    True or False?
                                </h1>
                                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                                    Test your discernment against common misconceptions and deep King James scripture truths! Decide quickly and build massive score combos.
                                </p>
                            </div>

                            {/* Length Selector */}
                            <div className="space-y-1.5 text-left max-w-sm mx-auto">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Choose Blitz Length
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { count: 12, label: '12 Statements', sub: 'Quick Blitz' },
                                        { count: 20, label: '20 Statements', sub: 'Championship' },
                                        { count: 30, label: '30 Statements', sub: 'Grand Tour' }
                                    ].map(b => (
                                        <button
                                            key={b.count}
                                            type="button"
                                            onClick={() => setRoundCount(b.count as any)}
                                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-bold ${
                                                roundCount === b.count
                                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                                                    : 'bg-slate-700/60 border-slate-600 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            <div className="text-xs">{b.label}</div>
                                            <div className="text-[10px] text-slate-400 font-normal">{b.sub}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => startNewGame(roundCount)}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                            >
                                Start Blitz
                            </button>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === 'playing' && currentQ && (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col space-y-4"
                        >
                            {/* HUD */}
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="text-slate-400">
                                    Statement {currentIndex + 1} of {questions.length}
                                </span>
                                {streak >= 3 && (
                                    <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                                        <Flame className="w-3.5 h-3.5 fill-amber-400" /> {streak}x Streak!
                                    </span>
                                )}
                                <span className="text-emerald-400 font-bold">
                                    {score} Points
                                </span>
                            </div>

                            {/* Statement Card */}
                            <div className="bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden text-center">
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-2xl text-xs sm:text-sm font-medium mb-5 text-left flex items-start gap-3 ${
                                            feedback === 'correct'
                                                ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-200'
                                                : 'bg-rose-600/30 border border-rose-500/50 text-rose-200'
                                        }`}
                                    >
                                        <span className="text-xl flex-shrink-0 mt-0.5">
                                            {feedback === 'correct' ? '✅' : '❌'}
                                        </span>
                                        <div>
                                            <strong className="block text-white text-sm">
                                                {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
                                            </strong>
                                            <p className="mt-1 leading-relaxed opacity-90">{currentQ.explanation}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                                    Is this statement true or false?
                                </p>

                                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white leading-relaxed mb-8">
                                    &ldquo;{currentQ.statement}&rdquo;
                                </h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        disabled={feedback !== null}
                                        onClick={() => handleAnswer(true)}
                                        className={`p-4 sm:p-5 rounded-2xl font-black text-lg sm:text-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 touch-manipulation select-none ${
                                            feedback !== null && currentQ.isTrue
                                                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50'
                                                : feedback !== null && selectedAnswer === true
                                                ? 'bg-rose-600 text-white'
                                                : 'bg-emerald-600/20 border-2 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                                        }`}
                                    >
                                        <Check className="w-5 h-5 sm:w-6 sm:h-6" /> TRUE
                                    </button>

                                    <button
                                        type="button"
                                        disabled={feedback !== null}
                                        onClick={() => handleAnswer(false)}
                                        className={`p-4 sm:p-5 rounded-2xl font-black text-lg sm:text-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 touch-manipulation select-none ${
                                            feedback !== null && !currentQ.isTrue
                                                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-400/50'
                                                : feedback !== null && selectedAnswer === false
                                                ? 'bg-rose-600 text-white'
                                                : 'bg-rose-600/20 border-2 border-rose-500/50 text-rose-300 hover:bg-rose-600 hover:text-white'
                                        }`}
                                    >
                                        <X className="w-5 h-5 sm:w-6 sm:h-6" /> FALSE
                                    </button>
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
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Trophy className="w-10 h-10 text-slate-950" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-white mb-1">
                                    Blitz Completed!
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Awesome quick-thinking on Scripture truths!
                                </p>

                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 my-4">
                                    {score} <span className="text-2xl text-slate-400 font-medium">pts</span>
                                </div>

                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold mb-3">
                                    <span>🪙 +20 Talents Earned!</span>
                                </div>

                                <div className="text-xs text-slate-400 mb-4">
                                    Longest Streak: <strong className="text-amber-400">{highestStreak} in a row</strong>
                                </div>

                                {/* WhatsApp Challenge Share */}
                                <div className="max-w-sm mx-auto">
                                    <ShareScoreButton
                                        gameName="Bible True or False Blitz"
                                        resultDetails={`Scored ${score} pts in the ${roundCount}-statement True or False Blitz with a ${highestStreak}-streak!`}
                                        urlPath="/games/true-false"
                                        variant="whatsapp"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                                <button
                                    onClick={() => startNewGame(roundCount)}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 px-7 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
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
