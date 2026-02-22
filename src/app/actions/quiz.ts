'use server';

import { ID, Query } from 'node-appwrite';
import { adminDatabases } from '@/lib/server/appwrite';
import { redirect } from 'next/navigation';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export async function createQuizAction(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const duration = parseInt(formData.get('duration') as string);
    const questionsRaw = formData.get('questions') as string;

    if (!title || !description || !duration || !questionsRaw) {
        throw new Error('All fields are required');
    }

    const questions = JSON.parse(questionsRaw);

    const quiz = await adminDatabases.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title,
        description,
        duration,
        is_active: true,
        question_count: questions.length,
    });

    for (const q of questions) {
        await adminDatabases.createDocument(DB_ID, 'questions', ID.unique(), {
            quiz_id: quiz.$id,
            text: q.text,
            options: q.options,
            correct_index: q.correctAnswer,
        });
    }

    redirect('/admin/quizzes');
}

export async function updateQuizAction(formData: FormData) {
    const quizId = formData.get('quizId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const duration = parseInt(formData.get('duration') as string);

    if (!quizId || !title || !description || !duration) {
        throw new Error('All fields are required');
    }

    await adminDatabases.updateDocument(DB_ID, 'quizzes', quizId, {
        title,
        description,
        duration,
    });

    redirect('/admin/quizzes');
}

export async function deleteQuizAction(quizId: string) {
    // Delete associated questions first
    try {
        const questions = await adminDatabases.listDocuments(DB_ID, 'questions', [
            Query.equal('quiz_id', quizId),
        ]);
        for (const q of questions.documents) {
            await adminDatabases.deleteDocument(DB_ID, 'questions', q.$id);
        }
    } catch {
        // If questions collection doesn't exist yet, continue
    }

    await adminDatabases.deleteDocument(DB_ID, 'quizzes', quizId);
}

export async function submitQuizAction(formData: FormData) {
    const quizId = formData.get('quizId') as string;
    const quizTitle = formData.get('quizTitle') as string;
    const participantName = formData.get('participantName') as string;
    const score = parseInt(formData.get('score') as string);
    const total = parseInt(formData.get('total') as string);

    if (!quizId || !participantName || score === undefined || !total) {
        throw new Error('Missing required fields');
    }

    await adminDatabases.createDocument(DB_ID, 'attempts', ID.unique(), {
        quiz_id: quizId,
        quiz_title: quizTitle,
        participant_name: participantName,
        score,
        total,
        percentage: Math.round((score / total) * 100),
    });

    redirect(`/quiz/${quizId}/result?name=${encodeURIComponent(participantName)}&score=${score}&total=${total}`);
}
