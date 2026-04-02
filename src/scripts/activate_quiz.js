const { Client, Databases, Query } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';
const QUIZ_ID = '69ce505a0029b9f932a2';

async function activateQuiz() {
    try {
        console.log('Activating Quiz and Updating Schema...');

        // 1. Ensure attributes exist
        const requiredAttributes = [
            { key: 'is_active', type: 'boolean', required: false, default: true },
            { key: 'question_count', type: 'integer', required: false, default: 0 }
        ];

        for (const attr of requiredAttributes) {
            try {
                console.log(`Checking attribute: ${attr.key}...`);
                if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(DB_ID, 'quizzes', attr.key, attr.required, attr.default);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DB_ID, 'quizzes', attr.key, attr.required, 0, 1000, attr.default);
                }
                console.log(`Attribute ${attr.key} created! Waiting for it to be ready...`);
                // Wait for attribute to be available
                let isAvailable = false;
                while (!isAvailable) {
                    const col = await databases.getCollection(DB_ID, 'quizzes');
                    const a = col.attributes.find(a => a.key === attr.key);
                    if (a && a.status === 'available') {
                        isAvailable = true;
                    } else {
                        process.stdout.write('.');
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }
                console.log(`\nAttribute ${attr.key} is now available!`);
            } catch (err) {
                if (err.code === 409) {
                    console.log(`Attribute ${attr.key} already exists.`);
                } else {
                    throw err;
                }
            }
        }

        // 2. Update the Quiz document
        console.log(`Setting Quiz ${QUIZ_ID} to active with 100 questions...`);
        await databases.updateDocument(DB_ID, 'quizzes', QUIZ_ID, {
            is_active: true,
            question_count: 100
        });

        console.log('Quiz activated successfully! Please refresh your website.');

    } catch (error) {
        console.error('Activation failed:', error);
    }
}

activateQuiz();
