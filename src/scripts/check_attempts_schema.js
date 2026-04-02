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

async function checkSchema() {
    try {
        console.log('--- CHECKING ATTEMPTS SCHEMA ---');
        const collection = await databases.getCollection(DB_ID, 'attempts');
        console.log(`Collection: ${collection.name} (ID: ${collection.$id})`);
        console.log('Attributes:');
        collection.attributes.forEach(attr => {
            console.log(`- ${attr.key} (${attr.type}, required: ${attr.required})`);
        });
    } catch (error) {
        console.error('Failed to get collection:', error.message);
    }
}

checkSchema();
