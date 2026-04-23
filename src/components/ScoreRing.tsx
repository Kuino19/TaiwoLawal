'use client';

import { useEffect, useRef } from 'react';

interface ScoreRingProps {
    percentage: number;
    passed: boolean;
}

export default function ScoreRing({ percentage, passed }: ScoreRingProps) {
    const circleRef = useRef<SVGCircleElement>(null);
    const R = 60;
    const circ = 2 * Math.PI * R;
    const target = circ * (1 - percentage / 100);

    useEffect(() => {
        const el = circleRef.current;
        if (!el) return;
        // Start at full gap (empty), then animate to target
        el.style.transition = 'none';
        el.style.strokeDashoffset = String(circ);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
                el.style.strokeDashoffset = String(target);
            });
        });
    }, [percentage, circ, target]);

    return (
        <div className="relative w-36 h-36 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                {/* Track */}
                <circle cx="72" cy="72" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                {/* Progress */}
                <circle
                    ref={circleRef}
                    cx="72" cy="72" r={R}
                    fill="none"
                    stroke={passed ? '#f59e0b' : '#8b5cf6'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif font-bold text-4xl text-white">{percentage}%</span>
            </div>
        </div>
    );
}
