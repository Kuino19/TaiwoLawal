/**
 * seed_standard_of_attainment.js
 *
 * Adds Standard of Attainment questions (Chapters 2 & 3, Q23–Q64)
 * to the existing "General Foursquare Knowledge" quiz.
 *
 * Run: node src/scripts/seed_standard_of_attainment.js
 */

const { Client, Databases, ID, Query } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

// ─────────────────────────────────────────────────────────────────────────────
// Standard of Attainment Questions — Chapters 2 & 3 (Q23–Q64)
// ─────────────────────────────────────────────────────────────────────────────
const standardQuestions = [
    // ── Chapter 2: The Fall of Man (Q23–Q43) ──
    {
        text: "Who made the world and everything in the world?",
        options: ["The angels", "God", "Nature itself", "Man"],
        correctAnswer: 1
    },
    {
        text: "How did God create all things?",
        options: ["From existing materials He shaped", "Out of nothing, through the words of His mouth", "Through the help of angels", "By mixing heavenly elements"],
        correctAnswer: 1
    },
    {
        text: "In how many days did the Creation take place?",
        options: ["Three days", "Seven days", "Six days", "Forty days"],
        correctAnswer: 2
    },
    {
        text: "How was man's body made?",
        options: ["From the dust of the ground", "From water and fire", "Out of nothing like the universe", "From clay found in the river"],
        correctAnswer: 0
    },
    {
        text: "How was man's soul given to him?",
        options: ["God spoke it into existence", "God breathed into his nostrils the breath of life", "The angels brought it to him", "It grew within him over time"],
        correctAnswer: 1
    },
    {
        text: "What separated Adam and Eve from God?",
        options: ["Their fear", "Their hunger", "Their disobedience", "Their pride"],
        correctAnswer: 2
    },
    {
        text: "What can people do so they will not be separated from God?",
        options: ["Follow the Ten Commandments only", "Do enough good deeds", "Confess their sins and ask God to forgive them for their disobedience", "Attend church every Sunday"],
        correctAnswer: 2
    },
    {
        text: "Who tempted Adam and Eve to disobey God?",
        options: ["A fallen angel named Lucifer", "Satan, the Devil", "An evil spirit God allowed", "Their own sinful hearts"],
        correctAnswer: 1
    },
    {
        text: "Has anyone else besides Adam and Eve disobeyed God?",
        options: ["No, only Adam and Eve disobeyed God", "Only the people in Noah's time", "Yes, everyone — the whole human race has sinned", "Only those who consciously reject God"],
        correctAnswer: 2
    },
    {
        text: "What scripture says 'For all have sinned and come short of the glory of God'?",
        options: ["John 3:16", "Hebrews 12:28", "Romans 3:23", "Isaiah 53:6"],
        correctAnswer: 2
    },

    // ── Chapter 3: God (Q44–Q64) ──
    {
        text: "What is the first verse of the Bible?",
        options: ["'God is love'", "'In the beginning was the Word'", "'In the beginning, God created the heaven and the earth.' Genesis 1:1", "'The Lord is my shepherd'"],
        correctAnswer: 2
    },
    {
        text: "What person is introduced in the first verse of the Bible?",
        options: ["Adam, the first man", "Moses, the lawgiver", "Jesus, the Son of God", "God, our Heavenly Father"],
        correctAnswer: 3
    },
    {
        text: "Who is God?",
        options: ["An invisible force in nature", "God is the Creator and Ruler of all things", "A being of pure light", "The spirit of good in all people"],
        correctAnswer: 1
    },
    {
        text: "Where is God?",
        options: ["Only in heaven above", "Only in the church building", "God is everywhere!", "Only in the heart of believers"],
        correctAnswer: 2
    },
    {
        text: "What does God know?",
        options: ["Only the future", "Only the words we speak aloud", "Only our visible actions", "God knows all things, even our thoughts"],
        correctAnswer: 3
    },
    {
        text: "What scripture says God understands our thoughts even from afar?",
        options: ["Jeremiah 32:27", "Romans 3:23", "Psalms 139:2", "Malachi 3:6"],
        correctAnswer: 2
    },
    {
        text: "What can God do?",
        options: ["Only what is good and pleasant", "Only things beyond human ability", "God can do whatever He chooses to do — He can do all things", "Only what the Bible specifically records"],
        correctAnswer: 2
    },
    {
        text: "What scripture asks 'Is there anything too hard for me?'",
        options: ["Genesis 18:14", "Jeremiah 32:27", "Matthew 19:26", "Luke 1:37"],
        correctAnswer: 1
    },
    {
        text: "How long has God lived?",
        options: ["Since the beginning of creation", "God has lived always, and will live forever", "For billions of years before creation", "Since the first day of Genesis"],
        correctAnswer: 1
    },
    {
        text: "Is God good?",
        options: ["God is powerful and mighty", "God is kind and gentle only", "God is holy, just and good", "God is patient and slow to judge"],
        correctAnswer: 2
    },
    {
        text: "Which scripture is quoted about God being 'merciful and gracious, long suffering, and abundant in goodness and truth'?",
        options: ["Psalm 23:6", "Exodus 34:6", "Isaiah 40:28", "Numbers 14:18"],
        correctAnswer: 1
    },
    {
        text: "Does God ever change?",
        options: ["God changes as the world changes", "God sometimes changes His mind about sin", "God is always the same", "God changes in emotions but not in His nature"],
        correctAnswer: 2
    },
    {
        text: "Which scripture says 'For I am the Lord, I change not'?",
        options: ["Hebrews 13:8", "Isaiah 40:8", "Malachi 3:6", "Numbers 23:19"],
        correctAnswer: 2
    },
    {
        text: "Is there more than one God?",
        options: ["Yes, God has many forms and expressions", "Yes, there is a god for each nation", "There is but one living and true God", "There are three Gods who work as one team"],
        correctAnswer: 2
    },
    {
        text: "What scripture declares 'the Lord is God, and that there is none else'?",
        options: ["Deuteronomy 6:4", "1 Kings 8:60", "Isaiah 45:5", "Exodus 20:3"],
        correctAnswer: 1
    },
    {
        text: "Can we see God?",
        options: ["Yes, if we are holy enough", "Yes, God appears in visions and dreams to all", "God is a spirit and cannot be seen", "Yes, we can see Him in heaven if we are righteous"],
        correctAnswer: 2
    },
    {
        text: "Which scripture says 'No man hath seen God at any time'?",
        options: ["Exodus 33:20", "John 1:18", "1 Timothy 6:16", "Deuteronomy 4:12"],
        correctAnswer: 1
    },
    {
        text: "What have we learned about the personality of God?",
        options: ["God is loving, kind and patient above all", "God is all-knowing, all-present, and all-powerful only", "God is a spirit, infinite, eternal and unchangeable in His being, wise, powerful, holy, just, good and true", "God is a spirit who created all things and rested"],
        correctAnswer: 2
    },
    {
        text: "What is a spirit?",
        options: ["An invisible energy in the universe", "A personal being without a body, a being that can think and love and will", "A cloud of divine power or energy", "An immortal human soul after death"],
        correctAnswer: 1
    },
    {
        text: "How do we know that God lives?",
        options: ["Because of our feelings inside", "Because the church teaches it and tradition confirms it", "Because He has shown Himself in Jesus Christ, His Son; in nature; and in people", "Because the Bible alone tells us so"],
        correctAnswer: 2
    },
    {
        text: "Which scripture says 'The heavens declare the glory of God; and the firmament showeth his handiwork'?",
        options: ["Isaiah 40:26", "Romans 1:20", "Psalm 19:1", "Job 38:4"],
        correctAnswer: 2
    },
    {
        text: "What is another name for God?",
        options: ["The Almighty", "The Creator", "Heavenly Father", "The Lord of Hosts"],
        correctAnswer: 2
    },
    {
        text: "What word do we use to express the fact that the Father, the Son, and the Holy Spirit are one God?",
        options: ["Unity", "Divinity", "The Trinity", "The Godhead"],
        correctAnswer: 2
    },
    {
        text: "How do we know what God is like?",
        options: ["By observing nature alone", "By reading the Bible and by Jesus' life on earth", "By listening to church leaders only", "By experiencing God in worship alone"],
        correctAnswer: 1
    },
    {
        text: "Who does God love?",
        options: ["Only those who obey Him", "The church and its faithful members", "The righteous and holy people only", "God loves everybody in the whole world, for 'God is love'"],
        correctAnswer: 3
    },
    {
        text: "How should we act toward God?",
        options: ["With fear and trembling only", "With casual friendship, like a friend", "We should honour and love God's name and be reverent in God's house", "By performing the right rituals at the right times"],
        correctAnswer: 2
    },
    {
        text: "Which scripture says 'Let us have grace, whereby we may serve God acceptably with reverence and godly fear'?",
        options: ["Romans 12:1", "1 Peter 2:17", "Hebrews 12:28", "Psalm 96:9"],
        correctAnswer: 2
    },
    {
        text: "What Bible verse expresses God's love for everyone?",
        options: ["Romans 3:23", "Psalm 23:1", "John 3:16", "Hebrews 12:28"],
        correctAnswer: 2
    },
    {
        text: "Complete John 3:16: 'For God so loved the world that He gave His only begotten Son, that whosoever believeth in Him should not perish but...'",
        options: ["'...be healed of all sickness'", "'...have everlasting life'", "'...receive the Holy Spirit'", "'...be called a child of God'"],
        correctAnswer: 1
    },
    {
        text: "Why should we love God?",
        options: ["Because He rewards us richly", "Because the Bible commands us to", "Because He made us in His image", "We love Him because He first loved us (1 John 4:19)"],
        correctAnswer: 3
    },
    {
        text: "Which scripture says 'We love Him because He first loved us'?",
        options: ["John 3:16", "Romans 5:8", "1 John 4:19", "Ephesians 2:4"],
        correctAnswer: 2
    },
];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('🚀 Starting Standard of Attainment seed...');
    console.log(`📡 Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
    console.log(`🗄️  Database: ${DB_ID}\n`);

    // 1. Find the General Foursquare Knowledge quiz
    console.log('🔍 Looking for "General Foursquare Knowledge" quiz...');
    const quizzes = await databases.listDocuments(DB_ID, 'quizzes', [
        Query.limit(20),
    ]);

    const foursquareQuiz = quizzes.documents.find(q =>
        q.title.toLowerCase().includes('foursquare')
    );

    if (!foursquareQuiz) {
        console.error('❌ Could not find the Foursquare quiz. Available quizzes:');
        quizzes.documents.forEach(q => console.log(`  - [${q.$id}] "${q.title}"`));
        return;
    }

    console.log(`✅ Found quiz: "${foursquareQuiz.title}" (ID: ${foursquareQuiz.$id})`);
    console.log(`📝 Adding ${standardQuestions.length} Standard of Attainment questions...\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < standardQuestions.length; i++) {
        const q = standardQuestions[i];
        try {
            await databases.createDocument(DB_ID, 'questions', ID.unique(), {
                quiz_id: foursquareQuiz.$id,
                text: q.text,
                options: q.options,
                correct_index: q.correctAnswer,
            });
            success++;
            process.stdout.write(`\r  Progress: ${success}/${standardQuestions.length} questions uploaded...`);
            await delay(150);
        } catch (err) {
            failed++;
            console.error(`\n  ❌ Failed Q${i + 1}: ${err.message}`);
            if (err.code === 429) {
                console.log('\n  ⏳ Rate limited — waiting 5s...');
                await delay(5000);
                try {
                    await databases.createDocument(DB_ID, 'questions', ID.unique(), {
                        quiz_id: foursquareQuiz.$id,
                        text: q.text,
                        options: q.options,
                        correct_index: q.correctAnswer,
                    });
                    success++; failed--;
                } catch (e) {
                    console.error(`  ❌ Retry failed: ${e.message}`);
                }
            }
        }
    }

    console.log(`\n\n✅ Done!`);
    console.log(`   Questions added: ${success}/${standardQuestions.length}`);
    if (failed > 0) console.log(`   ⚠️  Failed: ${failed}`);
    console.log(`   Quiz ID: ${foursquareQuiz.$id}`);
}

main().catch(console.error);
