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

async function listQuizzes() {
    try {
        console.log(`Checking Database: ${DB_ID}`);
        const res = await databases.listDocuments(DB_ID, 'quizzes');
        console.log(`Found ${res.total} quizzes.`);
        res.documents.forEach(doc => {
            console.log(`- ID: ${doc.$id}, Title: ${doc.title}, Active: ${doc.is_active}, QCount: ${doc.question_count}`);
        });
    } catch (error) {
        console.error('List failed:', error);
    }
}

listQuizzes();
