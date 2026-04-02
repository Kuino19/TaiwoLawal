const { Client, Databases, Query } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

// IMPORTANT: We do NOT set the API Key here to simulate a PUBLIC user
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function testPublic() {
    try {
        console.log('--- PUBLIC ACCESS TEST ---');
        console.log('Project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
        console.log('Database:', DB_ID);
        
        const res = await databases.listDocuments(DB_ID, 'quizzes', [
            Query.equal('is_active', true)
        ]);
        
        console.log(`Publicly visible quizzes: ${res.total}`);
        res.documents.forEach(doc => {
            console.log(`- ${doc.title} (ID: ${doc.$id})`);
        });

        if (res.total === 0) {
            console.log('WARNING: Quiz exists in DB but is HIDDEN from public view. Check Document Permissions.');
        } else {
            console.log('SUCCESS: Quiz is publicly visible. If the website is blank, it is likely a CACHE issue.');
        }
    } catch (error) {
        console.error('Public access check failed:', error.message);
    }
}

testPublic();
