'use server';

import { ID } from 'node-appwrite';
import { adminDatabases, adminStorage } from '@/lib/server/appwrite';
import { redirect } from 'next/navigation';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '699b30ce001bfec8ad88'; // Single bucket for all book-related files

export async function createBookAction(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const type = formData.get('type') as string;

    // Files from the form
    const coverFile = formData.get('cover-image') as File;
    const bookFile = formData.get('book-file') as File;

    if (!title || !description || !price || !type) {
        throw new Error('Required fields missing');
    }

    try {
        let imageUrl = '';
        let downloadUrl = '';

        // 1. Upload Cover Image if present
        if (coverFile && coverFile.size > 0) {
            const uploadedCover = await adminStorage.createFile(
                BUCKET_ID,
                ID.unique(),
                coverFile
            );
            // Public viewing URL for the image
            imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedCover.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        }

        // 2. Upload Digital Book File if present
        if (type === 'digital' && bookFile && bookFile.size > 0) {
            const uploadedFile = await adminStorage.createFile(
                BUCKET_ID,
                ID.unique(),
                bookFile
            );
            // Download URL for the file
            downloadUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
        }

        // 3. Create Document in Database
        await adminDatabases.createDocument(
            DB_ID,
            'books',
            ID.unique(),
            {
                title,
                description,
                price: Number(price),
                type,
                image_url: imageUrl,
                download_url: downloadUrl,
            }
        );
    } catch (error: any) {
        console.error('--- BOOK CREATION FAILURE ---');
        console.error('Error Code:', error.code);
        console.error('Error Type:', error.type);
        console.error('Error Message:', error.message);
        console.error('Stack Trace:', error.stack);
        console.error('Env Check:', {
            endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
            project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
            db: DB_ID,
            bucket: BUCKET_ID
        });
        console.error('-----------------------------');

        throw new Error(error.message || 'Failed to create book and upload files');
    }

    redirect('/admin/books');
}

export async function deleteBookAction(bookId: string) {
    try {
        await adminDatabases.deleteDocument(DB_ID, 'books', bookId);
    } catch (error) {
        console.error('Failed to delete book:', error);
        throw new Error('Failed to delete book');
    }
}
