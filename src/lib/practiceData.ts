import standardData from '@/data/standard_of_attainment.json';
import numbersP1Data from '@/data/numbers_quiz_bank_p1.json';
import numbersP2Data from '@/data/numbers_quiz_bank_p2.json';
import currentAffairsData from '@/data/foursquare_current_affairs.json';

export interface PracticeQuestion {
    id: string;
    text: string;
    options: string[];
    correct_index: number;
    full_answer?: string;
    scripture?: string;
    category?: string;
    subject: 'numbers' | 'standard' | 'current_affairs';
    subjectTitle: string;
}

export interface PracticeSubject {
    id: 'current_affairs' | 'numbers' | 'standard' | 'combined';
    title: string;
    shortTitle: string;
    badge: string;
    description: string;
    poolSize: number;
    sessionQuestions: number;
    timeMinutes: number;
    icon: string;
}

export const PRACTICE_SUBJECTS: PracticeSubject[] = [
    {
        id: 'current_affairs',
        title: 'Foursquare Current Affairs',
        shortTitle: 'Current Affairs',
        badge: 'Children Edition',
        description: 'Practice questions covering Foursquare history, founders, Nigerian leadership, Platinum Jubilee, and ministries.',
        poolSize: 30,
        sessionQuestions: 10,
        timeMinutes: 3,
        icon: 'Sparkles',
    },
    {
        id: 'numbers',
        title: 'The Book of Numbers',
        shortTitle: 'Book of Numbers',
        badge: 'Chapters 1–36',
        description: 'Practice questions covering Israel\'s census, camps, offerings, 12 spies, Korah\'s rebellion, the bronze serpent, and Balaam.',
        poolSize: 100,
        sessionQuestions: 10,
        timeMinutes: 3,
        icon: 'BookOpen',
    },
    {
        id: 'standard',
        title: 'Standard of Attainment',
        shortTitle: 'Standard of Attainment',
        badge: 'Official Catechism',
        description: 'Practice questions covering Creation, the Trinity, the Nature of God, the Fall, Evangelism, Salvation, and Church Sacraments.',
        poolSize: 100,
        sessionQuestions: 10,
        timeMinutes: 3,
        icon: 'Award',
    },
    {
        id: 'combined',
        title: 'Idimu Grand Mock Competition',
        shortTitle: 'Combined Mock',
        badge: 'Full Syllabus',
        description: 'Randomized blend of Current Affairs, Book of Numbers, and Standard of Attainment questions to simulate the real competition test.',
        poolSize: 100,
        sessionQuestions: 10,
        timeMinutes: 3,
        icon: 'Trophy',
    },
];

// Helper to shuffle any array
export function shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Generate the question pool for each subject
export function getSubjectPool(subjectId: 'current_affairs' | 'numbers' | 'standard' | 'combined'): PracticeQuestion[] {
    // 30 Current Affairs questions
    const currentAffairsQuestions: PracticeQuestion[] = currentAffairsData.map((q) => ({
        id: `ca-${q.id}`,
        text: q.text,
        options: q.options,
        correct_index: q.correct_index,
        full_answer: q.options[q.correct_index],
        category: 'Current Affairs',
        subject: 'current_affairs' as const,
        subjectTitle: 'Foursquare Current Affairs',
    }));

    if (subjectId === 'current_affairs') {
        return currentAffairsQuestions;
    }

    // 100 Book of Numbers questions
    const numbersQuestions: PracticeQuestion[] = [
        ...numbersP1Data.map((q, idx) => ({
            id: `num-${idx + 1}`,
            text: q.text,
            options: q.options,
            correct_index: q.correct_index,
            full_answer: q.options[q.correct_index],
            category: 'Numbers 1–15',
            subject: 'numbers' as const,
            subjectTitle: 'The Book of Numbers',
        })),
        ...numbersP2Data.map((q, idx) => ({
            id: `num-${idx + 45}`,
            text: q.text,
            options: q.options,
            correct_index: q.correct_index,
            full_answer: q.options[q.correct_index],
            category: 'Numbers 16–36',
            subject: 'numbers' as const,
            subjectTitle: 'The Book of Numbers',
        })),
    ].slice(0, 100);

    // 100 Standard of Attainment questions
    const standardQuestions: PracticeQuestion[] = standardData.map((q) => ({
        id: `soa-${q.id}`,
        text: q.question,
        options: q.options,
        correct_index: q.correct_index,
        full_answer: q.full_answer,
        scripture: q.scripture,
        category: q.category,
        subject: 'standard' as const,
        subjectTitle: 'Standard of Attainment',
    })).slice(0, 100);

    if (subjectId === 'numbers') {
        return numbersQuestions;
    }
    if (subjectId === 'standard') {
        return standardQuestions;
    }

    // Combined: blend of Current Affairs, Numbers, and Standard
    const sampledCA = shuffle(currentAffairsQuestions).slice(0, 20);
    const sampledNum = shuffle(numbersQuestions).slice(0, 40);
    const sampledSOA = shuffle(standardQuestions).slice(0, 40);
    return shuffle([...sampledCA, ...sampledNum, ...sampledSOA]);
}

// Get 10 randomized questions with randomized options
export function getRandomPracticeSession(subjectId: 'current_affairs' | 'numbers' | 'standard' | 'combined'): PracticeQuestion[] {
    const pool = getSubjectPool(subjectId);
    const shuffledPool = shuffle(pool);
    const selected10 = shuffledPool.slice(0, 10);

    // Also shuffle options for each question so answers don't always appear at the same index
    return selected10.map((q) => {
        const correctText = q.options[q.correct_index];
        const shuffledOptions = shuffle(q.options);
        const newCorrectIndex = shuffledOptions.indexOf(correctText);

        return {
            ...q,
            options: shuffledOptions,
            correct_index: newCorrectIndex,
        };
    });
}
