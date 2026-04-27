import type { Metadata } from 'next';
import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import BookCard from '@/components/BookCard';
import { Book } from '@/store/useCart';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Books & Resources | Taiwo Funmilayo Lawal',
    description: 'Shop faith-based books for children by Taiwo Funmilayo Lawal. Devotionals, storybooks, prayer journals, and academic guides.',
    openGraph: {
        title: 'Books & Resources — Taiwo Funmilayo Lawal',
        description: 'Faith-based books for children that build character, deepen faith, and ignite academic excellence.',
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
};

export const dynamic = 'force-dynamic'; // Always fetch fresh books, never serve cached page

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function getBooks(): Promise<Book[]> {
    try {
        const res = await adminDatabases.listDocuments(DB_ID, 'books', [
            Query.orderDesc('$createdAt'),
            Query.limit(50),
        ]);
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
        console.error('Failed to fetch books:', e);
        return [];
    }
}

export default async function StorePage() {
    const books = await getBooks();

    return (
        <div className="min-h-screen" style={{ background: '#0d0520' }}>
            {/* Page Header */}
            <div className="relative overflow-hidden py-24 pt-36"
                style={{ background: 'linear-gradient(160deg, #0d0520 0%, #1e0a4e 50%, #2e1065 100%)' }}>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-1/3 w-72 h-72 rounded-full blur-3xl opacity-15"
                        style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }} />
                    <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-[0.25em] uppercase"
                        style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                        <BookOpen className="w-3.5 h-3.5" />
                        The Collection
                    </div>
                    <h1 className="font-serif font-bold text-5xl md:text-7xl text-white mb-5 leading-tight">
                        Books & <span className="text-gradient-gold">Resources</span>
                    </h1>
                    <p className="text-white/50 font-sans text-lg max-w-lg mx-auto">
                        Discover books that build faith, sharpen minds, and ignite every child's God-given potential.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, #0d0520)' }} />
            </div>

            {/* Books Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {books.length === 0 ? (
                    <div className="text-center py-28">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{ background: 'rgba(109,40,217,0.1)', border: '1px solid rgba(109,40,217,0.2)' }}>
                            <BookOpen className="w-8 h-8 text-royal-400" />
                        </div>
                        <h3 className="font-serif font-bold text-2xl text-white mb-2">No books yet</h3>
                        <p className="text-white/40 font-sans">Check back soon — new books are on the way!</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <p className="section-label mb-1">All Books</p>
                                <p className="text-white/40 font-sans text-sm">{books.length} {books.length === 1 ? 'book' : 'books'} available</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
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
