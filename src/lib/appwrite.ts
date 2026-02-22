import { Client, Account, Databases, Storage } from 'appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

console.log('APPWRITE CONFIG:', { endpoint, project });

if (!endpoint || !project) {
    console.warn('MISSING APPWRITE CONFIG PARAMS!');
}

export const client = new Client();

client
    .setEndpoint(endpoint || '')
    .setProject(project || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
