const { Client, Databases, ID, Query, Permission, Role } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function freshSeed() {
    try {
        console.log('--- RELIABLE QUIZ SEEDING START ---');

        // 1. Identify the correct Database ID
        console.log('Identifying database...');
        const dbsList = await databases.list();
        let dbId = 'main-db'; // Default fallback
        
        // Use the ID from your console (matches Name: main-db)
        if (dbsList.databases.length > 0) {
            const mainDb = dbsList.databases.find(db => db.name === 'main-db' || db.$id === 'main-db');
            if (mainDb) {
                dbId = mainDb.$id;
                console.log(`Found database: ${mainDb.name} with ID: ${dbId}`);
            } else {
                dbId = dbsList.databases[0].$id;
                console.log(`Using first available database ID: ${dbId}`);
            }
        }

        // 2. Ensure Quizzes schema is ready
        console.log('Ensuring schema is ready...');
        const requiredAttributes = [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 1000, required: true },
            { key: 'duration', type: 'integer', required: false, default: 20 },
            { key: 'is_active', type: 'boolean', required: false, default: true },
            { key: 'question_count', type: 'integer', required: false, default: 0 }
        ];

        for (const attr of requiredAttributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, 'quizzes', attr.key, attr.size, attr.required);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, 'quizzes', attr.key, attr.required, 0, 1000, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(dbId, 'quizzes', attr.key, attr.required, attr.default);
                }
                console.log(`Attribute ${attr.key} created!`);
                await new Promise(r => setTimeout(r, 2000)); // Brief pause for processing
            } catch (err) {
                if (err.code !== 409) console.log(`Note: ${attr.key} skipped (${err.message})`);
            }
        }

        // Wait until all are available
        console.log('Waiting for attributes to be ready...');
        let allReady = false;
        while (!allReady) {
            const col = await databases.getCollection(dbId, 'quizzes');
            allReady = col.attributes.every(a => a.status === 'available');
            if (!allReady) {
                process.stdout.write('.');
                await new Promise(r => setTimeout(r, 2000));
            }
        }
        console.log('\nSchema is available!');

        // 3. Cleanup existing "Numbers" quizzes to avoid mess
        console.log('Cleaning up old Numbers quizzes...');
        const existingQuizzes = await databases.listDocuments(dbId, 'quizzes', [
            Query.equal('title', 'Numbers Chapters 1-15')
        ]);
        for (const old of existingQuizzes.documents) {
            console.log(`Deleting old quiz: ${old.$id}`);
            await databases.deleteDocument(dbId, 'quizzes', old.$id);
        }

        // 4. Create NEW Quiz
        console.log('Creating fresh quiz document...');
        const quiz = await databases.createDocument(
            dbId,
            'quizzes',
            ID.unique(),
            {
                title: 'Numbers Chapters 1-15',
                description: 'A comprehensive quiz covering Numbers 1-15.',
                duration: 20,
                is_active: true,
                question_count: 100
            },
            [
                Permission.read(Role.any()), // Public READ
                Permission.write(Role.users()) // Admin WRITE (simplified)
            ]
        );
        console.log(`NEW Quiz Created: ${quiz.$id}`);

        // 5. Seed questions
        console.log('Seeding 100 questions...');
        const p1 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/numbers_quiz_bank_p1.json'), 'utf8'));
        const p2 = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/numbers_quiz_bank_p2.json'), 'utf8'));
        const allQuestions = [...p1, ...p2];

        for (let i = 0; i < allQuestions.length; i++) {
            const q = allQuestions[i];
            let success = false;
            let retries = 3;

            while (!success && retries > 0) {
                try {
                    await databases.createDocument(dbId, 'questions', ID.unique(), {
                        quiz_id: quiz.$id,
                        text: q.text,
                        options: q.options,
                        correct_index: q.correct_index
                    }, [
                        Permission.read(Role.any())
                    ]);
                    success = true;
                    process.stdout.write('.');
                } catch (err) {
                    retries--;
                    console.log(`\nRetrying question ${i + 1} (${retries} left) due to: ${err.message}`);
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
            if (!success) console.log(`\nFailed to upload question: ${q.text.substring(0, 30)}`);
            
            // Deliberate pause to prevent rate limiting/SSL issues
            await new Promise(r => setTimeout(r, 400));
        }

        console.log('\n--- SUCCESS! RELIABLE SEED COMPLETE ---');
        console.log(`Quiz ID: ${quiz.$id}`);
        console.log('Please refresh Localhouse and Vercel.');

    } catch (error) {
        console.error('Fresh seed failed:', error);
    }
}

freshSeed();
