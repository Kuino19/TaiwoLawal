import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import BookCard from '@/components/BookCard';
import { Book } from '@/store/useCart';
import { BookOpen, Search } from 'lucide-react';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function getBooks(): Promise<Book[]> {
    try {
        const res = await databases.listDocuments(DB_ID, 'books', [
            Query.orderDesc('$createdAt'),
            Query.limit(50),
        ]);
        return res.documents as unknown as Book[];
    } catch {
        return [];
    }
}

export default async function StorePage() {
    const books = await getBooks();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="relative overflow-hidden py-24 pt-36"
                style={{ background: 'linear-gradient(135deg, #1e0a4e 0%, #2e1065 100%)' }}>
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(251,191,36,0.4), transparent 60%)' }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-4">The Collection</p>
                        <h1 className="font-serif font-bold text-5xl md:text-6xl text-white mb-4">
                            Books & Resources
                        </h1>
                        <p className="text-white/50 font-sans text-lg max-w-lg mx-auto">
                            Discover books that build faith, sharpen minds, and ignite every child's God-given potential.
                        </p>
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {books.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                            <BookOpen className="w-8 h-8 text-royal-400" />
                        </div>
                        <h3 className="font-serif font-bold text-2xl text-gray-900 mb-2">No books yet</h3>
                        <p className="text-gray-500 font-sans">Check back soon — new books are on the way!</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-10">
                            <p className="text-gray-500 font-sans">{books.length} {books.length === 1 ? 'book' : 'books'} available</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {books.map((book, i) => (
                                <BookCard key={book.$id} book={book} index={i} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
