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

async function updateDuration() {
    try {
        console.log('Finding quiz "Numbers Chapters 1-15"...');
        const res = await databases.listDocuments(DB_ID, 'quizzes', [
            Query.equal('title', 'Numbers Chapters 1-15')
        ]);

        if (res.total === 0) {
            console.log('Quiz not found.');
            return;
        }

        const quiz = res.documents[0];
        console.log(`Updating quiz ${quiz.$id} duration to 10 minutes...`);
        
        await databases.updateDocument(DB_ID, 'quizzes', quiz.$id, {
            duration: 10
        });

        console.log('Success! Timer is now 10 minutes.');
    } catch (error) {
        console.error('Failed to update duration:', error.message);
    }
}

updateDuration();
