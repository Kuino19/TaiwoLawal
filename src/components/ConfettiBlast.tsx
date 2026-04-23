'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ConfettiBlastProps {
    active: boolean;
}

const COLORS = ['#f59e0b', '#fbbf24', '#6d28d9', '#a78bfa', '#34d399', '#f472b6', '#fff'];

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default function ConfettiBlast({ active }: ConfettiBlastProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces: {
            x: number; y: number; vx: number; vy: number;
            w: number; h: number; color: string; rot: number; rotV: number; life: number;
        }[] = [];

        for (let i = 0; i < 160; i++) {
            pieces.push({
                x: random(0.2, 0.8) * canvas.width,
                y: -20,
                vx: random(-3, 3),
                vy: random(2.5, 7),
                w: random(7, 14),
                h: random(4, 9),
                color: COLORS[Math.floor(random(0, COLORS.length))],
                rot: random(0, Math.PI * 2),
                rotV: random(-0.15, 0.15),
                life: 1,
            });
        }

        let frame = 0;
        const tick = () => {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            for (const p of pieces) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.12; // gravity
                p.rot += p.rotV;
                p.life = Math.max(0, 1 - p.y / (canvas.height + 80));
                if (p.y < canvas.height + 80) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = p.life;
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rot);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            }
            if (alive) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafRef.current);
    }, [active]);

    if (!active) return null;
    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[200]"
        />
    );
}
