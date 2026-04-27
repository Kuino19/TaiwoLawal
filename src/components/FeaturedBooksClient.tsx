'use client';

import { motion } from 'framer-motion';
import { BookOpen, Star, ShoppingCart, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import toast from 'react-hot-toast';
import { Book } from '@/store/useCart';

const bookColors = [
    { from: '#2e1065', to: '#6d28d9', glow: 'rgba(109,40,217,0.3)' },
    { from: '#065f46', to: '#059669', glow: 'rgba(5,150,105,0.3)' },
    { from: '#7f1d1d', to: '#dc2626', glow: 'rgba(220,38,38,0.3)' },
    { from: '#78350f', to: '#d97706', glow: 'rgba(217,119,6,0.3)' },
];

interface Props {
    books: Book[];
}

export default function FeaturedBooksClient({ books }: Props) {
    const addItem = useCart((state) => state.addItem);

    if (books.length === 0) return null;

    return (
        <section className="py-28 relative overflow-hidden" style={{ background: '#0d0520' }}>
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <p className="section-label mb-3">New Arrivals</p>
                    <h2 className="font-serif font-bold text-5xl md:text-6xl text-white mb-5">
                        Resources for <span className="text-gradient-gold">Growth</span>
                    </h2>
                    <p className="max-w-xl mx-auto text-white/45 text-lg font-sans leading-relaxed">
                        Carefully curated books that nurture faith, sharpen intellect, and ignite the potential inside every child.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                    {books.map((book, i) => {
                        const col = bookColors[i % bookColors.length];
                        return (
                            <motion.div
                                key={book.$id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="group rounded-2xl overflow-hidden flex flex-col"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                                }}
                            >
                                {/* Cover */}
                                <Link href={`/store/${book.$id}`} className="block flex-shrink-0">
                                    <div className="h-48 relative overflow-hidden flex items-center justify-center"
                                        style={{ background: `linear-gradient(135deg, ${col.from}, ${col.to})` }}>
                                        {book.image_url ? (
                                            <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 opacity-20"
                                                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4), transparent 60%)' }} />
                                                <div className="relative flex gap-1 group-hover:-rotate-3 transition-transform duration-500">
                                                    <div className="w-3 h-32 rounded-l-sm opacity-50" style={{ background: 'rgba(0,0,0,0.4)' }} />
                                                    <div className="w-20 h-32 rounded-r-sm shadow-2xl flex flex-col items-center justify-center gap-2 border border-white/15"
                                                        style={{ background: 'rgba(255,255,255,0.1)' }}>
                                                        <BookOpen className="w-7 h-7 text-white/75" />
                                                        <div className="text-white/55 text-[8px] font-sans text-center px-2 leading-tight">
                                                            {book.title.toUpperCase().substring(0, 15)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {/* Rating chip */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                                            style={{ background: 'rgba(0,0,0,0.5)', color: '#fbbf24', backdropFilter: 'blur(8px)' }}>
                                            <Star className="w-3 h-3 fill-current" /> 4.9
                                        </div>
                                    </div>
                                </Link>

                                {/* Body */}
                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-xs font-bold tracking-widest uppercase mb-2"
                                        style={{ color: col.to === '#d97706' ? '#fbbf24' : col.to }}>
                                        {book.type}
                                    </span>
                                    <Link href={`/store/${book.$id}`}>
                                        <h3 className="font-serif font-bold text-white text-lg mb-4 leading-tight group-hover:text-gold-300 transition-colors flex-1 line-clamp-2">
                                            {book.title}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/8">
                                        <span className="font-serif font-bold text-xl" style={{ color: book.price === 0 ? '#34d399' : '#fff' }}>
                                            {book.price === 0 ? 'FREE' : `₦${book.price.toLocaleString()}`}
                                        </span>
                                        {book.type === 'digital' && book.price === 0 && book.download_url ? (
                                            <a
                                                href={book.download_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toast.success('Downloaded successfully! 🎉', {
                                                        duration: 3000,
                                                        icon: '📥',
                                                    });
                                                }}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                                                style={{ background: 'linear-gradient(135deg, #065f46, #059669)' }}
                                            >
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </a>
                                        ) : (
                                            <button
                                                onClick={() => { addItem(book); toast.success(`"${book.title}" added!`); }}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                                                style={{ background: `linear-gradient(135deg, ${col.from}, ${col.to})` }}
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" /> Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-14 text-center"
                >
                    <Link href="/store" className="inline-flex items-center gap-2 font-semibold text-gold-400 hover:text-gold-300 transition-colors group">
                        View all books
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
