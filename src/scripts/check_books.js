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

async function diagnose() {
    console.log('\n=== APPWRITE DIAGNOSTICS ===');
    console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
    console.log('Project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    console.log('Database:', DB_ID);

    // 1. List all collections
    console.log('\n--- Collections ---');
    try {
        const cols = await databases.listCollections(DB_ID);
        cols.collections.forEach(c => console.log(`  [${c.$id}] "${c.name}"`));
    } catch (e) {
        console.error('Failed to list collections:', e.message);
    }

    // 2. Try to read from 'books' collection
    console.log('\n--- Books in "books" collection ---');
    try {
        const books = await databases.listDocuments(DB_ID, 'books');
        console.log(`  Found ${books.total} books`);
        books.documents.forEach(b => console.log(`  - [${b.$id}] ${b.title} (₦${b.price})`));
    } catch (e) {
        console.error('  Error reading "books":', e.message);
    }

    // 3. Try to read from 'questions' collection (might be where books are)
    console.log('\n--- Documents in "questions" collection ---');
    try {
        const docs = await databases.listDocuments(DB_ID, 'questions');
        console.log(`  Found ${docs.total} documents`);
        docs.documents.slice(0, 5).forEach(d => console.log(`  - [${d.$id}]`, JSON.stringify(d).slice(0, 120)));
    } catch (e) {
        console.error('  Error reading "questions":', e.message);
    }
}

diagnose();
