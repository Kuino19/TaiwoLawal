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
        const res = await adminDatabases.listDocuments(DB_ID, 'questions', [
            Query.equal('quiz_id', id),
            Query.limit(100),
        ]);
        
        // Shuffle the 100 questions and take the first 20
        const shuffled = res.documents
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);

        return NextResponse.json(shuffled);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
