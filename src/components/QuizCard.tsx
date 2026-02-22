'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, HelpCircle, Zap } from 'lucide-react';

export interface Quiz {
    id: string;
    title: string;
    description: string;
    duration: number;
    questionCount: number;
    is_active?: boolean;
}

const accentColors = [
    { from: '#2e1065', to: '#6d28d9' },
    { from: '#78350f', to: '#d97706' },
    { from: '#065f46', to: '#059669' },
    { from: '#7f1d1d', to: '#dc2626' },
];

export default function QuizCard({ quiz, index = 0 }: { quiz: Quiz; index?: number }) {
    const color = accentColors[index % accentColors.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-royal-200 hover:shadow-2xl transition-all duration-400 flex flex-col"
        >
            {/* Color band */}
            <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }} />

            <div className="p-6 flex flex-col flex-1">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}>
                    <Zap className="w-5 h-5 text-white" />
                </div>

                <h3 className="font-serif font-bold text-gray-900 text-xl mb-2 group-hover:text-royal-700 transition-colors">
                    {quiz.title}
                </h3>
                <p className="text-gray-500 text-sm font-sans leading-relaxed mb-6 flex-1">
                    {quiz.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs font-sans text-gray-400 mb-6">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{quiz.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{quiz.questionCount} Questions</span>
                    </div>
                </div>

                <Link
                    href={`/quiz/${quiz.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                >
                    Start Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
