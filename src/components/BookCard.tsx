'use client';

import { motion } from 'framer-motion';
import { BookOpen, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import toast from 'react-hot-toast';
import { Book } from '@/store/useCart';

interface BookCardProps {
    book: Book;
}

const bookColors = [
    { bg: 'from-royal-700 to-royal-900', accent: '#f59e0b' },
    { bg: 'from-emerald-700 to-emerald-900', accent: '#34d399' },
    { bg: 'from-rose-700 to-rose-900', accent: '#fb7185' },
    { bg: 'from-amber-600 to-amber-900', accent: '#fbbf24' },
];

export default function BookCard({ book, index = 0 }: BookCardProps & { index?: number }) {
    const addItem = useCart((state) => state.addItem);
    const color = bookColors[index % bookColors.length];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(book);
        toast.success(`"${book.title}" added to cart!`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 border border-gray-100 hover:border-royal-100 flex flex-col"
        >
            {/* Book Cover */}
            <Link href={`/store/${book.$id}`} className="block relative">
                <div className={`h-56 bg-gradient-to-br ${color.bg} flex items-center justify-center relative overflow-hidden`}>
                    {book.image_url ? (
                        <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 60%)' }} />
                            {/* Book spine + cover illustration */}
                            <div className="relative flex gap-1">
                                <div className="w-3 h-36 rounded-l-sm opacity-50" style={{ background: 'rgba(0,0,0,0.4)' }} />
                                <div className="w-24 h-36 rounded-r-sm shadow-2xl flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                                    style={{ background: 'rgba(255,255,255,0.12)' }}>
                                    <div className="absolute inset-0 border border-white/20 rounded-r-sm" />
                                    <BookOpen className="w-8 h-8 text-white/80" />
                                    <div className="text-white/60 text-[9px] font-sans text-center px-2 leading-tight">
                                        {book.title.substring(0, 20)}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
                        style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', backdropFilter: 'blur(8px)' }}>
                        {book.type}
                    </div>

                    {/* Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(0,0,0,0.4)', color: '#fbbf24', backdropFilter: 'blur(8px)' }}>
                        <Star className="w-3 h-3 fill-current" />
                        4.9
                    </div>
                </div>
            </Link>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1">
                <Link href={`/store/${book.$id}`}>
                    <h3 className="font-serif font-bold text-gray-900 text-lg leading-tight group-hover:text-royal-700 transition-colors line-clamp-2 mb-1">
                        {book.title}
                    </h3>
                </Link>
                <p className="text-gray-500 text-sm font-sans leading-relaxed line-clamp-2 mb-4 flex-1">
                    {book.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="font-serif font-bold text-xl text-gray-900">
                        ₦{book.price.toLocaleString()}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #2e1065, #6d28d9)' }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
