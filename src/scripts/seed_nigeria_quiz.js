const { Client, Databases, ID } = require('node-appwrite');

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('699760600036a00287a2')
    .setKey(process.env.APPWRITE_API_KEY || 'YOUR_API_KEY'); // Will use environment variable or fallback

const databases = new Databases(client);
const DB_ID = 'main-db';

const NIGERIA_QUIZ = {
    title: 'How Well Do You Know Nigeria?',
    description: 'Test your knowledge about the Giant of Africa! 🎁 The highest three scorers will win a recharge card prize on October 1st (Independence Day)!',
    duration: 300, // 5 minutes
    is_active: true,
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Nigeria_location_map.svg/1024px-Nigeria_location_map.svg.png' // Map of Nigeria
};

const NIGERIA_QUESTIONS = [
    {
        text: 'What is the capital city of Nigeria?',
        options: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
        correct_index: 1
    },
    {
        text: 'In what year did Nigeria gain independence from British rule?',
        options: ['1957', '1960', '1963', '1966'],
        correct_index: 1
    },
    {
        text: 'How many states are there in Nigeria?',
        options: ['34', '35', '36', '37'],
        correct_index: 2
    },
    {
        text: 'What is the official currency of Nigeria?',
        options: ['Cedi', 'Rand', 'Naira', 'Shilling'],
        correct_index: 2
    },
    {
        text: 'Which of the following is the longest river in Nigeria?',
        options: ['River Benue', 'River Niger', 'River Kaduna', 'Osun River'],
        correct_index: 1
    },
    {
        text: 'What are the two colors of the Nigerian flag?',
        options: ['Green and Yellow', 'Green and White', 'Red and White', 'Blue and White'],
        correct_index: 1
    },
    {
        text: 'What is the nickname of the Nigerian national men\'s football team?',
        options: ['Super Eagles', 'Black Stars', 'Indomitable Lions', 'Desert Foxes'],
        correct_index: 0
    },
    {
        text: 'Who was the first Prime Minister of independent Nigeria?',
        options: ['Nnamdi Azikiwe', 'Obafemi Awolowo', 'Sir Ahmadu Bello', 'Sir Abubakar Tafawa Balewa'],
        correct_index: 3
    },
    {
        text: 'What is the most populous city in Nigeria and Africa?',
        options: ['Ibadan', 'Lagos', 'Kano', 'Abuja'],
        correct_index: 1
    },
    {
        text: 'What is the name of the popular, highly-debated spiced rice dish from Nigeria?',
        options: ['Waakye', 'Jollof Rice', 'Fried Rice', 'Ofada Rice'],
        correct_index: 1
    },
    {
        text: 'Which Nigerian author wrote the famous novel "Things Fall Apart"?',
        options: ['Wole Soyinka', 'Chimamanda Ngozi Adichie', 'Chinua Achebe', 'Buchi Emecheta'],
        correct_index: 2
    },
    {
        text: 'What is the name of the globally recognized Nigerian film industry?',
        options: ['Nollywood', 'Ghallywood', 'Kannywood', 'Afrowood'],
        correct_index: 0
    },
    {
        text: 'Which of these is the highest point (mountain peak) in Nigeria?',
        options: ['Zuma Rock', 'Olumo Rock', 'Idanre Hills', 'Chappal Waddi'],
        correct_index: 3
    },
    {
        text: 'What is the most widely spoken official language in Nigeria?',
        options: ['Hausa', 'Igbo', 'Yoruba', 'English'],
        correct_index: 3
    },
    {
        text: 'Which prominent Nigerian artist won a Grammy Award for the album "Twice as Tall"?',
        options: ['Wizkid', 'Davido', 'Burna Boy', 'Tiwa Savage'],
        correct_index: 2
    },
    {
        text: 'Which Nigerian state has the largest land mass?',
        options: ['Kano', 'Niger', 'Borno', 'Kaduna'],
        correct_index: 1
    },
    {
        text: 'What year did the Nigerian Civil War (Biafran War) begin?',
        options: ['1963', '1967', '1970', '1975'],
        correct_index: 1
    },
    {
        text: 'Who is the first Nigerian to win a Nobel Prize in Literature?',
        options: ['Chinua Achebe', 'Wole Soyinka', 'Femi Osofisan', 'Ken Saro-Wiwa'],
        correct_index: 1
    },
    {
        text: 'What is the fractional/smaller unit of the Nigerian Naira?',
        options: ['Cents', 'Pesewas', 'Kobo', 'Pence'],
        correct_index: 2
    },
    {
        text: 'Which regional economic body was co-founded by Nigeria in 1975 and is headquartered in Abuja?',
        options: ['ECOWAS', 'SADC', 'EAC', 'OAU'],
        correct_index: 0
    }
];

async function seedNigeriaQuiz() {
    try {
        console.log('Seeding Nigeria Quiz (20 questions, 5 mins)...');
        
        // 1. Create the quiz
        const quiz = await databases.createDocument(
            DB_ID,
            'quizzes',
            ID.unique(),
            {
                ...NIGERIA_QUIZ,
                question_count: NIGERIA_QUESTIONS.length
            }
        );
        console.log(`✅ Created Quiz: ${quiz.title} (${quiz.$id})`);

        // 2. Add questions
        for (let i = 0; i < NIGERIA_QUESTIONS.length; i++) {
            const q = NIGERIA_QUESTIONS[i];
            await databases.createDocument(
                DB_ID,
                'questions',
                ID.unique(),
                {
                    quiz_id: quiz.$id,
                    text: q.text,
                    options: q.options,
                    correct_index: q.correct_index
                }
            );
            console.log(`  ➕ Added Question ${i + 1}`);
        }

        console.log('\n🎉 Successfully seeded Nigeria Quiz!');
    } catch (error) {
        console.error('Error seeding quiz:', error);
    }
}

seedNigeriaQuiz();
