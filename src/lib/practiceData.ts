import standardData from '@/data/standard_of_attainment.json';
import numbersP1Data from '@/data/numbers_quiz_bank_p1.json';
import numbersP2Data from '@/data/numbers_quiz_bank_p2.json';

export interface PracticeQuestion {
    id: string;
    text: string;
    options: string[];
    correct_index: number;
    full_answer?: string;
    scripture?: string;
    category?: string;
    track: 'standard' | 'numbers_p1' | 'numbers_p2';
    trackLabel: string;
}

export interface PracticeTrack {
    id: string;
    title: string;
    shortTitle: string;
    badge: string;
    description: string;
    questionCount: number;
    accentColor: string;
    icon: string;
    chaptersOrScope: string;
}

export const PRACTICE_TRACKS: PracticeTrack[] = [
    {
        id: 'standard',
        title: 'Standard of Attainment',
        shortTitle: 'Standard of Attainment',
        badge: 'Official Catechism',
        description: 'Complete 45 questions on Creation, Nature of God, The Trinity, Fall of Man, Evangelism, Salvation, and Sacraments.',
        questionCount: 45,
        accentColor: 'from-amber-500 to-amber-600',
        icon: 'BookOpen',
        chaptersOrScope: '45 Official Questions & Scriptures',
    },
    {
        id: 'numbers_p1',
        title: 'Book of Numbers — Part 1',
        shortTitle: 'Numbers (Ch. 1–15)',
        badge: 'Part 1',
        description: 'Covers the census of Israel, camp arrangements, Levite service, the Nazirite vow, Aaronic blessing, and the 12 spies.',
        questionCount: 44,
        accentColor: 'from-purple-600 to-indigo-600',
        icon: 'Scroll',
        chaptersOrScope: 'Numbers Chapters 1 – 15',
    },
    {
        id: 'numbers_p2',
        title: 'Book of Numbers — Part 2',
        shortTitle: 'Numbers (Ch. 16–36)',
        badge: 'Part 2',
        description: 'Covers Korah\'s rebellion, Aaron\'s budding rod, the Bronze Serpent, Balaam\'s prophecies, Zelophehad\'s daughters, and Cities of Refuge.',
        questionCount: 56,
        accentColor: 'from-blue-600 to-cyan-600',
        icon: 'Compass',
        chaptersOrScope: 'Numbers Chapters 16 – 36',
    },
    {
        id: 'numbers_all',
        title: 'Book of Numbers — Full Book',
        shortTitle: 'Full Numbers (Ch. 1–36)',
        badge: '100 Questions',
        description: 'The master collection of 100 questions spanning the entire 36 chapters of the Book of Numbers.',
        questionCount: 100,
        accentColor: 'from-emerald-600 to-teal-600',
        icon: 'Flame',
        chaptersOrScope: 'Complete Book of Numbers',
    },
    {
        id: 'grand_mock',
        title: 'Grand Mock Competition',
        shortTitle: 'Mixed Competition Mock',
        badge: 'Simulated Exam',
        description: 'Randomized blend of both Book of Numbers and Standard of Attainment questions. Perfect practice for the real Idimu contest!',
        questionCount: 50,
        accentColor: 'from-rose-600 to-amber-600',
        icon: 'Trophy',
        chaptersOrScope: 'Numbers + Standard of Attainment',
    },
];

export function getQuestionsByTrack(trackId: string): PracticeQuestion[] {
    const formattedStandard: PracticeQuestion[] = standardData.map((q) => ({
        id: `soa-${q.id}`,
        text: q.question,
        options: q.options,
        correct_index: q.correct_index,
        full_answer: q.full_answer,
        scripture: q.scripture,
        category: q.category,
        track: 'standard',
        trackLabel: 'Standard of Attainment',
    }));

    const formattedNumbersP1: PracticeQuestion[] = numbersP1Data.map((q, idx) => ({
        id: `num1-${idx + 1}`,
        text: q.text,
        options: q.options,
        correct_index: q.correct_index,
        full_answer: `Correct Answer: "${q.options[q.correct_index]}"`,
        category: 'Numbers 1–15',
        track: 'numbers_p1',
        trackLabel: 'Book of Numbers (Ch. 1–15)',
    }));

    const formattedNumbersP2: PracticeQuestion[] = numbersP2Data.map((q, idx) => ({
        id: `num2-${idx + 1}`,
        text: q.text,
        options: q.options,
        correct_index: q.correct_index,
        full_answer: `Correct Answer: "${q.options[q.correct_index]}"`,
        category: 'Numbers 16–36',
        track: 'numbers_p2',
        trackLabel: 'Book of Numbers (Ch. 16–36)',
    }));

    switch (trackId) {
        case 'standard':
            return formattedStandard;
        case 'numbers_p1':
            return formattedNumbersP1;
        case 'numbers_p2':
            return formattedNumbersP2;
        case 'numbers_all':
            return [...formattedNumbersP1, ...formattedNumbersP2];
        case 'grand_mock':
        default: {
            // Shuffle mix of standard and numbers
            const combined = [...formattedStandard, ...formattedNumbersP1, ...formattedNumbersP2];
            return shuffleArray(combined);
        }
    }
}

export function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
