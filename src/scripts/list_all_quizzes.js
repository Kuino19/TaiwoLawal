const { Client, Databases } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function list() {
    try {
        const res = await databases.listDocuments('main-db', 'quizzes');
        console.log(`Found ${res.total} quizzes:`);
        for (const doc of res.documents) {
            console.log(`- [${doc.$id}] ${doc.title} (${doc.question_count || 0} questions, active: ${doc.is_active})`);
        }
    } catch (e) {
        console.error('Error listing quizzes:', e);
    }
}

list();
