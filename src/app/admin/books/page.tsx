import Link from 'next/link';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { deleteBookAction } from '@/app/actions/book';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function getBooks() {
    try {
        const r = await adminDatabases.listDocuments(DB_ID, 'books', [Query.orderDesc('$createdAt')]);
        return r.documents;
    } catch { return []; }
}

export default async function AdminBooksPage() {
    const books = await getBooks();

    return (
        <div>
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif font-bold text-3xl text-gray-900">Books</h1>
                    <p className="text-gray-500 text-sm font-sans mt-1">{books.length} {books.length === 1 ? 'book' : 'books'} in store</p>
                </div>
                <Link href="/admin/books/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #1e0a4e, #6d28d9)' }}>
                    <Plus className="w-4 h-4" /> Add Book
                </Link>
            </div>

            {books.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                        <BookOpen className="w-7 h-7 text-royal-500" />
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 text-xl mb-2">No books yet</h3>
                    <p className="text-gray-400 text-sm font-sans mb-6">Add your first book to get started.</p>
                    <Link href="/admin/books/new"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white"
                        style={{ background: 'linear-gradient(135deg, #1e0a4e, #6d28d9)' }}>
                        <Plus className="w-4 h-4" /> Add Book
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="divide-y divide-gray-50">
                        {books.map((book: any) => (
                            <div key={book.$id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4 min-w-0">
                                    {/* Book icon */}
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.12)' }}>
                                        <BookOpen className="w-5 h-5 text-royal-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{book.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${book.type === 'digital'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-royal-50 text-royal-700'
                                                }`}>
                                                {book.type}
                                            </span>
                                            <span className="text-gray-400 text-xs font-sans">₦{book.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <form action={async () => {
                                        'use server';
                                        await deleteBookAction(book.$id);
                                    }}>
                                        <button type="submit"
                                            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
