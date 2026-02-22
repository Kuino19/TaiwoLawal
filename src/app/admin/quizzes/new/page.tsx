'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { createQuizAction } from '@/app/actions/quiz';

interface QuestionDraft {
    text: string;
    options: string[];
    correctAnswer: number;
}

export default function CreateQuizPage() {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionDraft[]>([
        { text: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const updateQuestion = (index: number, field: keyof QuestionDraft, value: any) => {
        const newQuestions = [...questions];
        // @ts-ignore
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
        }
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            // Append questions as JSON string to formData
            formData.append('questions', JSON.stringify(questions));

            // Call server action
            await createQuizAction(formData);
        } catch (error) {
            console.error(error);
            alert('Failed to create quiz');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-6">
                <Link href="/admin/quizzes" className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to Quizzes
                </Link>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Create New Quiz</h2>
            </div>

            <form action={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 shadow rounded-lg space-y-6">
                    <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Quiz Details</h3>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                            <div className="sm:col-span-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" name="title" id="title" required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" id="description" rows={3} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"></textarea>
                            </div>
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (mins)</label>
                                <input type="number" name="duration" id="duration" required min="1" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Questions</h3>
                    </div>

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white p-6 shadow rounded-lg relative">
                            <div className="absolute top-4 right-4">
                                <button type="button" onClick={() => removeQuestion(qIndex)} className="text-gray-400 hover:text-red-500">
                                    <Trash className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Question {qIndex + 1}</label>
                                    <input
                                        type="text"
                                        required
                                        value={q.text}
                                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="Enter question text"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex}>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIndex}`}
                                                    checked={q.correctAnswer === oIndex}
                                                    onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                    className="ml-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                                                    placeholder={`Option ${oIndex + 1}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full flex justify-center py-3 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-900"
                    >
                        <Plus className="mr-2 h-5 w-5" /> Add Question
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="ml-3 inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Creating...' : 'Create Quiz'}
                    </button>
                </div>
            </form>
        </div>
    );
}
