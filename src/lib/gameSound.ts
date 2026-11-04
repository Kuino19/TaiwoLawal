// Web Audio API procedural sound synthesizer
// Works 100% offline and in all modern browsers (iOS Safari, Android Chrome, Desktop)
// No external MP3/WAV files required!

class SoundEngine {
    private ctx: AudioContext | null = null;
    private muted: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            try {
                this.muted = localStorage.getItem('bible_games_muted') === 'true';
            } catch {}
        }
    }

    private getContext(): AudioContext | null {
        if (typeof window === 'undefined') return null;
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        return this.ctx;
    }

    public isMuted(): boolean {
        return this.muted;
    }

    public toggleMute(): boolean {
        this.muted = !this.muted;
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('bible_games_muted', String(this.muted));
            } catch {}
        }
        return this.muted;
    }

    // Gentle short click / button tap
    public playTap(): void {
        if (this.muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch {}
    }

    // Card flip / item swoosh
    public playCardFlip(): void {
        if (this.muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(250, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.07);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.07);
        } catch {}
    }

    // Ascending chime for correct answer
    public playSuccess(): void {
        if (this.muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            notes.forEach((freq, index) => {
                const startTime = ctx.currentTime + index * 0.07;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.12, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + 0.22);
            });
        } catch {}
    }

    // Gentle buzzer / error thud
    public playError(): void {
        if (this.muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.18);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.18);
        } catch {}
    }

    // Victory fanfare arpeggio
    public playFanfare(): void {
        if (this.muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, index) => {
                const startTime = ctx.currentTime + index * 0.1;
                const duration = index === notes.length - 1 ? 0.6 : 0.25;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = index === notes.length - 1 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0.15, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(startTime);
                osc.stop(startTime + duration);
            });
        } catch {}
    }

    // Ticking clock for low countdown
    public playTick(): void {
        if (this.muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.025);

            gain.gain.setValueAtTime(0.07, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.025);
        } catch {}
    }

    // Combo streak sound (ascending pitch by combo level)
    public playCombo(combo: number): void {
        if (this.muted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        try {
            const baseFreq = 440;
            const multiplier = Math.min(combo, 8);
            const freq = baseFreq * (1 + (multiplier * 0.15));

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch {}
    }
}

export const gameSound = new SoundEngine();

// Safe Mobile Haptic feedback
export const triggerHaptic = (type: 'tap' | 'success' | 'error' | 'heavy' = 'tap') => {
    if (typeof window === 'undefined') return;
    if (!('vibrate' in navigator)) return;

    try {
        if (type === 'tap') {
            navigator.vibrate(10);
        } else if (type === 'success') {
            navigator.vibrate([25, 40, 35]);
        } else if (type === 'error') {
            navigator.vibrate([50, 40, 50]);
        } else if (type === 'heavy') {
            navigator.vibrate(80);
        }
    } catch {}
};
