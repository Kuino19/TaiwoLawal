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

const QUESTIONS = [
    // Introduction - David's Story
    { text: "In the introductory story, what specific items were demanding David's attention before he paused in his driveway?", options: ["A cold pizza, three missed calls from his boss, and two texts from church", "A hot pizza, an angry text from his wife, and an email from work", "Four missed calls, a meeting reminder, and a cold dinner", "Two calls from his church team and three texts from his boss"], correctAnswer: 0 },
    { text: "What specific rationale did David use to postpone his rest?", options: ["He was waiting for a weekend off and a holiday", "He was waiting for a big project to finish and an upcoming church conference", "He needed to earn enough money for a vacation first", "He felt his family would not understand if he rested now"], correctAnswer: 1 },
    { text: "What gentle thought settled into David's heart while sitting in his car?", options: ["'You must work harder to earn your rest.'", "'If you wait for the perfect time to rest, you will never rest.'", "'Your family needs you more than you need rest.'", "'God will provide a vacation when the time is right.'"], correctAnswer: 1 },
    { text: "How long did David spend in his quiet car praying before going inside?", options: ["Sixty seconds", "Two minutes", "Three minutes", "Five minutes"], correctAnswer: 2 },
    { text: "What changed for David after his brief pause in the car?", options: ["His schedule was cleared for the evening", "His circumstances changed miraculously", "His busy life was exactly the same, but his spirit felt lighter", "He decided to quit his job and focus on ministry"], correctAnswer: 2 },
    { text: "According to the introduction, what is a common misconception about real rest?", options: ["It requires spending a lot of money", "It only comes from a long vacation or a full day off", "It requires traveling to a secluded location", "It can only happen when the house is completely clean"], correctAnswer: 1 },
    { text: "The author explicitly describes this book as what kind of approach?", options: ["A strict discipline", "A gentle invitation rather than another task", "A theological treatise on sabbath", "A comprehensive medical guide"], correctAnswer: 1 },
    { text: "What guiding question does the introduction suggest you keep in mind as you read?", options: ["'How can I schedule more free time?'", "'Where, in my ordinary day, is rest already waiting for me?'", "'Why am I so tired all the time?'", "'Who can I delegate my tasks to?'"], correctAnswer: 1 },

    // Chapter 1: The Quiet Power of Small Pauses
    { text: "How do health experts view the comparison between short, frequent pauses and one long break?", options: ["Long breaks are vastly superior for physical health", "Short pauses protect the body just as much as one long break", "Short pauses only benefit the mind, not the body", "Frequent pauses are less effective because they disrupt focus"], correctAnswer: 1 },
    { text: "Which of the following physiological responses is NOT explicitly attributed to a short pause in Chapter 1?", options: ["The nervous system resets", "The heart rate slows", "The muscles loosen", "The digestive system accelerates"], correctAnswer: 3 },
    { text: "Why does the author state that scrolling on a phone is different from actually resting?", options: ["Scrolling strains the eyes, preventing sleep", "Scrolling keeps the brain alert and stimulated, even if the body is still", "Scrolling releases cortisol instead of dopamine", "Scrolling involves physical finger movement which disrupts calm"], correctAnswer: 1 },
    { text: "According to the author's definition, when does 'true rest' occur?", options: ["When the body is still for more than twenty minutes", "When both your body and your mind slow down together", "When you enter the REM cycle of sleep", "When you successfully complete all tasks for the day"], correctAnswer: 1 },
    { text: "Which of these specific actions is listed as a way to practice true rest?", options: ["Taking ten fast breaths before a meeting", "Sipping a warm drink slowly, without doing anything else", "Listening to an educational podcast while commuting", "Reading a challenging book before bed"], correctAnswer: 1 },
    { text: "How many slow, deep breaths does the book recommend taking before answering an email?", options: ["Two", "Three", "Five", "Ten"], correctAnswer: 2 },
    { text: "The author asserts that rest is not something you find; rather, it is something you...", options: ["Earn through hard work", "Make room for", "Must purchase", "Stumble upon accidentally"], correctAnswer: 1 },
    { text: "Regular short pauses have been linked to which specific combination of health benefits?", options: ["Lower stress hormones, steadier blood pressure, and a calmer mood", "Higher energy, better memory, and weight loss", "Reduced inflammation, deeper sleep, and better posture", "Lower cholesterol, steadier breathing, and increased focus"], correctAnswer: 0 },
    { text: "What is the only thing the author claims you need to rest well?", options: ["A quiet space", "A meditation app", "A willingness to pause, even for sixty seconds", "At least five minutes of uninterrupted time"], correctAnswer: 2 },
    { text: "What practical habit does the author suggest starting with to build small pauses?", options: ["Setting a gentle phone reminder for stillness each morning and afternoon", "Scheduling a 30-minute block in your calendar", "Leaving your phone in another room permanently", "Waking up an hour earlier every day"], correctAnswer: 0 },
    { text: "Where are people most often surprised to feel tension soften after a single minute of quiet?", options: ["The lower back, neck, and hands", "The shoulders, jaw, and chest", "The temples, eyes, and forehead", "The stomach, hips, and knees"], correctAnswer: 1 },
    { text: "What false belief about rest can quietly work against your health?", options: ["The belief that rest is a waste of time", "The belief that rest must be earned through exhaustion first", "The belief that sleep is the only valid form of rest", "The belief that you must be alone to rest"], correctAnswer: 1 },
    { text: "The book equates the basic need for rest to the need for which other necessities?", options: ["Exercise, sunlight, and nutrition", "Food, water, and sleep", "Shelter, clothing, and warmth", "Community, purpose, and love"], correctAnswer: 1 },
    { text: "Letting go of guilt around small pauses is described by the author as what?", options: ["A difficult mental exercise", "A form of self-care", "A luxury for those with free time", "An impossible goal for busy adults"], correctAnswer: 1 },
    { text: "When you feel guilty for sitting still, what specific reminder does the book suggest?", options: ["'I worked hard yesterday.'", "'This pause is helping my body function well, not holding me back.'", "'Everyone else is resting right now.'", "'I can work twice as fast after this.'"], correctAnswer: 1 },

    // Chapter 2: Everyday Moments That Heal
    { text: "What is the primary premise of finding calm in ordinary routines?", options: ["You must add new, calming activities to your schedule", "You simply need to notice what is already there and do it slower", "You must eliminate all stressful chores", "You need to delegate your daily routines to others"], correctAnswer: 1 },
    { text: "Which of the following is NOT given as an example of turning an ordinary routine into healing?", options: ["Folding laundry slowly, without multitasking", "Listening to soft music while preparing a meal", "Stretching gently for a minute after waking up", "Speed-walking around the block to burn off adrenaline"], correctAnswer: 3 },
    { text: "When your body shifts out of a stressed state and into a calmer one, which specific benefits occur?", options: ["Better digestion, steadier sleep at night, and a more balanced mood", "Increased metabolism, faster reflexes, and sharper vision", "Lower cholesterol, stronger immunity, and reduced pain", "Higher adrenaline, better endurance, and increased creativity"], correctAnswer: 0 },
    { text: "According to Chapter 2, why do many adults overlook small opportunities for rest?", options: ["Because they require too much concentration", "Because they seem too small to count", "Because they feel silly doing them", "Because they forget about them"], correctAnswer: 1 },
    { text: "How does the author view the building of health over time?", options: ["It requires occasional, dramatic lifestyle changes", "It is built in small, repeated choices rather than one dramatic change", "It is mostly determined by genetics and luck", "It depends entirely on the absence of stress"], correctAnswer: 1 },
    { text: "What does the author suggest you need instead of 'more hours in the day'?", options: ["More discipline in your scheduling", "More attention to the minutes you already have", "More help from your family", "More efficiency in your work"], correctAnswer: 1 },
    { text: "What specific challenge is given regarding brushing your teeth or making coffee?", options: ["Do it while taking deep breaths", "Do it with your eyes closed", "Do it slightly slower today, paying attention to how it feels", "Do it in complete silence"], correctAnswer: 2 },
    { text: "How does the book challenge the traditional view of chores?", options: ["It suggests paying someone else to do them", "It suggests chores should be ignored if you are tired", "It suggests that many chores can actually become restful when approached with a calmer pace", "It suggests chores are the primary cause of exhaustion"], correctAnswer: 2 },
    { text: "Which specific chores are mentioned as having the potential to settle the mind?", options: ["Vacuuming, dusting, and organizing", "Washing dishes by hand, watering plants, or tidying a small space", "Mowing the lawn, painting, and repairing", "Cooking, baking, and meal prepping"], correctAnswer: 1 },
    { text: "What is the author's stated goal regarding chores and rest?", options: ["To slow down your entire day", "To add more mindful chores to your list", "To choose one or two everyday tasks and let them become quiet pockets of calm", "To finish them as fast as possible to earn rest time"], correctAnswer: 2 },
    { text: "How can you protect your rest from the people around you without causing friction?", options: ["By locking your door", "By using a short, honest sentence like 'I need five quiet minutes before we talk'", "By ignoring their requests until you are rested", "By waiting until they are asleep to rest"], correctAnswer: 1 },
    { text: "What surprising claim does the author make about resting with others?", options: ["It is generally impossible unless you are both sleeping", "It can be just as restful as being alone, while also strengthening your relationships", "It is only effective if you are discussing your feelings", "It always requires a structured activity to prevent awkwardness"], correctAnswer: 1 },
    { text: "Which of the following is considered 'resting alongside someone else'?", options: ["A quiet walk with a friend or sitting together without the pressure to talk", "Playing a competitive game together", "Working on separate laptops in the same room", "Having a deep theological debate"], correctAnswer: 0 },

    // Deeper Synthesis / Harder Inferences (Chapters 1 & 2)
    { text: "If David from the introduction continued his old mindset, what would he likely do when he got home?", options: ["Sit in his car for an hour", "Eat the pizza slowly and mindfully", "Immediately start planning the church conference while eating", "Go straight to bed without speaking to anyone"], correctAnswer: 2 },
    { text: "Which phrase best summarizes the core philosophy of 'Finding Rest in the Little Things'?", options: ["Rest is a destination you must earn", "Rest is found by escaping your daily life", "Rest is accessible within the margins of your existing obligations", "Rest requires total silence and isolation"], correctAnswer: 2 },
    { text: "Based on the text, what is the ultimate consequence of believing you must 'wait for the perfect time to rest'?", options: ["You will appreciate the rest more when it comes", "You will never actually rest", "You will become more productive in the meantime", "You will eventually earn a longer vacation"], correctAnswer: 1 },
    { text: "Why might a person who spends 30 minutes scrolling through social media still feel exhausted?", options: ["Because the blue light damages their retinas", "Because their mind was kept alert and stimulated, preventing true rest", "Because they didn't scroll for long enough", "Because social media always causes negative emotions"], correctAnswer: 1 },
    { text: "What is the subtle danger of treating chores strictly as 'items to rush past'?", options: ["You might make a mistake while doing them", "You sacrifice an opportunity for a quiet pocket of calm", "You will finish them too early and be bored", "They will take longer to complete next time"], correctAnswer: 1 },
    { text: "How does the author reframe the feeling of 'guilt' associated with resting?", options: ["As a sign of a strong work ethic", "As a misunderstanding of rest as a reward rather than a basic physical need", "As a necessary emotion to prevent laziness", "As a spiritual failing that requires repentance"], correctAnswer: 1 },
    { text: "Which of the following scenarios best demonstrates the book's definition of 'making room for rest'?", options: ["Booking a flight to a quiet resort", "Deciding to fold the laundry slowly and attentively instead of rushing", "Quitting a demanding job", "Sleeping in until noon on a Saturday"], correctAnswer: 1 },
    { text: "What is the physiological relationship between slowing down a routine (like making coffee) and your health?", options: ["It forces your heart rate to increase slightly for better circulation", "It shifts the body out of a stressed state, which supports digestion and sleep over time", "It trains your muscles for better endurance", "It prevents you from developing caffeine tolerance"], correctAnswer: 1 },
    { text: "If you feel you have 'no time left to simply breathe,' the author's immediate remedy is to:", options: ["Drop your least important commitment", "Notice where rest is already waiting in your ordinary day", "Take a sick day from work", "Hire someone to do your chores"], correctAnswer: 1 },
    { text: "Which of the following is an example of an 'ordinary moment' that the book says hides real rest?", "options": ["Winning an award at work", "A slow sip of tea", "Completing a marathon", "Buying a new piece of furniture"], correctAnswer: 1 },
    { text: "Why does the author specifically mention noticing how tension softens in the 'shoulders, jaw, and chest'?", options: ["Because these are the only muscles that matter", "Because it proves that a single minute of quiet has a real, tangible effect on the physical body", "Because it is a placebo effect", "Because those areas require medical attention"], correctAnswer: 1 },
    { text: "What is the underlying message of the statement: 'You do not need more hours in the day. You need more attention to the minutes you already have'?", options: ["Time management is a myth", "Quality of presence is more restorative than sheer quantity of free time", "Everyone has exactly 24 hours", "You should sleep less to gain more minutes"], correctAnswer: 1 },
    { text: "According to the text, a 'gentle invitation' implies that the reader should:", options: ["Strictly follow all rules without deviation", "Treat the book as another task on their to-do list", "Approach the ideas without pressure or the need to change their whole life overnight", "Ignore the advice if they are too busy"], correctAnswer: 2 },
    { text: "When the author says 'Health is often built in small, repeated choices rather than one dramatic change,' this suggests that:", options: ["One week of vacation is useless", "A daily two-minute pause is a more sustainable health strategy than waiting for a rare holiday", "You should never make dramatic changes", "Repeated choices are always easy to make"], correctAnswer: 1 },
    { text: "Which of the following is NOT an intended outcome of practicing the small pauses suggested in the book?", options: ["Dropping the ball on your responsibilities", "Protecting your spirit, body, and relationships", "Lowering stress hormones", "Experiencing a steadier mood"], correctAnswer: 0 }
];

async function seedHardChapters1And2Quiz() {
    console.log('🚀 Starting Chapters 1 & 2 (Hard Mode) Quiz seed...');

    const quiz = await db.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title: "Finding Rest - Chapters 1 & 2 (Hard Mode)",
        description: "A challenging 20-question quiz generated from a 50-question bank based on Chapters 1 & 2 of the book.",
        duration: 300, // 5 minutes since it's 20 hard questions
        is_active: true,
        question_count: 20,
        image_url: '/finding-rest.jpg'
    });

    console.log(`✅ Created Quiz: ${quiz.title} (${quiz.$id})`);

    // Shuffle and pick 20 questions from the 50-question bank
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 20);

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

seedHardChapters1And2Quiz().catch(console.error);
