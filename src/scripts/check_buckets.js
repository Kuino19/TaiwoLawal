const { Client, Storage } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

async function checkBuckets() {
    try {
        const buckets = await storage.listBuckets();
        console.log('Buckets found:', JSON.stringify(buckets.buckets, null, 2));
    } catch (error) {
        console.error('Failed to list buckets:', error.message);
    }
}

checkBuckets();
