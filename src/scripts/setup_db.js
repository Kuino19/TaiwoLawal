const { Client, Databases, Permission, Role } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DB_ID = 'main-db';
const COLLECTIONS = [
    {
        id: 'books',
        name: 'Books',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 5000, required: true },
            { key: 'price', type: 'double', required: true },
            { key: 'type', type: 'string', size: 50, required: true }, // 'digital' or 'physical'
            { key: 'image_url', type: 'string', size: 2000, required: false },
            { key: 'download_url', type: 'string', size: 2000, required: false },
        ],
        permissions: [
            Permission.read(Role.any()), // Public can view books
            Permission.write(Role.users()), // Authenticated users (admin) can write - simplistic, needs proper teams later
        ]
    },
    {
        id: 'quizzes',
        name: 'Quizzes',
        attributes: [
            { key: 'title', type: 'string', size: 255, required: true },
            { key: 'description', type: 'string', size: 1000, required: true },
            { key: 'duration', type: 'integer', required: true }, // in minutes
            { key: 'is_active', type: 'boolean', required: true, default: true },
        ],
        permissions: [
            Permission.read(Role.any()),
            Permission.write(Role.users()),
        ]
    },
    {
        id: 'questions',
        name: 'Questions',
        attributes: [
            { key: 'quiz_id', type: 'string', size: 50, required: true },
            { key: 'text', type: 'string', size: 1000, required: true },
            { key: 'options', type: 'string', size: 5000, required: true, array: true }, // Array of strings
            { key: 'correct_index', type: 'integer', required: true },
        ],
        permissions: [
            Permission.read(Role.any()),
            Permission.write(Role.users()),
        ]
    },
    {
        id: 'orders',
        name: 'Orders',
        attributes: [
            { key: 'user_email', type: 'string', size: 255, required: true },
            { key: 'items', type: 'string', size: 10000, required: true }, // JSON string
            { key: 'total_amount', type: 'double', required: true },
            { key: 'status', type: 'string', size: 50, required: true }, // 'pending', 'paid', 'failed'
            { key: 'payment_ref', type: 'string', size: 255, required: true },
        ],
        permissions: [
            Permission.read(Role.users()), // Users can read their orders (needs row level security really)
            Permission.write(Role.any()), // Public can create orders (initially)
        ]
    }
];

async function setupDatabase() {
    try {
        console.log('Checking database...');
        try {
            await databases.get(DB_ID);
            console.log(`Database ${DB_ID} exists.`);
        } catch (error) {
            console.log(`Creating database ${DB_ID}...`);
            await databases.create(DB_ID, 'Main Database');
        }

        for (const col of COLLECTIONS) {
            try {
                console.log(`Checking collection ${col.name}...`);
                await databases.getCollection(DB_ID, col.id);
                console.log(`Collection ${col.name} exists.`);
            } catch (error) {
                console.log(`Creating collection ${col.name}...`);
                await databases.createCollection(DB_ID, col.id, col.name, col.permissions);

                // Create attributes
                console.log(`Creating attributes for ${col.name}...`);
                for (const attr of col.attributes) {
                    try {
                        if (attr.type === 'string') {
                            await databases.createStringAttribute(DB_ID, col.id, attr.key, attr.size, attr.required, attr.default, attr.array);
                        } else if (attr.type === 'integer') {
                            await databases.createIntegerAttribute(DB_ID, col.id, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
                        } else if (attr.type === 'double') {
                            await databases.createFloatAttribute(DB_ID, col.id, attr.key, attr.required, attr.min, attr.max, attr.default, attr.array);
                        } else if (attr.type === 'boolean') {
                            await databases.createBooleanAttribute(DB_ID, col.id, attr.key, attr.required, attr.default, attr.array);
                        }
                        // Add delay to avoid rate limits
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } catch (attrError) {
                        console.log(`Attribute ${attr.key} already exists or failed:`, attrError.message);
                    }
                }
            }
        }

        console.log('Database setup complete!');
    } catch (error) {
        console.error('Database setup failed:', error);
    }
}

setupDatabase();
