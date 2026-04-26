const { Client, Databases } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function renameQuiz() {
    try {
        const quizId = '69ea7262000f9746f58a';
        console.log(`Updating quiz ${quizId} title to 'General Foursquare Knowledge'...`);
        
        await databases.updateDocument(DB_ID, 'quizzes', quizId, {
            title: 'General Foursquare Knowledge'
        });

        console.log('Success! Quiz renamed.');
    } catch (error) {
        console.error('Failed to update title:', error.message);
    }
}

renameQuiz();
