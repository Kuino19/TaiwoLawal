import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

const DATABASE_ID = 'main-db';
const QUESTIONS_COLLECTION_ID = 'questions';

async function removeReflectionQuestions() {
    try {
        console.log('Fetching questions to delete...');
        const response = await databases.listDocuments(
            DATABASE_ID,
            QUESTIONS_COLLECTION_ID,
            [
                Query.equal('correct_index', -1),
                Query.limit(100)
            ]
        );

        console.log(`Found ${response.documents.length} reflection questions.`);

        for (const doc of response.documents) {
            console.log(`Deleting question: ${doc.text.substring(0, 50)}...`);
            await databases.deleteDocument(
                DATABASE_ID,
                QUESTIONS_COLLECTION_ID,
                doc.$id
            );
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
}

removeReflectionQuestions();
