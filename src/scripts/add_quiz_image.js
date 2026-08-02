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

async function main() {
    try {
        console.log('Creating image_url attribute on quizzes...');
        await db.createStringAttribute(DB_ID, 'quizzes', 'image_url', 1000, false);
        console.log('✅ Created image_url attribute');
    } catch (e) {
        console.log(`⚠️ Attribute exists or error: ${e.message}`);
    }

    // Wait a couple of seconds for attribute to be available
    await new Promise(r => setTimeout(r, 2000));

    try {
        console.log('Looking for Finding Rest quiz...');
        const quizzes = await db.listDocuments(DB_ID, 'quizzes', [Query.limit(20)]);
        const targetQuiz = quizzes.documents.find(q => q.title.includes('Finding Rest'));
        
        if (targetQuiz) {
            await db.updateDocument(DB_ID, 'quizzes', targetQuiz.$id, {
                image_url: '/finding-rest.jpg'
            });
            console.log(`✅ Updated quiz "${targetQuiz.title}" with image_url`);
        } else {
            console.log('❌ Quiz not found');
        }
    } catch (e) {
        console.log(`❌ Update error: ${e.message}`);
    }
}

main().catch(console.error);
