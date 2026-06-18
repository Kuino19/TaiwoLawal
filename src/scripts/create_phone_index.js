const { Client, Databases } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

async function createIndex() {
    console.log('Creating index for participant_phone...');
    try {
        await db.createIndex(DB_ID, 'attempts', 'phone_index', 'key', ['participant_phone']);
        console.log('✅ Index created!');
    } catch (e) {
        console.log(`⚠️ Note: ${e.message}`);
    }
}

createIndex().catch(console.error);
