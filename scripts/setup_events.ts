import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
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

async function setupEvents() {
    try {
        console.log(`Checking if events collection exists in database: ${dbId}...`);

        let collectionExists = true;
        try {
            await databases.getCollection(dbId, 'events');
            console.log('Collection "events" already exists.');
        } catch (error: any) {
            if (error.code === 404) {
                collectionExists = false;
                console.log('Collection "events" not found. Creating it now...');
            } else {
                throw error;
            }
        }

        if (!collectionExists) {
            // Create Collection
            const collection = await databases.createCollection(
                dbId,
                'events', // Use 'events' as custom ID
                'Events'  // Collection Name
            );
            console.log(`Collection created with ID: ${collection.$id}`);

            // Add Attributes
            console.log('Adding attributes...');
            await databases.createStringAttribute(dbId, 'events', 'name', 255, true);
            await databases.createStringAttribute(dbId, 'events', 'whatsapp', 50, true);
            await databases.createStringAttribute(dbId, 'events', 'email', 255, true);
            await databases.createBooleanAttribute(dbId, 'events', 'gets_free_book', true);

            console.log('Attributes added successfully.');
            console.log('NOTE: It might take a few moments for the attributes to become fully available.');
        } else {
            console.log('Attributes check skipped as collection already exists. Ensure it has name, whatsapp, email (Strings) and gets_free_book (Boolean).');
        }

    } catch (error) {
        console.error('Error setting up events collection:', error);
    }
}

setupEvents();
