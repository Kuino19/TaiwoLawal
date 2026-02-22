import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { NextResponse } from 'next/server';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    try {
        const res = await databases.listDocuments(DB_ID, 'questions', [
            Query.equal('quiz_id', id),
            Query.limit(100),
        ]);
        return NextResponse.json(res.documents);
    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
