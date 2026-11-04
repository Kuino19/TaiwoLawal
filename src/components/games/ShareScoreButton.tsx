'use client';

import { useState } from 'react';
import { Share2, Check, MessageCircle } from 'lucide-react';
import { shareScoreWhatsApp } from '@/lib/gameProfile';
import { gameSound, triggerHaptic } from '@/lib/gameSound';

interface ShareScoreButtonProps {
    gameName: string;
    resultDetails: string;
    urlPath?: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'whatsapp';
}

export default function ShareScoreButton({
    gameName,
    resultDetails,
    urlPath = '/games',
    className = '',
    variant = 'whatsapp'
}: ShareScoreButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        gameSound.playTap();
        triggerHaptic('tap');
        shareScoreWhatsApp(gameName, resultDetails, urlPath);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    if (variant === 'whatsapp') {
        return (
            <button
                type="button"
                onClick={handleShare}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer ${className}`}
            >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{copied ? 'Shared!' : 'Challenge on WhatsApp'}</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 transition-all cursor-pointer ${className}`}
        >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Link Copied!' : 'Share Score'}</span>
        </button>
    );
}
