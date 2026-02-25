'use server';

import { ID } from 'node-appwrite';
import { adminDatabases } from '@/lib/server/appwrite';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';
const EVENTS_COLLECTION_ID = 'events';

export async function registerForEventAction(formData: FormData) {
    const name = formData.get('name') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const email = formData.get('email') as string;

    if (!name || !whatsapp || !email) {
        throw new Error('Required fields missing');
    }

    try {
        // 1. Check current number of registrations to determine free book status
        let getsFreeBook = false;

        const response = await adminDatabases.listDocuments(
            DB_ID,
            EVENTS_COLLECTION_ID,
            [] // fetch all to count, or we could use Appwrite queries to just count
        );

        const totalRegistrations = response.total;

        if (totalRegistrations < 50) {
            getsFreeBook = true;
        }

        // 2. Save the registration
        const newEvent = await adminDatabases.createDocument(
            DB_ID,
            EVENTS_COLLECTION_ID,
            ID.unique(),
            {
                name,
                whatsapp,
                email,
                gets_free_book: getsFreeBook,
            }
        );

        return {
            success: true,
            getsFreeBook,
            message: getsFreeBook
                ? "Congratulations! You are one of the first 50 people to register and will receive the new book for free!"
                : "Thank you for registering! The first 50 free books have been claimed, but we'll be in touch."
        };

    } catch (error: any) {
        console.error('--- EVENT REGISTRATION FAILURE ---');
        console.error('Error Code:', error.code);
        console.error('Error Type:', error.type);
        console.error('Error Message:', error.message);
        console.error('---------------------------------');

        throw new Error(error.message || 'Failed to register for the event. Please try again later.');
    }
}
