'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, AlertCircle, ChevronRight, BookOpen, Mic, Square, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { submitQuizAction, uploadAudioAction, checkAttemptExistsAction } from '@/app/actions/quiz';

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
    image_url?: string;
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
    const [checkingAttempt, setCheckingAttempt] = useState(false);
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
                setTimeLeft(data.quiz.duration);
                setAnswers(new Array(data.questions.length).fill(-1));
            }
            setLoading(false);
        });
    }, [quizId]);

    const handleStartQuiz = async () => {
        if (!participantName.trim() || !participantPhone.trim()) {
            alert('Please enter both your name and phone number to continue.');
            return;
        }
        setCheckingAttempt(true);
        try {
            const exists = await checkAttemptExistsAction(quizId, participantPhone);
            if (exists) {
                alert('An attempt with this phone number has already been recorded. Only one entry is allowed per person!');
                setCheckingAttempt(false);
                return;
            }
            setNameEntered(true);
        } catch (e) {
            alert('Could not verify attempt status. Please try again.');
            setCheckingAttempt(false);
        }
    };

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
            if (q.correct_index !== -1 && answers[currentQuestion] === -1) {
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-sans">Loading quiz…</p>
            </div>
        </div>
    );

    // ─── Not found ───
    if (!quiz || questions.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center text-slate-900">
                <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                <h2 className="font-serif font-bold text-3xl mb-2">Quiz Not Found</h2>
                <p className="text-slate-500 mb-6">This quiz doesn't exist or has no questions yet.</p>
                <Link href="/quiz" className="inline-flex px-6 py-3 rounded-full bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition-colors">Back to Quizzes</Link>
            </div>
        </div>
    );

    // ─── Name Entry ───
    if (!nameEntered) return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
            {/* Bg blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-30 bg-amber-200" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-30 bg-purple-200" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">

                    {/* Top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-amber-400 to-amber-600" />

                    <div className="p-8 md:p-10">
                        {/* Section label */}
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 mb-4 text-center">Get Ready</p>

                        {quiz.image_url && (
                            <div className="mb-6 w-full max-w-[160px] mx-auto rounded-xl overflow-hidden shadow-lg border border-slate-100 relative group">
                                <img src={quiz.image_url} alt={quiz.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                        )}

                        <h1 className="font-serif font-bold text-3xl md:text-4xl text-slate-900 mb-3 text-center leading-snug">
                            {quiz.title}
                        </h1>
                        <p className="text-slate-500 text-sm font-sans text-center mb-8 leading-relaxed">
                            {quiz.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {[
                                { icon: Clock, label: 'Duration', value: `${Math.round(quiz.duration / 60)} min` },
                                { icon: BookOpen, label: 'Questions', value: `${questions.length} total` },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="rounded-2xl p-4 text-center bg-slate-50 border border-slate-100">
                                    <Icon className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                                    <div className="text-slate-900 font-semibold font-sans text-lg">{value}</div>
                                    <div className="text-slate-400 text-xs font-sans">{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Keyboard hint */}
                        <p className="text-slate-400 text-xs font-sans text-center mb-5">
                            Tip: Press <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-slate-500">A</kbd>–
                            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-slate-500">D</kbd> to select answers,{' '}
                            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-slate-500">←</kbd>
                            <kbd className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 font-mono text-slate-500">→</kbd> to navigate
                        </p>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && participantName.trim() && participantPhone.trim()) handleStartQuiz(); }}
                            className="w-full px-4 py-3.5 rounded-xl font-sans text-sm focus:outline-none mb-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                        <input
                            type="tel"
                            placeholder="Enter your phone number (required for prizes)"
                            value={participantPhone}
                            onChange={(e) => setParticipantPhone(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && participantName.trim() && participantPhone.trim()) handleStartQuiz(); }}
                            className="w-full px-4 py-3.5 rounded-xl font-sans text-sm focus:outline-none mb-6 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                        <button
                            onClick={handleStartQuiz}
                            disabled={!participantName.trim() || !participantPhone.trim() || checkingAttempt}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-sans font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {checkingAttempt ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Begin Quiz'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    const question = questions[currentQuestion];

    // ─── Quiz Interface ───
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">

            {/* Timer + progress bar strip */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">

                {/* Timer bar */}
                <div className="h-1 w-full bg-slate-100">
                    <div className="h-full transition-all duration-1000 ease-linear"
                        style={{
                            width: `${timePercent}%`,
                            background: isLowTime
                                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                                : isMedTime
                                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                    : 'linear-gradient(90deg, #f59e0b, #d97706)',
                        }} />
                </div>

                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/quiz"
                        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-sans">
                        <ArrowLeft className="w-4 h-4" /> Exit
                    </Link>

                    {/* Timer */}
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono font-bold text-base transition-colors bg-slate-50 border border-slate-200 ${
                        isLowTime ? 'text-rose-500 animate-pulse' : isMedTime ? 'text-amber-600' : 'text-slate-900'
                    }`}>
                        <Clock className="w-4 h-4" />
                        {formatTime(timeLeft)}
                    </div>

                    <span className="text-slate-500 text-sm font-sans">{answeredCount}/{questions.length}</span>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-start justify-center px-4 pt-28 pb-8">
                <div className="w-full max-w-3xl">

                    {/* Question progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between text-xs font-sans text-slate-500 mb-2">
                            <span>Question {currentQuestion + 1} of {questions.length}</span>
                            <span>{Math.round(progress)}% complete</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-200">
                            <div className="h-full rounded-full transition-all duration-400 bg-gradient-to-r from-amber-400 to-amber-600"
                                style={{ width: `${progress}%` }} />
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
                            <div className="rounded-2xl p-7 mb-5 bg-white border border-slate-200 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <span className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold font-sans bg-amber-100 text-amber-700">
                                        {currentQuestion + 1}
                                    </span>
                                    <h2 className="font-serif font-semibold text-slate-900 text-xl leading-snug pt-0.5">
                                        {question.text}
                                    </h2>
                                </div>
                            </div>

                            {/* Options or Text/Audio input */}
                            {question.correct_index === -1 ? (
                                <div className="mb-6 space-y-4">
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                        <p className="text-slate-500 text-sm font-sans mb-3">Respond by writing your thoughts or recording a voice note. (Points: 1)</p>
                                        
                                        {/* Text Area */}
                                        <textarea 
                                            placeholder="Type your response here..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-sans text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all mb-4 placeholder:text-slate-400"
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
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                            <span className="text-xs text-slate-400 uppercase tracking-widest">OR</span>
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                        </div>

                                        <div className="mt-4 flex flex-col items-center">
                                            {typeof answers[currentQuestion] === 'string' && answers[currentQuestion].toString().startsWith('http') ? (
                                                <div className="w-full flex flex-col items-center gap-3">
                                                    <div className="text-emerald-600 font-medium text-sm flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" /> Audio Recorded Successfully
                                                    </div>
                                                    <audio src={answers[currentQuestion] as string} controls className="w-full max-w-sm" />
                                                    <button onClick={() => {
                                                        const updated = [...answers];
                                                        updated[currentQuestion] = '';
                                                        setAnswers(updated);
                                                        setRecordingStatus('idle');
                                                    }} className="text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors">Remove Recording</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
                                                    disabled={uploadingAudio}
                                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans font-semibold text-sm transition-all shadow-sm ${
                                                        recordingStatus === 'recording' 
                                                            ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 animate-pulse' 
                                                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {uploadingAudio ? (
                                                        <><Loader2 className="w-4 h-4 animate-spin text-slate-500" /> <span className="text-slate-500">Uploading...</span></>
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
                                        const hasAnswered = answers[currentQuestion] !== -1;
                                        const isSelected = answers[currentQuestion] === i;
                                        const isCorrect = i === question.correct_index;
                                        
                                        // Default styles
                                        let bg = isSelected ? 'rgba(245,158,11,0.08)' : '#ffffff';
                                        let border = isSelected ? 'rgba(245,158,11,0.5)' : 'rgba(226,232,240,1)';
                                        let text = isSelected ? '#92400e' : '#475569';
                                        let shadow = isSelected ? '0 0 12px rgba(245,158,11,0.1)' : '0 1px 2px 0 rgb(0 0 0 / 0.05)';
                                        let labelBg = isSelected ? 'rgba(245,158,11,0.2)' : '#f8fafc';
                                        let labelColor = isSelected ? '#d97706' : '#94a3b8';
                                        let labelBorder = isSelected ? '1px solid rgba(245,158,11,0.4)' : '1px solid #e2e8f0';

                                        // Override with instant feedback if answered
                                        if (hasAnswered) {
                                            if (isCorrect) {
                                                bg = 'rgba(16,185,129,0.08)'; // emerald-500 light
                                                border = 'rgba(16,185,129,0.5)';
                                                text = '#065f46'; // emerald-800
                                                shadow = '0 0 12px rgba(16,185,129,0.1)';
                                                labelBg = 'rgba(16,185,129,0.2)';
                                                labelColor = '#059669'; // emerald-600
                                                labelBorder = '1px solid rgba(16,185,129,0.4)';
                                            } else if (isSelected && !isCorrect) {
                                                bg = 'rgba(244,63,94,0.08)'; // rose-500 light
                                                border = 'rgba(244,63,94,0.5)';
                                                text = '#9f1239'; // rose-800
                                                shadow = '0 0 12px rgba(244,63,94,0.1)';
                                                labelBg = 'rgba(244,63,94,0.2)';
                                                labelColor = '#e11d48'; // rose-600
                                                labelBorder = '1px solid rgba(244,63,94,0.4)';
                                            } else {
                                                // Unselected and incorrect, fade out a bit
                                                bg = '#f8fafc';
                                                border = 'rgba(226,232,240,0.5)';
                                                text = '#94a3b8';
                                                shadow = 'none';
                                                labelBg = '#f1f5f9';
                                                labelColor = '#cbd5e1';
                                            }
                                        }

                                        return (
                                            <motion.button
                                                key={i}
                                                whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                                                onClick={() => {
                                                    if (hasAnswered) return;
                                                    const updated = [...answers];
                                                    updated[currentQuestion] = i;
                                                    setAnswers(updated);
                                                }}
                                                className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all duration-200 font-sans group ${hasAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                                                style={{
                                                    background: bg,
                                                    borderColor: border,
                                                    color: text,
                                                    boxShadow: shadow,
                                                }}
                                            >
                                                <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all duration-200"
                                                    style={{
                                                        background: labelBg,
                                                        color: labelColor,
                                                        border: labelBorder,
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
                                            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                            : isAnswered
                                                ? '#fbbf24'
                                                : '#e2e8f0', // slate-200
                                        boxShadow: isCurrent ? '0 0 8px rgba(245,158,11,0.4)' : 'none',
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
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-sans font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed border-slate-200 text-slate-500 hover:bg-slate-100"
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {currentQuestion < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestion((c) => c + 1)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 bg-slate-800 hover:bg-slate-900"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-lg hover:shadow-amber-500/20"
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
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-sm rounded-3xl p-8 text-center border border-slate-100 bg-white shadow-2xl"
                        >
                            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                            <h3 className="font-serif font-bold text-2xl text-slate-900 mb-2">Not all answered</h3>
                            <p className="text-slate-500 font-sans text-sm mb-6">
                                You have {answers.filter((a, i) => questions[i]?.correct_index === -1 ? (a === -1 || a === '') : a === -1).length} unanswered{' '}
                                {answers.filter((a, i) => questions[i]?.correct_index === -1 ? (a === -1 || a === '') : a === -1).length === 1 ? 'question' : 'questions'}.
                                Submit anyway?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSubmitGuard(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100"
                                >
                                    Go back
                                </button>
                                <button
                                    onClick={() => { setShowSubmitGuard(false); handleSubmit(true); }}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm"
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
