const { Client, Databases } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function listDatabases() {
    try {
        console.log('Fetching all databases for project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
        const res = await databases.list();
        console.log(`Found ${res.total} Databases.`);
        res.databases.forEach(db => {
            console.log(`- NAME: ${db.name}, ID: ${db.$id}`);
        });
    } catch (error) {
        console.error('List failed:', error);
    }
}

listDatabases();
