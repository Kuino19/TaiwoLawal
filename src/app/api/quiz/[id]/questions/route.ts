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

        // Separate into normal and reflection questions
        const normalQuestions = allQuestions.filter(q => q.correct_index !== -1);
        const reflectionQuestions = allQuestions.filter(q => q.correct_index === -1);

        // Shuffle the normal pool
        const shuffledNormal = normalQuestions.sort(() => Math.random() - 0.5);

        let finalQuestions = [];
        if (reflectionQuestions.length > 0) {
            const randomReflection = reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)];
            finalQuestions = shuffledNormal.slice(0, questionCount - 1);
            finalQuestions.push(randomReflection);
        } else {
            finalQuestions = shuffledNormal.slice(0, questionCount);
        }

        return NextResponse.json(finalQuestions);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
