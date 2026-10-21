import json

with open(r'c:\Users\IFEDAYO LAWAL\Documents\TAIWO LAWAL\web\src\data\standard_of_attainment.json', 'r', encoding='utf-8') as f:
    existing = json.load(f)

print(f"Existing questions: {len(existing)}")

additional_questions = [
    {
        "id": 46,
        "question": "What is the full name of our church denomination?",
        "options": [
            "The International Church of the Foursquare Gospel",
            "The Evangelical Church of Victory",
            "The Pentecostal Mission International",
            "The United Church of Christ"
        ],
        "correct_index": 0,
        "full_answer": "The International Church of the Foursquare Gospel.",
        "scripture": "Hebrews 13:8",
        "category": "Foursquare Heritage"
    },
    {
        "id": 47,
        "question": "Who was the human founder of the International Church of the Foursquare Gospel?",
        "options": ["Aimee Semple McPherson", "John Wesley", "Charles Spurgeon", "Billy Graham"],
        "correct_index": 0,
        "full_answer": "Sister Aimee Semple McPherson under the inspiration of the Holy Spirit.",
        "scripture": "Acts 2:17-18",
        "category": "Foursquare Heritage"
    },
    {
        "id": 48,
        "question": "What are the four pillars of the Foursquare Gospel?",
        "options": [
            "Jesus the Savior, Baptizer with the Holy Spirit, Healer, and Soon-Coming King",
            "Faith, Hope, Charity, and Wisdom",
            "Repentance, Fasting, Tithing, and Prayer",
            "Righteousness, Peace, Joy, and Longsuffering"
        ],
        "correct_index": 0,
        "full_answer": "Jesus Christ as our Savior, Baptizer with the Holy Spirit, Healer, and Soon-Coming King.",
        "scripture": "Hebrews 13:8",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 49,
        "question": "Which symbol represents Jesus as the Savior in the Foursquare emblem?",
        "options": ["The Cross", "The Dove", "The Cup", "The Crown"],
        "correct_index": 0,
        "full_answer": "The Cross represents Jesus Christ as our Savior (John 3:16).",
        "scripture": "1 Corinthians 1:18, John 3:16",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 50,
        "question": "Which symbol represents Jesus as the Baptizer with the Holy Spirit in the Foursquare emblem?",
        "options": ["The Dove", "The Cross", "The Cup", "The Crown"],
        "correct_index": 0,
        "full_answer": "The Dove represents Jesus as the Baptizer with the Holy Spirit.",
        "scripture": "Luke 3:22, Acts 1:5",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 51,
        "question": "Which symbol represents Jesus as the Great Physician and Healer in the Foursquare emblem?",
        "options": ["The Cup", "The Dove", "The Cross", "The Crown"],
        "correct_index": 0,
        "full_answer": "The Cup represents Jesus Christ as the Great Physician and Healer.",
        "scripture": "1 Peter 2:24, James 5:14-15",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 52,
        "question": "Which symbol represents Jesus as the Soon-Coming King in the Foursquare emblem?",
        "options": ["The Crown", "The Cup", "The Dove", "The Cross"],
        "correct_index": 0,
        "full_answer": "The Crown represents Jesus Christ as our Soon-Coming King.",
        "scripture": "Revelation 19:16, 1 Thessalonians 4:16-17",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 53,
        "question": "What colors represent the four symbols of the Foursquare Gospel in order?",
        "options": [
            "Red (Cross), Gold (Dove), Blue (Cup), Purple (Crown)",
            "White, Green, Yellow, Black",
            "Blue, Red, White, Purple",
            "Gold, Silver, Bronze, Iron"
        ],
        "correct_index": 0,
        "full_answer": "Red represents the Cross, Gold represents the Dove, Blue represents the Cup, and Purple represents the Crown.",
        "scripture": "Hebrews 13:8",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 54,
        "question": "What is the key scripture theme of the Foursquare Gospel?",
        "options": [
            "Hebrews 13:8 - 'Jesus Christ the same yesterday, and to day, and for ever'",
            "John 11:35 - 'Jesus wept'",
            "Genesis 1:1 - 'In the beginning God created'",
            "Romans 8:31 - 'If God be for us, who can be against us?'"
        ],
        "correct_index": 0,
        "full_answer": "Hebrews 13:8: \"Jesus Christ the same yesterday, and to day, and for ever.\"",
        "scripture": "Hebrews 13:8",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 55,
        "question": "How many books are there in the Holy Bible?",
        "options": ["66 books", "70 books", "60 books", "39 books"],
        "correct_index": 0,
        "full_answer": "There are 66 books in the Holy Bible (39 in the Old Testament and 27 in the New Testament).",
        "scripture": "2 Timothy 3:16",
        "category": "The Holy Scriptures"
    },
    {
        "id": 56,
        "question": "How many books are in the Old Testament?",
        "options": ["39 books", "27 books", "66 books", "40 books"],
        "correct_index": 0,
        "full_answer": "There are 39 books in the Old Testament.",
        "scripture": "Luke 24:44",
        "category": "The Holy Scriptures"
    },
    {
        "id": 57,
        "question": "How many books are in the New Testament?",
        "options": ["27 books", "39 books", "30 books", "24 books"],
        "correct_index": 0,
        "full_answer": "There are 27 books in the New Testament.",
        "scripture": "2 Timothy 3:16",
        "category": "The Holy Scriptures"
    },
    {
        "id": 58,
        "question": "What is the first book of the Bible?",
        "options": ["Genesis", "Exodus", "Matthew", "Psalms"],
        "correct_index": 0,
        "full_answer": "Genesis is the first book of the Bible.",
        "scripture": "Genesis 1:1",
        "category": "The Holy Scriptures"
    },
    {
        "id": 59,
        "question": "What is the last book of the Bible?",
        "options": ["Revelation", "Malachi", "Jude", "Hebrews"],
        "correct_index": 0,
        "full_answer": "The Revelation of Saint John is the last book of the Bible.",
        "scripture": "Revelation 22:20-21",
        "category": "The Holy Scriptures"
    },
    {
        "id": 60,
        "question": "Who was the human instrument through whom God gave the Ten Commandments?",
        "options": ["Moses", "Abraham", "David", "Joshua"],
        "correct_index": 0,
        "full_answer": "Moses on Mount Sinai.",
        "scripture": "Exodus 20:1-17",
        "category": "The Ten Commandments"
    },
    {
        "id": 61,
        "question": "What is the First Commandment?",
        "options": [
            "\"Thou shalt have no other gods before me\"",
            "\"Thou shalt not steal\"",
            "\"Remember the sabbath day\"",
            "\"Honour thy father and thy mother\""
        ],
        "correct_index": 0,
        "full_answer": "\"Thou shalt have no other gods before me.\" Exodus 20:3.",
        "scripture": "Exodus 20:3",
        "category": "The Ten Commandments"
    },
    {
        "id": 62,
        "question": "Which commandment has a promise of long life attached to it?",
        "options": [
            "The Fifth Commandment: \"Honour thy father and thy mother\"",
            "The Third Commandment: \"Thou shalt not take the name of the Lord thy God in vain\"",
            "The Eighth Commandment: \"Thou shalt not steal\"",
            "The Tenth Commandment: \"Thou shalt not covet\""
        ],
        "correct_index": 0,
        "full_answer": "\"Honour thy father and thy mother: that thy days may be long upon the land which the Lord thy God giveth thee.\" Exodus 20:12.",
        "scripture": "Exodus 20:12, Ephesians 6:2",
        "category": "The Ten Commandments"
    },
    {
        "id": 63,
        "question": "How did Jesus summarize the whole Law and the Prophets?",
        "options": [
            "Love the Lord your God with all your heart, soul, and mind, and love your neighbor as yourself",
            "Attend temple worship every morning and evening",
            "Memorize all the genealogies of Israel",
            "Offer sacrifices three times a year"
        ],
        "correct_index": 0,
        "full_answer": "Love the Lord your God with all your heart, and love your neighbour as yourself.",
        "scripture": "Matthew 22:37-40",
        "category": "Christian Living"
    },
    {
        "id": 64,
        "question": "What prayer did Jesus teach His disciples when they asked Him how to pray?",
        "options": ["The Lord's Prayer (\"Our Father who art in heaven...\")", "The Prayer of Jabez", "The Aaronic Blessing", "The Prayer of Solomon"],
        "correct_index": 0,
        "full_answer": "The Lord's Prayer (Matthew 6:9-13).",
        "scripture": "Matthew 6:9-13, Luke 11:2-4",
        "category": "Prayer & Worship"
    },
    {
        "id": 65,
        "question": "How many fruits of the Spirit are listed in Galatians 5:22-23?",
        "options": ["Nine", "Seven", "Twelve", "Ten"],
        "correct_index": 0,
        "full_answer": "Nine fruits of the Spirit: Love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.",
        "scripture": "Galatians 5:22-23",
        "category": "The Holy Spirit"
    },
    {
        "id": 66,
        "question": "Which of the following is the first fruit of the Spirit listed in Galatians 5?",
        "options": ["Love", "Joy", "Peace", "Faith"],
        "correct_index": 0,
        "full_answer": "\"The fruit of the Spirit is love...\" Galatians 5:22.",
        "scripture": "Galatians 5:22",
        "category": "The Holy Spirit"
    },
    {
        "id": 67,
        "question": "What is the initial physical evidence of the baptism in the Holy Spirit?",
        "options": [
            "Speaking with other tongues as the Spirit gives utterance",
            "Shaking violently",
            "Receiving money",
            "Seeing a bright light"
        ],
        "correct_index": 0,
        "full_answer": "Speaking with other tongues as the Spirit gives them utterance.",
        "scripture": "Acts 2:4, Acts 10:44-46",
        "category": "The Holy Spirit"
    },
    {
        "id": 68,
        "question": "What piece of the Armor of God is used to extinguish all the fiery darts of the wicked one?",
        "options": ["The Shield of Faith", "The Helmet of Salvation", "The Belt of Truth", "The Shoes of Peace"],
        "correct_index": 0,
        "full_answer": "The Shield of Faith (Ephesians 6:16).",
        "scripture": "Ephesians 6:16",
        "category": "Spiritual Warfare"
    },
    {
        "id": 69,
        "question": "What is the Sword of the Spirit according to Ephesians 6:17?",
        "options": ["The Word of God", "Human wisdom", "Church traditions", "Personal feelings"],
        "correct_index": 0,
        "full_answer": "The Word of God (Ephesians 6:17).",
        "scripture": "Ephesians 6:17, Hebrews 4:12",
        "category": "Spiritual Warfare"
    },
    {
        "id": 70,
        "question": "What is water baptism a symbol of?",
        "options": [
            "Being buried with Christ in death and raised with Him to walk in newness of life",
            "Washing off physical dirt from the body",
            "Joining a social club",
            "Earning entrance into heaven"
        ],
        "correct_index": 0,
        "full_answer": "It signifies that we are buried with Christ in His death and raised to walk in newness of life.",
        "scripture": "Romans 6:4, Colossians 2:12",
        "category": "Sacraments & Ordinances"
    },
    {
        "id": 71,
        "question": "In whose name did Jesus command us to baptize believers?",
        "options": [
            "In the name of the Father, and of the Son, and of the Holy Ghost",
            "In the name of the local church pastor",
            "In the name of the angels",
            "In the name of Abraham and Moses"
        ],
        "correct_index": 0,
        "full_answer": "\"Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.\" Matthew 28:19.",
        "scripture": "Matthew 28:19",
        "category": "Sacraments & Ordinances"
    },
    {
        "id": 72,
        "question": "What does the cup or juice in Holy Communion represent?",
        "options": [
            "Christ's blood which was shed for the remission of our sins",
            "The wine made in Cana of Galilee",
            "The harvest of grapes in Israel",
            "A traditional secular drink"
        ],
        "correct_index": 0,
        "full_answer": "The cup represents the New Testament in Christ's blood shed for the remission of sins.",
        "scripture": "Matthew 26:27-28, 1 Corinthians 11:25",
        "category": "Sacraments & Ordinances"
    },
    {
        "id": 73,
        "question": "What is tithe according to the Bible?",
        "options": [
            "One-tenth (10%) of all our increase or earnings given to God's house",
            "Any small coin left in our pocket",
            "A tax paid to the government",
            "An optional donation only when we feel like it"
        ],
        "correct_index": 0,
        "full_answer": "The tithe is one-tenth of our income or increase, which belongs holy to the Lord.",
        "scripture": "Malachi 3:10, Leviticus 27:30",
        "category": "Stewardship & Giving"
    },
    {
        "id": 74,
        "question": "What blessing does God promise in Malachi 3:10 to those who bring all the tithes into the storehouse?",
        "options": [
            "He will open the windows of heaven and pour out a blessing that there shall not be room enough to receive it",
            "He will give them physical wings to fly",
            "They will never have to work again",
            "They will become kings of nations"
        ],
        "correct_index": 0,
        "full_answer": "\"Bring ye all the tithes into the storehouse... and prove me now herewith, saith the Lord of hosts, if I will not open you the windows of heaven, and pour you out a blessing...\" Malachi 3:10.",
        "scripture": "Malachi 3:10",
        "category": "Stewardship & Giving"
    },
    {
        "id": 75,
        "question": "What does 2 Corinthians 9:7 say about how God wants us to give?",
        "options": [
            "\"God loveth a cheerful giver\"",
            "God only accepts gifts given grudgingly",
            "Give only when forced by others",
            "Give nothing unless you are rich"
        ],
        "correct_index": 0,
        "full_answer": "\"Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.\" 2 Corinthians 9:7.",
        "scripture": "2 Corinthians 9:7",
        "category": "Stewardship & Giving"
    },
    {
        "id": 76,
        "question": "What is the Great Commission given by Jesus in Mark 16:15?",
        "options": [
            "\"Go ye into all the world, and preach the gospel to every creature\"",
            "\"Stay inside your home and do not speak to strangers\"",
            "\"Build the largest temple in Jerusalem\"",
            "\"Collect taxes for the Roman empire\""
        ],
        "correct_index": 0,
        "full_answer": "\"And he said unto them, Go ye into all the world, and preach the gospel to every creature.\" Mark 16:15.",
        "scripture": "Mark 16:15",
        "category": "Evangelism & Missions"
    },
    {
        "id": 77,
        "question": "What does Romans 1:16 say about the Gospel of Christ?",
        "options": [
            "\"For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth\"",
            "The gospel is a foolish philosophy of men",
            "The gospel is only for the priests",
            "The gospel is a secret for few people"
        ],
        "correct_index": 0,
        "full_answer": "\"For I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth.\" Romans 1:16.",
        "scripture": "Romans 1:16",
        "category": "Salvation"
    },
    {
        "id": 78,
        "question": "What must a person do to be saved according to Romans 10:9?",
        "options": [
            "Confess with your mouth the Lord Jesus, and believe in your heart that God raised Him from the dead",
            "Pay a large sum of money to the church",
            "Be born into a royal family",
            "Fast for 40 days without water"
        ],
        "correct_index": 0,
        "full_answer": "\"That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.\" Romans 10:9.",
        "scripture": "Romans 10:9",
        "category": "Salvation"
    },
    {
        "id": 79,
        "question": "What does 2 Corinthians 5:17 say about anyone who is in Christ?",
        "options": [
            "\"He is a new creature: old things are passed away; behold, all things are become new\"",
            "He will never face any trials or tests",
            "He is exactly the same as before",
            "He becomes an angel immediately"
        ],
        "correct_index": 0,
        "full_answer": "\"Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.\" 2 Corinthians 5:17.",
        "scripture": "2 Corinthians 5:17",
        "category": "Salvation"
    },
    {
        "id": 80,
        "question": "What is divine healing?",
        "options": [
            "The supernatural power of God that heals physical sickness through faith in Jesus Christ",
            "Relying only on magical potions",
            "A myth that stopped after the disciples died",
            "Healing that is bought with money"
        ],
        "correct_index": 0,
        "full_answer": "Divine healing is the supernatural power of God touching and healing the sick body through faith in Jesus Christ.",
        "scripture": "Isaiah 53:5, James 5:14-15",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 81,
        "question": "What did Isaiah 53:5 prophesy concerning the stripes of Jesus?",
        "options": [
            "\"...and with his stripes we are healed\"",
            "His stripes were in vain",
            "His stripes were only for the angels",
            "His stripes brought poverty"
        ],
        "correct_index": 0,
        "full_answer": "\"But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.\" Isaiah 53:5.",
        "scripture": "Isaiah 53:5",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 82,
        "question": "What instruction does James 5:14 give if any person is sick among us?",
        "options": [
            "Let him call for the elders of the church; and let them pray over him, anointing him with oil in the name of the Lord",
            "Hide the person away and do not pray",
            "Blame the person for having sickness",
            "Wait until the sickness gets worse before praying"
        ],
        "correct_index": 0,
        "full_answer": "\"Is any sick among you? let him call for the elders of the church; and let them pray over him, anointing him with oil in the name of the Lord.\" James 5:14.",
        "scripture": "James 5:14-15",
        "category": "Foursquare Doctrine"
    },
    {
        "id": 83,
        "question": "What is the Second Coming of Jesus Christ?",
        "options": [
            "The personal, visible, glorious return of Jesus Christ to catch up His saints and establish His reign",
            "A symbolic idea that only happens in our minds",
            "An event that happened two thousand years ago",
            "The birth of a new human prophet"
        ],
        "correct_index": 0,
        "full_answer": "The personal, visible return of Jesus Christ in power and great glory.",
        "scripture": "1 Thessalonians 4:16-17, Acts 1:11",
        "category": "The Second Coming"
    },
    {
        "id": 84,
        "question": "What will happen to believers who have died in Christ when the Lord returns?",
        "options": [
            "The dead in Christ shall rise first",
            "They will remain forgotten in the dust",
            "They will be reincarnated into animals",
            "They will rise last after all nations"
        ],
        "correct_index": 0,
        "full_answer": "\"For the Lord himself shall descend from heaven with a shout... and the dead in Christ shall rise first.\" 1 Thessalonians 4:16.",
        "scripture": "1 Thessalonians 4:16",
        "category": "The Second Coming"
    },
    {
        "id": 85,
        "question": "Does anyone on earth know the exact day or hour when Jesus will return?",
        "options": [
            "No man knows, neither the angels of heaven, but the Father only",
            "Yes, modern astrologers know the date",
            "Yes, church historians calculated it",
            "Every prophet knows the exact day"
        ],
        "correct_index": 0,
        "full_answer": "\"But of that day and hour knoweth no man, no, not the angels of heaven, but my Father only.\" Matthew 24:36.",
        "scripture": "Matthew 24:36",
        "category": "The Second Coming"
    },
    {
        "id": 86,
        "question": "What is the Golden Rule taught by Jesus in Matthew 7:12?",
        "options": [
            "\"Therefore all things whatsoever ye would that men should do to you, do ye even so to them\"",
            "Do unto others before they do unto you",
            "Love only those who show you kindness",
            "He who has the most gold makes the rules"
        ],
        "correct_index": 0,
        "full_answer": "\"Therefore all things whatsoever ye would that men should do to you, do ye even so to them: for this is the law and the prophets.\" Matthew 7:12.",
        "scripture": "Matthew 7:12",
        "category": "Christian Living"
    },
    {
        "id": 87,
        "question": "What does Psalm 119:105 say about God's Word?",
        "options": [
            "\"Thy word is a lamp unto my feet, and a light unto my path\"",
            "Thy word is a mystery hidden forever",
            "Thy word is only for old people",
            "Thy word changes every generation"
        ],
        "correct_index": 0,
        "full_answer": "\"Thy word is a lamp unto my feet, and a light unto my path.\" Psalms 119:105.",
        "scripture": "Psalms 119:105",
        "category": "The Holy Scriptures"
    },
    {
        "id": 88,
        "question": "What does Proverbs 3:5-6 instruct us to do?",
        "options": [
            "\"Trust in the Lord with all thine heart; and lean not unto thine own understanding\"",
            "Trust in your own wealth and education above all",
            "Do whatever feels right in your own eyes",
            "Listen only to the opinions of the crowd"
        ],
        "correct_index": 0,
        "full_answer": "\"Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.\" Proverbs 3:5-6.",
        "scripture": "Proverbs 3:5-6",
        "category": "Christian Living"
    },
    {
        "id": 89,
        "question": "What does Philippians 4:13 boldly declare for every believer?",
        "options": [
            "\"I can do all things through Christ which strengtheneth me\"",
            "I cannot do anything because I am weak",
            "I can only do things if others help me",
            "Strength comes from wealth and status"
        ],
        "correct_index": 0,
        "full_answer": "\"I can do all things through Christ which strengtheneth me.\" Philippians 4:13.",
        "scripture": "Philippians 4:13",
        "category": "Christian Living"
    },
    {
        "id": 90,
        "question": "What does Romans 8:28 promise to those who love God?",
        "options": [
            "\"All things work together for good to them that love God, to them who are the called according to his purpose\"",
            "Nothing good will ever happen in trials",
            "Only pleasant things happen to Christians",
            "God forgets those who are tested"
        ],
        "correct_index": 0,
        "full_answer": "\"And we know that all things work together for good to them that love God, to them who are the called according to his purpose.\" Romans 8:28.",
        "scripture": "Romans 8:28",
        "category": "Christian Living"
    },
    {
        "id": 91,
        "question": "What does Joshua 1:8 say we must do with the Book of the Law to make our way prosperous?",
        "options": [
            "\"Meditate therein day and night, that thou mayest observe to do according to all that is written therein\"",
            "Keep it closed on the shelf",
            "Read it only once a year on your birthday",
            "Argue about it without obeying it"
        ],
        "correct_index": 0,
        "full_answer": "\"This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night... for then thou shalt make thy way prosperous, and then thou shalt have good success.\" Joshua 1:8.",
        "scripture": "Joshua 1:8",
        "category": "The Holy Scriptures"
    },
    {
        "id": 92,
        "question": "What is faith according to Hebrews 11:1?",
        "options": [
            "\"The substance of things hoped for, the evidence of things not seen\"",
            "Believing only what you can touch with your hands",
            "Hoping for something without any promise from God",
            "A feeling of excitement during music"
        ],
        "correct_index": 0,
        "full_answer": "\"Now faith is the substance of things hoped for, the evidence of things not seen.\" Hebrews 11:1.",
        "scripture": "Hebrews 11:1",
        "category": "Faith & Christian Living"
    },
    {
        "id": 93,
        "question": "According to Hebrews 11:6, is it possible to please God without faith?",
        "options": [
            "No, \"without faith it is impossible to please him\"",
            "Yes, good manners alone please God",
            "Yes, wealth pleases God more than faith",
            "Yes, if you attend church regularly without faith"
        ],
        "correct_index": 0,
        "full_answer": "\"But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.\" Hebrews 11:6.",
        "scripture": "Hebrews 11:6",
        "category": "Faith & Christian Living"
    },
    {
        "id": 94,
        "question": "What did Jesus say about little children in Matthew 19:14?",
        "options": [
            "\"Suffer little children, and forbid them not, to come unto me: for of such is the kingdom of heaven\"",
            "Children must wait until they are adults to know God",
            "Children should be seen and not heard in church",
            "Children cannot understand the Gospel"
        ],
        "correct_index": 0,
        "full_answer": "\"But Jesus said, Suffer little children, and forbid them not, to come unto me: for of such is the kingdom of heaven.\" Matthew 19:14.",
        "scripture": "Matthew 19:14",
        "category": "Children Ministry"
    },
    {
        "id": 95,
        "question": "What is the memory verse of Proverbs 22:6 concerning children's training?",
        "options": [
            "\"Train up a child in the way he should go: and when he is old, he will not depart from it\"",
            "Children will learn everything from school alone",
            "Do not correct a child when they do wrong",
            "Let children choose whatever religion they like"
        ],
        "correct_index": 0,
        "full_answer": "\"Train up a child in the way he should go: and when he is old, he will not depart from it.\" Proverbs 22:6.",
        "scripture": "Proverbs 22:6",
        "category": "Children Ministry"
    },
    {
        "id": 96,
        "question": "What does 1 Timothy 4:12 instruct young believers?",
        "options": [
            "\"Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity\"",
            "Stay silent because you are too young to do anything for God",
            "Follow the bad habits of older people",
            "Wait until you are old before you live holy"
        ],
        "correct_index": 0,
        "full_answer": "\"Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.\" 1 Timothy 4:12.",
        "scripture": "1 Timothy 4:12",
        "category": "Children Ministry"
    },
    {
        "id": 97,
        "question": "Who was the young boy in the Old Testament who heard God calling his name in the temple at night?",
        "options": ["Samuel", "David", "Joseph", "Daniel"],
        "correct_index": 0,
        "full_answer": "Samuel, who answered: \"Speak, Lord; for thy servant heareth.\" 1 Samuel 3:9-10.",
        "scripture": "1 Samuel 3:9-10",
        "category": "Bible Characters"
    },
    {
        "id": 98,
        "question": "Who was the young shepherd boy who defeated the giant Goliath with a sling and stone in the name of the Lord?",
        "options": ["David", "Saul", "Jonathan", "Solomon"],
        "correct_index": 0,
        "full_answer": "David, saying: \"Thou comest to me with a sword, and with a spear... but I come to thee in the name of the Lord of hosts.\" 1 Samuel 17:45.",
        "scripture": "1 Samuel 17:45",
        "category": "Bible Characters"
    },
    {
        "id": 99,
        "question": "Who were the three Hebrew boys who refused to bow down to King Nebuchadnezzar's golden image in Babylon?",
        "options": [
            "Shadrach, Meshach, and Abednego",
            "Peter, James, and John",
            "Paul, Silas, and Barnabas",
            "Caleb, Joshua, and Phinehas"
        ],
        "correct_index": 0,
        "full_answer": "Shadrach, Meshach, and Abednego (Daniel 3).",
        "scripture": "Daniel 3:16-18",
        "category": "Bible Characters"
    },
    {
        "id": 100,
        "question": "What is the true Standard of Attainment for every Christian child and believer?",
        "options": [
            "To grow in the grace and knowledge of our Lord and Saviour Jesus Christ and walk in His footsteps daily",
            "To memorize facts without loving others",
            "To be praised by people for religious performance",
            "To win earthly trophies and ignore the commandments"
        ],
        "correct_index": 0,
        "full_answer": "To grow in the grace and knowledge of our Lord Jesus Christ, living a life of holy obedience, love, and witnessing to His glory.",
        "scripture": "2 Peter 3:18, Ephesians 4:13",
        "category": "Standard of Attainment"
    }
]

combined = existing + additional_questions
print(f"Total questions now: {len(combined)}")

with open(r'c:\Users\IFEDAYO LAWAL\Documents\TAIWO LAWAL\web\src\data\standard_of_attainment.json', 'w', encoding='utf-8') as f:
    json.dump(combined, f, indent=2, ensure_ascii=False)

print("Saved 100 questions to standard_of_attainment.json!")
