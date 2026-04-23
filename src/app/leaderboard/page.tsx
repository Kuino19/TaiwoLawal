import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { Trophy, Flame } from 'lucide-react';
import Link from 'next/link';
import LeaderboardClient from '@/components/LeaderboardClient';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export const dynamic = 'force-dynamic';

interface Attempt {
    $id: string;
    participant_name: string;
    quiz_title: string;
    quiz_id: string;
    score: number;
    total: number;
    percentage: number;
    $createdAt: string;
}

interface Quiz {
    id: string;
    title: string;
}

async function getAttempts(): Promise<Attempt[]> {
    try {
        const res = await adminDatabases.listDocuments(DB_ID, 'attempts', [
            Query.orderDesc('percentage'),
            Query.orderDesc('score'),
            Query.limit(200),
        ]);
        return res.documents as unknown as Attempt[];
    } catch {
        return [];
    }
}

async function getQuizzes(): Promise<Quiz[]> {
    try {
        const res = await adminDatabases.listDocuments(DB_ID, 'quizzes', [
            Query.equal('is_active', true),
            Query.orderAsc('title'),
            Query.limit(50),
        ]);
        return res.documents.map((d) => ({ id: d.$id, title: d.title }));
    } catch {
        return [];
    }
}

export default async function LeaderboardPage({
    searchParams,
}: {
    searchParams: Promise<{ quiz?: string }>;
}) {
    const { quiz: quizId } = await searchParams;
    const [attempts, quizzes] = await Promise.all([getAttempts(), getQuizzes()]);

    return (
        <div className="min-h-screen" style={{ background: '#0d0520' }}>

            {/* ── Hero ── */}
            <div className="relative overflow-hidden pb-8 pt-32"
                style={{ background: 'linear-gradient(160deg, #0d0520 0%, #1e0a4e 50%, #2e1065 100%)' }}>

                {/* Decorative blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-20"
                        style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
                    <div className="absolute top-24 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-15"
                        style={{ background: 'radial-gradient(circle, #6d28d9, transparent 70%)' }} />
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
                        backgroundSize: '60px 60px',
                    }} />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-[0.25em] uppercase"
                        style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                        <Trophy className="w-3.5 h-3.5" />
                        Hall of Fame
                    </div>

                    <h1 className="font-serif font-bold text-5xl md:text-7xl text-white mb-5 leading-tight">
                        Leader<span className="text-gradient-gold">board</span>
                    </h1>
                    <p className="text-white/50 font-sans text-lg max-w-md mx-auto mb-8">
                        Top performers across all quizzes. Select a quiz tab to see its rankings.
                    </p>

                    {/* Quick stats */}
                    <div className="inline-flex items-center gap-2 text-sm font-sans"
                        style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <Flame className="w-4 h-4 text-gold-400" />
                        {attempts.length} total submissions
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, #0d0520)' }} />
            </div>

            {/* ── Client Section (tabs + board) ── */}
            <LeaderboardClient
                attempts={attempts}
                quizzes={quizzes}
                defaultQuizId={quizId}
            />
        </div>
    );
}
