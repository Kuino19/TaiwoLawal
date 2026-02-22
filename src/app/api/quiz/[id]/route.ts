import { databases } from '@/lib/appwrite';
import { NextResponse } from 'next/server';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    try {
        const quiz = await databases.getDocument(DB_ID, 'quizzes', id);
        return NextResponse.json(quiz);
    } catch {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
}
