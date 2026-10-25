import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface CompetitionAttempt {
    id: string;
    contestantName: string;
    churchDistrict: string;
    ageCategory?: string;
    phone?: string;
    subjectId: 'current_affairs' | 'numbers' | 'standard' | 'combined';
    subjectTitle: string;
    score: number;
    total: number;
    percentage: number;
    timeSpentSeconds: number;
    date: string;
}

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'competition_attempts.json');

function readAttempts(): CompetitionAttempt[] {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            return [];
        }
        const fileContent = fs.readFileSync(DATA_PATH, 'utf-8');
        return JSON.parse(fileContent);
    } catch (e) {
        console.error('Failed reading competition attempts:', e);
        return [];
    }
}

function writeAttempts(data: CompetitionAttempt[]) {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        console.error('Failed writing competition attempts:', e);
    }
}

function sortAttempts(attempts: CompetitionAttempt[]) {
    return [...attempts].sort((a, b) => {
        // 1. Highest score / percentage first
        if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
        }
        // 2. Faster completion time wins ties!
        if (a.timeSpentSeconds !== b.timeSpentSeconds) {
            return a.timeSpentSeconds - b.timeSpentSeconds;
        }
        // 3. Most recent first
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');

    const all = readAttempts();
    const sorted = sortAttempts(all);

    if (subject && subject !== 'all') {
        const filtered = sorted.filter(a => a.subjectId === subject);
        return NextResponse.json(filtered);
    }

    return NextResponse.json(sorted);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            contestantName,
            churchDistrict,
            ageCategory,
            phone,
            subjectId,
            subjectTitle,
            score,
            total,
            timeSpentSeconds,
        } = body;

        if (!contestantName || score === undefined || !total) {
            return NextResponse.json({ error: 'Missing required contestant info or score' }, { status: 400 });
        }

        const percentage = Math.round((score / total) * 100);
        const newAttempt: CompetitionAttempt = {
            id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            contestantName: String(contestantName).trim(),
            churchDistrict: String(churchDistrict || 'Idimu Missionary District').trim(),
            ageCategory: ageCategory || 'Children (Ages 6–12)',
            phone: phone || '',
            subjectId: subjectId || 'current_affairs',
            subjectTitle: subjectTitle || 'Foursquare Current Affairs',
            score: Number(score),
            total: Number(total),
            percentage,
            timeSpentSeconds: Number(timeSpentSeconds || 0),
            date: new Date().toISOString(),
        };

        const existing = readAttempts();
        const updated = [...existing, newAttempt];
        writeAttempts(updated);

        // Also try background sync to Appwrite if available
        try {
            const { adminDatabases } = await import('@/lib/server/appwrite');
            const { ID } = await import('node-appwrite');
            const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';
            adminDatabases.createDocument(DB_ID, 'attempts', ID.unique(), {
                quiz_id: newAttempt.subjectId,
                quiz_title: newAttempt.subjectTitle,
                participant_name: `${newAttempt.contestantName} (${newAttempt.churchDistrict})`,
                participant_phone: newAttempt.phone,
                score: newAttempt.score,
                total: newAttempt.total,
                percentage: newAttempt.percentage,
                user_answers: JSON.stringify({ timeSpent: newAttempt.timeSpentSeconds }),
            }).catch(e => console.log('Appwrite sync background error ignored:', e.message));
        } catch {
            // Appwrite sync optional, local persistence handles leaderboard
        }

        const sorted = sortAttempts(updated);
        const overallRank = sorted.findIndex(a => a.id === newAttempt.id) + 1;
        const subjectRank = sorted
            .filter(a => a.subjectId === newAttempt.subjectId)
            .findIndex(a => a.id === newAttempt.id) + 1;

        return NextResponse.json({
            success: true,
            attempt: newAttempt,
            overallRank,
            subjectRank,
            totalContestants: sorted.length,
        });
    } catch (e: any) {
        console.error('API submission error:', e);
        return NextResponse.json({ error: e.message || 'Submission failed' }, { status: 500 });
    }
}