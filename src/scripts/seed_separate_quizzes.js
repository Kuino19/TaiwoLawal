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

const CH1_QUESTIONS = [
    // 1-5 David's Story
    { text: "What specific items were on the passenger seat of David's car?", options: ["A hot pizza for family dinner", "A cold pizza he had rushed to pick up", "His laptop and church service notes", "Three missed calls from his boss"], correctAnswer: 1 },
    { text: "How did David view his responsibilities before he took his pause?", options: ["He was looking for a way to quit his job", "He resented his family for their demands", "He loved God, his family, and cared about his work", "He was entirely focused on the upcoming church conference"], correctAnswer: 2 },
    { text: "What was the exact realization David had about the 'perfect time to rest'?", options: ["It will come after the church conference", "If you wait for it, you will never rest", "It requires at least a two-week vacation", "It only happens when you are asleep"], correctAnswer: 1 },
    { text: "What did David do during his three-minute pause in the car?", options: ["He returned the calls to his boss", "He ate the cold pizza", "He prayed and handed his heavy worries over to God", "He listened to a motivational podcast"], correctAnswer: 2 },
    { text: "What changed after David's pause?", options: ["His schedule was cleared", "His busy life remained exactly the same, but his spirit felt lighter", "He decided to step down from his ministry leadership", "His family had already eaten dinner"], correctAnswer: 1 },
    
    // 6-10 Small Pauses vs Vacation
    { text: "What is the primary contrast the author draws between a long vacation and small pauses?", options: ["Long vacations are unnecessary, while small pauses are essential", "Most people wait for a long vacation, but real rest hides inside small, ordinary moments", "Small pauses are too expensive compared to a day off", "Health experts prefer one long break over short frequent pauses"], correctAnswer: 1 },
    { text: "What does a short pause allow your nervous system to do?", options: ["Accelerate", "Shut down", "Reset", "Adapt to stress"], correctAnswer: 2 },
    { text: "Which of the following is NOT a physiological effect of a short pause mentioned in the text?", options: ["Heart rate slows", "Muscles loosen", "Mind settles", "Endorphins spike"], correctAnswer: 3 },
    { text: "Why is scrolling on your phone classified differently than resting?", options: ["It causes physical eye strain", "It keeps your brain alert and stimulated even if sitting still", "It takes up more time than a true pause", "It is considered a luxury rather than a necessity"], correctAnswer: 1 },
    { text: "According to the author, true rest happens when...", options: ["Your body is completely still for ten minutes", "Both your body and your mind slow down together", "You disconnect from the internet for 24 hours", "You achieve all your daily goals"], correctAnswer: 1 },

    // 11-15 Examples and Implementation
    { text: "Which of these is provided as a specific example of true rest?", options: ["Sipping a warm drink quickly between meetings", "Watching the clouds or the sky without reaching for your phone", "Taking ten rapid breaths before an email", "Listening to an audiobook while driving"], correctAnswer: 1 },
    { text: "The book states that rest is not something you find; it is something you...", options: ["Make room for", "Earn through hard work", "Schedule months in advance", "Stumble upon by accident"], correctAnswer: 0 },
    { text: "Regular short pauses are linked to which long-term benefits?", options: ["Higher metabolism and better vision", "Lower stress hormones, steadier blood pressure, and a calmer mood", "Increased muscle mass and endurance", "Better memory retention and faster reading speed"], correctAnswer: 1 },
    { text: "What is the minimum requirement to begin resting well, according to the book?", options: ["A dedicated meditation space", "A willingness to pause, even for sixty seconds", "A minimum of fifteen minutes", "A scented candle"], correctAnswer: 1 },
    { text: "Where does tension most commonly soften after a single minute of quiet?", options: ["Lower back and legs", "Shoulders, jaw, and chest", "Neck and temples", "Hands and feet"], correctAnswer: 1 },

    // 16-20 Guilt and Mindset
    { text: "What belief quietly works against the health of many adults?", options: ["The belief that they need eight hours of sleep", "The belief that rest must be earned through exhaustion first", "The belief that short pauses are a waste of time", "The belief that vacations are too expensive"], correctAnswer: 1 },
    { text: "Rest is explicitly compared to which basic needs?", options: ["Exercise and sunlight", "Food, water, and sleep", "Shelter and clothing", "Community and purpose"], correctAnswer: 1 },
    { text: "How does the author reframe the act of letting go of guilt around small pauses?", options: ["As a luxury", "As a form of self-care", "As a difficult discipline", "As a spiritual requirement"], correctAnswer: 1 },
    { text: "When you feel guilty for sitting still, what should you remind yourself?", options: ["'I am resting so I can work harder later.'", "'This pause is helping my body function well, not holding me back.'", "'Everyone else is resting too.'", "'I have earned this break.'"], correctAnswer: 1 },
    { text: "The book is framed as an invitation rather than...", options: ["A set of strict rules", "Another task on your to-do list", "A theological argument", "A medical textbook"], correctAnswer: 1 }
];

const CH2_QUESTIONS = [
    // 1-5 Ordinary Routines
    { text: "What does Chapter 2 suggest you need to add to your day to find rest?", options: ["A new meditation habit", "Nothing new, simply notice what is already there", "A 30-minute block of unscheduled time", "A new hobby"], correctAnswer: 1 },
    { text: "How can ordinary routines become quiet moments of healing?", options: ["By doing them perfectly", "By delegating them to others", "By doing them a little more slowly and with a little more attention", "By avoiding them whenever possible"], correctAnswer: 2 },
    { text: "Which of the following is an example given for finding calm in an ordinary routine?", options: ["Running a quick mile", "Folding laundry slowly, without rushing or multitasking", "Answering emails while eating breakfast", "Listening to a fast-paced podcast while cleaning"], correctAnswer: 1 },
    { text: "What physical change occurs when you slow down an ordinary routine?", options: ["Your body temperature increases", "Your body shifts out of a stressed state and into a calmer one", "Your heart rate spikes temporarily", "Your muscles tense up to focus"], correctAnswer: 1 },
    { text: "What long-term benefits are supported by shifting into a calmer state?", options: ["Better digestion, steadier sleep at night, and a more balanced mood", "Increased calorie burn and muscle growth", "Higher adrenaline and quicker reflexes", "Lower blood sugar and higher iron levels"], correctAnswer: 0 },

    // 6-10 Health and Attention
    { text: "Why do many adults overlook small opportunities for rest in their routines?", options: ["Because they take too long", "Because they seem too small to count", "Because they feel unproductive", "Because they require too much energy"], correctAnswer: 1 },
    { text: "How is health often built, according to the chapter?", options: ["In one dramatic lifestyle change", "In small, repeated choices", "By taking long vacations", "By eliminating all stress"], correctAnswer: 1 },
    { text: "What is the author's response to the feeling of needing 'more hours in the day'?", options: ["You need to manage your time better", "You need to delegate more tasks", "You need more attention to the minutes you already have", "You need to sleep less"], correctAnswer: 2 },
    { text: "Which routine is NOT explicitly mentioned as one to try doing slightly slower?", options: ["Brushing your teeth", "Making coffee", "Walking to your car", "Checking the mail"], correctAnswer: 3 },
    { text: "What is the ultimate result of repeating a minute of calm here and there daily?", options: ["It becomes a habit your whole body benefits from", "It eventually leads to a dramatic lifestyle change", "It replaces the need for sleep", "It makes you realize how much time you waste"], correctAnswer: 0 },

    // 11-15 Chores
    { text: "How are chores traditionally viewed in relation to rest?", options: ["As the best way to rest", "As the opposite of rest, something to rush through", "As a neutral activity", "As an opportunity for meditation"], correctAnswer: 1 },
    { text: "What happens when chores are approached with a calmer pace?", options: ["They take too long to complete", "They can actually become restful in themselves", "They become more frustrating", "They require more physical effort"], correctAnswer: 1 },
    { text: "Which of these chores is specifically listed as having the potential to settle the mind?", options: ["Vacuuming the entire house", "Washing dishes by hand", "Mowing the lawn", "Doing taxes"], correctAnswer: 1 },
    { text: "What is the goal of turning chores into moments of calm?", options: ["To add more chores to your day", "To slow down your entire schedule", "To choose one or two everyday tasks and let them become quiet pockets of calm", "To completely eliminate the stress of all chores"], correctAnswer: 2 },
    { text: "The author advises approaching chores without...", options: ["Music", "Hurry", "Help from others", "A checklist"], correctAnswer: 1 },

    // 16-20 Relationships
    { text: "How can you make it easier to protect your rest around other people?", options: ["By locking yourself in a room", "By explaining the physiological benefits of rest to them", "By using a short, honest sentence like 'I need five quiet minutes before we talk'", "By ignoring their requests"], correctAnswer: 2 },
    { text: "What is the intended outcome of saying 'I need five quiet minutes before we talk'?", options: ["To start an argument", "To create space for rest without guilt or explanation", "To make the other person feel bad", "To delay a difficult conversation indefinitely"], correctAnswer: 1 },
    { text: "What surprising claim does the book make about resting with others?", options: ["It is impossible unless you are both asleep", "It can be just as restful as being alone", "It is only effective if you are holding hands", "It always requires complete silence"], correctAnswer: 1 },
    { text: "What is a benefit of resting alongside someone else, besides the rest itself?", options: ["It forces them to rest too", "It strengthens your relationships", "It guarantees you won't fall asleep", "It allows you to multitask"], correctAnswer: 1 },
    { text: "Which of these is an example of resting alongside someone else?", options: ["A shared quiet cup of tea without the pressure to talk", "Debating a movie you just watched", "Working on separate projects in the same room", "Planning a family vacation together"], correctAnswer: 0 }
];

async function seedSeparateQuizzes() {
    console.log('🚀 Starting separate Chapters Quiz seed...');

    // Chapter 1 Quiz
    const quiz1 = await db.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title: "Finding Rest - Chapter 1 (Hard)",
        description: "A challenging 20-question quiz focusing entirely on Chapter 1: The Quiet Power of Small Pauses.",
        duration: 300, 
        is_active: true,
        question_count: 20,
        image_url: '/finding-rest.jpg'
    });
    console.log(`✅ Created Quiz: ${quiz1.title} (${quiz1.$id})`);

    let count1 = 0;
    for (const q of CH1_QUESTIONS) {
        await db.createDocument(DB_ID, 'questions', ID.unique(), {
            quiz_id: quiz1.$id,
            text: q.text,
            options: q.options,
            correct_index: q.correctAnswer,
        });
        count1++;
    }
    console.log(`📝 Added ${count1} questions for Chapter 1`);

    // Chapter 2 Quiz
    const quiz2 = await db.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title: "Finding Rest - Chapter 2 (Hard)",
        description: "A challenging 20-question quiz focusing entirely on Chapter 2: Everyday Moments That Heal.",
        duration: 300, 
        is_active: true,
        question_count: 20,
        image_url: '/finding-rest.jpg'
    });
    console.log(`✅ Created Quiz: ${quiz2.title} (${quiz2.$id})`);

    let count2 = 0;
    for (const q of CH2_QUESTIONS) {
        await db.createDocument(DB_ID, 'questions', ID.unique(), {
            quiz_id: quiz2.$id,
            text: q.text,
            options: q.options,
            correct_index: q.correctAnswer,
        });
        count2++;
    }
    console.log(`📝 Added ${count2} questions for Chapter 2`);

    console.log('✅ Seed complete!');
}

seedSeparateQuizzes().catch(console.error);
