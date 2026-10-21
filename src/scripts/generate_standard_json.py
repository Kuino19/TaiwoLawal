import zipfile
import xml.etree.ElementTree as ET
import json
import re

docx_path = r'c:\Users\IFEDAYO LAWAL\Videos\standard\STANDARD OF ATTAINMENT - quiz.docx'
z = zipfile.ZipFile(docx_path)
doc = ET.fromstring(z.read('word/document.xml'))
paras = [''.join(node.itertext()).strip() for node in doc.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p') if ''.join(node.itertext()).strip()]

if paras[0] == "STANDARD OF ATTAINMENT":
    paras = paras[1:]

items = []
current_q = None
current_a = []

for p in paras:
    is_answer_start = p.startswith("A:") or p.startswith("Answer:")
    is_quote = p.startswith('"') or p.startswith('“') or p.startswith('”') or p.startswith("'") or p.startswith("...")
    
    if not is_answer_start and not is_quote and ('?' in p or re.match(r'^\d+[\.\s]', p)):
        if current_q:
            items.append({
                "raw_q": current_q,
                "raw_a": " ".join(current_a)
            })
        current_q = p
        current_a = []
    else:
        current_a.append(p)

if current_q:
    items.append({
        "raw_q": current_q,
        "raw_a": " ".join(current_a)
    })

def clean_text(t):
    t = t.replace('\uFFFD', "'")
    t = t.replace('', "'")
    t = t.replace('“', '"').replace('”', '"').replace('’', "'").replace('‘', "'")
    return t.strip()

# Detailed handcrafted options for all 45 Standard of Attainment questions to guarantee rich, accurate competition prep:
mcq_data = [
    {
        "id": 1,
        "question": "Who made the world and everything in the world?",
        "options": ["God", "The angels", "Man", "Nature formed by chance"],
        "correct_index": 0,
        "full_answer": "God. \"In the beginning, God created the heavens and the earth.\" Genesis 1:1.",
        "scripture": "Genesis 1:1",
        "category": "Creation & God"
    },
    {
        "id": 2,
        "question": "How did God create all things?",
        "options": [
            "With pre-existing materials",
            "Out of nothing, by just giving the command through the words of His mouth",
            "By asking the angels to construct them",
            "Through millions of years of experimentation"
        ],
        "correct_index": 1,
        "full_answer": "God made everything out of nothing but by just giving the command, through the words of HIS mouth.",
        "scripture": "Genesis 1:3, Psalm 33:9",
        "category": "Creation & God"
    },
    {
        "id": 3,
        "question": "How was man's body made?",
        "options": [
            "Out of the dust of the ground",
            "From the sea foam",
            "From the sunlight",
            "From animal tissue"
        ],
        "correct_index": 0,
        "full_answer": "Man's body was made out of the dust of the ground. \"And the Lord formed man of the dust of the ground.\" Genesis 2:7.",
        "scripture": "Genesis 2:7",
        "category": "Creation of Man"
    },
    {
        "id": 4,
        "question": "How was man's soul given to him?",
        "options": [
            "He evolved naturally",
            "God breathed into his nostrils the breath of life",
            "Through eating the tree of life",
            "The angels whispered life into him"
        ],
        "correct_index": 1,
        "full_answer": "God breathed into him. \"And God breathed into his nostrils the breath of life; and man became a living soul.\" Genesis 2:7.",
        "scripture": "Genesis 2:7",
        "category": "Creation of Man"
    },
    {
        "id": 5,
        "question": "In how many days did the Creation take place?",
        "options": ["In three days", "In seven days", "In six days", "In twelve days"],
        "correct_index": 2,
        "full_answer": "In six days. \"And God saw everything that he had made, and behold, it was very good, and the evening and the morning were the sixth day.\" Genesis 1:31.",
        "scripture": "Genesis 1:31",
        "category": "Creation & God"
    },
    {
        "id": 6,
        "question": "What word do we use to express the fact that the three persons — the Father, the Son, and the Holy Spirit — are one God?",
        "options": ["The Omnipresence", "The Trinity", "The Sanctuary", "The Covenant"],
        "correct_index": 1,
        "full_answer": "The Trinity.",
        "scripture": "Matthew 28:19, 2 Corinthians 13:14",
        "category": "The Nature of God"
    },
    {
        "id": 7,
        "question": "How do we know what God is like?",
        "options": [
            "By scientific experiments",
            "By guessing and philosophy",
            "By reading the Bible and by Jesus' life on earth",
            "By dreams and visions only"
        ],
        "correct_index": 2,
        "full_answer": "We know what He is like by reading the Bible and by Jesus' life on earth.",
        "scripture": "Hebrews 1:1-2, John 14:9",
        "category": "The Nature of God"
    },
    {
        "id": 8,
        "question": "Who does God love?",
        "options": [
            "Only good church leaders",
            "Only the children of Israel",
            "Everybody in the whole world, for \"God is love\"",
            "Only those who never sin"
        ],
        "correct_index": 2,
        "full_answer": "God loves everybody in the whole world, for \"God is love.\"",
        "scripture": "1 John 4:8, John 3:16",
        "category": "The Nature of God"
    },
    {
        "id": 9,
        "question": "How should we act toward God?",
        "options": [
            "We should honour and love God's name and be reverent in God's house",
            "We should treat Him like an equal friend without reverence",
            "We only need to think about Him on Sundays",
            "We should fear Him with terror and avoid prayer"
        ],
        "correct_index": 0,
        "full_answer": "We should honour and love God's name and be reverent in God's house. \"Let us have grace, whereby we may serve God acceptably with reverence and godly fear.\" Hebrews 12:28.",
        "scripture": "Hebrews 12:28",
        "category": "Worship & Reverence"
    },
    {
        "id": 10,
        "question": "What Bible verse expresses God's love for everyone?",
        "options": ["Romans 3:23", "John 3:16", "Genesis 1:1", "Psalm 23:1"],
        "correct_index": 1,
        "full_answer": "John 3:16 \"For God so loved the world that He gave His only begotten Son that whosoever believeth in Him should not perish but have everlasting life.\"",
        "scripture": "John 3:16",
        "category": "Salvation"
    },
    {
        "id": 11,
        "question": "How long has God lived?",
        "options": [
            "He started when the world began",
            "God has lived always, and will live forever",
            "About 6,000 years",
            "Until the end of human history"
        ],
        "correct_index": 1,
        "full_answer": "God has lived always, and will live forever.",
        "scripture": "Psalm 90:2, Revelation 1:8",
        "category": "The Attributes of God"
    },
    {
        "id": 12,
        "question": "Is God good?",
        "options": [
            "God is holy, just and good",
            "God is indifferent to morality",
            "God changes between good and harsh",
            "God is good only to the righteous"
        ],
        "correct_index": 0,
        "full_answer": "God is holy, just and good. \"And the Lord passed by before him, and proclaimed-The Lord, The Lord God, merciful and gracious, longsuffering, and abundant in goodness and truth.\" Exodus 34:6.",
        "scripture": "Exodus 34:6",
        "category": "The Attributes of God"
    },
    {
        "id": 13,
        "question": "Does God ever change?",
        "options": [
            "Yes, He changes with different eras",
            "God is always the same. \"For I am the Lord, I change not\"",
            "He changes His mind often",
            "He changes depending on how people treat Him"
        ],
        "correct_index": 1,
        "full_answer": "God is always the same. \"For I am the Lord, I change not.\" Malachi 3:6.",
        "scripture": "Malachi 3:6",
        "category": "The Attributes of God"
    },
    {
        "id": 14,
        "question": "Is there more than one God?",
        "options": [
            "Yes, there are many gods for each nation",
            "There is but one living and true God",
            "There are three different gods in Heaven",
            "There were once many gods, now only one"
        ],
        "correct_index": 1,
        "full_answer": "There is but one living and true God. \"...the Lord is God, and that there is none else.\" 1 Kings 8:60.",
        "scripture": "1 Kings 8:60",
        "category": "The Nature of God"
    },
    {
        "id": 15,
        "question": "Can we see God?",
        "options": [
            "Yes, with special telescopes",
            "God is a spirit and cannot be seen. \"No man hath seen God at any time\"",
            "Yes, in the form of clouds",
            "Any pure person can see Him face to face now"
        ],
        "correct_index": 1,
        "full_answer": "God is a spirit and cannot be seen. \"No man hath seen God at any time.\" John 1:18.",
        "scripture": "John 1:18, 1 Timothy 6:16",
        "category": "The Attributes of God"
    },
    {
        "id": 16,
        "question": "What have we learned about the personality of God?",
        "options": [
            "God is an impersonal force of nature",
            "God is a spirit, infinite, eternal and unchangeable in His being, wise, powerful, holy, just, good and true",
            "God is a human who became divine",
            "God is a distant observer who does not intervene"
        ],
        "correct_index": 1,
        "full_answer": "God is a spirit, infinite, eternal and unchangeable in His being, wise, powerful, holy, just, good and true.",
        "scripture": "John 4:24, Psalm 102:27",
        "category": "The Attributes of God"
    },
    {
        "id": 17,
        "question": "What person is introduced in the first verse of the Bible?",
        "options": ["Adam", "Moses", "God, our Heavenly Father", "Abraham"],
        "correct_index": 2,
        "full_answer": "God, our Heavenly Father.",
        "scripture": "Genesis 1:1",
        "category": "Creation & God"
    },
    {
        "id": 18,
        "question": "Who is God?",
        "options": [
            "The Creator and Ruler of all things",
            "An ancient king of Israel",
            "An angel with great power",
            "A figure of ancient mythology"
        ],
        "correct_index": 0,
        "full_answer": "God is the Creator and Ruler of all things.",
        "scripture": "Psalm 103:19",
        "category": "The Nature of God"
    },
    {
        "id": 19,
        "question": "What does God know?",
        "options": [
            "Only things that happen in the day",
            "God knows all things even our thoughts",
            "Only things written in books",
            "Everything except the future"
        ],
        "correct_index": 1,
        "full_answer": "God knows all things even our thoughts. \"Thou knowest my downsitting and mine uprising, thou understandest my thought afar off.\" Psalms 139:2.",
        "scripture": "Psalms 139:2",
        "category": "The Attributes of God"
    },
    {
        "id": 20,
        "question": "What can God do?",
        "options": [
            "Only what human laws permit",
            "God can do whatever He chooses to do. He can do all things",
            "He can only control the weather",
            "He can do everything except defeat evil"
        ],
        "correct_index": 1,
        "full_answer": "God can do whatever He chooses to do. He can do all things. \"Behold, I am the Lord, the God of all flesh: is there anything too hard for me?\" Jeremiah 32:27.",
        "scripture": "Jeremiah 32:27, Luke 1:37",
        "category": "The Attributes of God"
    },
    {
        "id": 21,
        "question": "What separated Adam and Eve from God?",
        "options": [
            "A wide river",
            "Their disobedience",
            "The angel of death",
            "Old age"
        ],
        "correct_index": 1,
        "full_answer": "Their disobedience.",
        "scripture": "Genesis 3, Isaiah 59:2",
        "category": "The Fall of Man"
    },
    {
        "id": 22,
        "question": "What can people do so they will not be separated from God?",
        "options": [
            "Confess their sins and ask God to forgive them for their disobedience",
            "Offer animal sacrifices in the temple",
            "Hide their mistakes and never speak of them",
            "Do lots of charity without repentance"
        ],
        "correct_index": 0,
        "full_answer": "Confess their sins and ask God to forgive them for their disobedience.",
        "scripture": "1 John 1:9, Proverbs 28:13",
        "category": "Salvation"
    },
    {
        "id": 23,
        "question": "Who tempted Adam and Eve to disobey God?",
        "options": ["An Egyptian priest", "Satan, the Devil", "The angel Gabriel", "Cain"],
        "correct_index": 1,
        "full_answer": "Satan, the Devil.",
        "scripture": "Genesis 3:1-6, Revelation 12:9",
        "category": "The Fall of Man"
    },
    {
        "id": 24,
        "question": "Has anyone else besides Adam and Eve disobeyed God?",
        "options": [
            "No, only Adam and Eve sinned",
            "Yes, everyone, the whole human race. \"For all have sinned and come short of the glory of God\"",
            "Only people who went to prison",
            "Only adults, not young people"
        ],
        "correct_index": 1,
        "full_answer": "Yes, everyone, the whole human race. \"For all have sinned (disobeyed) and come short of the glory of God.\" Romans 3:23.",
        "scripture": "Romans 3:23",
        "category": "The Fall of Man"
    },
    {
        "id": 25,
        "question": "How did God create all things? (Repeated review in catechism)",
        "options": [
            "God made everything out of nothing but by just giving the command, through the words of HIS mouth",
            "By assembling elements over centuries",
            "Through physical labor like a builder",
            "By taking material from another universe"
        ],
        "correct_index": 0,
        "full_answer": "God made everything out of nothing but by just giving the command, through the words of HIS mouth.",
        "scripture": "Hebrews 11:3",
        "category": "Creation & God"
    },
    {
        "id": 26,
        "question": "Is there any reason why we should evangelize?",
        "options": [
            "Only if we want to earn extra points",
            "Yes, because Jesus told us to do so (\"And ye shall be witnesses unto me...\")",
            "Only pastors are allowed to evangelize",
            "No, everyone will naturally find out on their own"
        ],
        "correct_index": 1,
        "full_answer": "Yes, because Jesus told us to do so. \"And ye shall be witnesses unto me both in Jerusalem and in all Judea, and in Samaria and unto the uttermost part of the earth.\" Acts 1:8.",
        "scripture": "Acts 1:8, Mark 16:15",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 27,
        "question": "What is one of the best ways to evangelize?",
        "options": [
            "Argue with people until they agree",
            "Talk to people about Jesus Christ and show them how they can belong to God's family",
            "Give them money to come to church",
            "Wait quietly and never speak"
        ],
        "correct_index": 1,
        "full_answer": "One of the best ways is to talk to people about Jesus Christ and show them how they can belong to God's family.",
        "scripture": "2 Corinthians 5:20",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 28,
        "question": "What is personal soul winning?",
        "options": [
            "Winning a Bible quiz trophy",
            "To tell a person about Jesus Christ and to show him how to become a Christian",
            "Writing a book about theology",
            "Donating clothes to the poor"
        ],
        "correct_index": 1,
        "full_answer": "Personal soul winning is to tell a person about Jesus Christ and to show him how to become a Christian.",
        "scripture": "Acts 8:35",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 29,
        "question": "How do you lead someone to Jesus Christ?",
        "options": [
            "By forcing them to attend services every week",
            "By showing him in the Bible that Jesus loves him, why he needs Jesus as personal Saviour, and telling him he must accept Christ as Saviour",
            "By teaching him church history",
            "By asking him to do good deeds first"
        ],
        "correct_index": 1,
        "full_answer": "You lead a person to Christ by showing him in the Bible that Jesus loves him and show him why he needs Jesus as personal Saviour, and by telling him he must accept Christ as Saviour.",
        "scripture": "Romans 10:9-10",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 30,
        "question": "What will show the non-Christian person that he needs Jesus Christ as his own Saviour?",
        "options": [
            "Human philosophy",
            "The Bible which is God's Word",
            "Science textbooks",
            "Social media posts"
        ],
        "correct_index": 1,
        "full_answer": "The Bible which is God's Word. \"And that from a child thou hast known the holy Scriptures. Which are able to make thee wise unto salvation through faith which is in Christ Jesus.\" II Timothy 3:15.",
        "scripture": "2 Timothy 3:15, Hebrews 4:12",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 31,
        "question": "Can anyone help someone else to become a Christian?",
        "options": [
            "No, only ordained bishops and reverends",
            "Yes, everyone who first has accepted Christ as his own Saviour and lives for Him each day can help others to become Christians",
            "Only elderly Christians",
            "Only those who have attended Bible college"
        ],
        "correct_index": 1,
        "full_answer": "Yes, everyone who first has accepted Christ as his own Saviour and lives for Him each day can help others to become Christians.",
        "scripture": "1 Peter 3:15",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 32,
        "question": "Is it the responsibility of every Christian to tell other people about Jesus Christ?",
        "options": [
            "No, only professional evangelists",
            "Yes, every Christian is responsible to see that people around the world hear the story of Jesus Christ and what He has done for us",
            "Only Sunday school teachers",
            "Only when asked direct questions"
        ],
        "correct_index": 1,
        "full_answer": "Yes, every Christian is responsible to see that people around the world hear the story of Jesus Christ and what He has done for us.",
        "scripture": "Matthew 28:19-20",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 33,
        "question": "Where may we tell others about Jesus?",
        "options": [
            "Everywhere: home, school, play, work, church or any place we meet non-Christian people",
            "Only inside a dedicated church building",
            "Only on Sunday mornings",
            "Only in foreign mission fields"
        ],
        "correct_index": 0,
        "full_answer": "Everywhere: home, school, play, work, church or any place we meet non-Christian people.",
        "scripture": "Colossians 3:17, Acts 5:42",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 34,
        "question": "What does Proverbs 11:30 say about people who win people to Christ?",
        "options": [
            "\"...he that winneth souls is rich\"",
            "\"...he that winneth souls is wise\"",
            "\"...he that winneth souls shall never weep\"",
            "\"...he that winneth souls is famous\""
        ],
        "correct_index": 1,
        "full_answer": "Proverbs 11:30b \"...he that winneth souls is wise.\"",
        "scripture": "Proverbs 11:30",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 35,
        "question": "How did God make it possible for us to have eternal life?",
        "options": [
            "By building great monuments",
            "By sending angels to teach us philosophy",
            "God gave His only begotten Son that whosoever believeth in Him should not perish but have everlasting life",
            "By requiring impossible rituals"
        ],
        "correct_index": 2,
        "full_answer": "\"For God so loved the world, that He gave His only begotten Son, that whosoever believeth in Him, should not perish but have everlasting life.\" John 3:16.",
        "scripture": "John 3:16",
        "category": "Salvation"
    },
    {
        "id": 36,
        "question": "What did God do with the sins of the people?",
        "options": [
            "He pretended they did not exist",
            "He permitted Jesus to take the punishment for the people's sins",
            "He blamed innocent animals forever",
            "He left everyone to bear their own eternal penalty"
        ],
        "correct_index": 1,
        "full_answer": "He permitted Jesus to take the punishment for the people's sins. \"All we like sheep have gone astray: we have turned everyone to his own way, and the Lord hath laid on him the iniquity (sin) of us all.\" Isaiah 53:6.",
        "scripture": "Isaiah 53:6",
        "category": "Salvation"
    },
    {
        "id": 37,
        "question": "What did Jesus do to take away our sins?",
        "options": [
            "He died on the cross and there He was punished for our sins",
            "He wrote a book of new laws",
            "He told us to pay money to the temple",
            "He withdrew to the mountains away from mankind"
        ],
        "correct_index": 0,
        "full_answer": "He died on the cross and there He was punished for our sins. \"...while we were yet sinners, Christ died for us.\" Romans 5:8.",
        "scripture": "Romans 5:8, 1 Peter 2:24",
        "category": "Salvation"
    },
    {
        "id": 38,
        "question": "Why have not all people taken Jesus Christ as their Saviour?",
        "options": [
            "Because some have never heard about Him and others have not believed on Him",
            "Because Jesus only died for a small group of people",
            "Because the gospel was hidden in a secret vault",
            "Because God does not allow everyone to be saved"
        ],
        "correct_index": 0,
        "full_answer": "Because some have never heard about Him and others have not believed on Him. \"How then shall they call on him in whom they have not believed? And how shall they believe in him of whom they have not heard? And how shall they hear without a preacher?\" Romans 10:14.",
        "scripture": "Romans 10:14",
        "category": "Evangelism & Soul Winning"
    },
    {
        "id": 39,
        "question": "What does salvation mean?",
        "options": [
            "Becoming wealthy and respected on earth",
            "To be saved from guilt and the punishment of sin by taking Jesus Christ as Saviour",
            "Having a high score in a religious exam",
            "Joining a social club at church"
        ],
        "correct_index": 1,
        "full_answer": "Salvation means to be saved from guilt and the punishment of sin by taking Jesus Christ as Saviour.",
        "scripture": "Acts 4:12, Titus 2:11",
        "category": "Salvation"
    },
    {
        "id": 40,
        "question": "Do we become a Christian by the good things we do?",
        "options": [
            "Yes, if our good deeds outnumber our bad deeds",
            "No, we cannot become saved by doing good things (\"For by grace are ye saved through faith... it is the gift of God\")",
            "Yes, by being polite and doing charity",
            "Yes, good works are the only requirement for heaven"
        ],
        "correct_index": 1,
        "full_answer": "No. we cannot become saved by doing good things. \"For by grace are ye saved through faith, and that not of yourselves it is the gift of God: Not of works, lest any man should boast.\" Ephesians 2:8-9.",
        "scripture": "Ephesians 2:8-9",
        "category": "Salvation"
    },
    {
        "id": 41,
        "question": "Can we earn our way to heaven?",
        "options": [
            "Yes, with enough hard work and tithes",
            "No, eternal life is a gift given by God (\"the gift of God is eternal life through Jesus Christ our Lord\")",
            "Yes, if our ancestors were saints",
            "Yes, by fasting every day"
        ],
        "correct_index": 1,
        "full_answer": "No, eternal life is a gift given by God. \"For the wages of sin is death (separation from God) but the gift of God is eternal life through Jesus Christ our Lord.\" Romans 6:23.",
        "scripture": "Romans 6:23",
        "category": "Salvation"
    },
    {
        "id": 42,
        "question": "Who conducts the baptismal service?",
        "options": [
            "Any church member without permission",
            "The pastor, an evangelist, or any minister of the Gospel",
            "The town mayor",
            "Only angels in heaven"
        ],
        "correct_index": 1,
        "full_answer": "The pastor, an evangelist, or any minister of the Gospel.",
        "scripture": "Matthew 28:19, Acts 8:38",
        "category": "Sacraments & Ordinances"
    },
    {
        "id": 43,
        "question": "What does the word \"communion\" mean?",
        "options": [
            "A public debate in church",
            "A sacrament where you partake of bread and the juice",
            "Singing in the choir together",
            "Collecting offerings on the first Sunday"
        ],
        "correct_index": 1,
        "full_answer": "It is a sacrament where you partake of bread and the juice.",
        "scripture": "1 Corinthians 10:16",
        "category": "Sacraments & Ordinances"
    },
    {
        "id": 44,
        "question": "What does the bread, served at communion, represent?",
        "options": [
            "The physical food eaten in the wilderness",
            "Christ's body which was broken for us when He died on the cross",
            "The grain harvested by the farmers",
            "The unity of the political community"
        ],
        "correct_index": 1,
        "full_answer": "The bread represents Christ's body which was broken for us when He died on the cross.",
        "scripture": "1 Corinthians 11:24, Luke 22:19",
        "category": "Sacraments & Ordinances"
    },
    {
        "id": 45,
        "question": "What is another name for communion?",
        "options": [
            "The Passover Feast",
            "\"The Lord's Supper\"",
            "The Pentecost Feast",
            "The Love Offering"
        ],
        "correct_index": 1,
        "full_answer": "Communion is also known as \"The Lord's Supper\".",
        "scripture": "1 Corinthians 11:20",
        "category": "Sacraments & Ordinances"
    }
]

out_path = r'c:\Users\IFEDAYO LAWAL\Documents\TAIWO LAWAL\web\src\data\standard_of_attainment.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(mcq_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(mcq_data)} Standard of Attainment questions at {out_path}!")
