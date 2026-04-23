import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { NextResponse } from 'next/server';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    try {
        // Fetch the quiz to know how many questions to serve in a session
        let questionCount = 30;
        try {
            const quiz = await adminDatabases.getDocument(DB_ID, 'quizzes', id);
            if (quiz.question_count) questionCount = Number(quiz.question_count);
        } catch { /* use default */ }

        // Fetch ALL questions in the pool for this quiz (paginate, max 1000)
        // Appwrite max per request = 100, so we cursor-paginate
        const allQuestions: any[] = [];
        let cursor: string | undefined;

        while (true) {
            const queryArgs: any[] = [
                Query.equal('quiz_id', id),
                Query.limit(100),
            ];
            if (cursor) queryArgs.push(Query.cursorAfter(cursor));

            const res = await adminDatabases.listDocuments(DB_ID, 'questions', queryArgs);
            allQuestions.push(...res.documents);

            if (res.documents.length < 100) break; // no more pages
            cursor = res.documents[res.documents.length - 1].$id;
        }

        // Shuffle the full pool and take questionCount for this session
        const shuffled = allQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, questionCount);

        return NextResponse.json(shuffled);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
