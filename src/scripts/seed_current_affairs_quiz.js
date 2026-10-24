const { Client, Databases, ID } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function seed() {
    try {
        console.log('Seeding "Foursquare Current Affairs for Children" quiz to Appwrite...');

        // 1. Create Quiz document
        const quiz = await databases.createDocument(
            DB_ID,
            'quizzes',
            ID.unique(),
            {
                title: 'Foursquare Current Affairs for Children',
                description: 'Special children competition quiz covering Foursquare history, founders, leadership, anniversary milestones, and ministries. 10 randomized questions in 3 minutes.',
                duration: 180, // 3 minutes = 180 seconds
                is_active: true,
                question_count: 10, // 10 questions served randomly from the 30-question pool
            }
        );

        console.log(`✅ Created Quiz: ${quiz.title} (${quiz.$id})`);

        // 2. Load questions
        const questionsPath = path.join(__dirname, '../data/foursquare_current_affairs.json');
        const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

        console.log(`Uploading ${questions.length} questions into pool...`);

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            await databases.createDocument(
                DB_ID,
                'questions',
                ID.unique(),
                {
                    quiz_id: quiz.$id,
                    text: q.text,
                    options: q.options,
                    correct_index: q.correct_index,
                }
            );
            if ((i + 1) % 10 === 0 || i === questions.length - 1) {
                console.log(`Uploaded ${i + 1} / ${questions.length} questions...`);
            }
            // Small delay to prevent Appwrite rate limits
            await new Promise(r => setTimeout(r, 60));
        }

        console.log('🎉 Successfully created and seeded Foursquare Current Affairs for Children quiz!');
        console.log(`Quiz ID: ${quiz.$id}`);
        console.log(`Pool Size: ${questions.length} questions`);
        console.log(`Session Size: 10 questions`);
        console.log(`Time Limit: 3 minutes (180s)`);
    } catch (e) {
        console.error('Seed error:', e);
    }
}

seed();
