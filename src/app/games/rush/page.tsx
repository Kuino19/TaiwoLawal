'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Trophy, Play, RotateCcw, XCircle, CheckCircle2, Flame, Heart, Sparkles, Shield, Zap, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerRealisticConfetti } from '@/lib/confettiBurst';
import { gameSound, triggerHaptic } from '@/lib/gameSound';
import { earnTalents, spendTalents, unlockAchievement, recordGameWin } from '@/lib/gameProfile';
import GameTopBar from '@/components/games/GameTopBar';
import ShareScoreButton from '@/components/games/ShareScoreButton';

type GameMode = 'classic' | 'marathon' | 'survival';

interface TriviaItem {
    q: string;
    options: string[];
    a: number;
}

const MASSIVE_TRIVIA_POOL: TriviaItem[] = [
    // -------------------------------------------------------------
    // GENESIS, PATRIARCHS & THE CREATION (KJV)
    // -------------------------------------------------------------
    { q: "Who built the ark of gopher wood to preserve his household and living creatures from the flood?", options: ["Moses", "David", "Noah", "Abraham"], a: 2 },
    { q: "How many days did God take to create the heaven, earth, and all their host before resting on the seventh?", options: ["5", "6", "7", "40"], a: 1 },
    { q: "Who was the oldest man recorded in the Holy Scriptures, living 969 years?", options: ["Methuselah", "Enoch", "Jared", "Noah"], a: 0 },
    { q: "Which man walked with God, and he was not; for God took him?", options: ["Elijah", "Enoch", "Melchizedek", "Moses"], a: 1 },
    { q: "Who was the priest of the most high God and King of Salem who met Abraham with bread and wine?", options: ["Aaron", "Jethro", "Melchizedek", "Eleazar"], a: 2 },
    { q: "What was the name of Abraham's promised son born to Sarah in their old age?", options: ["Ishmael", "Isaac", "Jacob", "Esau"], a: 1 },
    { q: "For what dish did Esau despise his birthright and sell it to his brother Jacob?", options: ["Roast lamb", "Red pottage of lentils", "Unleavened bread", "Barley cakes"], a: 1 },
    { q: "Who wrestled with an angel until the breaking of the day at Peniel?", options: ["Abraham", "Isaac", "Jacob", "Joseph"], a: 2 },
    { q: "What new name did God bestow upon Jacob after he prevailed at Peniel?", options: ["Judah", "Israel", "Ephraim", "Jeshurun"], a: 1 },
    { q: "How many total sons were born unto Jacob?", options: ["10", "11", "12", "70"], a: 2 },
    { q: "Who was Jacob's youngest son, born to Rachel before she died near Bethlehem?", options: ["Joseph", "Benjamin", "Dan", "Gad"], a: 1 },
    { q: "To which land was Joseph carried and sold as a slave to Potiphar?", options: ["Assyria", "Babylon", "Egypt", "Midian"], a: 2 },
    { q: "What creature did Noah first send out of the ark to see if the waters had abated?", options: ["Dove", "Raven", "Sparrow", "Swallow"], a: 1 },
    { q: "What sign did God set in the cloud as the token of His covenant never again to destroy all flesh with a flood?", options: ["Rainbow", "Pillar of cloud", "Burning bush", "Bright morning star"], a: 0 },
    { q: "In what ancient land was the tower built whose top was intended to reach unto heaven?", options: ["Babel (Shinar)", "Nineveh", "Ur of the Chaldees", "Gilead"], a: 0 },
    { q: "From which city did Terah and Abram depart when called by God?", options: ["Haran", "Ur of the Chaldees", "Damascus", "Jericho"], a: 1 },
    { q: "What happened to Lot's wife when she looked back toward Sodom?", options: ["She turned into stone", "She became a pillar of salt", "She fell into a pit", "She was struck blind"], a: 1 },
    { q: "On which mountain did God test Abraham by commanding him to offer Isaac?", options: ["Mount Sinai", "Mount Moriah", "Mount Carmel", "Mount Nebo"], a: 1 },
    { q: "What animal was caught in a thicket by his horns to replace Isaac upon the altar?", options: ["A bullock", "A ram", "A he-goat", "A lamb"], a: 1 },
    { q: "In the land of Uz, who was described as perfect, upright, one that feared God and eschewed evil?", options: ["Job", "Eliphaz", "Elihu", "Balaam"], a: 0 },

    // -------------------------------------------------------------
    // EXODUS, THE LAW, TABERNACLE & WILDERNESS (KJV)
    // -------------------------------------------------------------
    { q: "What sea did the LORD divide by a strong east wind to deliver the children of Israel?", options: ["Dead Sea", "Red Sea", "Sea of Galilee", "Great Sea"], a: 1 },
    { q: "Out of what did the LORD first call unto Moses in Horeb?", options: ["A cloud of glory", "A burning bush that was not consumed", "A mighty earthquake", "A whirlwind"], a: 1 },
    { q: "Who served as Moses' brother and appointed spokesman before Pharaoh?", options: ["Hur", "Aaron", "Joshua", "Caleb"], a: 1 },
    { q: "How many plagues did the LORD pour out upon the land of Egypt?", options: ["7", "10", "12", "40"], a: 1 },
    { q: "What was the final and tenth plague visited upon Egypt on the night of the Passover?", options: ["Locusts", "Darkness", "Death of the firstborn", "Boils and blains"], a: 2 },
    { q: "What miraculous bread fell round about the host as small as the hoar frost?", options: ["Manna", "Quails", "Showbread", "Barley grain"], a: 0 },
    { q: "Upon which mountain did Moses receive the two tables of stone written with the finger of God?", options: ["Mount Horeb / Sinai", "Mount Hor", "Mount Hermon", "Mount Pisgah"], a: 0 },
    { q: "What wood was commanded for constructing the Ark of the Covenant and the Tabernacle boards?", options: ["Cedar wood", "Shittim (Acacia) wood", "Olive wood", "Oak wood"], a: 1 },
    { q: "What two figures of beaten gold were positioned at the ends of the Mercy Seat?", options: ["Seraphim", "Cherubims", "Eagles", "Lions"], a: 1 },
    { q: "Which tribe of Israel was chosen and set apart to minister in the holy things of the sanctuary?", options: ["Judah", "Levi", "Benjamin", "Ephraim"], a: 1 },
    { q: "What three items were kept within or before the Ark of the Covenant?", options: ["Aaron's rod, pot of manna, tables of covenant", "Moses' staff, golden censer, bronze serpent", "Gideon's fleece, jar of oil, crown", "David's sling, silver trumpet, scroll"], a: 0 },
    { q: "Whose rod budded, blossomed, and yielded almonds overnight to confirm his priesthood?", options: ["Moses", "Aaron", "Korah", "Eleazar"], a: 1 },
    { q: "Who led the famous rebellion against Moses and Aaron and was swallowed alive by the earth?", options: ["Dathan and Abiram with Korah", "Balaam and Balak", "Sihon and Og", "Achan"], a: 0 },
    { q: "What metal serpent did Moses fashion and set upon a pole so that whoever looked lived?", options: ["Golden serpent", "Silver serpent", "Brass serpent", "Iron serpent"], a: 2 },
    { q: "Which two spies brought back a good report of the Promised Land, declaring: 'Let us go up at once'?", options: ["Joshua and Caleb", "Moses and Aaron", "Nadab and Abihu", "Gideon and Phinehas"], a: 0 },
    { q: "From which mountain did Moses view the Promised Land before his death, whose sepulchre no man knoweth?", options: ["Mount Nebo (Pisgah)", "Mount Carmel", "Mount Sinai", "Mount Tabor"], a: 0 },
    { q: "How many years did the children of Israel wander in the wilderness until that generation passed?", options: ["30 years", "40 years", "70 years", "120 years"], a: 1 },

    // -------------------------------------------------------------
    // CONQUEST, JUDGES & EARLY KINGDOM (KJV)
    // -------------------------------------------------------------
    { q: "Who succeeded Moses and led the children of Israel across the Jordan into Canaan?", options: ["Caleb", "Joshua", "Phinehas", "Othniel"], a: 1 },
    { q: "Which woman hid the two spies in Jericho and hung a scarlet cord in her window?", options: ["Rahab", "Deborah", "Jael", "Delilah"], a: 0 },
    { q: "How many times did the armed men circle Jericho on the seventh day before the walls fell flat?", options: ["Once", "Three times", "Seven times", "Twelve times"], a: 2 },
    { q: "At whose prayer did the sun stand still upon Gibeon and the moon in the valley of Ajalon?", options: ["Moses", "Joshua", "David", "Elijah"], a: 1 },
    { q: "Who was the female judge and prophetess who judged Israel under a palm tree between Ramah and Bethel?", options: ["Ruth", "Deborah", "Huldah", "Miriam"], a: 1 },
    { q: "Which brave woman drove a tent nail into the temple of Sisera, captain of Jabin's army?", options: ["Jael", "Deborah", "Abigail", "Michal"], a: 0 },
    { q: "With how many men did Gideon rout the entire host of Midian by trumpets, pitchers, and lamps?", options: ["32,000", "10,000", "300", "70"], a: 2 },
    { q: "What left-handed judge slew Eglon, the fat king of Moab, with an eighteen-inch dagger?", options: ["Ehud", "Shamgar", "Barak", "Jephthah"], a: 0 },
    { q: "Who slew six hundred Philistines with an ox goad and delivered Israel?", options: ["Shamgar", "Samson", "Gideon", "Othniel"], a: 0 },
    { q: "From what tribe was Samson, whose strength remained while his Nazarite vow was kept?", options: ["Dan", "Judah", "Benjamin", "Manasseh"], a: 0 },
    { q: "With what unusual instrument did Samson slay one thousand Philistines at Lehi?", options: ["A spear of brass", "The jawbone of an ass", "A heavy iron rod", "A sling and smooth stone"], a: 1 },
    { q: "Which woman from the valley of Sorek enticed Samson until he revealed the secret of his strength?", options: ["Jezebel", "Delilah", "Athaliah", "Orpah"], a: 1 },
    { q: "Which faithful Moabitess said: 'Whither thou goest, I will go; and thy people shall be my people, and thy God my God'?", options: ["Orpah", "Ruth", "Vashti", "Tamar"], a: 1 },
    { q: "Who was the wealthy kinsman-redeemer of Bethlehem who took Ruth to be his wife?", options: ["Boaz", "Elimelech", "Mahlon", "Jesse"], a: 0 },
    { q: "Who prayed silently in the tabernacle at Shiloh, moving her lips, and bore Samuel?", options: ["Hannah", "Peninnah", "Elizabeth", "Rachel"], a: 0 },
    { q: "Who was the high priest at Shiloh whose two wicked sons were Hophni and Phinehas?", options: ["Eli", "Samuel", "Ahimelech", "Zadok"], a: 0 },
    { q: "Who was anointed as the very first king over the united nation of Israel?", options: ["David", "Saul", "Solomon", "Jeroboam"], a: 1 },

    // -------------------------------------------------------------
    // KINGS OF JUDAH & ISRAEL, DAVID & SOLOMON (KJV)
    // -------------------------------------------------------------
    { q: "What city was King David's birthplace and the home of his father Jesse?", options: ["Hebron", "Jerusalem", "Bethlehem", "Nazareth"], a: 2 },
    { q: "How many smooth stones did David choose out of the brook before confronting Goliath?", options: ["One", "Three", "Five", "Seven"], a: 2 },
    { q: "Which giant champion of Gath stood six cubits and a span, bearing a spear like a weaver's beam?", options: ["Og", "Sihon", "Goliath", "Ishbi-benob"], a: 2 },
    { q: "Who was King Saul's son whose soul was knit with the soul of David in covenant friendship?", options: ["Jonathan", "Ish-bosheth", "Abner", "Mephibosheth"], a: 0 },
    { q: "Who was the lame son of Jonathan to whom David restored all the land of Saul and gave bread at his table?", options: ["Mephibosheth", "Hanun", "Chimham", "Barzillai"], a: 0 },
    { q: "What prophet came to David with the parable of the ewe lamb after his sin concerning Uriah?", options: ["Samuel", "Nathan", "Gad", "Ahijah"], a: 1 },
    { q: "Which king asked God for an understanding heart to judge the people, rather than riches or long life?", options: ["Solomon", "Hezekiah", "Josiah", "Jehoshaphat"], a: 0 },
    { q: "On which mountain in Jerusalem did Solomon build the house of the LORD?", options: ["Mount Moriah", "Mount of Olives", "Mount Carmel", "Mount Zion"], a: 0 },
    { q: "Which queen came from the uttermost parts of the earth with hard questions and great trains of spices to prove Solomon?", options: ["Queen of Sheba", "Queen Candace", "Queen Esther", "Queen Athaliah"], a: 0 },
    { q: "After Solomon, which of his sons answered the elders roughly and caused the kingdom to divide?", options: ["Rehoboam", "Jeroboam", "Adonijah", "Absalom"], a: 0 },
    { q: "Who set up two golden calves in Bethel and Dan, causing Israel to sin?", options: ["Jeroboam", "Rehoboam", "Ahab", "Omri"], a: 0 },
    { q: "Which wicked king of Israel married Jezebel, daughter of Ethbaal king of the Zidonians?", options: ["Ahab", "Jehu", "Manasseh", "Ahaz"], a: 0 },
    { q: "On which mountain did Elijah challenge 450 prophets of Baal to a test by fire?", options: ["Mount Carmel", "Mount Tabor", "Mount Sinai", "Mount Hermon"], a: 0 },
    { q: "What carried the prophet Elijah up by a whirlwind into heaven?", options: ["A cloud of angels", "A chariot of fire and horses of fire", "A great eagle", "A pillar of smoke"], a: 1 },
    { q: "Who received a double portion of Elijah's spirit when his mantle fell?", options: ["Elisha", "Gehazi", "Obadiah", "Micaiah"], a: 0 },
    { q: "Which Syrian captain was healed of his leprosy after washing seven times in the Jordan River?", options: ["Naaman", "Ben-hadad", "Hazael", "Rezin"], a: 0 },
    { q: "Which king of Judah had fifteen years added to his life, confirmed by the shadow returning ten degrees backward?", options: ["Hezekiah", "Josiah", "Uzziah", "Asa"], a: 0 },
    { q: "Which boy king began to reign at eight years old, repaired the temple, and found the book of the law?", options: ["Josiah", "Joash", "Manasseh", "Jehoash"], a: 0 },

    // -------------------------------------------------------------
    // PROPHETS, EXILE & RETURN (KJV)
    // -------------------------------------------------------------
    { q: "Which prophet saw the LORD sitting upon a throne, high and lifted up, with seraphims crying 'Holy, holy, holy'?", options: ["Jeremiah", "Isaiah", "Ezekiel", "Daniel"], a: 1 },
    { q: "Who is known as the weeping prophet who witnessed the destruction of Jerusalem and wrote Lamentations?", options: ["Jeremiah", "Hosea", "Amos", "Micah"], a: 0 },
    { q: "Which prophet saw the vision of four living creatures, wheels within wheels, and a valley of dry bones?", options: ["Ezekiel", "Daniel", "Zechariah", "Habakkuk"], a: 0 },
    { q: "Who refused to defile himself with the portion of the Babylonian king's meat and wine?", options: ["Daniel", "Nehemiah", "Ezra", "Mordecai"], a: 0 },
    { q: "What were the Babylonian names given to Hananiah, Mishael, and Azariah?", options: ["Belteshazzar, Darius, Cyrus", "Shadrach, Meshach, Abednego", "Sanballat, Tobiah, Geshem", "Haman, Mordecai, Harbonah"], a: 1 },
    { q: "Who was cast into the den of lions because he kneeled upon his knees three times a day and prayed?", options: ["Daniel", "Jeremiah", "Nehemiah", "Ezekiel"], a: 0 },
    { q: "What words appeared written on the wall by the fingers of a man's hand during Belshazzar's banquet?", options: ["MENE, MENE, TEKEL, UPHARSIN", "ICHABOD", "MARANATHA", "TALITHA CUMI"], a: 0 },
    { q: "Which Persian king issued the decree permitting the Jews to return to Jerusalem and rebuild the house of God?", options: ["Cyrus", "Darius", "Artaxerxes", "Ahasuerus"], a: 0 },
    { q: "Who was the ready scribe in the law of Moses who led a return of exiles from Babylon to Jerusalem?", options: ["Ezra", "Nehemiah", "Zerubbabel", "Jeshua"], a: 0 },
    { q: "Who was the royal cupbearer to King Artaxerxes who rebuilt the broken walls of Jerusalem in 52 days?", options: ["Nehemiah", "Ezra", "Mordecai", "Daniel"], a: 0 },
    { q: "Which Jewish maiden became Queen of Persia and declared: 'And if I perish, I perish'?", options: ["Esther (Hadassah)", "Vashti", "Ruth", "Judith"], a: 0 },
    { q: "Who was the cousin of Esther who sat in the king's gate and refused to bow down to wicked Haman?", options: ["Mordecai", "Hegai", "Bigthan", "Teresh"], a: 0 },
    { q: "Which prophet ran from the presence of the LORD toward Tarshish and was swallowed by a great fish?", options: ["Jonah", "Joel", "Amos", "Nahum"], a: 0 },
    { q: "What great city of more than sixscore thousand persons repented in sackcloth and ashes at Jonah's preaching?", options: ["Nineveh", "Babylon", "Tyre", "Sidon"], a: 0 },
    { q: "Which prophet prophesied that the Messiah would be born in Bethlehem Ephratah?", options: ["Micah", "Hosea", "Zechariah", "Malachi"], a: 0 },
    { q: "Which minor prophet foretold the outpouring of God's Spirit upon all flesh in the last days?", options: ["Joel", "Amos", "Obadiah", "Zephaniah"], a: 0 },
    { q: "What is the final book of the Old Testament in the King James Version?", options: ["Malachi", "Zechariah", "Haggai", "Nehemiah"], a: 0 },

    // -------------------------------------------------------------
    // GOSPELS, THE LIFE & MIRACLES OF JESUS CHRIST (KJV)
    // -------------------------------------------------------------
    { q: "In what town of Judaea was the Lord Jesus Christ born, in fulfillment of prophecy?", options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"], a: 2 },
    { q: "Which angel was sent from God unto Nazareth to announce the miraculous conception to Mary?", options: ["Gabriel", "Michael", "Raphael", "Uriel"], a: 0 },
    { q: "Who was the forerunner of Christ who preached in the wilderness of Judaea, clothed in camel's hair?", options: ["John the Baptist", "Elijah", "Stephen", "Barnabas"], a: 0 },
    { q: "In which river was Jesus baptized by John, where the heavens opened and the Spirit descended like a dove?", options: ["Jordan", "Nile", "Euphrates", "Tigris"], a: 0 },
    { q: "How many days and nights did Jesus fast in the wilderness before being tempted of the devil?", options: ["7", "12", "40", "70"], a: 2 },
    { q: "What was Jesus' first miracle recorded in the Gospel according to John?", options: ["Turning water into wine at Cana", "Healing the centurion's servant", "Walking on the sea", "Feeding the five thousand"], a: 0 },
    { q: "How many apostles did Jesus ordain that they should be with Him and preach?", options: ["7", "10", "12", "70"], a: 2 },
    { q: "Which two sons of Zebedee did Jesus surname 'Boanerges', which is, 'The sons of thunder'?", options: ["James and John", "Peter and Andrew", "Philip and Bartholomew", "Thomas and Matthew"], a: 0 },
    { q: "Which disciple was a publican (tax collector) sitting at the receipt of custom when Jesus called him?", options: ["Matthew (Levi)", "Luke", "Mark", "Zacchaeus"], a: 0 },
    { q: "What provision did Jesus bless and multiply to feed about five thousand men besides women and children?", options: ["Five barley loaves and two small fishes", "Seven loaves and a few small fishes", "Ten loaves of showbread", "A cruse of oil and barrel of meal"], a: 0 },
    { q: "How many baskets full of fragments remained after feeding the five thousand?", options: ["Seven", "Twelve", "Forty", "Three"], a: 1 },
    { q: "Which disciple stepped down out of the ship and walked on the water to go to Jesus?", options: ["Peter", "John", "James", "Andrew"], a: 0 },
    { q: "Who climbed up into a sycomore tree to see Jesus, because he was little of stature?", options: ["Zacchaeus", "Bartimaeus", "Nicodemus", "Jairus"], a: 0 },
    { q: "What was the name of the blind beggar who cried by the wayside near Jericho: 'Jesus, thou Son of David, have mercy on me'?", options: ["Bartimaeus", "Lazarus", "Simon", "Malchus"], a: 0 },
    { q: "Who was the Pharisee and ruler of the Jews who came to Jesus by night to ask about being born again?", options: ["Nicodemus", "Gamaliel", "Caiaphas", "Joseph of Arimathaea"], a: 0 },
    { q: "In what town did Jesus raise Lazarus from the dead after he had lain in the grave four days?", options: ["Bethany", "Bethlehem", "Nazareth", "Jericho"], a: 0 },
    { q: "What is the shortest verse in the entire King James Bible?", options: ["'Jesus wept.' (John 11:35)", "'Pray without ceasing.'", "'Rejoice evermore.'", "'God is love.'"], a: 0 },
    { q: "What animal did Jesus ride into Jerusalem during His triumphal entry, fulfilling Zechariah 9:9?", options: ["A white warhorse", "A colt the foal of an ass", "A camel", "A chariot of gold"], a: 1 },
    { q: "In which garden did Jesus pray in agony until His sweat was as it were great drops of blood falling down to the ground?", options: ["Garden of Gethsemane", "Garden of Eden", "Garden of Uzza", "Mount Olivet garden"], a: 0 },
    { q: "For how many pieces of silver did Judas Iscariot covenant to betray the Lord Jesus?", options: ["20 pieces", "30 pieces", "50 pieces", "100 pieces"], a: 1 },
    { q: "What disciple drew his sword in Gethsemane and cut off the right ear of the high priest's servant Malchus?", options: ["Simon Peter", "John", "James", "Simon the Canaanite"], a: 0 },
    { q: "How many times did Peter deny knowing Jesus before the cock crew?", options: ["Once", "Twice", "Three times", "Seven times"], a: 2 },
    { q: "Who was the Roman governor of Judaea who washed his hands before the multitude and delivered Jesus to be crucified?", options: ["Pontius Pilate", "Herod Antipas", "Felix", "Festus"], a: 0 },
    { q: "What man of Cyrene was compelled to bear the cross of Jesus after Him?", options: ["Simon", "Joseph", "Cleopas", "Barnabas"], a: 0 },
    { q: "What place, being interpreted 'The place of a skull', was the site of the crucifixion?", options: ["Golgotha (Calvary)", "Gethsemane", "Moriah", "Sion"], a: 0 },
    { q: "What happened to the veil of the temple from top to bottom at the moment Jesus yielded up the ghost?", options: ["It was rent in twain", "It caught fire", "It turned black", "It fell into dust"], a: 0 },
    { q: "Who went boldly in unto Pilate to crave the body of Jesus and laid it in his own new tomb?", options: ["Joseph of Arimathaea", "Nicodemus", "Simon of Cyrene", "Cleopas"], a: 0 },
    { q: "On which day following His crucifixion did Jesus rise victoriously from the tomb?", options: ["The first day of the week (the third day)", "The seventh day", "The fortieth day", "The fiftieth day"], a: 0 },
    { q: "Which disciple doubted the resurrection until he saw in His hands the print of the nails and thrust his hand into His side?", options: ["Thomas (Didymus)", "Philip", "Bartholomew", "Thaddaeus"], a: 0 },
    { q: "From which mount near Jerusalem did the risen Lord Jesus ascend into heaven in a cloud?", options: ["Mount of Olives", "Mount Sinai", "Mount Tabor", "Mount Carmel"], a: 0 },

    // -------------------------------------------------------------
    // ACTS OF THE APOSTLES & THE EARLY CHURCH (KJV)
    // -------------------------------------------------------------
    { q: "How many souls were gathered together praying in one accord in the upper room before Pentecost?", options: ["About 120", "About 70", "About 500", "About 3,000"], a: 0 },
    { q: "What two miraculous signs accompanied the outpouring of the Holy Ghost on the Day of Pentecost?", options: ["Rushing mighty wind and cloven tongues like as of fire", "Earthquake and pillar of cloud", "Trumpet blast and hail", "Darkness and eclipse"], a: 0 },
    { q: "How many souls were gladly baptized and added unto the church after Peter's sermon on Pentecost?", options: ["About 3,000 souls", "About 5,000 souls", "120 souls", "70 souls"], a: 0 },
    { q: "At which gate of the temple was the lame man sitting when Peter said: 'Silver and gold have I none; but such as I have give I thee'?", options: ["The gate called Beautiful", "The Sheep gate", "The Water gate", "The Horse gate"], a: 0 },
    { q: "Which couple fell down dead at the apostles' feet after keeping back part of the price of their land and lying to the Holy Ghost?", options: ["Ananias and Sapphira", "Aquila and Priscilla", "Philemon and Apphia", "Felix and Drusilla"], a: 0 },
    { q: "Who was chosen as the first of the seven deacons and became the first Christian martyr stoned to death?", options: ["Stephen", "Philip", "Prochorus", "Nicanor"], a: 0 },
    { q: "To what man riding in his chariot did Philip explain Isaiah's prophecy of the Lamb led to the slaughter?", options: ["An Ethiopian eunuch of great authority under Candace", "Cornelius the centurion", "The jailor of Philippi", "Sergius Paulus"], a: 0 },
    { q: "Near which Syrian city did a light from heaven suddenly shine round about Saul of Tarsus?", options: ["Damascus", "Antioch", "Tarsus", "Jerusalem"], a: 0 },
    { q: "Who was the devout Roman centurion of Caesarea whose prayers and alms came up for a memorial before God?", options: ["Cornelius", "Julius", "Claudius Lysias", "Longinus"], a: 0 },
    { q: "In which city were the disciples first called 'Christians'?", options: ["Antioch", "Jerusalem", "Rome", "Corinth"], a: 0 },
    { q: "How did Apostle Peter escape from Herod Agrippa's prison while the church prayed without ceasing?", options: ["An angel of the Lord smote his chains off and led him through the iron gate", "Paul posted bail", "An earthquake broke the bars", "He fled through a tunnel"], a: 0 },
    { q: "Who accompanied Paul on his first missionary journey and was known as the 'Son of consolation'?", options: ["Barnabas", "Silas", "Luke", "Timothy"], a: 0 },
    { q: "At midnight in the prison at Philippi, what were Paul and Silas doing when a great earthquake shook the foundations?", options: ["Praying and singing praises unto God", "Sleeping soundly", "Weeping and lamenting", "Writing an epistle"], a: 0 },
    { q: "Which seller of purple from Thyatira heard Paul at Philippi by the riverside and opened her heart?", options: ["Lydia", "Priscilla", "Phoebe", "Dorcas"], a: 0 },
    { q: "On which hill in Athens did Paul deliver his famous discourse concerning the altar 'TO THE UNKNOWN GOD'?", options: ["Mars' hill (Areopagus)", "Mount Zion", "Mount Olympus", "Acropolis"], a: 0 },
    { q: "What craft did Paul, Aquila, and Priscilla share to support themselves?", options: ["Tentmakers", "Fishermen", "Silversmiths", "Carpenters"], a: 0 },
    { q: "Upon which island was Paul shipwrecked while on his voyage to Rome, where a viper fastened on his hand without harming him?", options: ["Melita (Malta)", "Crete", "Cyprus", "Patmos"], a: 0 },

    // -------------------------------------------------------------
    // EPISTLES, REVELATION & BIBLICAL CANON (KJV)
    // -------------------------------------------------------------
    { q: "How many total books comprise the canonical Holy Bible?", options: ["66 books", "73 books", "39 books", "27 books"], a: 0 },
    { q: "How many books are contained within the Old Testament?", options: ["39 books", "27 books", "40 books", "42 books"], a: 0 },
    { q: "How many books are contained within the New Testament?", options: ["27 books", "21 books", "39 books", "33 books"], a: 0 },
    { q: "In Galatians 5:22-23, how many spiritual virtues comprise the fruit of the Spirit?", options: ["Nine", "Seven", "Twelve", "Ten"], a: 0 },
    { q: "According to Ephesians 6, what piece of the whole armour of God is the Christian called to take to quench all the fiery darts of the wicked?", options: ["The shield of faith", "The helmet of salvation", "The breastplate of righteousness", "The girdle of truth"], a: 0 },
    { q: "What is described in Hebrews 4:12 as 'quick, and powerful, and sharper than any twoedged sword'?", options: ["The word of God", "The faith of Abraham", "The prayer of righteous", "The blood of Christ"], a: 0 },
    { q: "Which book of the New Testament is celebrated as the great chapter of faith, beginning 'Now faith is the substance of things hoped for'?", options: ["Hebrews 11", "Romans 8", "1 Corinthians 13", "James 2"], a: 0 },
    { q: "Which chapter of 1 Corinthians is renowned as the sublime discourse on charity (love)?", options: ["1 Corinthians 13", "1 Corinthians 15", "Romans 12", "Galatians 6"], a: 0 },
    { q: "Who wrote the short epistle to Philemon concerning the runaway slave Onesimus who became a brother beloved?", options: ["Paul", "Peter", "John", "James"], a: 0 },
    { q: "On which Aegean island was the Apostle John in the Spirit on the Lord's day when he received the Revelation?", options: ["Patmos", "Crete", "Chios", "Rhodes"], a: 0 },
    { q: "How many churches of Asia did the Lord address in the opening visions of the Revelation?", options: ["Seven churches", "Twelve churches", "Four churches", "Ten churches"], a: 0 },
    { q: "What are the names of the seven churches of Asia addressed in Revelation chapters 2 and 3?", options: ["Ephesus, Smyrna, Pergamos, Thyatira, Sardis, Philadelphia, Laodicea", "Jerusalem, Antioch, Alexandria, Rome, Ephesus, Philippi, Colosse", "Athens, Corinth, Berea, Thessalonica, Galatia, Crete, Rome", "Tyre, Sidon, Damascus, Tarsus, Miletus, Troas, Malta"], a: 0 },
    { q: "In Revelation, what precious foundation stone is NOT listed among the twelve foundations of the New Jerusalem?", options: ["Coal", "Jasper", "Sapphire", "Chrysolite"], a: 0 },
    { q: "How many gates of pearl does the Holy City, New Jerusalem, possess?", options: ["Twelve gates", "Seven gates", "Four gates", "Twenty-four gates"], a: 0 },
    { q: "What is the final prayer recorded in the closing verse of the Revelation (Rev 22:20)?", options: ["'Even so, come, Lord Jesus.'", "'Amen and Amen.'", "'Praise ye the LORD.'", "'Thy kingdom come.'"], a: 0 },

    // -------------------------------------------------------------
    // ADDITIONAL DEEP KJV SCRIPTURE & SCHOLARLY QUESTIONS
    // -------------------------------------------------------------
    { q: "What was the Hebrew name of King Solomon given to him by the prophet Nathan through the LORD?", options: ["Jedidiah", "Adonijah", "Shealtiel", "Zerubbabel"], a: 0 },
    { q: "Which judge of Israel made a rash vow before the battle with Ammon and was met by his only daughter?", options: ["Jephthah", "Samson", "Gideon", "Barak"], a: 0 },
    { q: "Who was the Roman centurion in the Gospels of whom Jesus declared: 'I have not found so great faith, no, not in Israel'?", options: ["The centurion of Capernaum", "Cornelius", "Julius", "The centurion at the cross"], a: 0 },
    { q: "Which high priest put Jesus under oath saying: 'I adjure thee by the living God, that thou tell us whether thou be the Christ'?", options: ["Caiaphas", "Annas", "Ananias", "Alexander"], a: 0 },
    { q: "Who was the silversmith in Ephesus who stirred up a great riot against Paul because 'Diana of the Ephesians' was despised?", options: ["Demetrius", "Alexander", "Hermogenes", "Phygellus"], a: 0 },
    { q: "Which disciple was surnamed Barnabas, which is, being interpreted, 'The son of consolation'?", options: ["Joses (Joseph)", "Simon", "Levi", "Justus"], a: 0 },
    { q: "Who was the queen of Judah, daughter of Jezebel, who usurped the throne and slew the royal seed until Joash was hidden?", options: ["Athaliah", "Vashti", "Maachah", "Jezebel"], a: 0 },
    { q: "What tree did Zacchaeus climb to see Jesus pass through Jericho?", options: ["A sycomore tree", "A cedar tree", "An olive tree", "A fig tree"], a: 0 },
    { q: "What river of Damascus did the Syrian captain Naaman boast was better than all the waters of Israel?", options: ["Abana and Pharpar", "Kishon", "Euphrates", "Arnon"], a: 0 },
    { q: "How many elders were seated round about the throne in the heavenly vision of Revelation 4?", options: ["Four and twenty (24)", "Twelve (12)", "Seventy (70)", "One hundred forty-four"], a: 0 },
    { q: "What kind of crown of life does James and Revelation promise to those that love Him and endure temptation?", options: ["A crown of life", "A crown of gold", "A crown of cedar", "A crown of emerald"], a: 0 },
    { q: "Who was the prophet that confronted King Ahab in the vineyard of Naboth the Jezreelite?", options: ["Elijah the Tishbite", "Elisha", "Micaiah", "Jehu"], a: 0 },
    { q: "What animal spoke with man's voice and forbad the madness of the prophet Balaam?", options: ["An ass", "A camel", "A lion", "An eagle"], a: 0 },
    { q: "Who was the priest and king of Midian whose daughter Zipporah became the wife of Moses?", options: ["Jethro (Reuel)", "Hobab", "Balaam", "Melchizedek"], a: 0 },
    { q: "Which prophet lay upon his left side 390 days and right side 40 days as a sign unto Israel and Judah?", options: ["Ezekiel", "Jeremiah", "Isaiah", "Daniel"], a: 0 },
    { q: "What name did the mother of Phinehas' child utter as she died, saying: 'The glory is departed from Israel'?", options: ["Ichabod", "Ebenezer", "Mahlon", "Lo-ammi"], a: 0 },
    { q: "What does the name 'Ebenezer' mean, set up by Samuel between Mizpeh and Shen?", options: ["'Hitherto hath the LORD helped us'", "'God is our refuge'", "'The Lord will provide'", "'Peace be unto this house'"], a: 0 },
    { q: "What Greek island did the storm wind Euroclydon drive Paul's ship away from?", options: ["Clauda / Crete", "Cyprus", "Rhodes", "Samos"], a: 0 },
    { q: "Who was the grandmother of Timothy praised by Paul for her unfeigned faith?", options: ["Lois", "Eunice", "Priscilla", "Rhoda"], a: 0 },
    { q: "Who was the mother of Timothy commended for instilling the Holy Scriptures in him from a child?", options: ["Eunice", "Lois", "Salome", "Anna"], a: 0 },
    { q: "Which book of the Bible contains the verse: 'The joy of the LORD is your strength'?", options: ["Nehemiah 8:10", "Psalm 100:1", "Habakkuk 3:18", "Philippians 4:4"], a: 0 },
    { q: "How many years did Methuselah live, making him the longest-lived human in biblical history?", options: ["969 years", "950 years", "930 years", "777 years"], a: 0 },
    { q: "Who was the cupbearer that forgot Joseph in the Egyptian prison for two full years?", options: ["The chief butler", "The chief baker", "Potiphar", "Asenath"], a: 0 },
    { q: "What was the name of the garden planted eastward in which the tree of life was set?", options: ["Eden", "Gethsemane", "Sharon", "Carmel"], a: 0 }
];

// Fisher-Yates unbiased shuffle
function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function TriviaRushGame() {
    const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
    const [mode, setMode] = useState<GameMode>('classic');
    const [timeLeft, setTimeLeft] = useState(60);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0);
    const [highScores, setHighScores] = useState<Record<string, number>>({});
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [questions, setQuestions] = useState<TriviaItem[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
    const [lifelineNotice, setLifelineNotice] = useState<string | null>(null);

    // Load High Scores
    useEffect(() => {
        try {
            const saved = localStorage.getItem('trivia_rush_high_scores_v2');
            if (saved) setHighScores(JSON.parse(saved));
        } catch {}
    }, []);

    const startGame = (chosenMode = mode) => {
        setMode(chosenMode);
        const shuffled = shuffleArray(MASSIVE_TRIVIA_POOL);
        setQuestions(shuffled);
        setCurrentQIndex(0);
        setScore(0);
        setStreak(0);
        setHighestStreak(0);
        setLives(3);
        setTimeLeft(chosenMode === 'marathon' ? 120 : 60);
        setGameState('playing');
        setFeedback(null);
        setDisabledOptions([]);
        setLifelineNotice(null);
    };

    // Lifeline: 50:50 (Eliminate 2 wrong choices)
    const handleUse5050 = () => {
        if (gameState !== 'playing' || feedback !== null) return;
        if (disabledOptions.length > 0) {
            setLifelineNotice("50:50 already used on this question!");
            setTimeout(() => setLifelineNotice(null), 2000);
            return;
        }

        const success = spendTalents(20);
        if (!success) {
            gameSound.playError();
            triggerHaptic('error');
            setLifelineNotice("Need 20 Talents 🪙 for 50:50!");
            setTimeout(() => setLifelineNotice(null), 2500);
            return;
        }

        gameSound.playSuccess();
        triggerHaptic('success');

        const currentQ = questions[currentQIndex];
        const wrongIndices = currentQ.options
            .map((_, i) => i)
            .filter(i => i !== currentQ.a);
        const toEliminate = shuffleArray(wrongIndices).slice(0, 2);

        setDisabledOptions(toEliminate);
        setLifelineNotice("2 wrong answers eliminated! (-20 🪙)");
        setTimeout(() => setLifelineNotice(null), 2500);
    };

    // Lifeline: +15s Time Boost
    const handleUseTimeBoost = () => {
        if (gameState !== 'playing' || feedback !== null) return;
        if (mode === 'survival') {
            setLifelineNotice("Time Boost not available in Survival!");
            setTimeout(() => setLifelineNotice(null), 2000);
            return;
        }

        const success = spendTalents(25);
        if (!success) {
            gameSound.playError();
            triggerHaptic('error');
            setLifelineNotice("Need 25 Talents 🪙 for +15s Boost!");
            setTimeout(() => setLifelineNotice(null), 2500);
            return;
        }

        gameSound.playSuccess();
        triggerHaptic('success');
        setTimeLeft(prev => prev + 15);
        setLifelineNotice("+15 Seconds Added! (-25 🪙)");
        setTimeout(() => setLifelineNotice(null), 2500);
    };

    // Timer logic for timed modes
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && mode !== 'survival' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 5 && prev > 1) {
                        gameSound.playTick();
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing' && mode !== 'survival') {
            endGame();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, mode]);

    const endGame = () => {
        setGameState('end');
        gameSound.playFanfare();
        triggerHaptic('heavy');

        setScore(currentScore => {
            const best = highScores[mode] || 0;
            if (currentScore > best) {
                const updated = { ...highScores, [mode]: currentScore };
                setHighScores(updated);
                try {
                    localStorage.setItem('trivia_rush_high_scores_v2', JSON.stringify(updated));
                } catch {}
                triggerRealisticConfetti();
            } else if (currentScore >= 60) {
                triggerRealisticConfetti();
            }

            // Award talents based on score
            const earned = Math.max(10, Math.floor(currentScore / 4));
            earnTalents(earned);
            recordGameWin('trivia');

            return currentScore;
        });
    };

    const handleAnswer = (selectedIndex: number) => {
        if (feedback !== null || disabledOptions.includes(selectedIndex)) return;

        const isCorrect = selectedIndex === questions[currentQIndex].a;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            gameSound.playSuccess();
            triggerHaptic('success');
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > highestStreak) setHighestStreak(newStreak);
            if (newStreak >= 5) {
                unlockAchievement('trivia_streak_5');
            }
            const streakBonus = newStreak >= 5 ? 5 : newStreak >= 3 ? 2 : 0;
            setScore(prev => prev + 10 + streakBonus);
        } else {
            gameSound.playError();
            triggerHaptic('error');
            setStreak(0);
            if (mode === 'survival') {
                const nextLives = lives - 1;
                setLives(nextLives);
                if (nextLives <= 0) {
                    setTimeout(() => {
                        setFeedback(null);
                        endGame();
                    }, 500);
                    return;
                }
            } else {
                setScore(prev => Math.max(0, prev - 5));
            }
        }

        setTimeout(() => {
            setFeedback(null);
            setDisabledOptions([]);
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(prev => prev + 1);
            } else {
                endGame();
            }
        }, 500);
    };

    const currentBest = highScores[mode] || 0;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            {/* Top Bar with Profile Stats */}
            <GameTopBar
                title="Bible Trivia Rush"
                backHref="/games"
                backLabel="Games"
                theme="dark"
                extraPill={
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                        <Trophy className="w-3.5 h-3.5" /> {currentBest}
                    </div>
                }
            />

            <div className="flex-1 w-full max-w-2xl mx-auto p-4 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div 
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-amber-500 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                                <Clock className="w-12 h-12 text-slate-950" />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" /> 120+ Deep Bible Questions (KJV)
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black mb-2 uppercase tracking-tight text-white">Bible Trivia Rush</h1>
                                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                                    Test your Bible speed, recall, and discernment! Deep scripture knowledge across Genesis through Revelation. Pick your battle mode below:
                                </p>
                            </div>

                            {/* Mode Selector */}
                            <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
                                {[
                                    { id: 'classic', label: 'Classic 60s', desc: 'Fast 60-second timer', icon: Clock },
                                    { id: 'marathon', label: 'Marathon 120s', desc: 'Extended 2 mins', icon: Flame },
                                    { id: 'survival', label: 'Survival Mode', desc: '3 Lives. No timer!', icon: Heart },
                                ].map((m) => {
                                    const Icon = m.icon;
                                    const isSel = mode === m.id;
                                    return (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => {
                                                gameSound.playTap();
                                                triggerHaptic('tap');
                                                setMode(m.id as GameMode);
                                            }}
                                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                                                isSel
                                                    ? 'bg-gradient-to-br from-cyan-500/20 to-amber-500/20 border-cyan-400 text-white ring-1 ring-cyan-400'
                                                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                            }`}
                                        >
                                            <Icon className={`w-5 h-5 mb-1.5 ${isSel ? 'text-amber-400' : 'text-slate-400'}`} />
                                            <div className="font-bold text-xs text-white leading-tight">{m.label}</div>
                                            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{m.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <button 
                                    onClick={() => {
                                        gameSound.playTap();
                                        triggerHaptic('tap');
                                        startGame(mode);
                                    }}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 px-9 py-4 rounded-full font-black text-lg shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                >
                                    <Play className="w-6 h-6 fill-slate-950" />
                                    Launch {mode === 'classic' ? 'Classic' : mode === 'marathon' ? 'Marathon' : 'Survival'}!
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* PLAYING SCREEN */}
                    {gameState === 'playing' && questions[currentQIndex] && (
                        <motion.div 
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col justify-center"
                        >
                            {/* HUD */}
                            <div className="flex items-center justify-between mb-3 bg-slate-800/90 p-4 rounded-2xl border border-slate-700 shadow-md">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Score</span>
                                    <span className="text-3xl font-black text-cyan-400">{score}</span>
                                </div>

                                {streak >= 3 && (
                                    <motion.div 
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
                                    >
                                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        <span>{streak}x Combo!</span>
                                    </motion.div>
                                )}

                                {mode === 'survival' ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Lives</span>
                                        <div className="flex items-center gap-1 text-2xl mt-1">
                                            {[1, 2, 3].map(h => (
                                                <Heart
                                                    key={h}
                                                    className={`w-6 h-6 ${
                                                        h <= lives
                                                            ? 'text-rose-500 fill-rose-500'
                                                            : 'text-slate-600'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`flex flex-col items-end ${timeLeft <= 10 ? 'animate-pulse text-rose-400' : 'text-slate-100'}`}>
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Time</span>
                                        <span className="text-3xl font-black font-mono">{timeLeft}s</span>
                                    </div>
                                )}
                            </div>

                            {/* Lifelines Bar */}
                            <div className="flex items-center justify-between gap-2 mb-3 px-1">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleUse5050}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                                        title="Eliminate two wrong choices (-20 Talents)"
                                    >
                                        <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>50:50</span>
                                        <span className="text-[10px] bg-cyan-950 px-1.5 py-0.2 rounded-full text-cyan-200 border border-cyan-500/40">-20 🪙</span>
                                    </button>

                                    {mode !== 'survival' && (
                                        <button
                                            type="button"
                                            onClick={handleUseTimeBoost}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                                            title="Add 15 seconds to timer (-25 Talents)"
                                        >
                                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                                            <span>+15s Time</span>
                                            <span className="text-[10px] bg-amber-950 px-1.5 py-0.2 rounded-full text-amber-200 border border-amber-500/40">-25 🪙</span>
                                        </button>
                                    )}
                                </div>

                                {lifelineNotice && (
                                    <span className="text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 rounded-xl animate-pulse truncate">
                                        {lifelineNotice}
                                    </span>
                                )}
                            </div>

                            {/* Question Card */}
                            <motion.div 
                                key={currentQIndex}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="bg-slate-800/95 p-5 sm:p-7 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden"
                            >
                                {/* Feedback overlay */}
                                <AnimatePresence>
                                    {feedback === 'correct' && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-emerald-600/90 backdrop-blur-sm"
                                        >
                                            <CheckCircle2 className="w-16 h-16 text-white drop-shadow-lg mb-1" />
                                            <span className="text-white font-black text-2xl uppercase tracking-wider">Correct! +10</span>
                                        </motion.div>
                                    )}
                                    {feedback === 'incorrect' && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-rose-600/90 backdrop-blur-sm"
                                        >
                                            <XCircle className="w-16 h-16 text-white drop-shadow-lg mb-1" />
                                            <span className="text-white font-black text-2xl uppercase tracking-wider">
                                                {mode === 'survival' ? 'Lost a Life!' : '-5 pts'}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Question {currentQIndex + 1}
                                </div>

                                <h2 className="text-lg sm:text-2xl font-bold leading-snug mb-5 text-white">
                                    {questions[currentQIndex]?.q}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                                    {questions[currentQIndex]?.options.map((opt, i) => {
                                        const isEliminated = disabledOptions.includes(i);
                                        return (
                                            <button
                                                key={i}
                                                disabled={isEliminated}
                                                onClick={() => handleAnswer(i)}
                                                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all font-semibold text-sm sm:text-base cursor-pointer active:scale-98 touch-manipulation select-none ${
                                                    isEliminated
                                                        ? 'bg-slate-800/40 border-slate-700/40 text-slate-600 line-through opacity-40 cursor-not-allowed'
                                                        : 'bg-slate-700/60 hover:bg-slate-700 border-slate-600 hover:border-cyan-400 text-white'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* END SCREEN */}
                    {gameState === 'end' && (
                        <motion.div 
                            key="end"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-5 bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl"
                        >
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                                <Trophy className="w-10 h-10 text-slate-950" />
                            </div>
                            
                            <div>
                                <h2 className="text-3xl font-black text-white mb-1">
                                    {mode === 'survival' && lives <= 0 ? "Out of Lives!" : "Rush Completed!"}
                                </h2>
                                <p className="text-slate-400 text-sm">You answered with wisdom and lightning speed</p>
                                
                                <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 my-3">
                                    {score} <span className="text-2xl text-slate-400 font-medium">pts</span>
                                </div>

                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-4">
                                    <span>🪙 +{Math.max(10, Math.floor(score / 4))} Talents Earned!</span>
                                </div>

                                <div className="flex items-center justify-center gap-6 text-sm text-slate-300">
                                    <div>
                                        <span className="text-slate-400 text-xs block">Best Streak</span>
                                        <strong className="text-amber-400 text-base">{highestStreak} in a row</strong>
                                    </div>
                                    <div className="h-8 w-px bg-slate-700" />
                                    <div>
                                        <span className="text-slate-400 text-xs block">Mode Record</span>
                                        <strong className="text-cyan-400 text-base">{highScores[mode] || score} pts</strong>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Challenge Share */}
                            <div className="pt-2">
                                <ShareScoreButton
                                    gameName="Bible Trivia Rush"
                                    resultDetails={`Scored ${score} pts in ${mode.toUpperCase()} mode with a ${highestStreak}-question streak!`}
                                    urlPath="/games/rush"
                                    variant="whatsapp"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
                                <button 
                                    onClick={() => {
                                        gameSound.playTap();
                                        triggerHaptic('tap');
                                        startGame(mode);
                                    }}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Play Again
                                </button>
                                <button 
                                    onClick={() => {
                                        gameSound.playTap();
                                        setGameState('start');
                                    }}
                                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
                                >
                                    Change Mode
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
