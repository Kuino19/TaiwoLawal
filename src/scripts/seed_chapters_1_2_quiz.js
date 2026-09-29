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

const QUESTIONS = [
    // Chapter 1
    {
        text: "According to the book, what do most people picture when they think of rest?",
        options: ["Completing a to-do list", "A big event like a beach holiday or long sleep", "Working quietly", "Exercising vigorously"],
        correctAnswer: 1
    },
    {
        text: "How do short, frequent pauses throughout the day protect the body?",
        options: ["Just as much as one long break", "Less than a full week off", "Only if combined with exercise", "They don't have any real effect"],
        correctAnswer: 0
    },
    {
        text: "What happens to your nervous system during a short pause?",
        options: ["It becomes more stimulated", "It resets", "It shuts down", "It prepares for danger"],
        correctAnswer: 1
    },
    {
        text: "What is the main difference between scrolling on your phone and truly resting?",
        options: ["Scrolling rests the body more", "Scrolling keeps your brain alert and stimulated", "There is no difference", "Scrolling is a form of deep rest"],
        correctAnswer: 1
    },
    {
        text: "When does true rest actually happen?",
        options: ["When you finally fall asleep at night", "When you finish all your daily chores", "When both your body and your mind slow down together", "When you check your social media"],
        correctAnswer: 2
    },
    {
        text: "Which of the following is listed as an example of true rest?",
        options: ["Taking five slow, deep breaths before answering an email", "Reading the news online", "Watching a fast-paced television show", "Planning tomorrow's schedule"],
        correctAnswer: 0
    },
    {
        text: "What physical benefit is linked to regular short pauses?",
        options: ["Increased heart rate", "Lower stress hormones and steadier blood pressure", "Weight loss", "Higher adrenaline levels"],
        correctAnswer: 1
    },
    {
        text: "What is all you need to begin resting well?",
        options: ["A meditation app", "A scented candle", "A willingness to pause, even for sixty seconds", "A dedicated quiet room"],
        correctAnswer: 2
    },
    {
        text: "Why do many adults feel guilty when they take a pause?",
        options: ["Because they dislike quiet moments", "Because they believe rest must be earned through exhaustion first", "Because they think they will fall asleep", "Because they want to be seen as busy"],
        correctAnswer: 1
    },
    {
        text: "The author states that rest is not a reward for finishing everything, but rather a...",
        options: ["Sign of laziness", "Luxury for the weekend", "Basic need, the same as food, water, and sleep", "Waste of productive time"],
        correctAnswer: 2
    },

    // Chapter 2
    {
        text: "What does the author suggest you need to add to your day to find rest?",
        options: ["A completely new hobby", "You do not need to add anything new, simply notice what is already there", "An hour of intense meditation", "More time to your schedule"],
        correctAnswer: 1
    },
    {
        text: "How can ordinary routines become quiet moments of healing?",
        options: ["By doing them a little more slowly and with a little more attention", "By avoiding them completely", "By doing them as quickly as possible", "By doing multiple routines at once"],
        correctAnswer: 0
    },
    {
        text: "What physical shift occurs when you slow down, even briefly?",
        options: ["Your body enters a state of panic", "Your body shifts out of a stressed state and into a calmer one", "Your body temperature rises significantly", "Your body prepares for heavy labor"],
        correctAnswer: 1
    },
    {
        text: "What are some of the benefits of your body shifting into a calmer state?",
        options: ["Better digestion and steadier sleep at night", "Faster running speed", "Increased muscle mass", "Higher stress tolerance"],
        correctAnswer: 0
    },
    {
        text: "According to Chapter 2, health is often built upon what?",
        options: ["One dramatic lifestyle change", "Small, repeated choices", "Expensive vacations", "Strict daily schedules"],
        correctAnswer: 1
    },
    {
        text: "How does the book suggest you approach chores to turn them into moments of calm?",
        options: ["With a calmer pace and without hurry", "By rushing to finish them", "By avoiding them until the weekend", "By listening to loud music while doing them"],
        correctAnswer: 0
    },
    {
        text: "What is the goal of turning chores into moments of calm?",
        options: ["To slow down your entire day", "To let one or two everyday tasks become quiet pockets of calm", "To make you do more chores", "To procrastinate on important work"],
        correctAnswer: 1
    },
    {
        text: "How can you make it easier to protect your rest around other people?",
        options: ["By sneaking away without telling anyone", "By using a short, honest sentence like 'I need five quiet minutes'", "By arguing that you deserve a break", "By ignoring them completely"],
        correctAnswer: 1
    },
    {
        text: "What does the book suggest about resting alongside someone else?",
        options: ["It is impossible to rest with others", "It is only restful if you are talking", "It can be just as restful as being alone, while strengthening relationships", "It always causes more stress"],
        correctAnswer: 2
    },
    {
        text: "Which of the following is given as an example of resting alongside someone else?",
        options: ["Debating a difficult topic", "A quiet walk with a friend or a shared quiet cup of tea", "Watching a movie together", "Working on a project together"],
        correctAnswer: 1
    }
];

async function seedChapters1And2Quiz() {
    console.log('🚀 Starting Chapters 1 & 2 Quiz seed...');

    const quiz = await db.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title: "Finding Rest - Chapters 1 & 2",
        description: "A 10-question quiz generated from Chapters 1 & 2 of 'Finding Rest in the Little Things'.",
        duration: 120, // 2 minutes
        is_active: true,
        question_count: 10,
        image_url: '/finding-rest.jpg'
    });

    console.log(`✅ Created Quiz: ${quiz.title} (${quiz.$id})`);

    // Shuffle and pick 10 questions from the 20-question bank
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 10);

    console.log(`📝 Adding ${selectedQuestions.length} questions...`);

    let count = 0;
    for (const q of selectedQuestions) {
        await db.createDocument(DB_ID, 'questions', ID.unique(), {
            quiz_id: quiz.$id,
            text: q.text,
            options: q.options,
            correct_index: q.correctAnswer,
        });
        count++;
        process.stdout.write(`\r   Uploaded Question: ${count}/${selectedQuestions.length}`);
    }

    console.log('\n✅ Seed complete!');
}

seedChapters1And2Quiz().catch(console.error);
