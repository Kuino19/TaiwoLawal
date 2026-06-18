/**
 * seed_fathers_day.js
 *
 * Creates a "Father's Day" quiz in Appwrite.
 * 20 questions (Biblical and secular mix), 5 minutes duration.
 *
 * Run: node src/scripts/seed_fathers_day.js
 */

const { Client, Databases, ID } = require('node-appwrite');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

const quizQuestions = [
    // --- Biblical Fathers ---
    {
        text: "Who is known in the Bible as the 'Father of Many Nations'?",
        options: ["Isaac", "Moses", "Abraham", "Noah"],
        correctAnswer: 2
    },
    {
        text: "Which father in the Bible had a coat of many colors made for his favorite son?",
        options: ["David", "Jacob", "Adam", "Lot"],
        correctAnswer: 1
    },
    {
        text: "Who was the father of King Solomon?",
        options: ["King Saul", "King David", "Prophet Samuel", "Jesse"],
        correctAnswer: 1
    },
    {
        text: "What was the name of John the Baptist's father, who was struck mute until his son's birth?",
        options: ["Zechariah", "Joseph", "Simeon", "Nicodemus"],
        correctAnswer: 0
    },
    {
        text: "Who was the earthly father (adoptive father) of Jesus?",
        options: ["Peter", "John", "Joseph", "Matthew"],
        correctAnswer: 2
    },
    {
        text: "In one of Jesus' famous parables, a father forgives and welcomes back a son who squandered his inheritance. What is this parable called?",
        options: ["The Parable of the Sower", "The Parable of the Prodigal Son", "The Parable of the Lost Coin", "The Parable of the Good Samaritan"],
        correctAnswer: 1
    },
    {
        text: "Who was the father of Jonathan, David's loyal friend?",
        options: ["King Saul", "Samuel", "Jesse", "Abner"],
        correctAnswer: 0
    },
    {
        text: "Which Biblical father built an ark to save his family from a great flood?",
        options: ["Enoch", "Methuselah", "Lot", "Noah"],
        correctAnswer: 3
    },
    {
        text: "Whose father-in-law, Jethro, advised him to delegate his duties by appointing leaders of thousands, hundreds, fifties, and tens?",
        options: ["Aaron", "Moses", "Joshua", "Caleb"],
        correctAnswer: 1
    },
    {
        text: "Who is the father of James and John (the 'Sons of Thunder')?",
        options: ["Zebedee", "Alphaeus", "Jonah", "Simon"],
        correctAnswer: 0
    },

    // --- Secular / Pop Culture / Historical Fathers ---
    {
        text: "In the Star Wars universe, who famously says, 'No, I am your father'?",
        options: ["Obi-Wan Kenobi", "Emperor Palpatine", "Darth Vader", "Yoda"],
        correctAnswer: 2
    },
    {
        text: "Who is known as the 'Father of His Country' in the United States?",
        options: ["Abraham Lincoln", "Thomas Jefferson", "Benjamin Franklin", "George Washington"],
        correctAnswer: 3
    },
    {
        text: "Which animated TV dad is known for working at the Springfield Nuclear Power Plant?",
        options: ["Peter Griffin", "Homer Simpson", "Fred Flintstone", "Stan Smith"],
        correctAnswer: 1
    },
    {
        text: "In Disney/Pixar's 'Finding Nemo', what is the name of Nemo's overprotective clownfish father?",
        options: ["Marlin", "Gill", "Crush", "Bruce"],
        correctAnswer: 0
    },
    {
        text: "Which real-life figure is widely celebrated as the 'Father of the Nation' in India?",
        options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Subhas Chandra Bose", "B. R. Ambedkar"],
        correctAnswer: 1
    },
    {
        text: "Who is the father and ruler of the gods in ancient Greek mythology?",
        options: ["Poseidon", "Hades", "Apollo", "Zeus"],
        correctAnswer: 3
    },
    {
        text: "What animated king is the father of Princess Ariel in 'The Little Mermaid'?",
        options: ["King Arthur", "King Triton", "King Midas", "King Neptune"],
        correctAnswer: 1
    },
    {
        text: "In Disney's 'The Lion King', what is the name of Simba's father?",
        options: ["Scar", "Rafiki", "Mufasa", "Zazu"],
        correctAnswer: 2
    },
    {
        text: "Which famous inventor is often called the 'Father of the Telephone'?",
        options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"],
        correctAnswer: 1
    },
    {
        text: "In the Harry Potter series, what is the name of Harry's father?",
        options: ["Sirius Black", "Remus Lupin", "Severus Snape", "James Potter"],
        correctAnswer: 3
    }
];

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("🚀 Starting Father's Day Quiz seed...");

    // 1. Create the quiz
    console.log("\n📋 Creating Father's Day quiz...");
    const newQuiz = await db.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title: "Father's Day Special Quiz",
        description: "Celebrate Father's Day with this fun quiz! Test your knowledge of fathers from the Bible, history, and pop culture. 20 questions in 5 minutes.",
        duration: 300, // 5 minutes in seconds
        is_active: true,
        question_count: 20,
    });
    console.log(`✅ New quiz created: "${newQuiz.title}" (${newQuiz.$id})`);

    // 2. Add the questions
    console.log('\n📝 Adding 20 questions...');
    let success = 0;
    let failed = 0;

    for (let i = 0; i < quizQuestions.length; i++) {
        const q = quizQuestions[i];
        try {
            await db.createDocument(DB_ID, 'questions', ID.unique(), {
                quiz_id: newQuiz.$id,
                text: q.text,
                options: q.options,
                correct_index: q.correctAnswer,
            });
            success++;
            process.stdout.write(`\r   Uploaded: ${success}/${quizQuestions.length}`);
            await delay(150);
        } catch (err) {
            failed++;
            console.error(`\n   ❌ Failed Q${i + 1}: ${err.message}`);
        }
    }

    console.log(`\n\n✅ Seed complete!`);
    console.log(`   Questions uploaded: ${success}/${quizQuestions.length}`);
    if (failed > 0) console.log(`   ⚠️  Failed: ${failed}`);
    console.log(`\n   Quiz ID: ${newQuiz.$id}`);
    console.log('   The quiz is now active on your site.');
}

main().catch(console.error);
