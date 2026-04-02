
const { Client, Databases, ID } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function seedQuiz() {
    try {
        console.log('Starting seed...');
        
        // 1. Create the Quiz document
        const quiz = await databases.createDocument(
            DB_ID,
            'quizzes',
            ID.unique(),
            {
                title: 'Numbers Chapters 1-15',
                description: 'A comprehensive quiz covering the Israelites\' census, camps, laws, and the rebellion in the wilderness (Numbers 1-15).',
                duration: 20
            }
        );

        console.log(`Created Quiz: ${quiz.title} (${quiz.$id})`);

        // 2. Load questions from JSON files
        const p1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/numbers_quiz_bank_p1.json'), 'utf8'));
        const p2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/numbers_quiz_bank_p2.json'), 'utf8'));
        const allQuestions = [...p1, ...p2];

        console.log(`Found ${allQuestions.length} questions. Seeding to 'questions' collection...`);

        for (const q of allQuestions) {
            await databases.createDocument(
                DB_ID,
                'questions',
                ID.unique(),
                {
                    quiz_id: quiz.$id,
                    text: q.text,
                    options: q.options,
                    correct_index: q.correct_index
                }
            );
            // Small delay to avoid rate limiting
            await new Promise(r => setTimeout(r, 100));
        }

        console.log('Seeding complete!');
        console.log(`Quiz ID for your app: ${quiz.$id}`);

    } catch (error) {
        console.error('Seed failed:', error);
    }
}

seedQuiz();
