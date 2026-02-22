'use client';

import { motion } from 'framer-motion';
import { BookOpen, Star, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import toast from 'react-hot-toast';

const books = [
    { id: 1, title: 'Kingdom Stars Vol. 1', category: 'Devotional', price: 2500, color: 'from-royal-700 to-royal-900' },
    { id: 2, title: 'Bible Stories for Kids', category: 'Storybook', price: 3000, color: 'from-emerald-700 to-emerald-900' },
    { id: 3, title: 'Prayer Journal', category: 'Workbook', price: 1500, color: 'from-rose-700 to-rose-900' },
    { id: 4, title: 'Academic Excellence Guide', category: 'Guide', price: 2000, color: 'from-amber-600 to-amber-900' },
];

export default function FeaturedBooks() {
    const addItem = useCart((state) => state.addItem);

    const handleAddToCart = (e: React.MouseEvent, book: (typeof books)[0]) => {
        e.preventDefault();
        addItem({ $id: String(book.id), title: book.title, description: '', price: book.price, image_url: '', type: 'physical' });
        toast.success(`"${book.title}" added to cart!`);
    };

    return (
        <section className="py-28 bg-white relative overflow-hidden">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <p className="section-label mb-3">New Arrivals</p>
                    <h2 className="font-serif font-bold text-5xl md:text-6xl text-gray-900 mb-5">
                        Resources for Growth
                    </h2>
                    <p className="max-w-xl mx-auto text-gray-500 text-lg font-sans leading-relaxed">
                        Carefully curated books that nurture faith, sharpen intellect, and ignite the potential inside every child.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {books.map((book, i) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-royal-200 hover:shadow-2xl transition-all duration-400 flex flex-col"
                        >
                            {/* Cover */}
                            <div className={`h-60 bg-gradient-to-br ${book.color} relative overflow-hidden flex items-center justify-center`}>
                                <div className="absolute inset-0 opacity-20"
                                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4), transparent 60%)' }} />
                                {/* Book illustration */}
                                <div className="relative flex gap-1 transform group-hover:-rotate-3 transition-transform duration-500">
                                    <div className="w-3 h-36 rounded-l-sm" style={{ background: 'rgba(0,0,0,0.4)' }} />
                                    <div className="w-24 h-36 rounded-r-sm shadow-2xl flex flex-col items-center justify-center gap-2 border border-white/20"
                                        style={{ background: 'rgba(255,255,255,0.1)' }}>
                                        <BookOpen className="w-8 h-8 text-white/80" />
                                        <div className="text-white/60 text-[9px] font-sans text-center px-2 leading-tight">
                                            {book.title.toUpperCase().substring(0, 15)}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating chip */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                                    style={{ background: 'rgba(0,0,0,0.5)', color: '#fbbf24', backdropFilter: 'blur(8px)' }}>
                                    <Star className="w-3 h-3 fill-current" /> 4.9
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 flex flex-col flex-1">
                                <span className="text-xs font-bold tracking-widest uppercase text-gold-600 mb-2">{book.category}</span>
                                <h3 className="font-serif font-bold text-gray-900 text-xl mb-4 leading-tight group-hover:text-royal-700 transition-colors flex-1">
                                    {book.title}
                                </h3>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                    <span className="font-serif font-bold text-xl text-gray-900">₦{book.price.toLocaleString()}</span>
                                    <button
                                        onClick={(e) => handleAddToCart(e, book)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                                        style={{ background: 'linear-gradient(135deg, #2e1065, #6d28d9)' }}
                                    >
                                        <ShoppingCart className="w-4 h-4" /> Add
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <Link href="/store" className="inline-flex items-center gap-2 font-semibold text-royal-700 hover:text-royal-900 transition-colors group">
                        View all books
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
