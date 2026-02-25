import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

if (!endpoint || !project || !apiKey) {
    console.error('Missing required environment variables. Please check .env.local');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(apiKey);

const databases = new Databases(client);

async function updateEvents() {
    try {
        console.log('Adding new attributes (district, zone, church)...');

        try { await databases.createStringAttribute(dbId, 'events', 'district', 255, true); console.log('Added district'); } catch (e: any) { console.log('district already exists or error:', e.message); }
        // Appwrite requires a short delay between attribute creations sometimes, but lets try parallel/sequential.
        await new Promise(r => setTimeout(r, 1000));
        try { await databases.createStringAttribute(dbId, 'events', 'zone', 255, true); console.log('Added zone'); } catch (e: any) { console.log('zone already exists or error:', e.message); }
        await new Promise(r => setTimeout(r, 1000));
        try { await databases.createStringAttribute(dbId, 'events', 'church', 255, true); console.log('Added church'); } catch (e: any) { console.log('church already exists or error:', e.message); }

        console.log('Finished adding attributes.');
    } catch (error) {
        console.error('Error updating events collection:', error);
    }
}

updateEvents();
