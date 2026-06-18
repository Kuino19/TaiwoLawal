/**
 * migrate_standard_of_attainment.js
 *
 * 1. Creates a new "Standard of Attainment" quiz
 * 2. Finds the 41 questions that were accidentally added to the Foursquare quiz
 * 3. Moves them to the new quiz by updating their quiz_id
 *
 * Run: node src/scripts/migrate_standard_of_attainment.js
 */

const { Client, Databases, ID, Query } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

// The exact text of every question we want to move
const STANDARD_QUESTION_TEXTS = new Set([
    "Who made the world and everything in the world?",
    "How did God create all things?",
    "In how many days did the Creation take place?",
    "How was man's body made?",
    "How was man's soul given to him?",
    "What separated Adam and Eve from God?",
    "What can people do so they will not be separated from God?",
    "Who tempted Adam and Eve to disobey God?",
    "Has anyone else besides Adam and Eve disobeyed God?",
    "What scripture says 'For all have sinned and come short of the glory of God'?",
    "What is the first verse of the Bible?",
    "What person is introduced in the first verse of the Bible?",
    "Who is God?",
    "Where is God?",
    "What does God know?",
    "What scripture says God understands our thoughts even from afar?",
    "What can God do?",
    "What scripture asks 'Is there anything too hard for me?'",
    "How long has God lived?",
    "Is God good?",
    "Which scripture is quoted about God being 'merciful and gracious, long suffering, and abundant in goodness and truth'?",
    "Does God ever change?",
    "Which scripture says 'For I am the Lord, I change not'?",
    "Is there more than one God?",
    "What scripture declares 'the Lord is God, and that there is none else'?",
    "Can we see God?",
    "Which scripture says 'No man hath seen God at any time'?",
    "What have we learned about the personality of God?",
    "What is a spirit?",
    "How do we know that God lives?",
    "Which scripture says 'The heavens declare the glory of God; and the firmament showeth his handiwork'?",
    "What is another name for God?",
    "What word do we use to express the fact that the Father, the Son, and the Holy Spirit are one God?",
    "How do we know what God is like?",
    "Who does God love?",
    "How should we act toward God?",
    "Which scripture says 'Let us have grace, whereby we may serve God acceptably with reverence and godly fear'?",
    "What Bible verse expresses God's love for everyone?",
    "Complete John 3:16: 'For God so loved the world that He gave His only begotten Son, that whosoever believeth in Him should not perish but...'",
    "Why should we love God?",
    "Which scripture says 'We love Him because He first loved us'?",
]);

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAllQuestions(quizId) {
    const all = [];
    let cursor = null;
    while (true) {
        const queries = [Query.equal('quiz_id', quizId), Query.limit(100)];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const res = await db.listDocuments(DB_ID, 'questions', queries);
        all.push(...res.documents);
        if (res.documents.length < 100) break;
        cursor = res.documents[res.documents.length - 1].$id;
    }
    return all;
}

async function main() {
    console.log('🚀 Starting migration...');

    // 1. Find the Foursquare quiz
    console.log('🔍 Finding "General Foursquare Knowledge" quiz...');
    const quizzes = await db.listDocuments(DB_ID, 'quizzes', [Query.limit(20)]);
    const foursquareQuiz = quizzes.documents.find(q =>
        q.title.toLowerCase().includes('foursquare')
    );
    if (!foursquareQuiz) {
        console.error('❌ Foursquare quiz not found. Quizzes available:');
        quizzes.documents.forEach(q => console.log(`  - "${q.title}"`));
        return;
    }
    console.log(`✅ Foursquare quiz: "${foursquareQuiz.title}" (${foursquareQuiz.$id})`);

    // 2. Create the new Standard of Attainment quiz
    console.log('\n📋 Creating "Standard of Attainment" quiz...');
    const newQuiz = await db.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title: 'Standard of Attainment',
        description: 'Test your knowledge of the Foursquare Standard of Attainment — covering Creation, The Fall of Man, and the nature of God. Each session draws 30 questions. 15 minutes.',
        duration: 900,
        is_active: true,
        question_count: 30,
    });
    console.log(`✅ New quiz created: "${newQuiz.title}" (${newQuiz.$id})`);

    // 3. Fetch all questions in the Foursquare quiz
    console.log('\n🔍 Fetching all questions from the Foursquare quiz...');
    const allFoursquareQuestions = await getAllQuestions(foursquareQuiz.$id);
    console.log(`   Total questions found: ${allFoursquareQuestions.length}`);

    // 4. Filter to only the Standard of Attainment ones
    const toMove = allFoursquareQuestions.filter(q =>
        STANDARD_QUESTION_TEXTS.has(q.text)
    );
    console.log(`   Questions to move: ${toMove.length}`);

    if (toMove.length === 0) {
        console.warn('⚠️  No matching questions found. Check that the text matches exactly.');
        return;
    }

    // 5. Update each question's quiz_id
    console.log('\n🔄 Moving questions to the new quiz...');
    let moved = 0;
    for (const q of toMove) {
        await db.updateDocument(DB_ID, 'questions', q.$id, {
            quiz_id: newQuiz.$id,
        });
        moved++;
        process.stdout.write(`\r   Moved: ${moved}/${toMove.length}`);
        await delay(120);
    }

    console.log(`\n\n✅ Migration complete!`);
    console.log(`   Questions moved: ${moved}/${toMove.length}`);
    console.log(`\n   Standard of Attainment Quiz ID: ${newQuiz.$id}`);
    console.log(`   General Foursquare Knowledge Quiz ID: ${foursquareQuiz.$id}`);
    console.log('\n   Both quizzes are now active on your site.');
}

main().catch(console.error);
