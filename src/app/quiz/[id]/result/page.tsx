import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import ResultClient from './ResultClient';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function getAttempt(attemptId: string) {
    try {
        return await adminDatabases.getDocument(DB_ID, 'attempts', attemptId);
    } catch {
        return null;
    }
}

async function getQuestions(quizId: string) {
    try {
        const res = await adminDatabases.listDocuments(DB_ID, 'questions', [
            Query.equal('quiz_id', quizId),
            Query.limit(100),
            Query.orderAsc('$createdAt'),
        ]);
        return res.documents;
    } catch {
        return [];
    }
}

export default async function QuizResultPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ attemptId?: string; name?: string; score?: string; total?: string; answers?: string }>;
}) {
    const { id: quizId } = await params;
    const { attemptId, name: nameParam, score: scoreParam, total: totalParam, answers: answersParam } = await searchParams;

    let name = 'Participant';
    let score = 0;
    let total = 0;
    let userAnswers: number[] = [];

    if (attemptId) {
        const attempt = await getAttempt(attemptId);
        if (attempt) {
            name = attempt.participant_name;
            score = attempt.score;
            total = attempt.total;
            userAnswers = JSON.parse(attempt.user_answers);
        }
    } else if (nameParam && scoreParam && totalParam) {
        name = nameParam;
        score = parseInt(scoreParam);
        total = parseInt(totalParam);
        userAnswers = answersParam ? JSON.parse(decodeURIComponent(answersParam)) : [];
    }

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const questions = await getQuestions(quizId);
    const plainQuestions = questions.map((q: any) => ({
        $id: q.$id,
        text: q.text,
        options: q.options,
        correct_index: q.correct_index,
    }));

    const passed = percentage >= 50;
    const grade =
        percentage >= 90 ? 'Excellent!' :
        percentage >= 70 ? 'Great Job!' :
        percentage >= 50 ? 'Good Effort!' :
        'Keep Practicing!';

    return (
        <ResultClient
            name={name}
            score={score}
            total={total}
            percentage={percentage}
            passed={passed}
            grade={grade}
            questions={plainQuestions}
            userAnswers={userAnswers}
            quizId={quizId}
        />
    );
}
