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

async function checkCol() {
    try {
        console.log(`Checking Collection: attempts in Database: ${DB_ID}`);
        const col = await databases.getCollection(DB_ID, 'attempts');
        console.log(`Collection Found: ${col.name}`);
        console.log('--- Attributes Status ---');
        col.attributes.forEach(attr => {
            console.log(`- ${attr.key}: ${attr.status}`);
        });
        
        const nonAvailable = col.attributes.filter(a => a.status !== 'available');
        if (nonAvailable.length > 0) {
            console.log('\nWARNING: Some attributes are still processing! Wait 30 seconds.');
        } else {
            console.log('\nSUCCESS: All attributes are available. The collection should be working.');
        }
    } catch (error) {
        console.error('FAILED:', error.message);
    }
}

checkCol();
