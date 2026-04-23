'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterProps {
    end: number;
    suffix?: string;
    duration?: number;
}

function Counter({ end, suffix = '', duration = 2 }: CounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [inView, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function Counter3({ items }: { items: { value: number; suffix: string; label: string }[] }) {
    return (
        <div style={{ background: 'linear-gradient(135deg, #0f0628, #1e0a4e)' }}>
            <div className="max-w-7xl mx-auto px-4 py-14">
                <div className="grid grid-cols-3 gap-6 divide-x divide-white/10">
                    {items.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center px-4"
                        >
                            <div className="font-serif font-bold text-4xl sm:text-5xl mb-1"
                                style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                <Counter end={s.value} suffix={s.suffix} />
                            </div>
                            <div className="text-white/45 text-xs font-sans tracking-widest uppercase">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
