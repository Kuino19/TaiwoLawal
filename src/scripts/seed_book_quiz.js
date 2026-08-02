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
    {
        text: "What do most people picture when they think of rest?",
        options: ["Working harder", "A beach holiday or long vacation", "Answering emails", "Scrolling on a phone"],
        correctAnswer: 1
    },
    {
        text: "According to health experts, what protects the body just as much as one long break?",
        options: ["A vigorous workout", "Short, frequent pauses throughout the day", "Eating more vegetables", "Drinking coffee constantly"],
        correctAnswer: 1
    },
    {
        text: "What happens to your nervous system during a short pause?",
        options: ["It becomes more stressed", "It resets", "It shuts down completely", "It speeds up"],
        correctAnswer: 1
    },
    {
        text: "During a short pause, what happens to your heart rate?",
        options: ["It increases rapidly", "It remains the same", "It slows down", "It becomes irregular"],
        correctAnswer: 2
    },
    {
        text: "How does a short pause affect your muscles?",
        options: ["They tighten up", "They cramp", "They loosen", "They grow stronger"],
        correctAnswer: 2
    },
    {
        text: "What happens to a racing mind when you take a short pause?",
        options: ["It finds new things to worry about", "It finally has room to settle", "It falls asleep instantly", "It starts planning the next day"],
        correctAnswer: 1
    },
    {
        text: "Why is scrolling on your phone not considered true rest?",
        options: ["It hurts your eyes", "It keeps your brain alert and stimulated", "It takes up too much time", "It drains your battery"],
        correctAnswer: 1
    },
    {
        text: "When does true rest happen?",
        options: ["When you sleep for 12 hours", "When you finish all your chores", "When both your body and mind slow down together", "When you turn off your phone permanently"],
        correctAnswer: 2
    },
    {
        text: "Which of the following is an example of true rest mentioned in the chapter?",
        options: ["Watching a loud movie", "Sitting quietly with your eyes closed for two minutes", "Running a marathon", "Reading the news online"],
        correctAnswer: 1
    },
    {
        text: "How many slow, deep breaths does the book suggest taking before answering an email?",
        options: ["One", "Three", "Five", "Ten"],
        correctAnswer: 2
    },
    {
        text: "What does the chapter suggest doing instead of reaching for your phone?",
        options: ["Calling a friend", "Watching the clouds or the sky", "Checking your calendar", "Writing a to-do list"],
        correctAnswer: 1
    },
    {
        text: "How should you sip a warm drink to experience true rest?",
        options: ["Quickly before it gets cold", "While checking emails", "Slowly, without doing anything else at the same time", "While talking to a coworker"],
        correctAnswer: 2
    },
    {
        text: "The book states that rest is not something you find. What is it instead?",
        options: ["Something you buy", "Something you make room for", "Something you earn", "Something you stumble upon"],
        correctAnswer: 1
    },
    {
        text: "Are the effects of small, simple moments of rest on the body real?",
        options: ["Yes, their effect is real", "No, it's just a placebo", "Only if done for over an hour", "Only for children"],
        correctAnswer: 0
    },
    {
        text: "Regular short pauses have been linked to a reduction in what?",
        options: ["Stress hormones", "Creativity", "Productivity", "Appetite"],
        correctAnswer: 0
    },
    {
        text: "How do regular short pauses affect blood pressure?",
        options: ["They cause it to spike", "They make it steadier", "They lower it to dangerous levels", "They have no effect"],
        correctAnswer: 1
    },
    {
        text: "What kind of mood do regular short pauses promote throughout the day?",
        options: ["Anxious", "Apathetic", "Calmer", "Energetic"],
        correctAnswer: 2
    },
    {
        text: "Do you need a special room or meditation app to rest well?",
        options: ["Yes, they are essential", "No, you just need a willingness to pause", "Yes, unless you have a scented candle", "Only if you are a beginner"],
        correctAnswer: 1
    },
    {
        text: "What is the minimum amount of time suggested to pause before moving to the next task?",
        options: ["Five minutes", "Ten minutes", "Sixty seconds", "Thirty minutes"],
        correctAnswer: 2
    },
    {
        text: "What practical tip does the chapter suggest for remembering to pause?",
        options: ["Setting a gentle reminder on your phone", "Hiring an assistant", "Writing it on your hand", "Asking a friend to call you"],
        correctAnswer: 0
    },
    {
        text: "When does the book suggest setting a reminder for a moment of stillness?",
        options: ["Once at midnight", "Each morning and each afternoon", "Every hour on the hour", "Only on weekends"],
        correctAnswer: 1
    },
    {
        text: "What should you notice before and after you take a pause?",
        options: ["How many emails you received", "How your body feels", "How much time has passed", "What others are doing"],
        correctAnswer: 1
    },
    {
        text: "Where do most people surprisingly feel tension soften after a single minute of quiet?",
        options: ["Shoulders, jaw, and chest", "Knees and ankles", "Fingers and toes", "Lower back only"],
        correctAnswer: 0
    },
    {
        text: "Why do many adults feel guilty when they pause?",
        options: ["They think they should be exercising", "They believe rest must be earned through exhaustion first", "They feel they are being watched", "They don't like the quiet"],
        correctAnswer: 1
    },
    {
        text: "How does the belief that rest must be earned affect your health?",
        options: ["It improves it", "It quietly works against it", "It has no impact", "It makes you physically stronger"],
        correctAnswer: 1
    },
    {
        text: "According to the chapter, rest is NOT what?",
        options: ["A basic need", "Essential", "A reward for finishing everything", "Important for health"],
        correctAnswer: 2
    },
    {
        text: "What is rest compared to in terms of basic needs?",
        options: ["Luxury vacations", "Food, water, and sleep", "Exercise and vitamins", "Money and success"],
        correctAnswer: 1
    },
    {
        text: "What does the chapter consider letting go of guilt around small pauses to be?",
        options: ["A sign of laziness", "A form of self-care", "Impossible for adults", "A waste of time"],
        correctAnswer: 1
    },
    {
        text: "What should you remind yourself when you feel guilty for sitting still?",
        options: ["That you will work harder tomorrow", "That the pause is helping your body function well", "That everyone else is resting too", "That life is too short to work"],
        correctAnswer: 1
    },
    {
        text: "Does taking a pause hold you back?",
        options: ["Yes, it delays progress", "No, it helps your body function well", "Only if it's during work hours", "Yes, if you do it every day"],
        correctAnswer: 1
    },
    {
        text: "Which of the following is NOT listed as a way to truly rest?",
        options: ["Sipping a warm drink slowly", "Watching the clouds", "Scrolling on social media", "Taking five deep breaths"],
        correctAnswer: 2
    },
    {
        text: "According to the text, a week off work is considered what?",
        options: ["Unnecessary", "A wonderful kind of rest, but not the only kind", "The only true way to recover", "Too expensive for most"],
        correctAnswer: 1
    },
    {
        text: "What body system resets during a short pause?",
        options: ["Digestive system", "Nervous system", "Immune system", "Skeletal system"],
        correctAnswer: 1
    },
    {
        text: "When your mind has been racing from one task to another, a pause gives it room to do what?",
        options: ["Settle", "Speed up", "Forget everything", "Multitask better"],
        correctAnswer: 0
    },
    {
        text: "Even if your body is sitting still, scrolling on your phone keeps your brain...",
        options: ["Relaxed and calm", "Alert and stimulated", "Bored and sleepy", "Unfocused and confused"],
        correctAnswer: 1
    },
    {
        text: "True rest is achieved when...",
        options: ["You fall asleep", "You finish your to-do list", "Your body and mind slow down together", "You are on a beach holiday"],
        correctAnswer: 2
    },
    {
        text: "Sitting quietly with your eyes closed for how long is given as an example of rest?",
        options: ["Two minutes", "Ten minutes", "Half an hour", "One hour"],
        correctAnswer: 0
    },
    {
        text: "What should you do before answering an email to practice rest?",
        options: ["Drink coffee", "Take five slow, deep breaths", "Scroll on your phone", "Stretch your legs"],
        correctAnswer: 1
    },
    {
        text: "When watching the sky, what should you avoid doing?",
        options: ["Blinking", "Breathing deeply", "Reaching for your phone", "Sitting down"],
        correctAnswer: 2
    },
    {
        text: "How does the book describe the action of making room for rest?",
        options: ["It is something you find by accident", "It is something you make room for", "It is something you purchase", "It is something you schedule months ahead"],
        correctAnswer: 1
    },
    {
        text: "What might surprise people after a single minute of quiet?",
        options: ["How much tension softens in their body", "How angry they become", "How many thoughts they have", "How quickly they fall asleep"],
        correctAnswer: 0
    },
    {
        text: "Tension often softens in which three areas after a moment of quiet?",
        options: ["Hands, feet, and neck", "Shoulders, jaw, and chest", "Back, knees, and elbows", "Stomach, thighs, and calves"],
        correctAnswer: 1
    },
    {
        text: "What false belief can quietly work against your health?",
        options: ["That rest is important", "That rest must be earned through exhaustion", "That water is necessary", "That sleep is restorative"],
        correctAnswer: 1
    },
    {
        text: "Rest should be considered a basic need, the same as...",
        options: ["Vacations and holidays", "Food, water, and sleep", "Exercise and diet", "Money and success"],
        correctAnswer: 1
    },
    {
        text: "What emotion is described as something to let go of as a form of self-care?",
        options: ["Joy", "Anger", "Guilt", "Sadness"],
        correctAnswer: 2
    },
    {
        text: "A pause is not holding you back; rather, it is...",
        options: ["Wasting your time", "Helping your body function well", "A sign of weakness", "An excuse to be lazy"],
        correctAnswer: 1
    },
    {
        text: "What is the primary difference highlighted between true rest and scrolling?",
        options: ["Scrolling rests the mind but not the body", "Scrolling keeps the brain alert, while true rest slows both body and mind", "Scrolling is better for the nervous system", "There is no difference"],
        correctAnswer: 1
    },
    {
        text: "Which of these is NOT required to rest well according to Chapter 1?",
        options: ["A willingness to pause", "Sixty seconds", "A scented candle", "A gentle reminder"],
        correctAnswer: 2
    },
    {
        text: "What does the text suggest about the simplicity of these small moments?",
        options: ["They are too simple to matter", "They may seem too simple, but their effect is real", "They are only effective for simple people", "They should be made more complicated"],
        correctAnswer: 1
    },
    {
        text: "Ultimately, what is the 'Quiet Power of Small Pauses'?",
        options: ["The ability to work longer hours", "The reset of the nervous system and protection of body and mind", "The chance to catch up on social media", "The preparation for a long vacation"],
        correctAnswer: 1
    }
];

async function seedBookQuiz() {
    console.log('🚀 Starting Book Quiz seed...');

    const quiz = await db.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title: "Finding Rest - Chapter 1",
        description: "A 10-question quiz generated from the 50-question bank based on Chapter 1: The Quiet Power of Small Pauses.",
        duration: 120, // 2 minutes
        is_active: true,
        question_count: 10,
    });

    console.log(`✅ Created Quiz: ${quiz.title} (${quiz.$id})`);

    // Shuffle and pick 10 questions from the 50-question bank
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

seedBookQuiz().catch(console.error);
