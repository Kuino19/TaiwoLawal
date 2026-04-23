// Server component — fetches real books from Appwrite
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import FeaturedBooksClient from './FeaturedBooksClient';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function getBooks() {
    try {
        const res = await databases.listDocuments(DB_ID, 'books', [
            Query.orderDesc('$createdAt'),
            Query.limit(4),
        ]);
        return res.documents;
    } catch {
        return [];
    }
}

export default async function FeaturedBooks() {
    const books = await getBooks();
    return <FeaturedBooksClient books={books as any} />;
}
