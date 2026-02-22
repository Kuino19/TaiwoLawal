const { Client, Storage, Permission, Role } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

async function setupStorage() {
    const buckets = [
        { id: 'book-covers', name: 'Book Covers' },
        { id: 'book-files', name: 'Book Files' }
    ];

    for (const b of buckets) {
        try {
            console.log(`Checking bucket ${b.name}...`);
            await storage.getBucket(b.id);
            console.log(`Bucket ${b.name} already exists.`);
        } catch (error) {
            console.log(`Creating bucket ${b.name}...`);
            await storage.createBucket(
                b.id,
                b.name,
                [
                    Permission.read(Role.any()), // Public read
                    Permission.write(Role.users()), // Authenticated users write
                ]
            );
            console.log(`Bucket ${b.name} created successfully.`);
        }
    }
}

setupStorage();
