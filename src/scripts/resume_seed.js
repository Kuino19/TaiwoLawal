const { Client, Databases, ID, Query } = require('node-appwrite');
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
const QUIZ_ID = '69ce505a0029b9f932a2'; // The ID already created in your console

async function resumeSeed() {
    try {
        console.log(`Resuming seed for Quiz ID: ${QUIZ_ID}...`);
        
        // 1. Get existing questions to avoid duplicates
        const existing = await databases.listDocuments(DB_ID, 'questions', [
            Query.equal('quiz_id', QUIZ_ID),
            Query.limit(100)
        ]);
        const existingTexts = new Set(existing.documents.map(d => d.text));
        console.log(`Found ${existingTexts.size} questions already in database.`);

        // 2. Load all questions
        const p1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/numbers_quiz_bank_p1.json'), 'utf8'));
        const p2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/numbers_quiz_bank_p2.json'), 'utf8'));
        const allQuestions = [...p1, ...p2];

        // 3. Filter and upload missing ones
        const missing = allQuestions.filter(q => !existingTexts.has(q.text));
        console.log(`Uploading ${missing.length} remaining questions...`);

        for (const q of missing) {
            try {
                await databases.createDocument(DB_ID, 'questions', ID.unique(), {
                    quiz_id: QUIZ_ID,
                    text: q.text,
                    options: q.options,
                    correct_index: q.correct_index
                });
                process.stdout.write('.'); // Progress indicator
                await new Promise(r => setTimeout(r, 250)); // Slower pace to avoid ECONNRESET
            } catch (err) {
                console.error(`\nFailed to upload: ${q.text.substring(0, 30)}...`);
            }
        }

        console.log('\nSeeding complete! All 100 questions should now be present.');

    } catch (error) {
        console.error('Resume failed:', error);
    }
}

resumeSeed();
