const { Client, Databases } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function scan() {
    try {
        console.log('--- GLOBAL DATABASE SCAN ---');
        console.log('Project:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
        
        const dbsList = await databases.list();
        console.log(`Found ${dbsList.total} Databases.`);
        
        for (const db of dbsList.databases) {
            console.log(`\nScanning DB: ${db.name} (ID: ${db.$id})`);
            try {
                const cols = await databases.listCollections(db.$id);
                console.log(`- Found ${cols.total} collections:`);
                cols.collections.forEach(c => {
                    console.log(`  - ${c.name} (ID: ${c.$id})`);
                });
            } catch (e) {
                console.log(`  - Failed to list collections: ${e.message}`);
            }
        }
    } catch (error) {
        console.error('Scan failed:', error.message);
    }
}

scan();
