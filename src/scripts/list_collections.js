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

async function listCols() {
    try {
        console.log(`Checking Database: ${DB_ID}`);
        const res = await databases.listCollections(DB_ID);
        console.log(`Found ${res.total} collections:`);
        res.collections.forEach(c => {
            console.log(`- ${c.name} (ID: ${c.$id})`);
        });
    } catch (error) {
        console.error('Failed to list collections:', error.message);
    }
}

listCols();
