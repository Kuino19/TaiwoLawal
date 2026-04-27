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

async function fixPrices() {
    const books = await databases.listDocuments(DB_ID, 'books');
    console.log(`Found ${books.total} books`);

    for (const book of books.documents) {
        if (book.price < 0) {
            console.log(`Fixing "${book.title}" price: ${book.price} → 0`);
            await databases.updateDocument(DB_ID, 'books', book.$id, { price: 0 });
            console.log(`  ✓ Fixed`);
        } else {
            console.log(`  OK: "${book.title}" ₦${book.price}`);
        }
    }

    console.log('\nDone!');
}

fixPrices().catch(console.error);
