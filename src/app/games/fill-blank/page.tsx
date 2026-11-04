'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight, Sparkles, Flame, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';
import { gameSound, triggerHaptic } from '@/lib/gameSound';
import { earnTalents, spendTalents, recordGameWin } from '@/lib/gameProfile';
import GameTopBar from '@/components/games/GameTopBar';
import ShareScoreButton from '@/components/games/ShareScoreButton';

interface BlankQuestion {
    id: number;
    sentenceBefore: string;
    blankWord: string;
    sentenceAfter: string;
    reference: string;
    options: string[];
    explanation?: string;
}

const MASSIVE_BLANK_QUESTIONS: BlankQuestion[] = [
    {
        id: 1,
        sentenceBefore: "In the beginning God created the",
        blankWord: "heaven",
        sentenceAfter: "and the earth.",
        reference: "Genesis 1:1",
        options: ["heaven", "oceans", "angels", "firmament"],
        explanation: "Genesis 1:1 (KJV): 'In the beginning God created the heaven and the earth.'"
    },
    {
        id: 2,
        sentenceBefore: "The LORD is my shepherd; I shall not",
        blankWord: "want",
        sentenceAfter: ".",
        reference: "Psalm 23:1",
        options: ["want", "fear", "lack", "stumble"],
        explanation: "Psalm 23:1 (KJV): 'The LORD is my shepherd; I shall not want.'"
    },
    {
        id: 3,
        sentenceBefore: "For God so loved the world, that he gave his only",
        blankWord: "begotten",
        sentenceAfter: "Son, that whosoever believeth in him should not perish, but have everlasting life.",
        reference: "John 3:16",
        options: ["begotten", "beloved", "holy", "anointed"],
        explanation: "John 3:16 (KJV): 'that he gave his only begotten Son...'"
    },
    {
        id: 4,
        sentenceBefore: "I can do all things through Christ which",
        blankWord: "strengtheneth",
        sentenceAfter: "me.",
        reference: "Philippians 4:13",
        options: ["strengtheneth", "guideth", "comforteth", "healeth"],
        explanation: "Philippians 4:13 (KJV): 'I can do all things through Christ which strengtheneth me.'"
    },
    {
        id: 5,
        sentenceBefore: "Thy word is a lamp unto my feet, and a",
        blankWord: "light",
        sentenceAfter: "unto my path.",
        reference: "Psalm 119:105",
        options: ["light", "shield", "guide", "fire"],
        explanation: "Psalm 119:105 (KJV): 'Thy word is a lamp unto my feet, and a light unto my path.'"
    },
    {
        id: 6,
        sentenceBefore: "Jesus saith unto him, I am the way, the truth, and the",
        blankWord: "life",
        sentenceAfter: ": no man cometh unto the Father, but by me.",
        reference: "John 14:6",
        options: ["life", "door", "rock", "light"],
        explanation: "John 14:6 (KJV): 'I am the way, the truth, and the life: no man cometh unto the Father, but by me.'"
    },
    {
        id: 7,
        sentenceBefore: "Have not I commanded thee? Be strong and of a good",
        blankWord: "courage",
        sentenceAfter: "; be not afraid, neither be thou dismayed.",
        reference: "Joshua 1:9",
        options: ["courage", "heart", "faith", "hope"],
        explanation: "Joshua 1:9 (KJV): 'Be strong and of a good courage; be not afraid...'"
    },
    {
        id: 8,
        sentenceBefore: "Trust in the LORD with all thine heart; and lean not unto thine own",
        blankWord: "understanding",
        sentenceAfter: ".",
        reference: "Proverbs 3:5",
        options: ["understanding", "strength", "wisdom", "counsel"],
        explanation: "Proverbs 3:5 (KJV): 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.'"
    },
    {
        id: 9,
        sentenceBefore: "And we know that all things work together for",
        blankWord: "good",
        sentenceAfter: "to them that love God, to them who are the called according to his purpose.",
        reference: "Romans 8:28",
        options: ["good", "peace", "righteousness", "praise"],
        explanation: "Romans 8:28 (KJV): 'all things work together for good to them that love God...'"
    },
    {
        id: 10,
        sentenceBefore: "But the fruit of the Spirit is love, joy, peace,",
        blankWord: "longsuffering",
        sentenceAfter: ", gentleness, goodness, faith, meekness, temperance.",
        reference: "Galatians 5:22-23",
        options: ["longsuffering", "patience", "forbearance", "righteousness"],
        explanation: "Galatians 5:22-23 (KJV): 'love, joy, peace, longsuffering, gentleness, goodness, faith...'"
    },
    {
        id: 11,
        sentenceBefore: "They that wait upon the LORD shall renew their strength; they shall mount up with wings as",
        blankWord: "eagles",
        sentenceAfter: "; they shall run, and not be weary.",
        reference: "Isaiah 40:31",
        options: ["eagles", "doves", "hawks", "angels"],
        explanation: "Isaiah 40:31 (KJV): 'they shall mount up with wings as eagles; they shall run, and not be weary.'"
    },
    {
        id: 12,
        sentenceBefore: "But seek ye first the kingdom of God, and his",
        blankWord: "righteousness",
        sentenceAfter: "; and all these things shall be added unto you.",
        reference: "Matthew 6:33",
        options: ["righteousness", "holiness", "peace", "grace"],
        explanation: "Matthew 6:33 (KJV): 'seek ye first the kingdom of God, and his righteousness...'"
    },
    {
        id: 13,
        sentenceBefore: "The name of the LORD is a strong",
        blankWord: "tower",
        sentenceAfter: ": the righteous runneth into it, and is safe.",
        reference: "Proverbs 18:10",
        options: ["tower", "shield", "habitation", "rock"],
        explanation: "Proverbs 18:10 (KJV): 'The name of the LORD is a strong tower: the righteous runneth into it, and is safe.'"
    },
    {
        id: 14,
        sentenceBefore: "For God hath not given us the spirit of",
        blankWord: "fear",
        sentenceAfter: "; but of power, and of love, and of a sound mind.",
        reference: "2 Timothy 1:7",
        options: ["fear", "bondage", "sorrow", "doubt"],
        explanation: "2 Timothy 1:7 (KJV): 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.'"
    },
    {
        id: 15,
        sentenceBefore: "Now faith is the",
        blankWord: "substance",
        sentenceAfter: "of things hoped for, the evidence of things not seen.",
        reference: "Hebrews 11:1",
        options: ["substance", "assurance", "confidence", "foundation"],
        explanation: "Hebrews 11:1 (KJV): 'Now faith is the substance of things hoped for, the evidence of things not seen.'"
    },
    {
        id: 16,
        sentenceBefore: "Jesus Christ the same yesterday, and to day, and for",
        blankWord: "ever",
        sentenceAfter: ".",
        reference: "Hebrews 13:8",
        options: ["ever", "eternity", "always", "ages"],
        explanation: "Hebrews 13:8 (KJV): 'Jesus Christ the same yesterday, and to day, and for ever.'"
    },
    {
        id: 17,
        sentenceBefore: "For by",
        blankWord: "grace",
        sentenceAfter: "are ye saved through faith; and that not of yourselves: it is the gift of God.",
        reference: "Ephesians 2:8",
        options: ["grace", "mercy", "works", "love"],
        explanation: "Ephesians 2:8 (KJV): 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God.'"
    },
    {
        id: 18,
        sentenceBefore: "God is our refuge and strength, a very",
        blankWord: "present",
        sentenceAfter: "help in trouble.",
        reference: "Psalm 46:1",
        options: ["present", "mighty", "faithful", "quick"],
        explanation: "Psalm 46:1 (KJV): 'God is our refuge and strength, a very present help in trouble.'"
    },
    {
        id: 19,
        sentenceBefore: "Casting all your",
        blankWord: "care",
        sentenceAfter: "upon him; for he careth for you.",
        reference: "1 Peter 5:7",
        options: ["care", "burden", "anxiety", "grief"],
        explanation: "1 Peter 5:7 (KJV): 'Casting all your care upon him; for he careth for you.'"
    },
    {
        id: 20,
        sentenceBefore: "Ye are the",
        blankWord: "light",
        sentenceAfter: "of the world. A city that is set on an hill cannot be hid.",
        reference: "Matthew 5:14",
        options: ["light", "salt", "hope", "glory"],
        explanation: "Matthew 5:14 (KJV): 'Ye are the light of the world. A city that is set on an hill cannot be hid.'"
    },
    {
        id: 21,
        sentenceBefore: "What shall we then say to these things? If God be for us, who can be",
        blankWord: "against",
        sentenceAfter: "us?",
        reference: "Romans 8:31",
        options: ["against", "beside", "above", "before"],
        explanation: "Romans 8:31 (KJV): 'If God be for us, who can be against us?'"
    },
    {
        id: 22,
        sentenceBefore: "We love him, because he",
        blankWord: "first",
        sentenceAfter: "loved us.",
        reference: "1 John 4:19",
        options: ["first", "always", "freely", "truly"],
        explanation: "1 John 4:19 (KJV): 'We love him, because he first loved us.'"
    },
    {
        id: 23,
        sentenceBefore: "He that dwelleth in the secret place of the most High shall abide under the",
        blankWord: "shadow",
        sentenceAfter: "of the Almighty.",
        reference: "Psalm 91:1",
        options: ["shadow", "wings", "shield", "pavilion"],
        explanation: "Psalm 91:1 (KJV): 'shall abide under the shadow of the Almighty.'"
    },
    {
        id: 24,
        sentenceBefore: "He was wounded for our transgressions, he was bruised for our iniquities... and with his",
        blankWord: "stripes",
        sentenceAfter: "we are healed.",
        reference: "Isaiah 53:5",
        options: ["stripes", "blood", "sorrow", "cross"],
        explanation: "Isaiah 53:5 (KJV): 'and with his stripes we are healed.'"
    },
    {
        id: 25,
        sentenceBefore: "Thoughts of peace, and not of evil, to give you an",
        blankWord: "expected",
        sentenceAfter: "end.",
        reference: "Jeremiah 29:11",
        options: ["expected", "glorious", "abundant", "everlasting"],
        explanation: "Jeremiah 29:11 (KJV): 'thoughts of peace, and not of evil, to give you an expected end.'"
    },
    {
        id: 26,
        sentenceBefore: "Come unto me, all ye that labour and are heavy laden, and I will give you",
        blankWord: "rest",
        sentenceAfter: ".",
        reference: "Matthew 11:28",
        options: ["rest", "peace", "joy", "strength"],
        explanation: "Matthew 11:28 (KJV): 'and I will give you rest.'"
    },
    {
        id: 27,
        sentenceBefore: "In the beginning was the Word, and the Word was with God, and the Word was",
        blankWord: "God",
        sentenceAfter: ".",
        reference: "John 1:1",
        options: ["God", "Lord", "Spirit", "Light"],
        explanation: "John 1:1 (KJV): 'and the Word was God.'"
    },
    {
        id: 28,
        sentenceBefore: "I am come that they might have",
        blankWord: "life",
        sentenceAfter: ", and that they might have it more abundantly.",
        reference: "John 10:10",
        options: ["life", "peace", "grace", "joy"],
        explanation: "John 10:10 (KJV): 'I am come that they might have life, and that they might have it more abundantly.'"
    },
    {
        id: 29,
        sentenceBefore: "Be not conformed to this world: but be ye transformed by the",
        blankWord: "renewing",
        sentenceAfter: "of your mind.",
        reference: "Romans 12:2",
        options: ["renewing", "cleansing", "power", "sanctifying"],
        explanation: "Romans 12:2 (KJV): 'but be ye transformed by the renewing of your mind...'"
    },
    {
        id: 30,
        sentenceBefore: "The LORD is my light and my salvation; whom shall I",
        blankWord: "fear",
        sentenceAfter: "? the LORD is the strength of my life; of whom shall I be afraid?",
        reference: "Psalm 27:1",
        options: ["fear", "dread", "flee", "doubt"],
        explanation: "Psalm 27:1 (KJV): 'The LORD is my light and my salvation; whom shall I fear?'"
    },
    {
        id: 31,
        sentenceBefore: "Pride goeth before destruction, and an haughty spirit before a",
        blankWord: "fall",
        sentenceAfter: ".",
        reference: "Proverbs 16:18",
        options: ["fall", "snare", "pit", "loss"],
        explanation: "Proverbs 16:18 (KJV): 'Pride goeth before destruction, and an haughty spirit before a fall.'"
    },
    {
        id: 32,
        sentenceBefore: "Pray without",
        blankWord: "ceasing",
        sentenceAfter: ".",
        reference: "1 Thessalonians 5:17",
        options: ["ceasing", "fainting", "fear", "delay"],
        explanation: "1 Thessalonians 5:17 (KJV): 'Pray without ceasing.'"
    },
    {
        id: 33,
        sentenceBefore: "And now abideth faith, hope, charity, these three; but the greatest of these is",
        blankWord: "charity",
        sentenceAfter: ".",
        reference: "1 Corinthians 13:13",
        options: ["charity", "faith", "hope", "grace"],
        explanation: "1 Corinthians 13:13 (KJV): 'but the greatest of these is charity.'"
    },
    {
        id: 34,
        sentenceBefore: "Delight thyself also in the LORD; and he shall give thee the desires of thine",
        blankWord: "heart",
        sentenceAfter: ".",
        reference: "Psalm 37:4",
        options: ["heart", "soul", "mind", "hands"],
        explanation: "Psalm 37:4 (KJV): 'and he shall give thee the desires of thine heart.'"
    },
    {
        id: 35,
        sentenceBefore: "What doth the LORD require of thee, but to do justly, and to love",
        blankWord: "mercy",
        sentenceAfter: ", and to walk humbly with thy God?",
        reference: "Micah 6:8",
        options: ["mercy", "truth", "righteousness", "peace"],
        explanation: "Micah 6:8 (KJV): 'to do justly, and to love mercy, and to walk humbly with thy God.'"
    },
    {
        id: 36,
        sentenceBefore: "The just shall live by his",
        blankWord: "faith",
        sentenceAfter: ".",
        reference: "Habakkuk 2:4",
        options: ["faith", "works", "righteousness", "prayer"],
        explanation: "Habakkuk 2:4 (KJV): 'the just shall live by his faith.'"
    },
    {
        id: 37,
        sentenceBefore: "Not by might, nor by power, but by my",
        blankWord: "spirit",
        sentenceAfter: ", saith the LORD of hosts.",
        reference: "Zechariah 4:6",
        options: ["spirit", "word", "hand", "glory"],
        explanation: "Zechariah 4:6 (KJV): 'Not by might, nor by power, but by my spirit, saith the LORD of hosts.'"
    },
    {
        id: 38,
        sentenceBefore: "Baptizing them in the name of the Father, and of the Son, and of the",
        blankWord: "Holy Ghost",
        sentenceAfter: ".",
        reference: "Matthew 28:19",
        options: ["Holy Ghost", "Lord", "Church", "Kingdom"],
        explanation: "Matthew 28:19 (KJV): 'in the name of the Father, and of the Son, and of the Holy Ghost.'"
    },
    {
        id: 39,
        sentenceBefore: "But ye shall receive",
        blankWord: "power",
        sentenceAfter: ", after that the Holy Ghost is come upon you: and ye shall be witnesses unto me.",
        reference: "Acts 1:8",
        options: ["power", "wisdom", "grace", "tongues"],
        explanation: "Acts 1:8 (KJV): 'But ye shall receive power, after that the Holy Ghost is come upon you...'"
    },
    {
        id: 40,
        sentenceBefore: "For the wages of sin is death; but the gift of God is",
        blankWord: "eternal life",
        sentenceAfter: "through Jesus Christ our Lord.",
        reference: "Romans 6:23",
        options: ["eternal life", "righteousness", "peace", "heaven"],
        explanation: "Romans 6:23 (KJV): 'but the gift of God is eternal life through Jesus Christ our Lord.'"
    },
    {
        id: 41,
        sentenceBefore: "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become",
        blankWord: "new",
        sentenceAfter: ".",
        reference: "2 Corinthians 5:17",
        options: ["new", "holy", "clean", "righteous"],
        explanation: "2 Corinthians 5:17 (KJV): 'old things are passed away; behold, all things are become new.'"
    },
    {
        id: 42,
        sentenceBefore: "Set your affection on things",
        blankWord: "above",
        sentenceAfter: ", not on things on the earth.",
        reference: "Colossians 3:2",
        options: ["above", "heavenly", "eternal", "holy"],
        explanation: "Colossians 3:2 (KJV): 'Set your affection on things above, not on things on the earth.'"
    },
    {
        id: 43,
        sentenceBefore: "All scripture is given by",
        blankWord: "inspiration",
        sentenceAfter: "of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness.",
        reference: "2 Timothy 3:16",
        options: ["inspiration", "commandment", "wisdom", "revelation"],
        explanation: "2 Timothy 3:16 (KJV): 'All scripture is given by inspiration of God...'"
    },
    {
        id: 44,
        sentenceBefore: "If any of you lack",
        blankWord: "wisdom",
        sentenceAfter: ", let him ask of God, that giveth to all men liberally, and upbraideth not.",
        reference: "James 1:5",
        options: ["wisdom", "faith", "patience", "strength"],
        explanation: "James 1:5 (KJV): 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally...'"
    },
    {
        id: 45,
        sentenceBefore: "If we confess our sins, he is faithful and just to",
        blankWord: "forgive",
        sentenceAfter: "us our sins, and to cleanse us from all unrighteousness.",
        reference: "1 John 1:9",
        options: ["forgive", "blot out", "pardon", "hide"],
        explanation: "1 John 1:9 (KJV): 'he is faithful and just to forgive us our sins...'"
    },
    {
        id: 46,
        sentenceBefore: "Behold, I stand at the",
        blankWord: "door",
        sentenceAfter: ", and knock: if any man hear my voice, and open the door, I will come in to him.",
        reference: "Revelation 3:20",
        options: ["door", "gate", "threshold", "altar"],
        explanation: "Revelation 3:20 (KJV): 'Behold, I stand at the door, and knock...'"
    },
    {
        id: 47,
        sentenceBefore: "And God shall wipe away all",
        blankWord: "tears",
        sentenceAfter: "from their eyes; and there shall be no more death, neither sorrow, nor crying.",
        reference: "Revelation 21:4",
        options: ["tears", "sin", "darkness", "fear"],
        explanation: "Revelation 21:4 (KJV): 'And God shall wipe away all tears from their eyes...'"
    },
    {
        id: 48,
        sentenceBefore: "My help cometh from the LORD, which made heaven and",
        blankWord: "earth",
        sentenceAfter: ".",
        reference: "Psalm 121:2",
        options: ["earth", "man", "seas", "stars"],
        explanation: "Psalm 121:2 (KJV): 'My help cometh from the LORD, which made heaven and earth.'"
    },
    {
        id: 49,
        sentenceBefore: "Enter into his gates with thanksgiving, and into his",
        blankWord: "courts",
        sentenceAfter: "with praise: be thankful unto him, and bless his name.",
        reference: "Psalm 100:4",
        options: ["courts", "temple", "house", "presence"],
        explanation: "Psalm 100:4 (KJV): 'and into his courts with praise: be thankful unto him, and bless his name.'"
    },
    {
        id: 50,
        sentenceBefore: "And his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of",
        blankWord: "Peace",
        sentenceAfter: ".",
        reference: "Isaiah 9:6",
        options: ["Peace", "Glory", "Life", "Righteousness"],
        explanation: "Isaiah 9:6 (KJV): 'The Prince of Peace.'"
    },
    {
        id: 51,
        sentenceBefore: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be",
        blankWord: "opened",
        sentenceAfter: "unto you.",
        reference: "Matthew 7:7",
        options: ["opened", "revealed", "given", "answered"],
        explanation: "Matthew 7:7 (KJV): 'knock, and it shall be opened unto you.'"
    },
    {
        id: 52,
        sentenceBefore: "And ye shall know the truth, and the truth shall make you",
        blankWord: "free",
        sentenceAfter: ".",
        reference: "John 8:32",
        options: ["free", "clean", "whole", "wise"],
        explanation: "John 8:32 (KJV): 'and the truth shall make you free.'"
    },
    {
        id: 53,
        sentenceBefore: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be",
        blankWord: "saved",
        sentenceAfter: ".",
        reference: "Romans 10:9",
        options: ["saved", "justified", "blessed", "healed"],
        explanation: "Romans 10:9 (KJV): 'thou shalt be saved.'"
    },
    {
        id: 54,
        sentenceBefore: "Put on the whole armour of God, that ye may be able to stand against the",
        blankWord: "wiles",
        sentenceAfter: "of the devil.",
        reference: "Ephesians 6:11",
        options: ["wiles", "darts", "snare", "power"],
        explanation: "Ephesians 6:11 (KJV): 'stand against the wiles of the devil.'"
    },
    {
        id: 55,
        sentenceBefore: "For the word of God is quick, and powerful, and sharper than any twoedged",
        blankWord: "sword",
        sentenceAfter: ", piercing even to the dividing asunder of soul and spirit.",
        reference: "Hebrews 4:12",
        options: ["sword", "blade", "spear", "arrow"],
        explanation: "Hebrews 4:12 (KJV): 'sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit.'"
    },
    {
        id: 56,
        sentenceBefore: "Looking unto Jesus the author and",
        blankWord: "finisher",
        sentenceAfter: "of our faith; who for the joy that was set before him endured the cross.",
        reference: "Hebrews 12:2",
        options: ["finisher", "perfecter", "captain", "giver"],
        explanation: "Hebrews 12:2 (KJV): 'Looking unto Jesus the author and finisher of our faith...'"
    },
    {
        id: 57,
        sentenceBefore: "Submit yourselves therefore to God. Resist the devil, and he will",
        blankWord: "flee",
        sentenceAfter: "from you.",
        reference: "James 4:7",
        options: ["flee", "depart", "perish", "fall"],
        explanation: "James 4:7 (KJV): 'Resist the devil, and he will flee from you.'"
    },
    {
        id: 58,
        sentenceBefore: "But ye are a chosen generation, a royal",
        blankWord: "priesthood",
        sentenceAfter: ", an holy nation, a peculiar people.",
        reference: "1 Peter 2:9",
        options: ["priesthood", "army", "temple", "assembly"],
        explanation: "1 Peter 2:9 (KJV): 'a royal priesthood, an holy nation, a peculiar people...'"
    },
    {
        id: 59,
        sentenceBefore: "I will bless the LORD at all times: his praise shall continually be in my",
        blankWord: "mouth",
        sentenceAfter: ".",
        reference: "Psalm 34:1",
        options: ["mouth", "heart", "lips", "spirit"],
        explanation: "Psalm 34:1 (KJV): 'his praise shall continually be in my mouth.'"
    },
    {
        id: 60,
        sentenceBefore: "Man shall not live by bread alone, but by every word that proceedeth out of the",
        blankWord: "mouth",
        sentenceAfter: "of God.",
        reference: "Matthew 4:4",
        options: ["mouth", "throne", "counsel", "heart"],
        explanation: "Matthew 4:4 (KJV): 'but by every word that proceedeth out of the mouth of God.'"
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

export default function FillInTheBlankGame() {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [roundCount, setRoundCount] = useState<10 | 20>(10);
    const [questions, setQuestions] = useState<BlankQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [hintNotice, setHintNotice] = useState<string | null>(null);

    const startNewGame = (count = roundCount) => {
        setRoundCount(count);
        const shuffled = shuffle(MASSIVE_BLANK_QUESTIONS).slice(0, count).map(q => ({
            ...q,
            options: shuffle(q.options)
        }));
        setQuestions(shuffled);
        setCurrentIndex(0);
        setScore(0);
        setStreak(0);
        setHighestStreak(0);
        setSelectedOption(null);
        setFeedback(null);
        setHintNotice(null);
        setGameState('playing');
    };

    const currentQ = questions[currentIndex];

    const handleUseHint = () => {
        if (feedback !== null || !currentQ) return;
        const success = spendTalents(10);
        if (!success) {
            gameSound.playError();
            triggerHaptic('error');
            setHintNotice("Need 10 Talents 🪙 for Letter Hint!");
            setTimeout(() => setHintNotice(null), 2500);
            return;
        }

        gameSound.playSuccess();
        triggerHaptic('success');
        setHintNotice(`Hint: Starts with "${currentQ.blankWord[0].toUpperCase()}"! (-10 🪙)`);
        setTimeout(() => setHintNotice(null), 3500);
    };

    const handleSelectOption = (word: string) => {
        if (feedback !== null) return;
        setSelectedOption(word);

        const isCorrect = word.toLowerCase() === currentQ.blankWord.toLowerCase();
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
            setSelectedOption(null);
            setHintNotice(null);
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setGameState('end');
                gameSound.playFanfare();
                triggerHaptic('heavy');
                triggerRealisticConfetti();
                earnTalents(20);
                recordGameWin('fill_blank');
            }
        }, 1400);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* Top Bar with Profile Stats */}
            <GameTopBar
                title="Fill-in-the-Blank"
                backHref="/games"
                backLabel="Games"
                theme="light"
                extraPill={
                    gameState === 'playing' ? (
                        <div className="text-xs font-mono font-bold bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full">
                            {score} pts
                        </div>
                    ) : null
                }
            />

            <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <span className="text-4xl">✏️</span>
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" /> 60 Sacred KJV Verses
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-2">
                                    Fill-in-the-Blank
                                </h1>
                                <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                                    Recall and complete holy words in timeless King James Version (KJV) scriptures!
                                </p>
                            </div>

                            {/* Length Selector */}
                            <div className="space-y-1.5 text-left max-w-xs mx-auto">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-center">
                                    Choose Question Count
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { count: 10, label: '10 Verses', detail: 'Quick Sprint' },
                                        { count: 20, label: '20 Verses', detail: 'Championship' }
                                    ].map(c => (
                                        <button
                                            key={c.count}
                                            type="button"
                                            onClick={() => setRoundCount(c.count as any)}
                                            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                                                roundCount === c.count
                                                    ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="text-sm font-bold">{c.label}</div>
                                            <div className="text-[10px] text-slate-400">{c.detail}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => startNewGame(roundCount)}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                            >
                                Start Challenge <ChevronRight className="w-5 h-5" />
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
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-slate-500 font-mono">
                                    Question {currentIndex + 1} of {questions.length}
                                </span>
                                {streak >= 3 && (
                                    <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full font-bold">
                                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" /> {streak}x Streak!
                                    </span>
                                )}
                                <span className="font-bold text-slate-700">
                                    {score} Points
                                </span>
                            </div>

                            {/* Question Card */}
                            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                        📖 {currentQ.reference}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={handleUseHint}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs shadow-2xs active:scale-95 transition-all cursor-pointer"
                                        title="Reveal first letter (-10 Talents)"
                                    >
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Hint</span>
                                        <span className="text-[10px] bg-amber-200 px-1.5 py-0.2 rounded-full font-extrabold">-10 🪙</span>
                                    </button>
                                </div>

                                {hintNotice && (
                                    <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold text-center animate-bounce">
                                        {hintNotice}
                                    </div>
                                )}

                                <div className="text-xl sm:text-2xl font-serif text-slate-900 leading-relaxed mb-6">
                                    <span>&ldquo;{currentQ.sentenceBefore} </span>
                                    <span className={`inline-block px-3 py-0.5 rounded-xl border-2 font-bold transition-all ${
                                        feedback === 'correct'
                                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                                            : feedback === 'wrong'
                                            ? 'bg-rose-100 border-rose-500 text-rose-900'
                                            : 'bg-amber-50 border-amber-400 text-amber-900 border-dashed'
                                    }`}>
                                        {selectedOption || '_______'}
                                    </span>
                                    <span> {currentQ.sentenceAfter}&rdquo;</span>
                                </div>

                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium mb-5 flex items-start gap-2.5 ${
                                            feedback === 'correct'
                                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                                : 'bg-rose-50 text-rose-900 border border-rose-200'
                                        }`}
                                    >
                                        {feedback === 'correct' ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <div className="font-bold">
                                                {feedback === 'correct' ? 'Correct!' : `Correct Answer: "${currentQ.blankWord}"`}
                                            </div>
                                            <p className="mt-0.5 text-xs opacity-90">{currentQ.explanation}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {currentQ.options.map((opt, oIdx) => {
                                        const isSelected = selectedOption === opt;
                                        const isActualCorrect = opt.toLowerCase() === currentQ.blankWord.toLowerCase();

                                        let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50';
                                        if (feedback && isSelected) {
                                            btnStyle = feedback === 'correct'
                                                ? 'bg-emerald-500 text-white border-emerald-600'
                                                : 'bg-rose-500 text-white border-rose-600';
                                        } else if (feedback && isActualCorrect) {
                                            btnStyle = 'bg-emerald-100 text-emerald-900 border-emerald-400';
                                        }

                                        return (
                                            <button
                                                key={oIdx}
                                                type="button"
                                                disabled={feedback !== null}
                                                onClick={() => handleSelectOption(opt)}
                                                className={`p-3.5 sm:p-4 rounded-2xl border-2 font-bold text-base sm:text-lg transition-all text-center cursor-pointer active:scale-98 touch-manipulation select-none ${btnStyle}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
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
                            className="text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-1">
                                    Challenge Completed!
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    You have hidden God&apos;s Word in your heart!
                                </p>

                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 my-4">
                                    {score} <span className="text-2xl text-slate-400 font-medium">pts</span>
                                </div>

                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
                                    <span>🪙 +20 Talents Earned!</span>
                                </div>

                                <div className="text-xs text-slate-500 mb-4">
                                    Best Combo Streak: <strong className="text-amber-700">{highestStreak} in a row</strong>
                                </div>

                                {/* WhatsApp Challenge Share */}
                                <div className="max-w-sm mx-auto">
                                    <ShareScoreButton
                                        gameName="Fill-in-the-Blank"
                                        resultDetails={`Completed the Scripture Fill-in-the-Blank with ${score} pts and a ${highestStreak}-question streak!`}
                                        urlPath="/games/fill-blank"
                                        variant="whatsapp"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                                <button
                                    onClick={() => startNewGame(roundCount)}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Play Again
                                </button>
                                <Link
                                    href="/games"
                                    className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
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
