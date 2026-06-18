const { Client, Databases, Query } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function updateDB() {
    console.log('1. Updating Quiz Duration to 2 minutes...');
    const quizzes = await db.listDocuments(DB_ID, 'quizzes', [Query.limit(20)]);
    const targetQuiz = quizzes.documents.find(q => q.title.toLowerCase().includes('father'));

    if (targetQuiz) {
        await db.updateDocument(DB_ID, 'quizzes', targetQuiz.$id, { 
            duration: 120,
            description: targetQuiz.description.replace('1 minute', '2 minutes') 
        });
        console.log(`✅ Successfully updated duration to 120 seconds.`);
    }

    console.log('\n2. Adding phone_number attribute to Attempts collection...');
    try {
        await db.createStringAttribute(DB_ID, 'attempts', 'participant_phone', 20, false);
        console.log(`✅ Successfully initiated creation of participant_phone attribute.`);
    } catch (e) {
        console.log(`⚠️ Note on participant_phone: ${e.message}`);
    }
}

updateDB().catch(console.error);
