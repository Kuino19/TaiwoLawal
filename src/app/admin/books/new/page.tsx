'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { createBookAction } from '@/app/actions/book';

export default function AddBookPage() {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('physical');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [bookFile, setBookFile] = useState<File | null>(null);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/books" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-royal-600 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Books
                </Link>
                <h2 className="mt-4 text-3xl font-serif font-bold text-gray-900">Add New Book</h2>
                <p className="text-gray-500 mt-1">Create a new entry for your store. Digital books will require a file upload.</p>
            </div>

            <form action={async (formData) => {
                setLoading(true);
                try {
                    await createBookAction(formData);
                } catch (error) {
                    console.error(error);
                    alert('Failed to save book. Please check your storage settings.');
                } finally {
                    setLoading(false);
                }
            }} className="space-y-8 bg-white p-8 shadow-sm border border-gray-100 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Book Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            placeholder="e.g. The Greatest Sacrifice"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Price (₦)
                        </label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            required
                            placeholder="0.00"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Book Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500 transition-all"
                        >
                            <option value="physical">Physical Hardcopy</option>
                            <option value="digital">Digital (E-Book/PDF)</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows={4}
                            placeholder="Write a brief overview of the book..."
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500 transition-all"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Cover Image
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                name="cover-image"
                                id="cover-image"
                                accept="image/*"
                                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                className="sr-only"
                            />
                            <label
                                htmlFor="cover-image"
                                className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-royal-300 transition-all"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="mb-1 text-sm text-gray-500">
                                        <span className="font-semibold">{coverFile ? coverFile.name : 'Click to upload'}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">JPG, PNG (Max. 5MB)</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {type === 'digital' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Digital Book File (PDF/EPUB)
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    name="book-file"
                                    id="book-file"
                                    required={type === 'digital'}
                                    onChange={(e) => setBookFile(e.target.files?.[0] || null)}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="book-file"
                                    className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-royal-300 transition-all"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <p className="mb-1 text-sm text-gray-500">
                                            <span className="font-semibold">{bookFile ? bookFile.name : 'Click to upload'}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">PDF, EPUB (Max. 20MB)</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:shadow-lg disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #1e0a4e, #6d28d9)' }}
                    >
                        {loading ? 'Saving Book...' : 'Save Book & Upload Files'}
                    </button>
                </div>
            </form>
        </div>
    );
}
