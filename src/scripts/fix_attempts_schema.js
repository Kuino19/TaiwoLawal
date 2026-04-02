const { Client, Databases, ID } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';
const COL_ID = 'attempts';

const requiredAttributes = [
    { key: 'quiz_id', type: 'string', size: 50, required: true },
    { key: 'quiz_title', type: 'string', size: 255, required: true },
    { key: 'participant_name', type: 'string', size: 255, required: true },
    { key: 'score', type: 'integer', required: true },
    { key: 'total', type: 'integer', required: true },
    { key: 'percentage', type: 'integer', required: true },
    { key: 'user_answers', type: 'string', size: 5000, required: false },
];

async function fixSchema() {
    try {
        console.log(`--- FIXING ATTEMPTS SCHEMA IN ${DB_ID} ---`);
        
        // 1. Ensure collection exists
        try {
            await databases.getCollection(DB_ID, COL_ID);
            console.log(`Collection ${COL_ID} exists.`);
        } catch (error) {
            console.log(`Collection ${COL_ID} does not exist. Creating...`);
            await databases.createCollection(DB_ID, COL_ID, 'Attempts');
            console.log(`Collection ${COL_ID} created!`);
        }

        // 2. Add missing attributes
        for (const attr of requiredAttributes) {
            try {
                console.log(`Checking attribute: ${attr.key}...`);
                if (attr.type === 'string') {
                    await databases.createStringAttribute(DB_ID, COL_ID, attr.key, attr.size, attr.required);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DB_ID, COL_ID, attr.key, attr.required);
                }
                console.log(`- Created attribute ${attr.key}. Waiting for availability...`);
                
                // Wait for the attribute to be available
                let isReady = false;
                while (!isReady) {
                    const col = await databases.getCollection(DB_ID, COL_ID);
                    const found = col.attributes.find(a => a.key === attr.key);
                    if (found && found.status === 'available') {
                        isReady = true;
                    } else {
                        process.stdout.write('.');
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }
                console.log(`\n- Attribute ${attr.key} is now available!`);
            } catch (err) {
                if (err.code === 409) {
                    console.log(`- Attribute ${attr.key} already exists.`);
                } else {
                    console.error(`- Error creating ${attr.key}:`, err.message);
                }
            }
        }

        console.log('--- SCHEMA FIX COMPLETE ---');
    } catch (error) {
        console.error('Schema fix failed:', error);
    }
}

fixSchema();
