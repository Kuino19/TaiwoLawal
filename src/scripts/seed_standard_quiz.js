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
        console.log('Seeding Foursquare Idimu: Standard of Attainment quiz to Appwrite...');

        // 1. Create Quiz document
        const quiz = await databases.createDocument(
            DB_ID,
            'quizzes',
            ID.unique(),
            {
                title: 'Foursquare Idimu: Standard of Attainment',
                description: 'Official competition practice quiz based on the Standard of Attainment catechism, covering Creation, Nature of God, Salvation, Evangelism, and Sacraments.',
                duration: 45,
                is_active: true,
                question_count: 45,
            }
        );

        console.log(`Created Quiz: ${quiz.title} (${quiz.$id})`);

        // 2. Load questions
        const questions = JSON.parse(
            fs.readFileSync(path.join(__dirname, '../data/standard_of_attainment.json'), 'utf8')
        );

        console.log(`Uploading ${questions.length} questions...`);

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            await databases.createDocument(
                DB_ID,
                'questions',
                ID.unique(),
                {
                    quiz_id: quiz.$id,
                    text: q.question,
                    options: q.options,
                    correct_index: q.correct_index,
                }
            );
            if ((i + 1) % 10 === 0 || i === questions.length - 1) {
                console.log(`Uploaded ${i + 1} / ${questions.length} questions...`);
            }
            // Small delay to prevent Appwrite rate limits
            await new Promise(r => setTimeout(r, 80));
        }

        console.log('Finished seeding Standard of Attainment quiz!');
        console.log(`Quiz ID: ${quiz.$id}`);
    } catch (e) {
        console.error('Seed error:', e);
    }
}

seed();
