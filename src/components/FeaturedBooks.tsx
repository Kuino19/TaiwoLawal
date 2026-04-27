// Server component — fetches real books from Appwrite
import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import FeaturedBooksClient from './FeaturedBooksClient';
import { Book } from '@/store/useCart';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function getBooks(): Promise<Book[]> {
    try {
        const res = await adminDatabases.listDocuments(DB_ID, 'books', [
            Query.orderDesc('$createdAt'),
            Query.limit(4),
        ]);
        // Serialize to plain objects — Appwrite returns class instances that
        // Next.js cannot pass across the Server→Client component boundary.
        return res.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title as string,
            description: doc.description as string,
            price: doc.price as number,
            type: doc.type as string,
            image_url: (doc.image_url as string) || '',
            download_url: (doc.download_url as string) || '',
        })) as Book[];
    } catch (e) {
        console.error('FeaturedBooks fetch error:', e);
        return [];
    }
}

export default async function FeaturedBooks() {
    const books = await getBooks();
    return <FeaturedBooksClient books={books} />;
}
