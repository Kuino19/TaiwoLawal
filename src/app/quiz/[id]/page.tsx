'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, AlertCircle, ChevronRight, BookOpen, Mic, Square, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { submitQuizAction, uploadAudioAction } from '@/app/actions/quiz';

interface Question {
    $id: string;
    text: string;
    options: string[];
    correct_index: number;
}

interface QuizData {
    $id: string;
    title: string;
    description: string;
    duration: number;
}

async function fetchQuizData(quizId: string): Promise<{ quiz: QuizData; questions: Question[] } | null> {
    try {
        const [quizRes, questionsRes] = await Promise.all([
            fetch(`/api/quiz/${quizId}`),
            fetch(`/api/quiz/${quizId}/questions`),
        ]);
        if (!quizRes.ok) return null;
        const quiz = await quizRes.json();
        const questions = await questionsRes.json();
        return { quiz, questions };
    } catch {
        return null;
    }
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

export default function QuizInterface({ params }: { params: Promise<{ id: string }> }) {
    const { id: quizId } = use(params);
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<(number | string)[]>([]);
    const [loading, setLoading] = useState(true);
    const [participantName, setParticipantName] = useState('');
    const [participantPhone, setParticipantPhone] = useState('');
    const [nameEntered, setNameEntered] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showSubmitGuard, setShowSubmitGuard] = useState(false);

    // Audio recording state
    const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [uploadingAudio, setUploadingAudio] = useState(false);

    useEffect(() => {
        fetchQuizData(quizId).then((data) => {
            if (data) {
                setQuiz(data.quiz);
                setQuestions(data.questions);
                setAnswers(new Array(data.questions.length).fill(-1));
                setTimeLeft(data.quiz.duration); // duration stored in seconds already
            }
            setLoading(false);
        });
    }, [quizId]);

    const handleSubmit = useCallback(async (force = false) => {
        if (submitting) return;
        const unanswered = answers.filter((a, i) => questions[i]?.correct_index === -1 ? (a === -1 || a === '') : a === -1).length;
        if (!force && unanswered > 0) {
            setShowSubmitGuard(true);
            return;
        }
        setSubmitting(true);
        try {
            const score = answers.reduce((s, a, i) => {
                if (questions[i]?.correct_index === -1) {
                    return (a !== -1 && a !== '') ? (Number(s) + 1) : Number(s);
                }
                return a === questions[i]?.correct_index ? (Number(s) + 1) : Number(s);
            }, 0);
            
            const formData = new FormData();
            formData.append('quizId', quizId);
            formData.append('quizTitle', quiz?.title || '');
            formData.append('participantName', participantName);
            formData.append('participantPhone', participantPhone);
            formData.append('score', String(score));
            formData.append('total', String(questions.length));
            formData.append('userAnswers', JSON.stringify(answers));
            await submitQuizAction(formData);
        } catch (error: any) {
            if (error?.message?.includes('NEXT_REDIRECT')) throw error;
            console.error('Quiz submission failed:', error);
            alert(error.message || 'Failed to submit quiz. Please check your connection and try again.');
            setSubmitting(false);
        }
    }, [answers, questions, participantName, participantPhone, quizId, quiz, submitting]);

    // Countdown timer
    useEffect(() => {
        if (!nameEntered || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) { handleSubmit(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [nameEntered, timeLeft, handleSubmit]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!nameEntered || !questions.length) return;
        const handler = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
            const key = e.key.toLowerCase();
            const q = questions[currentQuestion];
            if (q.correct_index !== -1) {
                if (key === 'a' || key === '1') { const updated = [...answers]; updated[currentQuestion] = 0; setAnswers(updated); }
                else if (key === 'b' || key === '2') { const updated = [...answers]; updated[currentQuestion] = 1; setAnswers(updated); }
                else if (key === 'c' || key === '3') { const updated = [...answers]; updated[currentQuestion] = 2; setAnswers(updated); }
                else if (key === 'd' || key === '4') { const updated = [...answers]; updated[currentQuestion] = 3; setAnswers(updated); }
            }
            if (key === 'arrowright' && currentQuestion < questions.length - 1) setCurrentQuestion((c) => c + 1);
            else if (key === 'arrowleft' && currentQuestion > 0) setCurrentQuestion((c) => c - 1);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [nameEntered, currentQuestion, answers, questions]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];
            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setRecordingStatus('recorded');
                setUploadingAudio(true);
                const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('audio', file);
                try {
                    const url = await uploadAudioAction(formData);
                    const updated = [...answers];
                    updated[currentQuestion] = url;
                    setAnswers(updated);
                } catch (e) {
                    alert('Audio upload failed.');
                    setRecordingStatus('idle');
                }
                setUploadingAudio(false);
                stream.getTracks().forEach(t => t.stop());
            };
            recorder.start();
            setMediaRecorder(recorder);
            setRecordingStatus('recording');
        } catch (e) {
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    };

    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const timePercent = quiz ? (timeLeft / quiz.duration) * 100 : 100;
    const progress = questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0;
    const answeredCount = answers.filter((a, i) => questions[i]?.correct_index === -1 ? (a !== -1 && a !== '') : a !== -1).length;
    const isLowTime = timeLeft < 60;
    const isMedTime = timeLeft < 300 && timeLeft >= 60;

    // ─── Loading ───
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0520' }}>
            <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-gold-400 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-white/50 font-sans">Loading quiz…</p>
            </div>
        </div>
    );

    // ─── Not found ───
    if (!quiz || questions.length === 0) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0520' }}>
            <div className="text-center text-white">
                <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                <h2 className="font-serif font-bold text-3xl mb-2">Quiz Not Found</h2>
                <p className="text-white/50 mb-6">This quiz doesn't exist or has no questions yet.</p>
                <Link href="/quiz" className="btn-gold">Back to Quizzes</Link>
            </div>
        </div>
    );

    // ─── Name Entry ───
    if (!nameEntered) return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0d0520' }}>
            {/* Bg blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
                    style={{ background: 'radial-gradient(circle, #6d28d9, transparent)' }} />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
                    style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                <div className="rounded-3xl overflow-hidden border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)' }}>

                    {/* Top accent */}
                    <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6d28d9, #f59e0b)' }} />

                    <div className="p-8 md:p-10">
                        {/* Section label */}
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold-400 mb-4 text-center">Get Ready</p>

                        <h1 className="font-serif font-bold text-3xl md:text-4xl text-white mb-3 text-center leading-snug">
                            {quiz.title}
                        </h1>
                        <p className="text-white/45 text-sm font-sans text-center mb-8 leading-relaxed">
                            {quiz.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { icon: Clock, label: 'Duration', value: `${Math.round(quiz.duration / 60)} min` },
                                { icon: BookOpen, label: 'Questions', value: `${questions.length} total` },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="rounded-2xl p-4 text-center"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <Icon className="w-5 h-5 text-gold-400 mx-auto mb-1.5" />
                                    <div className="text-white font-semibold font-sans text-lg">{value}</div>
                                    <div className="text-white/40 text-xs font-sans">{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Keyboard hint */}
                        <p className="text-white/30 text-xs font-sans text-center mb-5">
                            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">A</kbd>–
                            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">D</kbd> to select answers,{' '}
                            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">←</kbd>
                            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">→</kbd> to navigate
                        </p>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && participantName.trim()) setNameEntered(true); }}
                            className="w-full px-4 py-3.5 rounded-xl font-sans text-sm focus:outline-none mb-3"
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: 'white',
                            }}
                        />
                        <input
                            type="tel"
                            placeholder="Enter your phone number (optional)"
                            value={participantPhone}
                            onChange={(e) => setParticipantPhone(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && participantName.trim()) setNameEntered(true); }}
                            className="w-full px-4 py-3.5 rounded-xl font-sans text-sm focus:outline-none mb-4"
                            style={{
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: 'white',
                            }}
                        />
                        <button
                            onClick={() => { if (participantName.trim()) setNameEntered(true); }}
                            disabled={!participantName.trim()}
                            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ background: 'linear-gradient(135deg, #6d28d9, #f59e0b)' }}
                        >
                            Begin Quiz <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    const question = questions[currentQuestion];

    // ─── Quiz Interface ───
    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#0d0520' }}>

            {/* Timer + progress bar strip */}
            <div className="fixed top-0 left-0 right-0 z-50"
                style={{ background: 'rgba(13,5,32,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

                {/* Timer bar */}
                <div className="h-1 w-full bg-white/8">
                    <div className="h-full transition-all duration-1000 ease-linear"
                        style={{
                            width: `${timePercent}%`,
                            background: isLowTime
                                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                                : isMedTime
                                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                    : 'linear-gradient(90deg, #6d28d9, #f59e0b)',
                        }} />
                </div>

                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/quiz"
                        className="flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors text-sm font-sans">
                        <ArrowLeft className="w-4 h-4" /> Exit
                    </Link>

                    {/* Timer */}
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono font-bold text-base transition-colors ${
                        isLowTime ? 'text-rose-400 animate-pulse' : isMedTime ? 'text-gold-400' : 'text-white'
                    }`} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Clock className="w-4 h-4" />
                        {formatTime(timeLeft)}
                    </div>

                    <span className="text-white/40 text-sm font-sans">{answeredCount}/{questions.length}</span>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-start justify-center px-4 pt-28 pb-8">
                <div className="w-full max-w-3xl">

                    {/* Question progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between text-xs font-sans text-white/35 mb-2">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>{Math.round(progress)}% complete</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/8">
                            <div className="h-full rounded-full transition-all duration-400"
                                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6d28d9, #f59e0b)' }} />
                        </div>
                    </div>

                    {/* Question card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                        >
                            {/* Question */}
                            <div className="rounded-2xl p-7 mb-5 border border-white/8"
                                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)' }}>
                                <div className="flex items-start gap-4">
                                    <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold font-sans"
                                        style={{ background: 'linear-gradient(135deg, #6d28d9, #a78bfa)', color: 'white' }}>
                                        {currentQuestion + 1}
                                    </span>
                                    <h2 className="font-serif font-semibold text-white text-xl leading-snug pt-0.5">
                                        {question.text}
                                    </h2>
                                </div>
                            </div>

                            {/* Options or Text/Audio input */}
                            {question.correct_index === -1 ? (
                                <div className="mb-6 space-y-4">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                        <p className="text-white/60 text-sm font-sans mb-3">Respond by writing your thoughts or recording a voice note. (Points: 1)</p>
                                        
                                        {/* Text Area */}
                                        <textarea 
                                            placeholder="Type your response here..."
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white font-sans text-sm min-h-[120px] focus:outline-none focus:border-gold-400/50 transition-colors mb-4"
                                            value={typeof answers[currentQuestion] === 'string' && !answers[currentQuestion].toString().startsWith('http') ? answers[currentQuestion] : ''}
                                            onChange={(e) => {
                                                const updated = [...answers];
                                                updated[currentQuestion] = e.target.value;
                                                setAnswers(updated);
                                            }}
                                            disabled={uploadingAudio || recordingStatus === 'recording'}
                                        />

                                        {/* Audio Recorder */}
                                        <div className="flex items-center gap-4">
                                            <div className="h-px flex-1 bg-white/10"></div>
                                            <span className="text-xs text-white/40 uppercase tracking-widest">OR</span>
                                            <div className="h-px flex-1 bg-white/10"></div>
                                        </div>

                                        <div className="mt-4 flex flex-col items-center">
                                            {typeof answers[currentQuestion] === 'string' && answers[currentQuestion].toString().startsWith('http') ? (
                                                <div className="w-full flex flex-col items-center gap-3">
                                                    <div className="text-emerald-400 text-sm flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" /> Audio Recorded Successfully
                                                    </div>
                                                    <audio src={answers[currentQuestion] as string} controls className="w-full max-w-sm" />
                                                    <button onClick={() => {
                                                        const updated = [...answers];
                                                        updated[currentQuestion] = '';
                                                        setAnswers(updated);
                                                        setRecordingStatus('idle');
                                                    }} className="text-xs text-rose-400 hover:text-rose-300">Remove Recording</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
                                                    disabled={uploadingAudio}
                                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans font-semibold text-sm transition-all ${
                                                        recordingStatus === 'recording' 
                                                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30 animate-pulse' 
                                                            : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                                                    }`}
                                                >
                                                    {uploadingAudio ? (
                                                        <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                                                    ) : recordingStatus === 'recording' ? (
                                                        <><Square className="w-4 h-4" fill="currentColor" /> Stop Recording</>
                                                    ) : (
                                                        <><Mic className="w-4 h-4" /> Record Voice Note</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-3 mb-6">
                                    {question.options.map((option, i) => {
                                        const selected = answers[currentQuestion] === i;
                                        return (
                                            <motion.button
                                                key={i}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    const updated = [...answers];
                                                    updated[currentQuestion] = i;
                                                    setAnswers(updated);
                                                }}
                                                className="w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-200 font-sans group"
                                                style={{
                                                    background: selected ? 'rgba(109,40,217,0.18)' : 'rgba(255,255,255,0.04)',
                                                    borderColor: selected ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.08)',
                                                    color: selected ? '#e9d5ff' : 'rgba(255,255,255,0.65)',
                                                    boxShadow: selected ? '0 0 20px rgba(109,40,217,0.25)' : 'none',
                                                }}
                                            >
                                                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all duration-200"
                                                    style={{
                                                        background: selected ? 'rgba(167,139,250,0.3)' : 'rgba(255,255,255,0.07)',
                                                        color: selected ? '#c4b5fd' : 'rgba(255,255,255,0.4)',
                                                        border: selected ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.1)',
                                                    }}>
                                                    {OPTION_LABELS[i]}
                                                </span>
                                                <span className="font-medium text-sm leading-snug">{option}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Question dot navigator */}
                    <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
                        {questions.map((q, i) => {
                            const isAnswered = q.correct_index === -1 ? (answers[i] !== -1 && answers[i] !== '') : answers[i] !== -1;
                            const isCurrent = i === currentQuestion;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQuestion(i)}
                                    title={`Question ${i + 1}`}
                                    className="transition-all duration-200 rounded-md"
                                    style={{
                                        width: isCurrent ? '28px' : '10px',
                                        height: '10px',
                                        background: isCurrent
                                            ? 'linear-gradient(90deg, #6d28d9, #f59e0b)'
                                            : isAnswered
                                                ? '#6d28d9'
                                                : 'rgba(255,255,255,0.15)',
                                        boxShadow: isCurrent ? '0 0 8px rgba(109,40,217,0.6)' : 'none',
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentQuestion((c) => Math.max(0, c - 1))}
                            disabled={currentQuestion === 0}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-sans font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                            style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {currentQuestion < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestion((c) => c + 1)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #2e1065, #6d28d9)' }}
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                            >
                                {submitting ? 'Submitting…' : 'Submit Quiz'}
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit guard dialog */}
            <AnimatePresence>
                {showSubmitGuard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-sm rounded-3xl p-8 text-center border border-white/10"
                            style={{ background: 'rgba(20,8,50,0.98)', backdropFilter: 'blur(20px)' }}
                        >
                            <AlertCircle className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                            <h3 className="font-serif font-bold text-2xl text-white mb-2">Not all answered</h3>
                            <p className="text-white/50 font-sans text-sm mb-6">
                                You have {answers.filter((a, i) => questions[i]?.correct_index === -1 ? (a === -1 || a === '') : a === -1).length} unanswered{' '}
                                {answers.filter((a, i) => questions[i]?.correct_index === -1 ? (a === -1 || a === '') : a === -1).length === 1 ? 'question' : 'questions'}.
                                Submit anyway?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSubmitGuard(false)}
                                    className="flex-1 py-2.5 rounded-xl border text-sm font-semibold text-white/70 transition-all hover:bg-white/5"
                                    style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                                >
                                    Go back
                                </button>
                                <button
                                    onClick={() => { setShowSubmitGuard(false); handleSubmit(true); }}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                                >
                                    Submit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
