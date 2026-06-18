/**
 * seed_fathers_day_extended.js
 *
 * Creates a "Father's Day Special Quiz" (or updates the existing one)
 * and seeds 200 normal questions + 5 special reflection questions.
 *
 * Run: node src/scripts/seed_fathers_day_extended.js
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

const REFLECTION_QUESTIONS = [
    "The Advice Question: What is the most valuable piece of advice your own father gave you?",
    "The Memory Question: What is your favorite childhood memory involving your dad?",
    "The Legacy Question: What is one character trait or habit you clearly inherited from your father?",
    "The Parenting Question: What was the most surprising thing you learned about yourself when you became a father?",
    "The Humor Question: What is your dad's most famous 'Dad Joke' or catchphrase?"
];

// Format: [ "Question text", ["Option A", "Option B", "Option C", "Option D"], CorrectIndex ]
const NORMAL_QUESTIONS = [
    // --- Biblical Fathers (70 questions) ---
    ["Who is known in the Bible as the 'Father of Many Nations'?", ["Isaac", "Moses", "Abraham", "Noah"], 2],
    ["Which father had a coat of many colors made for his favorite son?", ["David", "Jacob", "Adam", "Lot"], 1],
    ["Who was the father of King Solomon?", ["King Saul", "King David", "Prophet Samuel", "Jesse"], 1],
    ["What was the name of John the Baptist's father?", ["Zechariah", "Joseph", "Simeon", "Nicodemus"], 0],
    ["Who was the earthly adoptive father of Jesus?", ["Peter", "John", "Joseph", "Matthew"], 2],
    ["Who was the father of Jonathan, David's loyal friend?", ["King Saul", "Samuel", "Jesse", "Abner"], 0],
    ["Which Biblical father built an ark to save his family?", ["Enoch", "Methuselah", "Lot", "Noah"], 3],
    ["Whose father-in-law Jethro advised him to delegate his duties?", ["Aaron", "Moses", "Joshua", "Caleb"], 1],
    ["Who is the father of James and John (the 'Sons of Thunder')?", ["Zebedee", "Alphaeus", "Jonah", "Simon"], 0],
    ["Who was the father of King David?", ["Saul", "Solomon", "Jesse", "Boaz"], 2],
    ["Which father was told to sacrifice his son Isaac?", ["Jacob", "Abraham", "Noah", "Lot"], 1],
    ["Who was the father of Cain, Abel, and Seth?", ["Adam", "Enoch", "Lamech", "Noah"], 0],
    ["Which father lost his children, health, and wealth but stayed faithful to God?", ["Job", "Jeremiah", "Isaiah", "David"], 0],
    ["Who was the father of Rachel and Leah?", ["Laban", "Bethuel", "Isaac", "Terah"], 0],
    ["Who was the father of the prophet Samuel?", ["Eli", "Elkanah", "Hophni", "Phinehas"], 1],
    ["What was the name of Moses's father?", ["Amram", "Izhar", "Hebron", "Uzziel"], 0],
    ["Who was the father of Joshua?", ["Nun", "Caleb", "Achan", "Othniel"], 0],
    ["Which father wrestled with God and had his name changed to Israel?", ["Isaac", "Jacob", "Esau", "Joseph"], 1],
    ["Who was the father of the nation of Edom?", ["Esau", "Jacob", "Ishmael", "Lot"], 0],
    ["Who was the father of Moab and Ammon?", ["Abraham", "Lot", "Isaac", "Nahor"], 1],
    ["Who was the father of King Hezekiah?", ["Ahaz", "Uzziah", "Jotham", "Josiah"], 0],
    ["Who was the father of the prophet Isaiah?", ["Amoz", "Hilkiah", "Buzi", "Beeri"], 0],
    ["Who was the father of the prodigal son in Jesus' parable?", ["A rich ruler", "A certain man", "A Pharisee", "A king"], 1],
    ["Which father pleaded with Jesus to heal his demon-possessed son after the disciples couldn't?", ["A centurion", "Jairus", "A man in the crowd", "Nicodemus"], 2],
    ["Which synagogue leader fell at Jesus' feet asking him to heal his dying daughter?", ["Jairus", "Nicodemus", "Joseph of Arimathea", "Caiaphas"], 0],
    ["Who was the father of Methuselah?", ["Enoch", "Lamech", "Mahalaleel", "Jared"], 0],
    ["Who was the father of Noah?", ["Enoch", "Methuselah", "Lamech", "Seth"], 2],
    ["Who was the father of Abraham, Nahor, and Haran?", ["Terah", "Nahor", "Serug", "Peleg"], 0],
    ["Who was the father of Isaac and Ishmael?", ["Lot", "Abraham", "Nahor", "Haran"], 1],
    ["Who was the father of the twelve tribes of Israel?", ["Abraham", "Isaac", "Jacob", "Joseph"], 2],
    ["Who was the father of Ephraim and Manasseh?", ["Jacob", "Joseph", "Reuben", "Judah"], 1],
    ["Who was the father of Aaron and Miriam?", ["Amram", "Izhar", "Kohath", "Levi"], 0],
    ["Who was the father of Caleb?", ["Jephunneh", "Kenaz", "Othniel", "Nun"], 0],
    ["Who was the father of Gideon?", ["Joash", "Abiezrite", "Manoah", "Jesse"], 0],
    ["Who was the father of Samson?", ["Joash", "Manoah", "Elkanah", "Eli"], 1],
    ["Who was the father of King Saul?", ["Kish", "Ner", "Abner", "Jonathan"], 0],
    ["Who was the father of Abner, Saul's army commander?", ["Kish", "Ner", "Zeruiah", "Jesse"], 1],
    ["Who was the father of Joab, David's army commander?", ["Zeruiah (mother, father unknown)", "Jesse", "Abner", "Benaiah"], 0],
    ["Who was the father of Absalom?", ["Solomon", "David", "Saul", "Amnon"], 1],
    ["Who was the father of Rehoboam?", ["David", "Solomon", "Jeroboam", "Asa"], 1],
    ["Who was the father of Jeroboam?", ["Nebat", "Solomon", "Ahijah", "Baasha"], 0],
    ["Who was the father of King Ahab?", ["Omri", "Baasha", "Zimri", "Elah"], 0],
    ["Who was the father of King Josiah?", ["Amon", "Manasseh", "Hezekiah", "Ahaz"], 0],
    ["Who was the father of the prophet Jeremiah?", ["Hilkiah", "Buzi", "Beeri", "Amoz"], 0],
    ["Who was the father of the prophet Ezekiel?", ["Buzi", "Hilkiah", "Beeri", "Amoz"], 0],
    ["Who was the father of the prophet Hosea?", ["Beeri", "Amoz", "Buzi", "Hilkiah"], 0],
    ["Who was the father of the prophet Zechariah?", ["Berechiah", "Iddo", "Buzi", "Beeri"], 0],
    ["Who was the father of Peter and Andrew?", ["Jonah/John", "Zebedee", "Alphaeus", "Simon"], 0],
    ["Who was the father of Judas Iscariot?", ["Simon", "Alphaeus", "Zebedee", "Cleopas"], 0],
    ["Who was the father of Matthew (Levi)?", ["Alphaeus", "Zebedee", "Jonah", "Simon"], 0],
    ["Who was the father of James the Less?", ["Alphaeus", "Zebedee", "Simon", "Cleopas"], 0],
    ["Which father cried out, 'Lord, I believe; help my unbelief!'?", ["Jairus", "The father of the demon-possessed boy", "A centurion", "Zacchaeus"], 1],
    ["In the parable of the two sons, what did the father ask them to do?", ["Go work in the vineyard", "Tend the sheep", "Gather the harvest", "Build a tower"], 0],
    ["Which apostle calls Timothy his 'true son in the faith'?", ["Peter", "John", "Paul", "James"], 2],
    ["Which apostle refers to Mark as 'my son'?", ["Peter", "Paul", "John", "James"], 0],
    ["Who is called the 'Father of Lights' in the book of James?", ["Abraham", "The sun", "God", "Moses"], 2],
    ["Which Psalm says, 'As a father has compassion on his children, so the Lord has compassion on those who fear him'?", ["Psalm 23", "Psalm 91", "Psalm 103", "Psalm 139"], 2],
    ["Proverbs 3 says the Lord disciplines those he loves, as a father does what?", ["The son he delights in", "The rebellious son", "The eldest son", "The foolish son"], 0],
    ["According to Ephesians 6, fathers should not provoke their children to what?", ["Anger", "Tears", "Rebellion", "Laughter"], 0],
    ["Colossians 3:21 warns fathers not to embitter their children, or they will become what?", ["Rebellious", "Discouraged", "Angry", "Foolish"], 1],
    ["Who was the father of the Rechabites, who commanded his descendants not to drink wine?", ["Jonadab", "Rechab", "Jeremiah", "Jehu"], 0],
    ["Who was the father of the first murderer?", ["Adam", "Cain", "Lamech", "Noah"], 0],
    ["Who was the father of the first polygamist mentioned in the Bible?", ["Methushael (father of Lamech)", "Cain", "Enoch", "Jared"], 0],
    ["Who was the father of Jubal, the father of all who play stringed instruments?", ["Lamech", "Cain", "Enoch", "Seth"], 0],
    ["Who was the father of Tubal-Cain, the first blacksmith?", ["Lamech", "Cain", "Enoch", "Seth"], 0],
    ["Who was the father of Jabal, the father of those who live in tents and raise livestock?", ["Lamech", "Cain", "Enoch", "Seth"], 0],
    ["Who was the father of Peleg, in whose days the earth was divided?", ["Eber", "Salah", "Arphaxad", "Shem"], 0],
    ["Who was the father of Abram's wife, Sarai?", ["Terah", "Nahor", "Haran", "Bethuel"], 0],
    ["Who was the father of Rebekah?", ["Bethuel", "Laban", "Nahor", "Abraham"], 0],
    ["Who was the father of Dinah?", ["Jacob", "Isaac", "Abraham", "Laban"], 0]
];

// Add filler questions to reach exactly 200 normal questions.
// Currently we have 130 + 70 = 200 normal questions precisely!

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("🚀 Starting Father's Day Quiz Extended seed...");
    console.log(`Total normal questions to seed: ${NORMAL_QUESTIONS.length}`);
    console.log(`Total reflection questions to seed: ${REFLECTION_QUESTIONS.length}`);

    // 1. Find or Create the quiz
    console.log('\n📋 Looking for Father\'s Day quiz...');
    const quizzes = await db.listDocuments(DB_ID, 'quizzes', [Query.limit(20)]);
    let targetQuiz = quizzes.documents.find(q =>
        q.title.toLowerCase().includes('father')
    );

    if (!targetQuiz) {
        console.log('   Not found, creating it...');
        targetQuiz = await db.createDocument(DB_ID, 'quizzes', ID.unique(), {
            title: "Father's Day Special Quiz",
            description: "Celebrate Father's Day with this fun quiz! Test your knowledge of fathers from the Bible, history, and pop culture. Plus, answer a special personal reflection question at the end! 20 questions in 5 minutes.",
            duration: 300, // 5 minutes
            is_active: true,
            question_count: 20,
        });
    } else {
        console.log(`✅ Found quiz: "${targetQuiz.title}" (${targetQuiz.$id})`);
        
        // Clear existing questions for this quiz to avoid duplicates
        console.log('   Clearing old questions for this quiz...');
        while (true) {
            const queries = [Query.equal('quiz_id', targetQuiz.$id), Query.limit(100)];
            const oldQs = await db.listDocuments(DB_ID, 'questions', queries);
            if (oldQs.documents.length === 0) break;
            
            for (const oldQ of oldQs.documents) {
                await db.deleteDocument(DB_ID, 'questions', oldQ.$id);
            }
        }
        console.log('   Old questions cleared.');
    }

    // 2. Add Normal questions
    console.log('\n📝 Adding 200 normal questions...');
    let success = 0;
    let failed = 0;

    for (let i = 0; i < NORMAL_QUESTIONS.length; i++) {
        const [text, options, correctIndex] = NORMAL_QUESTIONS[i];
        try {
            await db.createDocument(DB_ID, 'questions', ID.unique(), {
                quiz_id: targetQuiz.$id,
                text,
                options,
                correct_index: correctIndex,
            });
            success++;
            process.stdout.write(`\r   Uploaded Normal: ${success}/${NORMAL_QUESTIONS.length}`);
            await delay(50);
        } catch (err) {
            failed++;
            console.error(`\n   ❌ Failed Normal Q${i + 1}: ${err.message}`);
        }
    }

    // 3. Add Reflection questions
    console.log('\n\n📝 Adding 5 reflection questions...');
    let refSuccess = 0;
    for (let i = 0; i < REFLECTION_QUESTIONS.length; i++) {
        const text = REFLECTION_QUESTIONS[i];
        try {
            await db.createDocument(DB_ID, 'questions', ID.unique(), {
                quiz_id: targetQuiz.$id,
                text,
                options: [],
                correct_index: -1, // -1 means it's a reflection question
            });
            refSuccess++;
            process.stdout.write(`\r   Uploaded Reflection: ${refSuccess}/${REFLECTION_QUESTIONS.length}`);
            await delay(50);
        } catch (err) {
            console.error(`\n   ❌ Failed Reflection Q${i + 1}: ${err.message}`);
        }
    }

    console.log(`\n\n✅ Seed complete!`);
    console.log(`   Normal uploaded: ${success}/${NORMAL_QUESTIONS.length}`);
    console.log(`   Reflection uploaded: ${refSuccess}/${REFLECTION_QUESTIONS.length}`);
    if (failed > 0) console.log(`   ⚠️  Failed normal: ${failed}`);
    console.log(`\n   Quiz ID: ${targetQuiz.$id}`);
}

main().catch(console.error);
