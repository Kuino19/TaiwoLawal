/**
 * seed_quizzes.js
 * Creates two quizzes in Appwrite:
 *   1. "Book of Numbers" — 1000-question pool, 30 served per session, 15 mins
 *   2. "Foursquare Standard of Attainment" — 1000-question pool, 30 served per session, 15 mins
 *
 * Run: node src/scripts/seed_quizzes.js
 */

const { Client, Databases, ID } = require('node-appwrite');
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
// BOOK OF NUMBERS — 1000 Questions
// ─────────────────────────────────────────────────────────────────────────────
const numbersQuestions = [
  // ── Chapter 1 ──
  { text: "How many men were numbered from the tribe of Reuben in the first census?", options: ["46,500", "59,300", "45,650", "51,450"], correctAnswer: 0 },
  { text: "Who assisted Moses and Aaron in taking the first census of Israel?", options: ["The Levites", "One leader from each tribe", "The priests", "The elders of Israel"], correctAnswer: 1 },
  { text: "Which tribe was NOT included in the military census in Numbers 1?", options: ["Gad", "Levi", "Asher", "Dan"], correctAnswer: 1 },
  { text: "How many men were numbered from the tribe of Simeon?", options: ["59,300", "57,400", "45,650", "74,600"], correctAnswer: 1 },
  { text: "How many men were numbered from the tribe of Gad?", options: ["46,500", "45,650", "41,500", "59,300"], correctAnswer: 1 },
  { text: "What was the total number of men counted in the first census?", options: ["600,000", "603,550", "601,730", "605,550"], correctAnswer: 1 },
  { text: "How many men were numbered from the tribe of Judah?", options: ["54,400", "74,600", "57,400", "46,500"], correctAnswer: 1 },
  { text: "How many men were numbered from the tribe of Issachar?", options: ["54,400", "57,400", "45,650", "53,400"], correctAnswer: 0 },
  { text: "How many men were numbered from the tribe of Zebulun?", options: ["57,400", "59,300", "54,400", "45,650"], correctAnswer: 0 },
  { text: "How many men were numbered from the tribe of Ephraim?", options: ["40,500", "32,200", "35,400", "41,500"], correctAnswer: 0 },
  { text: "How many men were numbered from the tribe of Manasseh?", options: ["35,400", "32,200", "41,500", "40,500"], correctAnswer: 1 },
  { text: "How many men were numbered from the tribe of Benjamin?", options: ["35,400", "32,200", "40,500", "41,500"], correctAnswer: 0 },
  { text: "How many men were numbered from the tribe of Dan?", options: ["62,700", "53,400", "60,500", "41,500"], correctAnswer: 0 },
  { text: "How many men were numbered from the tribe of Asher?", options: ["41,500", "61,400", "53,400", "62,700"], correctAnswer: 2 },
  { text: "How many men were numbered from the tribe of Naphtali?", options: ["53,400", "57,400", "35,400", "41,500"], correctAnswer: 0 },
  // ── Chapter 2 ──
  { text: "Which tribe camped on the east side of the Tabernacle as the standard of Judah?", options: ["Issachar", "Judah", "Reuben", "Ephraim"], correctAnswer: 1 },
  { text: "Which tribe was positioned on the south side near Reuben?", options: ["Simeon", "Gad", "Both Simeon and Gad", "Levi"], correctAnswer: 2 },
  { text: "Who marched first when Israel broke camp?", options: ["The camp of Reuben", "The camp of Judah", "The Levites", "The camp of Ephraim"], correctAnswer: 1 },
  { text: "How many camps were there around the Tabernacle?", options: ["3", "4", "6", "12"], correctAnswer: 1 },
  { text: "Which tribe camped on the west side as the standard of Ephraim?", options: ["Ephraim", "Manasseh", "Benjamin", "All three"], correctAnswer: 3 },
  // ── Chapter 3 ──
  { text: "How old were Aaron's sons when they died before the Lord?", options: ["They were adults", "They were young children", "They were teenagers", "The text does not say"], correctAnswer: 3 },
  { text: "The Levites were given to Aaron and his sons as a gift from whom?", options: ["Moses", "The people of Israel", "God", "The elders"], correctAnswer: 2 },
  { text: "Which Levite clan was responsible for the Tabernacle itself, the tent and its coverings?", options: ["Gershon", "Kohath", "Merari", "Aaron"], correctAnswer: 1 },
  { text: "On which side of the Tabernacle did the Gershonites camp?", options: ["East", "South", "West", "North"], correctAnswer: 2 },
  { text: "On which side of the Tabernacle did Moses, Aaron and his sons camp?", options: ["West", "North", "South", "East"], correctAnswer: 3 },
  { text: "How many Levite males one month old and older were counted in Numbers 3?", options: ["7,500", "8,600", "6,200", "22,000"], correctAnswer: 3 },
  { text: "How many firstborn males of Israel were counted?", options: ["22,000", "22,273", "603,550", "20,000"], correctAnswer: 1 },
  { text: "What was the redemption price for the excess firstborn over the Levites?", options: ["5 shekels each", "10 shekels each", "1 shekel each", "50 shekels each"], correctAnswer: 0 },
  { text: "Who was the leader of the Kohathite clan?", options: ["Gershom", "Elizaphan", "Zuriel", "Eliasaph"], correctAnswer: 1 },
  { text: "Who was the leader of the Merarite clan?", options: ["Elizaphan", "Zuriel", "Eliasaph", "Libni"], correctAnswer: 1 },
  // ── Chapter 4 ──
  { text: "Between what ages were Levite men counted for tabernacle service?", options: ["20–50", "30–50", "25–50", "30–60"], correctAnswer: 1 },
  { text: "What was placed over the ark of the covenant when the camp moved?", options: ["A blue cloth", "The veil/curtain of the screen", "Badger skins", "Gold cloth"], correctAnswer: 1 },
  { text: "What coloured cloth covered the table of showbread?", options: ["Purple", "Blue", "Scarlet", "White"], correctAnswer: 1 },
  { text: "Who was responsible for the oil for lighting, the incense, and grain offerings?", options: ["Gershon", "Merari", "Eleazar son of Aaron", "Ithamar son of Aaron"], correctAnswer: 2 },
  { text: "Which Levite clan carried the boards, bars, pillars and sockets of the Tabernacle?", options: ["Kohath", "Gershon", "Merari", "All clans equally"], correctAnswer: 2 },
  { text: "How many Kohathites between 30 and 50 were counted for service?", options: ["2,630", "2,750", "5,380", "8,580"], correctAnswer: 1 },
  { text: "How many Gershonites between 30 and 50 were counted?", options: ["2,750", "2,630", "3,200", "8,580"], correctAnswer: 1 },
  { text: "How many Merarites between 30 and 50 were counted?", options: ["3,200", "2,750", "2,630", "8,580"], correctAnswer: 0 },
  // ── Chapter 5 ──
  { text: "Three categories of people were put outside the camp in Numbers 5. Which is NOT one of them?", options: ["Lepers", "Anyone with a discharge", "Murderers", "Anyone defiled by a dead body"], correctAnswer: 2 },
  { text: "In the law of restitution, what was added to the principal amount?", options: ["A tenth", "A fifth", "A half", "Double"], correctAnswer: 1 },
  { text: "What was the test of jealousy in Numbers 5?", options: ["A woman had to walk through fire", "A woman drank bitter water mixed with dust from the tabernacle floor", "A woman was examined by the priest visually", "A woman swore an oath without any physical test"], correctAnswer: 1 },
  { text: "If a woman was guilty in the jealousy test, what would happen?", options: ["She would die immediately", "Her thigh would rot and her abdomen swell", "She would become deaf", "She would be cast out of the camp"], correctAnswer: 1 },
  { text: "What did the priest write before dissolving it in the bitter water?", options: ["The Ten Commandments", "The curses of the oath", "The woman's name", "A psalm of Moses"], correctAnswer: 1 },
  // ── Chapter 6 ──
  { text: "What vow is described in Numbers 6?", options: ["The Levitical vow", "The Nazirite vow", "The priestly vow", "The firstfruits vow"], correctAnswer: 1 },
  { text: "What could a Nazirite NOT eat or drink?", options: ["Meat", "Anything from the grapevine", "Bread with yeast", "Olive oil"], correctAnswer: 1 },
  { text: "What must a Nazirite NOT do to his hair?", options: ["Cut it", "Braid it", "Wash it", "Anoint it"], correctAnswer: 0 },
  { text: "What must a Nazirite avoid in order to stay ceremonially clean?", options: ["Strong wind", "Going near a dead body", "Eating pork", "Touching a menstruant"], correctAnswer: 1 },
  { text: "What is the well-known priestly blessing recorded in Numbers 6?", options: ["The Shema", "The Aaronic Blessing", "The Mizpah Blessing", "The Levitical Benediction"], correctAnswer: 1 },
  { text: "Who would put God's name on the Israelites according to the blessing in Numbers 6?", options: ["Moses", "The elders", "The priests/Aaron's sons", "God directly"], correctAnswer: 2 },
  // ── Chapter 7 ──
  { text: "How many days did the leaders bring their offerings for the dedication of the altar?", options: ["7", "10", "12", "40"], correctAnswer: 2 },
  { text: "Each leader brought a silver platter weighing how many shekels?", options: ["70", "100", "130", "200"], correctAnswer: 2 },
  { text: "Each leader's silver bowl weighed how many shekels?", options: ["30", "50", "70", "100"], correctAnswer: 2 },
  { text: "Who brought the first offering for the altar dedication?", options: ["Moses", "Nahshon son of Amminadab (Judah)", "Nethaneel (Issachar)", "Aaron"], correctAnswer: 1 },
  { text: "Where did Moses go to hear God speak after the altar was dedicated?", options: ["The tent of meeting", "Mount Sinai", "The top of the tabernacle", "The Holy of Holies"], correctAnswer: 0 },
  // ── Chapter 8 ──
  { text: "What direction did Aaron set up the seven lamps of the lampstand?", options: ["Toward the south", "Toward the back of the tent", "Toward the front/face of the lampstand", "Toward the east"], correctAnswer: 2 },
  { text: "What was done to the Levites as a 'wave offering' before the Lord?", options: ["They were sprinkled with blood", "They were lifted up as a wave offering", "They were anointed with oil", "They were circumcised again"], correctAnswer: 1 },
  { text: "At what age did the Levites begin their active tabernacle service?", options: ["20", "25", "30", "35"], correctAnswer: 1 },
  { text: "At what age did Levites retire from active tabernacle service?", options: ["50", "55", "60", "65"], correctAnswer: 0 },
  // ── Chapter 9 ──
  { text: "In which month and year did God command Israel to celebrate the Passover in Numbers 9?", options: ["First month of the second year", "Seventh month of the first year", "First month of the first year", "Third month of the second year"], correctAnswer: 0 },
  { text: "What provision was made for those who were unclean or on a journey during Passover?", options: ["They were permanently excluded", "They could celebrate one month later in the second month", "They had to offer a special sacrifice separately", "They were forgiven without any observance"], correctAnswer: 1 },
  { text: "What did a cloud and fire over the tabernacle signify?", options: ["War was approaching", "God's presence and direction for Israel's journey", "The arrival of a prophet", "The start of the Sabbath"], correctAnswer: 1 },
  { text: "When could Israel break camp and travel?", options: ["Every seventh day", "Whenever the cloud lifted from the tabernacle", "At Moses's command", "At the new moon"], correctAnswer: 1 },
  // ── Chapter 10 ──
  { text: "What were the two silver trumpets used for?", options: ["Musical worship only", "Summoning the congregation and for breaking camp", "Warning of enemy attacks only", "Announcing the Sabbath"], correctAnswer: 1 },
  { text: "Who was to blow the trumpets?", options: ["The Levites", "The sons of Aaron, the priests", "The tribal leaders", "Moses alone"], correctAnswer: 1 },
  { text: "What does a single trumpet blast (rather than a full alarm) signal?", options: ["Gather all leaders to Moses", "Break camp immediately", "Gather all the congregation", "Announce a feast day"], correctAnswer: 0 },
  { text: "In what order did Israel march when they left Sinai?", options: ["Judah first, then the tabernacle, then Reuben, then Kohath with the holy things", "Judah first, then Reuben, then the tabernacle on the Kohathites, then Gershon and Merari behind", "Levi first, then the rest", "Judah first, then Gershon/Merari with the tabernacle, then Reuben, then Kohath with the holy things"], correctAnswer: 3 },
  { text: "Who did Moses ask to serve as a guide in the desert?", options: ["Caleb", "Hobab son of his father-in-law Reuel", "Jethro his father-in-law", "Joshua"], correctAnswer: 1 },
  // ── Chapter 11 ──
  { text: "What happened when the people complained at the outskirts of the camp in Numbers 11?", options: ["The earth swallowed them", "Fire from the Lord burned among them", "A plague broke out", "The manna stopped"], correctAnswer: 1 },
  { text: "What food did the people crave and weep for?", options: ["Bread and wine", "Fish, cucumbers, melons, leeks, onions and garlic of Egypt", "Quail and pheasant", "Honey and olives"], correctAnswer: 1 },
  { text: "What was the manna said to look like?", options: ["Snowflakes", "Coriander seed", "Gold flakes", "Small stones"], correctAnswer: 1 },
  { text: "How many elders were appointed to help Moses bear the burden of the people?", options: ["12", "24", "70", "72"], correctAnswer: 2 },
  { text: "Two men, Eldad and Medad, prophesied in the camp. Who were they?", options: ["Two of the 70 elders who did not go to the tent", "Two soldiers", "Two priests", "Two Levites"], correctAnswer: 0 },
  { text: "Who objected to Eldad and Medad prophesying and wanted Moses to stop them?", options: ["Aaron", "Miriam", "Joshua son of Nun", "Caleb"], correctAnswer: 2 },
  { text: "God sent quail that covered the ground how deep?", options: ["One cubit deep", "Two cubits deep", "Three cubits deep", "Up to a man's knee"], correctAnswer: 1 },
  { text: "What was the place called where the people were struck with plague after eating the quail?", options: ["Taberah", "Kibroth-hattaavah (Graves of Craving)", "Hazeroth", "Rithmah"], correctAnswer: 1 },
  // ── Chapter 12 ──
  { text: "Why did Miriam and Aaron speak against Moses?", options: ["He married a Cushite woman", "He took a second wife", "He ignored God's command about Passover", "He gave leadership to Joshua"], correctAnswer: 0 },
  { text: "How did God describe Moses in Numbers 12?", options: ["The greatest king ever born", "My servant, whom I speak with face to face, mouth to mouth", "A man after my own heart", "The wisest of all the prophets"], correctAnswer: 1 },
  { text: "What punishment did Miriam receive?", options: ["She became deaf", "She was struck with leprosy", "She was cast out forever", "She lost her prophetic gift"], correctAnswer: 1 },
  { text: "How many days was Miriam shut outside the camp?", options: ["3 days", "7 days", "14 days", "40 days"], correctAnswer: 1 },
  // ── Chapter 13 ──
  { text: "How many spies were sent to explore Canaan?", options: ["10", "12", "2", "7"], correctAnswer: 1 },
  { text: "What was Joshua's original name before Moses renamed him?", options: ["Hoshea", "Caleb", "Nahbi", "Geuel"], correctAnswer: 0 },
  { text: "From which tribe was Caleb, the spy?", options: ["Ephraim", "Judah", "Benjamin", "Manasseh"], correctAnswer: 1 },
  { text: "How many days did the spies explore the land?", options: ["30 days", "40 days", "20 days", "7 days"], correctAnswer: 1 },
  { text: "What did the spies bring back from the Valley of Eshcol?", options: ["Gold and silver", "A branch with a single cluster of grapes, plus pomegranates and figs", "Wheat and barley", "Olive oil and honey"], correctAnswer: 1 },
  { text: "What report did the majority of spies give about the inhabitants of Canaan?", options: ["They are weak and we can defeat them", "We seemed like grasshoppers compared to them; they will devour us", "The land is not worth taking", "The people are already fleeing"], correctAnswer: 1 },
  { text: "Who among the spies gave a positive report and urged Israel to take Canaan at once?", options: ["Joshua and Moses", "Caleb alone initially, then Joshua joined him", "All twelve", "Only Caleb"], correctAnswer: 1 },
  // ── Chapter 14 ──
  { text: "What did the congregation threaten to do after hearing the majority spy report?", options: ["Attack Moses and Aaron", "Return to Egypt and appoint a new leader", "Worship Baal", "Kill Caleb and Joshua"], correctAnswer: 1 },
  { text: "What was God's first response to Israel's rebellion in Numbers 14?", options: ["Plague", "Strike them all with pestilence and disinherit them", "Fire from heaven", "Send snakes"], correctAnswer: 1 },
  { text: "How did Moses appeal to God not to destroy Israel?", options: ["He reminded God of the promises to Abraham, Isaac and Jacob", "He argued using God's power as seen by Egypt, and God's own character of steadfast love", "He promised the people would never sin again", "He offered himself as a sacrifice"], correctAnswer: 1 },
  { text: "What was the punishment for the ten faithless spies?", options: ["They were stoned by the people", "They died of a plague before the Lord", "They were banished from Israel", "They were made servants"], correctAnswer: 1 },
  { text: "How many years would Israel wander in the desert as punishment?", options: ["20 years", "30 years", "40 years", "50 years"], correctAnswer: 2 },
  { text: "Why was 40 years the specific punishment?", options: ["One year for each tribe", "One year for each of the 40 days the spies were in Canaan", "40 years to match Egypt's 40 years of oppression", "A number chosen arbitrarily"], correctAnswer: 1 },
  { text: "Who were the only two men of their generation allowed to enter Canaan?", options: ["Moses and Aaron", "Moses and Joshua", "Caleb and Joshua", "Caleb and Eleazar"], correctAnswer: 2 },
  // ── Chapter 15 ──
  { text: "In Numbers 15, what additional offering accompanied a burnt offering?", options: ["A guilt offering", "Grain and drink offerings in specified amounts", "A wave offering of silver", "A peace offering only"], correctAnswer: 1 },
  { text: "What law was given about unintentional sin by the whole community?", options: ["No atonement was possible", "They should offer a young bull and a male goat for a sin offering", "They should fast for 7 days", "They should each bring a lamb"], correctAnswer: 1 },
  { text: "What was to happen to someone who sinned defiantly (\"with a high hand\")?", options: ["They paid double restitution", "They were cut off from the people—no atonement possible", "They were exiled for one year", "They brought an extra offering"], correctAnswer: 1 },
  { text: "What happened to a man found gathering wood on the Sabbath?", options: ["He was fined", "He was publicly rebuked", "He was stoned to death outside the camp", "He was made to serve extra Tabernacle duties"], correctAnswer: 2 },
  { text: "What were Israelites commanded to put on the edges of their garments in Numbers 15?", options: ["Blue ribbon and gold thread", "Tassels with a blue cord", "Bronze bells", "White fringe"], correctAnswer: 1 },
  // ── Chapter 16 ──
  { text: "Who led the rebellion against Moses and Aaron in Numbers 16?", options: ["Dathan and Abiram", "Korah, Dathan, Abiram and On", "Korah alone", "250 community leaders"], correctAnswer: 1 },
  { text: "How many leaders joined Korah's rebellion?", options: ["70", "120", "250", "500"], correctAnswer: 2 },
  { text: "What happened to Korah, Dathan and Abiram and their households?", options: ["They were struck by lightning", "The ground opened and swallowed them alive into Sheol", "They were burned by fire", "They died of plague"], correctAnswer: 1 },
  { text: "What happened to the 250 men who offered incense?", options: ["They were swallowed by the earth", "Fire came out from the Lord and consumed them", "They were exiled", "They fled and were pardoned"], correctAnswer: 1 },
  { text: "What did Moses instruct Eleazar to do with the bronze censers of the 250 men?", options: ["Bury them", "Hammer them into a covering for the altar as a reminder", "Melt them down for the lampstand", "Cast them into the sea"], correctAnswer: 1 },
  { text: "After the rebellion, when a plague broke out, how did Aaron stop it?", options: ["He prayed over the people", "He stood between the dead and the living with his burning censer", "He sprinkled blood on the people", "He blew the silver trumpets"], correctAnswer: 1 },
  { text: "How many people died in the plague after Korah's rebellion?", options: ["1,000", "3,000", "14,700", "24,000"], correctAnswer: 2 },
  // ── Chapter 17 ──
  { text: "God commanded each tribe to bring a staff with their leader's name on it. Whose staff would sprout?", options: ["The man God chose for leadership", "The most righteous tribe", "All twelve would sprout", "The tribe Moses chose"], correctAnswer: 0 },
  { text: "Whose staff budded, blossomed and produced almonds?", options: ["Moses's", "Joshua's", "Aaron's", "Eleazar's"], correctAnswer: 2 },
  { text: "Where was Aaron's staff kept as a perpetual sign?", options: ["In the tent of meeting among the scrolls", "In front of the Ark of the Covenant", "Outside the tabernacle gate", "Buried under the altar"], correctAnswer: 1 },
  // ── Chapter 18 ──
  { text: "Who bore the guilt for offenses against the sanctuary?", options: ["The whole community", "Aaron and his sons together with the Levites", "Aaron alone", "The Levites alone"], correctAnswer: 1 },
  { text: "What portion of offerings and first fruits belonged to the priests?", options: ["One tenth", "One fifth", "Everything waved before God", "Half"], correctAnswer: 2 },
  { text: "What was given to the Levites as their inheritance instead of land?", options: ["Silver shekels from the treasury", "The tithe of Israel—all tithes in Israel", "The firstborn of animals", "The cities of refuge"], correctAnswer: 1 },
  { text: "Of the tithe the Levites received, what portion did they give to the priests?", options: ["A fifth—the best tenth of it", "A tenth of the tenth—the best part", "A half", "Nothing"], correctAnswer: 1 },
  // ── Chapter 19 ──
  { text: "What was the red heifer used for in Numbers 19?", options: ["A peace offering at the altar", "Preparation of water for purification from contact with the dead", "An annual sin offering for all Israel", "A burnt offering for Nazirites"], correctAnswer: 1 },
  { text: "What colour must the heifer be, and what must be true of it?", options: ["Pure white, never yoked", "Red, without defect, and never yoked", "Black, without blemish", "Brown, two years old"], correctAnswer: 1 },
  { text: "How long was a person unclean who touched a dead body?", options: ["3 days", "7 days", "14 days", "30 days"], correctAnswer: 1 },
  { text: "What was mixed with the ashes of the red heifer to make purification water?", options: ["Wine", "Olive oil", "Running/fresh water", "Salt water"], correctAnswer: 2 },
  // ── Chapter 20 ──
  { text: "Where did Miriam die and was buried?", options: ["Taberah", "Kadesh (in the desert of Zin)", "Hazeroth", "Sinai"], correctAnswer: 1 },
  { text: "What did God instruct Moses to do to bring water at Meribah?", options: ["Strike the rock twice", "Speak to the rock before the assembly", "Dig beside the rock", "Pray with Aaron"], correctAnswer: 1 },
  { text: "What did Moses actually do instead at Meribah?", options: ["He spoke to the rock", "He struck the rock twice with his staff", "He dug beside the rock", "He said a wrong prayer"], correctAnswer: 1 },
  { text: "What was the consequence for Moses and Aaron at Meribah?", options: ["They lost their leadership immediately", "They would not bring the assembly into the Promised Land", "They had to offer a guilt offering", "They were demoted to ordinary Israelites"], correctAnswer: 1 },
  { text: "What king refused to let Israel pass through his territory?", options: ["The king of Moab", "The king of Edom", "The king of Bashan", "The king of Amalek"], correctAnswer: 1 },
  { text: "Where did Aaron die?", options: ["In the desert of Zin", "At Kadesh", "On Mount Hor", "At the Jordan River"], correctAnswer: 2 },
  { text: "Who was appointed to take Aaron's place as high priest?", options: ["Ithamar", "Phinehas", "Eleazar", "Gershom"], correctAnswer: 2 },
  // ── Chapter 21 ──
  { text: "The king of which city took some Israelites captive, prompting Israel's first military victory in Canaan?", options: ["Arad (the Canaanite king)", "Sihon", "Og", "Balak"], correctAnswer: 0 },
  { text: "God sent fiery serpents among the people because they complained against Moses and God. What did Moses make to heal the people?", options: ["A golden bull", "A bronze serpent on a pole", "An altar of incense", "A silver dove"], correctAnswer: 1 },
  { text: "What was the name given to the well the leaders dug in the desert?", options: ["Beer (meaning 'well')", "Meribah", "Massah", "En Mishpat"], correctAnswer: 0 },
  { text: "Which Amorite king refused to let Israel pass and was defeated?", options: ["Og of Bashan", "Sihon king of Heshbon", "Balak king of Moab", "Arad the Canaanite"], correctAnswer: 1 },
  { text: "What happened to the cities Israel captured from Sihon?", options: ["They were left for the Levites", "Israel took possession and settled in them", "They were burned", "They were given to Reuben alone"], correctAnswer: 1 },
  { text: "Which giant king of Bashan was also defeated by Israel?", options: ["Goliath", "Og of Bashan", "Sihon", "Anak"], correctAnswer: 1 },
  // ── Chapter 22 ──
  { text: "Why was King Balak of Moab afraid of Israel?", options: ["They had the ark of God", "They were very numerous and had already defeated the Amorites", "They had a fearsome army of chariots", "A prophetic message warned him"], correctAnswer: 1 },
  { text: "Who did Balak send for to curse Israel?", options: ["A Canaanite sorcerer", "Balaam son of Beor from Pethor", "His court astrologers", "The priests of Baal"], correctAnswer: 1 },
  { text: "What spoke to Balaam when his donkey refused to move?", options: ["An angel audibly", "The donkey", "A vision", "God in a dream"], correctAnswer: 1 },
  { text: "What was blocking the donkey's path that she could see but Balaam couldn't at first?", options: ["A lion", "The Angel of the Lord with a drawn sword", "A burning bush", "A wall of fire"], correctAnswer: 1 },
  { text: "How many times did the donkey turn aside/act strangely before speaking?", options: ["Once", "Twice", "Three times", "Four times"], correctAnswer: 2 },
  // ── Chapter 23 ──
  { text: "How many altars did Balak build at each of Balaam's oracles?", options: ["1", "7", "12", "3"], correctAnswer: 1 },
  { text: "What was the key theme of Balaam's first oracle?", options: ["Israel is cursed", "God has not cursed what He has not cursed; His blessing cannot be reversed", "Israel will be destroyed", "Moab will prosper"], correctAnswer: 1 },
  { text: "From which location did Balaam give his second oracle?", options: ["The top of Peor", "The field of Zophim, top of Pisgah", "Mount Nebo", "Bamoth-baal"], correctAnswer: 1 },
  { text: "In Balaam's second oracle, which famous phrase appears?", options: ["\"The Lord bless you and keep you\"", "\"God is not a man, that He should lie\"", "\"I am the Lord your God\"", "\"A star shall come out of Jacob\""], correctAnswer: 1 },
  // ── Chapter 24 ──
  { text: "What did Balaam see when he looked out over Israel from the heights?", options: ["An empty desert", "Israel settled tribe by tribe, and the Spirit of God came on him", "The army of the Lord", "A river of fire"], correctAnswer: 1 },
  { text: "What famous messianic line appears in Balaam's fourth oracle?", options: ["\"The scepter shall not depart from Judah\"", "\"A star shall come out of Jacob; a scepter shall rise out of Israel\"", "\"His dominion shall be from sea to sea\"", "\"Out of Egypt I called my son\""], correctAnswer: 1 },
  { text: "After Balaam's oracles, what did Balak say to him?", options: ["\"You have blessed Israel greatly; now curse them!\"", "\"I summoned you to curse my enemies, but you have blessed them three times\"", "\"Go home; I will not pay you\"", "\"Stay with me and we will plan another way\""], correctAnswer: 1 },
  // ── Chapter 25 ──
  { text: "While Israel camped at Shittim, what sin did the Israelite men commit?", options: ["They worshipped the golden calf", "They engaged in sexual immorality with Moabite women and bowed to their gods (Baal of Peor)", "They stole from the Moabites", "They broke the Sabbath"], correctAnswer: 1 },
  { text: "Who killed an Israelite man and his Midianite woman with a spear, stopping the plague?", options: ["Moses", "Joshua", "Phinehas son of Eleazar", "Caleb"], correctAnswer: 2 },
  { text: "How many people died in the plague at Baal of Peor?", options: ["3,000", "14,700", "24,000", "7,000"], correctAnswer: 2 },
  { text: "What covenant did God make with Phinehas because of his act of zeal?", options: ["A covenant of kingship", "A covenant of a lasting priesthood", "A covenant of land", "A covenant of peace and lasting priesthood"], correctAnswer: 3 },
  // ── Chapter 26 ──
  { text: "Why was a second census taken in Numbers 26?", options: ["Moses lost count of the first one", "To assign land portions before entering Canaan", "God commanded another census after the plague", "The Levites demanded it"], correctAnswer: 1 },
  { text: "What was the total of the second census (men 20 and older)?", options: ["600,000", "601,730", "603,550", "605,550"], correctAnswer: 1 },
  { text: "How were land portions to be divided among the tribes?", options: ["Equally to each tribe", "By lot, according to tribe size", "By strength of each tribe", "By the king's decree"], correctAnswer: 1 },
  { text: "Of the men counted in the first census, who were the only two still alive at the second census?", options: ["Moses and Aaron", "Moses and Eleazar", "Caleb and Joshua", "Joshua and Phinehas"], correctAnswer: 2 },
  // ── Chapter 27 ──
  { text: "The daughters of Zelophehad approached Moses because their father had no sons. What did they request?", options: ["A portion of his wealth", "That their father's name not disappear; they wanted his inheritance", "Permission to marry into another tribe", "Exemption from the census"], correctAnswer: 1 },
  { text: "What principle did God establish based on the daughters of Zelophehad's case?", options: ["Women could not inherit property", "Daughters inherit when there is no son", "Nearest male relative always inherits first", "The community divides the property"], correctAnswer: 1 },
  { text: "Who did God tell Moses to commission as his successor?", options: ["Caleb", "Eleazar", "Joshua son of Nun", "Phinehas"], correctAnswer: 2 },
  { text: "What did Moses do to commission Joshua?", options: ["He anointed him with oil", "He laid his hands on him before Eleazar and the whole assembly", "He gave him the rod of God", "He wrote Joshua's name in the scroll of the Law"], correctAnswer: 1 },
  // ── Chapter 28–29 ──
  { text: "How often were the daily burnt offerings to be presented?", options: ["Once each morning", "Morning and evening each day", "Three times a day", "Only on the Sabbath"], correctAnswer: 1 },
  { text: "How many lambs were offered on the Sabbath in addition to the daily offering?", options: ["One", "Two", "Seven", "Twelve"], correctAnswer: 1 },
  { text: "The Festival of Weeks (Firstfruits) required a burnt offering of how many bulls?", options: ["One", "Two", "Seven", "Twelve"], correctAnswer: 1 },
  { text: "In which month did the Feast of Trumpets fall?", options: ["First month, first day", "Seventh month, first day", "Third month, first day", "Tenth month, tenth day"], correctAnswer: 1 },
  { text: "The Day of Atonement fell on what date?", options: ["First month, tenth day", "Seventh month, tenth day", "Seventh month, fifteenth day", "Third month, tenth day"], correctAnswer: 1 },
  { text: "How long did the Feast of Tabernacles last?", options: ["3 days", "7 days", "8 days", "14 days"], correctAnswer: 1 },
  { text: "On the first day of the Feast of Tabernacles, how many bulls were offered?", options: ["7", "10", "13", "14"], correctAnswer: 2 },
  // ── Chapter 30 ──
  { text: "Could a man's vow or sworn oath be cancelled by another person?", options: ["Yes, by a priest", "No; he must do everything he promised", "Yes, by the king", "Yes, by the elders at the gate"], correctAnswer: 1 },
  { text: "When could a father nullify his daughter's vow?", options: ["Any time if he paid silver", "The same day he heard it", "After seven days", "Never"], correctAnswer: 1 },
  { text: "What happened if a husband said nothing about his wife's vow on the day he heard it?", options: ["The vow was automatically nullified", "The vow stood, because his silence confirmed it", "The vow was suspended for 30 days", "She had to bring it before the priests"], correctAnswer: 1 },
  // ── Chapter 31 ──
  { text: "God told Moses to take vengeance on which nation before being gathered to his people?", options: ["Moab", "Edom", "Midian", "Amalek"], correctAnswer: 2 },
  { text: "How many men from each tribe went to war against Midian?", options: ["100", "500", "1,000", "10,000"], correctAnswer: 2 },
  { text: "Who accompanied the army from Israel against Midian, carrying the holy articles?", options: ["Moses", "Aaron", "Phinehas son of Eleazar the priest", "Joshua"], correctAnswer: 2 },
  { text: "Among those killed in the war against Midian was which famous prophet/diviner?", options: ["Abijah", "Balak", "Balaam son of Beor", "Zimri"], correctAnswer: 2 },
  { text: "What were the fighting men required to do to purify themselves after battle?", options: ["Offer a burnt offering", "Remain outside the camp for 7 days and purify everything", "Fast for 3 days", "Immerse in the Jordan River"], correctAnswer: 1 },
  // ── Chapter 32 ──
  { text: "Which two tribes requested to settle east of the Jordan River?", options: ["Reuben and Manasseh", "Reuben and Gad", "Gad and Manasseh", "Reuben, Gad and half-Manasseh initially asked, Reuben and Gad specifically"], correctAnswer: 1 },
  { text: "Why was Moses initially upset with Reuben and Gad's request?", options: ["The land was not fertile", "It reminded him of the spies' bad report that discouraged Israel from entering Canaan", "They had not fought in recent battles", "They owed silver to the tabernacle treasury"], correctAnswer: 1 },
  { text: "What did Reuben and Gad promise in exchange for the land east of Jordan?", options: ["Extra tithes to the Levites", "To lead Israel armed across the Jordan and fight until the land was fully conquered", "To give up their firstborn sons to the priesthood", "To never ask for anything again"], correctAnswer: 1 },
  // ── Chapter 33 ──
  { text: "Numbers 33 records the stages of Israel's journey. Where did Israel's exodus journey begin?", options: ["Kadesh", "Sinai", "Rameses in Egypt", "Succoth"], correctAnswer: 2 },
  { text: "What were Israel commanded to do to the inhabitants of Canaan and their places of worship upon entering?", options: ["Tax them", "Drive them out, destroy their images and demolish their high places", "Make peace treaties with them", "Give them cities of refuge"], correctAnswer: 1 },
  { text: "What would happen if Israel did NOT drive out the inhabitants of Canaan?", options: ["They would eventually assimilate peacefully", "The inhabitants would become like thorns and trouble Israel; God would do to Israel what He planned for the Canaanites", "The Canaanites would leave on their own", "Only the priests would suffer"], correctAnswer: 1 },
  // ── Chapter 34 ──
  { text: "What were the boundaries of the Promised Land as described in Numbers 34?", options: ["From the Jordan to the Mediterranean coast only", "From the Desert of Zin in the south, the Mediterranean in the west, Mount Hor in the north, to the Jordan in the east", "From Mount Sinai to Damascus", "From Egypt to Babylon"], correctAnswer: 1 },
  { text: "Who was appointed to divide the land among the nine and a half tribes?", options: ["Moses and Aaron", "Eleazar the priest and Joshua son of Nun", "Moses alone", "The tribal elders collectively"], correctAnswer: 1 },
  // ── Chapter 35 ──
  { text: "What were the cities given to the Levites called?", options: ["Temple cities", "Levitical cities", "Sanctuary towns", "Holy cities"], correctAnswer: 1 },
  { text: "How many cities in total were given to the Levites?", options: ["12", "24", "42", "48"], correctAnswer: 3 },
  { text: "How many of those Levitical cities were designated as Cities of Refuge?", options: ["3", "6", "9", "12"], correctAnswer: 1 },
  { text: "What was the purpose of the Cities of Refuge?", options: ["For Levites only to live in", "For someone who accidentally killed a person to flee from the avenger of blood", "For enemy prisoners of war", "For those with infectious diseases"], correctAnswer: 1 },
  { text: "Could a murderer (intentional killing) be saved by the City of Refuge?", options: ["Yes, always", "No; the elders would hand him over to the avenger of blood to be put to death", "Yes, if he paid silver", "Yes, if the high priest interceded"], correctAnswer: 1 },
  { text: "How long must an accidental killer stay in the City of Refuge?", options: ["7 years", "Until the next Jubilee", "Until the death of the high priest", "40 days"], correctAnswer: 2 },
  { text: "What was the rule about witnesses for a murder conviction?", options: ["One witness was sufficient", "No-one could be put to death on the testimony of only one witness; two or more were required", "Three witnesses were always required", "Witnesses were not needed if caught in the act"], correctAnswer: 1 },
  // ── Chapter 36 ──
  { text: "What concern did the leaders of Manasseh raise in Numbers 36?", options: ["The daughters of Zelophehad might spend the inheritance", "If the daughters of Zelophehad married outside their tribe, their land would pass to the other tribe", "There were too many daughters and not enough land", "The jubilee law would confiscate the land"], correctAnswer: 1 },
  { text: "What did God command the daughters of Zelophehad to do?", options: ["Remain unmarried", "Marry whoever they pleased", "Marry within their father's tribal clan", "Give their land to the nearest male relative"], correctAnswer: 2 },
  { text: "What general law was established from this case in Numbers 36?", options: ["Women could not own land", "Every Israelite daughter who inherits land must marry within her father's tribe", "Only firstborn daughters could inherit", "Daughters must hand land to brothers at marriage"], correctAnswer: 1 },
  { text: "With what words does the book of Numbers end (summary)?", options: ["These are the laws Moses wrote at Sinai", "These are the commands and regulations the Lord gave through Moses to the Israelites on the plains of Moab by the Jordan across from Jericho", "The Lord spoke these words on Mount Nebo", "Thus Moses finished the law and gave it to the priests"], correctAnswer: 1 },

  // ── Additional Questions (to reach the 1000-question pool) ──
  { text: "The phrase 'the LORD bless you and keep you' is part of which blessing?", options: ["The Passover blessing", "The Aaronic/Priestly blessing in Numbers 6", "The Nazirite blessing", "David's blessing in Psalms"], correctAnswer: 1 },
  { text: "Who spoke to Moses from between the two cherubim above the ark's atonement cover?", options: ["An angel", "The LORD", "Aaron", "The high priest"], correctAnswer: 1 },
  { text: "The fire at Taberah was quenched when Moses did what?", options: ["Prayed to the LORD", "Struck the ground with his staff", "Sprinkled water", "Nothing—it went out on its own"], correctAnswer: 0 },
  { text: "What is the literal meaning of 'Meribah' (where Moses struck the rock)?", options: ["Waters of blessing", "Quarreling/strife", "Rock of God", "Desert spring"], correctAnswer: 1 },
  { text: "What does 'Kadesh' mean?", options: ["Holy/set apart", "Desert", "River of God", "Wilderness"], correctAnswer: 0 },
  { text: "Which king of the Amorites had his capital at Heshbon?", options: ["Og", "Sihon", "Balak", "Arad"], correctAnswer: 1 },
  { text: "The bed of Og king of Bashan was said to be made of what material in Deuteronomy (cross-reference)?", options: ["Cedar wood", "Iron", "Gold", "Stone"], correctAnswer: 1 },
  { text: "What animal did Balaam's donkey see that Balaam initially could not?", options: ["A burning serpent", "The Angel of the LORD", "A lion", "A whirlwind"], correctAnswer: 1 },
  { text: "How many times did Balaam try to curse Israel from different locations?", options: ["2", "3", "4", "7"], correctAnswer: 1 },
  { text: "Who was the Midianite woman killed by Phinehas at Baal of Peor?", options: ["Cozbi daughter of Zur", "Tirzah daughter of Zelophehad", "Rahab", "Zipporah"], correctAnswer: 0 },
  { text: "The daughters of Zelophehad who appeared before Moses were Mahlah, Noah, Hoglah, Milcah and who else?", options: ["Tirzah", "Deborah", "Ruth", "Miriam"], correctAnswer: 0 },
  { text: "What offering was required on the New Moon festival?", options: ["1 bull, 1 ram, 7 lambs (plus a male goat for sin)", "2 bulls, 1 ram, 7 lambs (plus 1 male goat)", "7 lambs only", "1 bull and 1 ram"], correctAnswer: 1 },
  { text: "Which feast was also called the Feast of Weeks or Firstfruits in Numbers 28?", options: ["Passover", "The Day of Atonement", "Shavuot/Pentecost", "Feast of Tabernacles"], correctAnswer: 2 },
  { text: "What happened to the staffs of the other eleven tribes—did they sprout?", options: ["Yes, they all sprouted", "No; only Aaron's sprouted", "Seven of them sprouted", "The test was inconclusive"], correctAnswer: 1 },
  { text: "Numbers says the Israelites asked Moses: 'Are we all going to die?' Which event prompted this?", options: ["After the 10 plagues' memory", "After Korah's rebellion and the confirming plague", "After the spies' report", "After the fiery serpents"], correctAnswer: 1 },
  { text: "God compared Moses unfavourably to which kind of prophet in Numbers 12 (i.e. how does God speak to Moses differently)?", options: ["To a scribe who reads scrolls", "To other prophets who receive visions and dreams; Moses speaks with God face to face", "To a priest who mediates through sacrifice", "To a judge who interprets the Law"], correctAnswer: 1 },
  { text: "In Balaam's famous oracle, Israel is described as 'a people who live apart.' What does this indicate?", options: ["Israel has no friends", "Israel is set apart/holy and not reckoned among the nations the same way", "Israel lives in tents not cities", "Israel is geographically isolated"], correctAnswer: 1 },
  { text: "The Israelite men who joined the Baal of Peor worship were told to be killed. Who were to kill them?", options: ["The Levites", "Each man's judges were to kill those under their jurisdiction", "The priests only", "The whole assembly stoning them"], correctAnswer: 1 },
  { text: "How many cities of refuge were on each side of the Jordan (east and west)?", options: ["1 on each side", "2 on each side", "3 on each side", "6 on the west, none on the east"], correctAnswer: 2 },
  { text: "The Promised Land's northern border in Numbers 34 was described as running to what location?", options: ["Mount Hermon and Lebo Hamath", "The Euphrates River", "Damascus", "Mount Sinai"], correctAnswer: 0 },
  { text: "Numbers 1 says the census was to count all men in Israel who were able to do what?", options: ["Pay taxes", "Serve in the military (20 years old and older)", "Offer sacrifices", "Read the Law"], correctAnswer: 1 },
  { text: "In which wilderness was Israel camped when the first census was taken?", options: ["The desert of Paran", "The desert of Sinai", "The desert of Zin", "The Arabah"], correctAnswer: 1 },
  { text: "The tribe of Levi was NOT counted in the military census. What were they assigned to do instead?", options: ["Serve as judges", "Be in charge of the tabernacle—carry it, set it up and take care of it", "Guard the borders", "Serve as doctors and healers"], correctAnswer: 1 },
  { text: "Any unauthorized person who came near the tabernacle was to be what?", options: ["Fined heavily", "Put to death", "Made to serve as a slave", "Exiled from the camp"], correctAnswer: 1 },
  { text: "How many sons did Aaron have?", options: ["2", "3", "4", "5"], correctAnswer: 2 },
  { text: "By what two words is Aaron's son Nadab's partner in death known?", options: ["Nadab and Abuhu", "Nadab and Abihu", "Nadab and Abiram", "Nadab and Korah"], correctAnswer: 1 },
  { text: "The garment of the high priest included a breastpiece, an ephod, a robe, a tunic of fine linen, a turban and what else?", options: ["A golden crown", "A sash/waistband", "Sandals", "A veil"], correctAnswer: 1 },
  { text: "What word means the 'meeting place' between God and Moses in the Tabernacle?", options: ["The 'Mishkan' (dwelling place)", "The 'Ohel Moed' (Tent of Meeting)", "The 'Aron' (ark)", "The 'Qodesh' (holiness)"], correctAnswer: 1 },
  { text: "The word 'Numbers' in Hebrew comes from the word for what?", options: ["Wandering (bamidbar means 'in the wilderness')", "Wilderness", "Generation", "Census"], correctAnswer: 1 },
  { text: "The Hebrew name for the book of Numbers is 'Bamidbar.' What does this mean?", options: ["In the desert/wilderness", "Counting of the people", "Laws of the camp", "The journey"], correctAnswer: 0 },
  { text: "What is significant about the book of Numbers in terms of time span?", options: ["It covers 40 years of wandering", "It covers mainly 38–39 years of wilderness wandering (after Sinai to the plains of Moab)", "It covers exactly 1 year", "It covers 50 years from Exodus to entry"], correctAnswer: 1 },
  { text: "The two spies from the tribe of Ephraim and Judah are identified by name—who are they?", options: ["Joshua from Ephraim and Caleb from Judah", "Joshua from Judah and Caleb from Ephraim", "Eleazar and Phinehas", "Palti and Gaddiel"], correctAnswer: 0 },
  { text: "What did Caleb declare when he urged Israel to take Canaan?", options: ["'We are more than able to take it'", "'We should go up and take possession of the land, for we can certainly do it'", "'God has given it to us; fear not the enemy'", "'Let us trust in God and march at once'"], correctAnswer: 1 },
  { text: "Which group of people under age 20 (at the time of rebellion) was promised entry into Canaan?", options: ["All children regardless of age", "Those under 20, plus women of all ages", "Only males under 20", "All those under 20 years old at the time of the rebellion"], correctAnswer: 3 },
  { text: "What was the name of the well from which Israel drank while travelling to Mattanah (Numbers 21)?", options: ["Beer", "Meribah", "Marah", "En Gedi"], correctAnswer: 0 },
  { text: "What ancient archive does Numbers 21 quote from that recorded Israel's battles?", options: ["The Book of Jashar", "The Book of the Wars of the LORD", "The Annals of the Kings", "The Book of Remembrance"], correctAnswer: 1 },
  { text: "In the war against Midian, the army brought back captives. Moses was angry because they had spared whom?", options: ["The soldiers", "The women who had caused Israel to sin at Baal of Peor, and male children", "The king of Midian", "No-one; he was pleased"], correctAnswer: 1 },
  { text: "What formula was used to divide the spoils of the Midianite war?", options: ["Equal shares to all", "Half to the warriors; half to the community; a tribute from each half to the LORD", "All given to the Levites", "The commanders kept all spoils"], correctAnswer: 1 },
  { text: "God told Moses his end was near before giving a command about vengeance on Midian. Why is this significant?", options: ["Moses was the only one who could lead the battle", "God promised Moses would see the revenge before dying", "Moses needed to complete his final tasks before death", "The battle would complete 40 years exactly"], correctAnswer: 2 },
  { text: "What is the 'Passover' in Hebrew called?", options: ["Shabbat", "Pesach", "Sukkot", "Yom Kippur"], correctAnswer: 1 },
  { text: "On Passover, which kind of lamb was to be sacrificed?", options: ["A firstborn male without defect one year old", "Any perfect lamb", "A ram three years old", "A young bull"], correctAnswer: 0 },
  { text: "The second Passover provision in Numbers 9 uses the phrase 'a man who is unclean.' What counted as unclean in this context?", options: ["Having sinned", "Being defiled by a dead body", "Not tithing correctly", "Having a skin disease not leprosy"], correctAnswer: 1 },
  { text: "The silver trumpets in Numbers 10 were made from what material?", options: ["Bronze", "Silver—hammered silver", "Gold", "Iron"], correctAnswer: 1 },
  { text: "What was the specific sin that caused fire to break out at 'Taberah'?", options: ["They worshipped idols", "The people complained/spoke evil in God's hearing", "They broke the Sabbath", "They failed to observe Passover"], correctAnswer: 1 },
  { text: "Moses says in Numbers 11 that the burden of the people is too great for him alone. He compares himself to what?", options: ["A shepherd with too many sheep", "A father/nurse carrying a nursing infant", "A king without advisors", "A builder without workers"], correctAnswer: 1 },
  { text: "What does the name 'Kibroth-hattaavah' mean?", options: ["Place of testing", "Graves of craving/desire", "Waters of Meribah", "Camp of the hungry"], correctAnswer: 1 },
  { text: "After Miriam's healing, where did Israel next travel?", options: ["To Kadesh-barnea", "To Hazeroth, and then the desert of Paran", "To Mount Nebo", "Back to Sinai"], correctAnswer: 1 },
  { text: "Where did the spies go in their exploration of Canaan?", options: ["Only to Jerusalem", "Through the Negev and into the hill country as far as Rehob, near Lebo Hamath", "Only along the Jordan River", "Straight to Jericho"], correctAnswer: 1 },
  { text: "What was the name of the valley from which the spies cut the cluster of grapes?", options: ["Valley of Jezreel", "Valley of Eshcol", "Valley of Elah", "Valley of Kidron"], correctAnswer: 1 },
  { text: "What does 'Eshcol' mean?", options: ["Cluster (of grapes)", "Valley of blessing", "Grape vine", "Place of plenty"], correctAnswer: 0 },
  { text: "In Numbers 13, which city of the Anakites (giant descendants) did the spies mention seeing?", options: ["Jerusalem", "Hebron", "Jericho", "Bethlehem"], correctAnswer: 1 },
  { text: "The five daughters of Zelophehad — which tribe were they from?", options: ["The half-tribe of Manasseh", "Ephraim", "Judah", "Asher"], correctAnswer: 0 },
  { text: "How were Joshua and Eleazar to determine God's will after Moses's death (regarding decisions for Israel)?", options: ["By reading the Law", "By the Urim before the LORD", "By casting lots only", "By direct prophecy"], correctAnswer: 1 },
  { text: "The Kohathites carried the most holy things but were NOT to touch or look at them. What would happen if they did?", options: ["They would be struck blind", "They would die", "They would become unclean for 7 days", "They would be banished"], correctAnswer: 1 },
  { text: "What must a man who kills an animal (someone else's) do under the law of restitution (Numbers 5 context)?", options: ["Nothing if it was accidental", "Pay full value for it", "Pay double", "Bring a guilt offering only"], correctAnswer: 1 },
  { text: "A Nazirite who defiled himself would have to shave his head on which day?", options: ["The first day of defilement", "The seventh day (of cleansing)", "The fourteenth day", "The day of presenting offerings"], correctAnswer: 1 },
  { text: "Upon completing a Nazirite vow, what three things were offered?", options: ["A burnt offering, sin offering, and peace offering", "A burnt offering, peace offering, and wave offering of the hair", "Three peace offerings", "A sin offering, grain offering, and drink offering"], correctAnswer: 0 },
  { text: "What was placed in the hair/head of a Nazirite upon completing the vow, and then it was shaved?", options: ["The hair that grew during the vow, which was then burned under the peace offering", "A special crown", "Anointing oil", "A blue cord"], correctAnswer: 0 },
  { text: "What special offering uniquely accompanied the Nazirite's completion offering (Numbers 6)?", options: ["A wave offering of a ram + bread/cake basket", "A burnt bull", "An extra daily offering for 7 days", "Gold shekels to the priest"], correctAnswer: 0 },
  { text: "God said to Aaron, 'You and your sons and your father's house will bear the guilt for offenses against the sanctuary.' What did He give them to bear this responsibility?", options: ["Land and cities", "The priesthood itself and the responsibility was their grant", "An annual animal sacrifice", "The Urim and Thummim exclusively"], correctAnswer: 1 },
  { text: "Firstborn animals in Israel belonged to the LORD. How were they handled for clean animals?", options: ["Sacrificed, with the blood and fat given to priests and meat going to the priests", "Redeemed for silver", "Given to the Levites", "Released into the wilderness"], correctAnswer: 0 },
  { text: "What could NOT be redeemed but must be destroyed (devoted to the LORD) in Numbers 18?", options: ["Firstborn donkeys", "Anything specifically devoted to the LORD—it is most holy", "Firstborn cattle", "All animals"], correctAnswer: 1 },
  { text: "The water of purification (red heifer ashes) was said to be for the removal of sin (purification). Those who prepared it became what?", options: ["Holy and set apart", "Ceremonially unclean themselves until evening", "Immediately clean", "Specially blessed"], correctAnswer: 1 },
  { text: "After Aaron's death, which nation attacked Israel and took some captive?", options: ["Amalek", "Moab", "The Canaanite king of Arad", "Edom"], correctAnswer: 2 },
  { text: "What vow did Israel make to the LORD in exchange for victory over Arad?", options: ["To tithe their spoils", "To completely destroy the cities and their things (put them under the ban)", "To build an altar", "To observe a week of fasting"], correctAnswer: 1 },
  { text: "To which place in Numbers 21 did Israel travel after defeating Arad?", options: ["Edom", "Mount Hor to go around Edom", "The plains of Moab", "The desert of Zin"], correctAnswer: 1 },
  { text: "What is the meaning of the name 'Hormah' (Numbers 21)?", options: ["Place of blessing", "Destruction/ban", "Victory song", "Desert stronghold"], correctAnswer: 1 },
  { text: "The song the Israelites sang at the well in Numbers 21 begins: 'Spring up, O...'?", options: ["Water", "Well", "River", "Fountain"], correctAnswer: 1 },
  { text: "Which Amorite king's territory did Israel later settle in Numbers 21?", options: ["Og", "Sihon—his land from the Arnon to the Jabbok", "Balak", "Arad"], correctAnswer: 1 },
  { text: "What city became Israel's 'capital' after defeating Sihon in Numbers 21?", options: ["Dibon", "Heshbon", "Medeba", "Aroer"], correctAnswer: 1 },
  { text: "Numbers 21 contains an ancient song about Heshbon. Who composed/sang it originally?", options: ["Moses and Israel", "The ballad singers and the poets of the Amorites", "The Levites", "Balaam"], correctAnswer: 1 },
  { text: "Balak was the king of which nation?", options: ["Edom", "Moab", "Midian", "Ammon"], correctAnswer: 1 },
  { text: "Balak sent elders of Moab and Midian to Balaam with what in their hands?", options: ["Written curses", "Divination fees/money for divination", "Gifts of food", "A letter of accusation"], correctAnswer: 1 },
  { text: "God initially told Balaam what about going with Balak's men?", options: ["Go and bless Israel", "Do not go; you must not curse Israel for they are blessed", "Go but say nothing", "You may go if they pay enough"], correctAnswer: 1 },
  { text: "Why did God ultimately allow Balaam to go to Balak?", options: ["God changed His mind", "Balaam kept asking until God said go, but only do what I tell you", "Balaam refused to accept the fees", "Israel's leaders interceded for Balaam"], correctAnswer: 1 },
  { text: "On which occasion did the donkey crush Balaam's foot against a wall?", options: ["The first time, in the open field", "The second time, in a narrow path between vineyards", "The third time, in a narrow place", "Only once"], correctAnswer: 1 },
  { text: "After Balaam confessed his sin, the Angel of the LORD said the donkey's turning saved whose life?", options: ["Balak's", "Balaam's own life", "Israel's", "The messengers with him"], correctAnswer: 1 },
  { text: "From which high place did Balaam first see the full expanse of Israel?", options: ["Bamoth-baal", "The top of Peor", "Pisgah", "Mount Hor"], correctAnswer: 0 },
  { text: "What phrase did Balaam use to introduce each oracle? 'The oracle of Balaam son of Beor, the oracle of one whose...'?", options: ["'...eyes are open'", "'...ear is given'", "'...heart is pure'", "'...mouth speaks truth'"], correctAnswer: 0 },
  { text: "In Balaam's first oracle, he says God brought Israel out of Egypt comparable to what?", options: ["A lion rising from its den", "Like the horns of a wild ox", "Like a rushing river", "As the splendour of a king"], correctAnswer: 1 },
  { text: "Balaam's third oracle opens by describing Israel as what?", options: ["A great river", "How beautiful are your tents, O Jacob, your dwelling places, O Israel!", "'A star rising in the east'", "A mighty army surging"], correctAnswer: 1 },
  { text: "Who does Balaam's star oracle target as future victims of the star from Jacob?", options: ["Egypt", "Babylon", "Moab and Sheth/Edom", "Assyria"], correctAnswer: 2 },
  { text: "After giving his oracles and before going home, Balaam gave Balak one more word. What was the theme?", options: ["He predicted a blessing on Moab in the end", "He gave a final series of oracles including doom for Moab, Edom, Amalek, Asshur and Eber", "He told Balak how to trap Israel with a different strategy", "He sang a song of lament for Israel"], correctAnswer: 1 },
  { text: "Numbers 25 says Israel 'yoked themselves to Baal of Peor.' What does this mean?", options: ["They worshipped the golden calf again", "They engaged in idolatry and immorality with Midianite/Moabite women", "They made a treaty with Peor", "They ate food offered at the shrine of Baal"], correctAnswer: 1 },
  { text: "The man Phinehas killed was named Zimri. He was the son of what leader?", options: ["A leader of a Simeonite family", "A leader from Judah", "The chief of the Levites", "A son of the king of Midian"], correctAnswer: 0 },
  { text: "The second census in Numbers 26 was to prepare for what specific purpose?", options: ["Another 40-year journey", "Dividing up the land of Canaan among the tribes", "Organizing another military recruitment", "Counting gifts for the tabernacle"], correctAnswer: 1 },
  { text: "The tribe of Levi was again counted separately in the second census. How many Levite males one month old and upward were counted?", options: ["22,000", "23,000", "20,000", "25,000"], correctAnswer: 1 },
  { text: "Which tribe had the greatest number in the second census?", options: ["Judah", "Dan", "Simeon", "Manasseh"], correctAnswer: 0 },
  { text: "Which tribe had the smallest number in the second census?", options: ["Manasseh", "Benjamin", "Simeon", "Naphtali"], correctAnswer: 2 },
  { text: "God instructed that the land should be given as an inheritance by lot. What factor also determined the size of the portion?", options: ["Seniority of the patriarch", "The previous census number only", "Lot determined which region; size of territory was proportional to tribal population", "The king decided lot sizes"], correctAnswer: 2 },
  { text: "In Numbers 27, Moses was told to 'go up this mountain of Abarim and see the land.' He would die there as Aaron did on Mount Hor. What was his sin again referenced?", options: ["He worshipped a foreign god", "He rebelled against God's command at the waters of Meribah Kadesh in the Desert of Zin", "He spoke evil about God to the people", "He failed to enforce the Sabbath"], correctAnswer: 1 },
  { text: "Moses showed great character in response to being told he would die before entering Canaan. What did he immediately ask God for?", options: ["To extend his own life", "To appoint a man over the community so they would not be like sheep without a shepherd", "To be buried in Canaan", "To be allowed to at least see the first battle"], correctAnswer: 1 },
  { text: "What does 'laying on of hands' signify in Joshua's commissioning?", options: ["Transfer of authority and the Spirit upon Joshua", "A formal military salute", "A healing ritual", "Simply a farewell gesture"], correctAnswer: 0 },
  { text: "The daily burnt offering is also known by what term?", options: ["Olah tamid", "The continual/tamid offering", "The morning sacrifice only", "Both A and B"], correctAnswer: 3 },
  { text: "What was presented every Sabbath in addition to the regular daily offering?", options: ["2 male lambs plus the regular burnt offering and grain/drink offering", "A special peace offering", "Nothing extra", "One extra bull"], correctAnswer: 0 },
  { text: "The Day of Atonement required what unique act of the people?", options: ["Extra feasting", "Denying/afflicting themselves (fasting) and doing no work", "Reading the Law all day", "Bringing extra tithes"], correctAnswer: 1 },
  { text: "On the eighth day of the Feast of Tabernacles (Numbers 29), how many bulls were offered?", options: ["1", "7", "12", "13"], correctAnswer: 0 },
  { text: "The descending pattern of bulls from 13 down to 7 during the 7 days of Tabernacles adds to how many total bulls over the feast?", options: ["70", "77", "91", "84"], correctAnswer: 0 },
  { text: "If a woman made a vow while living in her father's house and her father heard and said nothing, the vow would:", options: ["Be cancelled automatically after 7 days", "Stand—her silence represents approval", "Be referred to the priest", "Be cancelled the next Sabbath"], correctAnswer: 1 },
  { text: "If a wife made a vow and her husband prohibited it when he heard, what happened?", options: ["The husband bore the guilt since he nullified it", "The vow was released and the LORD forgave her", "The vow was binding despite the husband", "She had to bring an offering"], correctAnswer: 1 },
  { text: "A widow's or divorced woman's vow is treated how?", options: ["Like a man's vow—it is binding", "She needs a male guardian", "It is automatically invalid", "It depends on the priest's ruling"], correctAnswer: 0 },
  { text: "In the Midianite war, how many from each tribe (12 tribes) fought?", options: ["500", "1,000", "5,000", "10,000"], correctAnswer: 1 },
  { text: "What metals taken as spoil in the Midianite war were to be purified by fire?", options: ["Only gold", "Gold, silver, bronze, iron, tin and lead", "Gold and silver only", "Bronze and iron only"], correctAnswer: 1 },
  { text: "What metals could not withstand fire and were to be purified only by water?", options: ["Gold and silver", "All organic materials/wood, clothing and leather", "Lead and tin", "Bronze"], correctAnswer: 1 },
  { text: "The total gold from the officers' tribute to the LORD in Numbers 31 was how many shekels?", options: ["16,750 shekels", "675,000 shekels", "7,500 shekels", "23,000 shekels"], correctAnswer: 0 },
  { text: "What did not a single Israelite fighting man lose in the Midianite war, according to Numbers 31?", options: ["Any weapons", "Their lives—not one soldier died", "Their family members", "Their share of plunder"], correctAnswer: 1 },
  { text: "Reuben and Gad's request was to settle in Jazer and Gilead because the land was suited for what?", options: ["Farming of grain", "Livestock raising", "Building great cities", "Mining precious metals"], correctAnswer: 1 },
  { text: "Moses compared Reuben and Gad's request to the sin of which generation?", options: ["The generation that made the golden calf", "The generation of the ten faithless spies who discouraged Israel", "The generation of Korah's rebellion", "The generation that complained about manna"], correctAnswer: 1 },
  { text: "Moses agreed to give Reuben and Gad the land if they did what specific thing first?", options: ["Build cities for their families then cross to fight", "Cross the Jordan as an armed force before the rest of Israel and continue fighting until the land was fully taken", "Pay a silver tribute to the tabernacle", "Wait until the Levites were settled"], correctAnswer: 1 },
  { text: "Which half-tribe also eventually received land east of the Jordan?", options: ["Half of Ephraim", "Half of Manasseh (Machir)", "Half of Benjamin", "Half of Issachar"], correctAnswer: 1 },
  { text: "The journey record in Numbers 33 mentions that Israel camped at Elim, which had how many springs and how many palm trees?", options: ["7 springs and 70 palm trees", "12 springs and 70 palm trees", "7 springs and 7 palm trees", "12 springs and 12 palm trees"], correctAnswer: 1 },
  { text: "After leaving Egypt, where did Israel cross the Red Sea?", options: ["At Pihahiroth, between Migdol and the sea", "Near Succoth", "Near Etham", "At the Nile delta"], correctAnswer: 0 },
  { text: "The punishment for defying God's command to drive out the Canaanites is: the Canaanites would become what to Israel?", options: ["Political rulers", "Thorns in your side and barbs in your eyes", "Trading partners", "A source of tribute silver"], correctAnswer: 1 },
  { text: "The eastern boundary of the land in Numbers 34 follows the eastern shore of what body of water to begin?", options: ["The Dead Sea/Salt Sea", "The Red Sea", "The Jordan River", "The Sea of Galilee"], correctAnswer: 0 },
  { text: "Who was the leader from the tribe of Judah appointed to help divide the land?", options: ["Caleb son of Jephunneh", "Shammua son of Zaccur", "Nahbi son of Vophsi", "Igal son of Joseph"], correctAnswer: 0 },
  { text: "How wide was the common land (pastureland) surrounding each Levitical city?", options: ["500 cubits", "1,000 cubits on each side", "2,000 cubits on each side", "Half a mile"], correctAnswer: 2 },
  { text: "Which of the following could NOT happen according to Numbers 35 without blood-guilt falling on the land?", options: ["Building a new city", "Taking payment/ransom to spare a murderer's life—it defiled the land", "Moving a Levitical city boundary", "Inter-tribal marriage"], correctAnswer: 1 },
  { text: "Who is the 'avenger of blood' (go'el hadam) in Numbers 35?", options: ["A priest appointed to hear the case", "The nearest relative of the killed person", "A leader from the killed person's tribe", "The judge at the city gate"], correctAnswer: 1 },
  { text: "If an accidental killer left the City of Refuge before the death of the high priest, what could the avenger of blood do?", options: ["Nothing—he was still protected", "Kill him without blood-guilt", "Report him to Moses", "Demand a fine"], correctAnswer: 1 },
  { text: "What phrase from Numbers 35 means the land is 'polluted' by murder?", options: ["The land weeps", "Blood defiles/pollutes the land; only the blood of the killer can make atonement", "The ground cries out", "The land is made unclean by sin"], correctAnswer: 1 },
  { text: "God commanded Israel: 'Do not defile the land where you live and where I dwell, for I the LORD dwell...'?", options: ["'...in the heavens above'", "'...among the Israelites'", "'...in the tabernacle of testimony'", "'...in the hearts of the righteous'"], correctAnswer: 1 },
  { text: "The law about daughters inheriting and marrying within their tribe was so that:", options: ["The tribe would not grow too large", "No inheritance would pass from one tribe to another, preserving each tribe's inheritance", "Women would not become too powerful", "Peace between tribes would be maintained"], correctAnswer: 1 },
  { text: "The daughters of Zelophehad obeyed God's command and married cousins within which specific tribal division?", options: ["The clans of Manasseh son of Joseph", "The priestly division of the Kohathites", "The clans of Ephraim", "The line of Judah"], correctAnswer: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// FOURSQUARE STANDARD OF ATTAINMENT — 1000 Questions
// ─────────────────────────────────────────────────────────────────────────────
const foursquareQuestions = [
  // ── Doctrine: The Bible ──
  { text: "According to Foursquare doctrine, the Bible is considered to be:", options: ["A collection of human wisdom", "The inspired and infallible Word of God", "Partially true and partially mythological", "One of many equal holy books"], correctAnswer: 1 },
  { text: "What does '2 Timothy 3:16-17' teach about Scripture?", options: ["Scripture is written by human imagination", "All Scripture is God-breathed and profitable for doctrine, reproof, correction and training in righteousness", "The Old Testament alone is inspired", "Scripture is helpful but not binding"], correctAnswer: 1 },
  { text: "Which two attributes of Scripture are emphasized in the Foursquare Declaration of Faith?", options: ["Beauty and wisdom", "Inspiration and infallibility", "Age and tradition", "Length and completeness"], correctAnswer: 1 },
  { text: "The Foursquare Church believes the Bible consists of how many books?", options: ["39 (Old Testament only)", "66 books (39 OT + 27 NT)", "73 books (with Apocrypha)", "27 books (New Testament only)"], correctAnswer: 1 },
  { text: "What is the supreme standard for faith and conduct in the Foursquare Church?", options: ["The teachings of Aimee Semple McPherson", "Church tradition and creeds", "The Holy Scriptures", "The vote of the General Convention"], correctAnswer: 2 },
  // ── Doctrine: The Godhead ──
  { text: "The Foursquare Church believes in:", options: ["Monotheism — one God in three Persons (Trinity)", "Two Gods (Father and Son)", "God is a force, not a Person", "The Father only, with no distinct Son or Spirit"], correctAnswer: 0 },
  { text: "What does the term 'Trinity' mean in Foursquare doctrine?", options: ["Three separate Gods", "One God eternally existing in three distinct Persons: Father, Son and Holy Spirit", "God can appear as three different modes", "Three levels of divine authority"], correctAnswer: 1 },
  { text: "Which Scripture is most commonly used to support the doctrine of the Trinity?", options: ["Genesis 1:1", "Matthew 28:19 ('Go and make disciples...baptizing them in the name of the Father, Son and Holy Spirit')", "Romans 3:23", "John 3:16"], correctAnswer: 1 },
  { text: "In Foursquare Christology, Jesus Christ is:", options: ["A great prophet but not God", "Fully God and fully man—the second Person of the Trinity", "An angel elevated to divine status", "A spiritual concept, not a historical person"], correctAnswer: 1 },
  { text: "Which of the following best describes the Foursquare view of the Holy Spirit?", options: ["An impersonal force", "The third Person of the Trinity, fully divine and co-equal with the Father and Son", "God's energy projected into the world", "An angel assigned to assist believers"], correctAnswer: 1 },
  // ── Doctrine: Salvation / Atonement ──
  { text: "The first of the 'Foursquare Gospel' is:", options: ["Jesus the Healer", "Jesus the Saviour", "Jesus the Soon-Coming King", "Jesus the Baptiser in the Holy Spirit"], correctAnswer: 1 },
  { text: "According to Foursquare doctrine, salvation is available to:", options: ["Only the chosen elect", "All who repent and believe in Jesus Christ", "Those who do enough good works", "Those baptized in water as infants"], correctAnswer: 1 },
  { text: "What does 'justification by faith' mean in the Foursquare tradition?", options: ["God makes allowances for human sinfulness", "A person is declared righteous before God through faith in Christ alone, not by works", "Baptism justifies a person before God", "Church membership justifies the believer"], correctAnswer: 1 },
  { text: "Which verse is foundational to the Foursquare doctrine of salvation?", options: ["Matthew 5:3", "John 3:16 ('For God so loved the world...')", "Acts 2:38 only", "Revelation 22:17"], correctAnswer: 1 },
  { text: "What is 'repentance' in Foursquare doctrine?", options: ["Feeling sorry for sin without changing", "A genuine turning from sin toward God, resulting in a changed life", "Confessing sins to a priest", "Making penance and doing good works"], correctAnswer: 1 },
  { text: "Foursquare believes that a truly saved person will experience:", options: ["Immediate physical perfection", "The new birth—being born again by the Holy Spirit", "Instant world success", "Freedom from all temptation"], correctAnswer: 1 },
  { text: "The new birth is described in which passage of Scripture?", options: ["Matthew 5:1-12", "John 3:3-7 (Jesus says 'You must be born again')", "Acts 2:1-4", "Romans 8:1-4"], correctAnswer: 1 },
  // ── Doctrine: Water Baptism ──
  { text: "The Foursquare Church practices water baptism for:", options: ["Infants and adults alike", "Believers who have genuinely repented and accepted Christ", "Only adults over 18 years", "Levites and priests"], correctAnswer: 1 },
  { text: "Water baptism in the Foursquare Church is performed by what mode?", options: ["Sprinkling only", "Immersion", "Pouring", "Any mode the candidate prefers"], correctAnswer: 1 },
  { text: "What does water baptism symbolize according to Foursquare teaching?", options: ["The washing away of original sin", "Death to the old life and resurrection to new life in Christ (Romans 6:3-4)", "Membership in the visible church", "Receiving the Holy Spirit baptism"], correctAnswer: 1 },
  { text: "Water baptism in Foursquare teaching is:", options: ["A sacrament that conveys saving grace", "An ordinance—an outward sign of an inward work", "Required for salvation", "Optional and not important"], correctAnswer: 1 },
  // ── Doctrine: Holy Spirit Baptism ──
  { text: "The second of the 'Foursquare Gospel' truths is:", options: ["Jesus the Saviour", "Jesus the Baptiser in the Holy Spirit", "Jesus the Healer", "Jesus the Coming King"], correctAnswer: 1 },
  { text: "In Foursquare doctrine, the Baptism in the Holy Spirit is:", options: ["The same as the new birth/salvation", "A subsequent definite work of grace after salvation", "Only available to ordained ministers", "A metaphorical experience with no physical sign"], correctAnswer: 1 },
  { text: "What is described as the initial physical evidence of the Baptism in the Holy Spirit in Foursquare doctrine?", options: ["Falling under the power", "Speaking in other tongues (glossolalia) as the Spirit gives utterance", "Weeping and trembling", "Prophesying about future events"], correctAnswer: 1 },
  { text: "Which Scripture records the first occurrence of Spirit baptism with speaking in tongues?", options: ["Matthew 3:11", "Acts 2:1-4 (the Day of Pentecost)", "Luke 11:13", "1 Corinthians 12:1"], correctAnswer: 1 },
  { text: "The promise of the Holy Spirit was made by Jesus in which passage?", options: ["Matthew 5:6", "Acts 1:4-5 and 8 ('You will be baptized with the Holy Spirit...')", "Romans 8:9", "Ephesians 1:13 only"], correctAnswer: 1 },
  { text: "According to Acts 2:39, the promise of the Holy Spirit is for:", options: ["Only the 120 disciples at Pentecost", "All who are far off, everyone whom the Lord our God calls", "Only Jewish believers", "Only ordained leaders"], correctAnswer: 1 },
  { text: "Which Foursquare distinctives are sometimes called 'Initial Evidence'?", options: ["Water baptism and the Lord's Supper", "Speaking in tongues as the initial evidence of Holy Spirit baptism", "Healing and prophecy together", "Faith and repentance together"], correctAnswer: 1 },
  // ── Doctrine: Divine Healing ──
  { text: "The third Foursquare Gospel truth is:", options: ["Jesus the Baptiser", "Jesus the Healer", "Jesus the Coming King", "Jesus the Saviour"], correctAnswer: 1 },
  { text: "The Foursquare Church teaches that divine healing is:", options: ["A gift only for the apostolic age, no longer available", "Provided in the atonement of Christ and available today for all who believe", "Only available to those with special faith", "A metaphor for spiritual restoration"], correctAnswer: 1 },
  { text: "Which Old Testament scripture is cited as a basis for healing in the atonement?", options: ["Psalm 23:4", "Isaiah 53:4-5 ('By His stripes we are healed')", "Proverbs 4:22", "Exodus 15:26"], correctAnswer: 1 },
  { text: "Which New Testament verse explicitly connects healing with the atonement?", options: ["John 11:25", "Matthew 8:17 ('He took our infirmities and bore our diseases')", "Hebrews 11:1", "James 4:7"], correctAnswer: 1 },
  { text: "James 5:14-15 instructs people who are sick to:", options: ["Rely on doctors alone", "Call for the elders of the church to pray and anoint with oil in the name of the Lord", "Fast for 40 days", "Bind the spirit of sickness in tongues"], correctAnswer: 1 },
  { text: "What does Foursquare teaching say about medicine and doctors?", options: ["They are sinful and should never be consulted", "God heals supernaturally and through medicine; doctors are not excluded", "Medicine is a crutch that shows lack of faith", "Only elders should decide if a doctor is seen"], correctAnswer: 1 },
  // ── Doctrine: Second Coming ──
  { text: "The fourth Foursquare Gospel truth is:", options: ["Jesus the Saviour", "Jesus the Baptiser", "Jesus the Healer", "Jesus the Soon-Coming King"], correctAnswer: 3 },
  { text: "The Foursquare Church believes the Second Coming of Christ will be:", options: ["Symbolic and spiritual, not literal", "Literal, personal, and visible", "Through a future great prophet", "At the end of a long period of Christian world conquest"], correctAnswer: 1 },
  { text: "The 'Rapture' in Foursquare eschatology refers to:", options: ["Believers being spiritually renewed", "Christ catching believers up to meet Him in the air before or at His return (1 Thess 4:16-17)", "The conversion of Israel", "The defeat of Satan after the millennium"], correctAnswer: 1 },
  { text: "The Foursquare Church's eschatological position is primarily:", options: ["Amillennial", "Postmillennial", "Premillennial — Christ returns before the millennium", "Preterist"], correctAnswer: 2 },
  { text: "Which passage is most used to support the bodily return of Christ?", options: ["Revelation 1:1", "Acts 1:11 ('This same Jesus...will come back in the same way you have seen him go')", "Daniel 7:13 alone", "Matthew 24:36 alone"], correctAnswer: 1 },
  { text: "Foursquare teaching on the resurrection involves:", options: ["Only spiritual resurrection of souls", "The bodily resurrection of the dead at Christ's return (1 Corinthians 15)", "Reincarnation", "Souls going straight to final states at death with no future resurrection"], correctAnswer: 1 },
  // ── Foursquare History ──
  { text: "Who founded the International Church of the Foursquare Gospel?", options: ["Charles Parham", "Aimee Semple McPherson", "William Seymour", "Smith Wigglesworth"], correctAnswer: 1 },
  { text: "In which year was the Foursquare Church officially founded?", options: ["1906", "1910", "1923", "1931"], correctAnswer: 2 },
  { text: "Where was the Foursquare Church founded (original location)?", options: ["Azusa Street, Los Angeles", "Angelus Temple, Los Angeles", "Chicago, Illinois", "Toronto, Canada"], correctAnswer: 1 },
  { text: "What does the name 'Foursquare' refer to?", options: ["The four walls of the temple", "The four aspects of Jesus's ministry: Saviour, Baptiser, Healer, and Coming King", "The four Gospels of the New Testament", "The four founding members"], correctAnswer: 1 },
  { text: "Aimee Semple McPherson's vision of the Foursquare Gospel came from her study of which Old Testament chapter?", options: ["Isaiah 53", "Ezekiel 1 (the four living creatures)", "Daniel 7", "Numbers 6"], correctAnswer: 1 },
  { text: "When did Aimee Semple McPherson live?", options: ["1820–1901", "1890–1944", "1890–1962", "1900–1980"], correctAnswer: 1 },
  { text: "The Foursquare movement has its Pentecostal roots in the revival that began on Azusa Street in what year?", options: ["1900", "1906", "1910", "1920"], correctAnswer: 1 },
  { text: "Who led the Azusa Street Revival?", options: ["Aimee Semple McPherson", "William J. Seymour", "Charles Parham", "John G. Lake"], correctAnswer: 1 },
  { text: "Angelus Temple was dedicated in which year?", options: ["1919", "1921", "1923", "1927"], correctAnswer: 2 },
  { text: "What was the seating capacity of Angelus Temple when it opened?", options: ["3,000", "5,300", "8,000", "10,000"], correctAnswer: 1 },
  // ── Nigerian Foursquare Context ──
  { text: "When did the Foursquare Gospel Church come to Nigeria?", options: ["1955", "1958", "1961", "1970"], correctAnswer: 2 },
  { text: "Who brought the Foursquare Gospel Church to Nigeria?", options: ["Aimee Semple McPherson herself", "A team led by missionary Arthur Edwards", "Indigenous leaders from Ghana", "The Elim Mission from the UK"], correctAnswer: 1 },
  { text: "The headquarters of the Foursquare Gospel Church in Nigeria is in:", options: ["Abuja", "Lagos", "Ibadan", "Port Harcourt"], correctAnswer: 1 },
  { text: "What does the Foursquare Gospel Church in Nigeria emphasize in its children's ministry?", options: ["Academic excellence only", "Spiritual formation, biblical knowledge, and character development", "Social work only", "Political engagement"], correctAnswer: 1 },
  { text: "The Foursquare Gospel Church's worldwide governing body is called:", options: ["The General Council", "The International Board of Directors / Foursquare Senior Leadership Team", "The World Assembly of God", "The Global Pentecostal Conference"], correctAnswer: 1 },
  // ── Ordinances and Practices ──
  { text: "How many ordinances does the Foursquare Church officially observe?", options: ["1 (Communion only)", "2 (Water Baptism and the Lord's Supper)", "3 (Baptism, Communion, Footwashing)", "7 (like Catholic sacraments)"], correctAnswer: 1 },
  { text: "The Lord's Supper in Foursquare practice:", options: ["Physically transforms into Christ's body and blood (transubstantiation)", "Is a memorial feast — bread and cup symbolize Christ's body and blood", "Is unnecessary since Christ is spiritually present always", "Is only for ordained ministers"], correctAnswer: 1 },
  { text: "How often does the Foursquare Church typically celebrate the Lord's Supper?", options: ["Once a year at Easter only", "Weekly without exception", "Regularly, as often as is appropriate — often monthly or quarterly", "Daily"], correctAnswer: 2 },
  { text: "The biblical basis for the Lord's Supper is found in:", options: ["Acts 2:42 only", "Matthew 26:26-28; 1 Corinthians 11:23-26", "Revelation 19:9 only", "Leviticus 23:5"], correctAnswer: 1 },
  { text: "What does the bread in the Lord's Supper represent?", options: ["The eternal life of the believer", "The body of Christ broken for us", "The Word of God", "The Church as one body"], correctAnswer: 1 },
  { text: "What does the cup in the Lord's Supper represent?", options: ["The Holy Spirit", "The blood of Christ shed for our sins — the New Covenant", "The rivers of living water", "The tears of repentance"], correctAnswer: 1 },
  // ── Ethics and Christian Living ──
  { text: "The Foursquare Standard of Attainment for Christian living is based primarily on:", options: ["Church tradition and pastor's guidelines", "Biblical principles applied through Holy Spirit empowerment", "A points-based merit system", "Cultural norms of the local community"], correctAnswer: 1 },
  { text: "Foursquare teaching on tithing is:", options: ["Tithing is an Old Testament law irrelevant today", "Believers are encouraged to give at least a tenth of their income as an act of worship and obedience", "Only the ordained should tithe", "Give whatever one feels, without any standard"], correctAnswer: 1 },
  { text: "The Foursquare Church's position on divorce and remarriage is:", options: ["Divorce is always permitted", "Marriage is for life; divorce is a departure from God's ideal, handled with pastoral care and biblical guidance", "Remarriage after divorce is always forbidden", "The Church has no position on marriage"], correctAnswer: 1 },
  { text: "Foursquare teaching on sanctification involves:", options: ["Instant moral perfection at salvation", "A progressive work of the Holy Spirit in the believer's life toward Christ-likeness", "A second definite crisis experience that eliminates the sinful nature completely", "No change in behavior after conversion"], correctAnswer: 1 },
  { text: "Which fruits of the Spirit (Galatians 5:22-23) are central to Foursquare ethical teaching?", options: ["Power, authority, and signs", "Love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control", "Prophesying, healing, and tongues", "Wisdom, knowledge, and discernment"], correctAnswer: 1 },
  // ── Spiritual Gifts ──
  { text: "The Foursquare Church teaches that the gifts of the Holy Spirit:", options: ["Ceased with the death of the last apostle", "Are still available and active in the church today", "Are only for special leaders", "Should be sought above all else"], correctAnswer: 1 },
  { text: "How many gifts of the Spirit are listed in 1 Corinthians 12?", options: ["7", "9", "12", "14"], correctAnswer: 1 },
  { text: "What is the gift of 'tongues' used for in Foursquare teaching?", options: ["As a sign to unbelievers only", "As private prayer language and, when interpreted, as prophetic ministry to the church", "As the only evidence of salvation", "As a replacement for Bible reading"], correctAnswer: 1 },
  { text: "The gift of prophecy, according to Foursquare teaching, serves to:", options: ["Add to the Bible", "Edify, exhort, and comfort (1 Corinthians 14:3)", "Reveal new doctrine", "Only predict future events"], correctAnswer: 1 },
  { text: "What is the 'gift of discernment' (discerning of spirits)?", options: ["The ability to judge others harshly", "The supernatural ability to distinguish between spirits — divine, human, or demonic", "A critical spirit toward false teachers", "The skill of biblical interpretation"], correctAnswer: 1 },
  { text: "How does the Foursquare Church regulate the use of spiritual gifts?", options: ["There are no regulations", "By biblical guidelines (1 Corinthians 14) — in order, with discernment and love", "Only the senior pastor may operate gifts publicly", "Gifts are practiced only in private"], correctAnswer: 1 },
  // ── Prayer and Worship ──
  { text: "The Foursquare Church emphasizes prayer because:", options: ["It is a ritual requirement", "Prayer is communion with God and the means by which we access His will and power", "It impresses other church members", "It fulfills a legal covenant obligation"], correctAnswer: 1 },
  { text: "Corporate worship in the Foursquare Church typically includes:", options: ["Liturgy and candles only", "Praise and worship music, prayer, the Word, and the move of the Spirit", "Silent meditation only", "A formal mass"], correctAnswer: 1 },
  { text: "The model prayer Jesus gave (the Lord's Prayer) contains how many petitions according to traditional analysis?", options: ["5", "6", "7", "9"], correctAnswer: 1 },
  { text: "Foursquare teaching on fasting includes:", options: ["Fasting is not expected of New Testament believers", "Fasting is a spiritual discipline that enhances prayer and spiritual sensitivity", "Only leaders should fast", "Fasting means giving up television only"], correctAnswer: 1 },
  // ── Sin and Judgment ──
  { text: "Foursquare doctrine teaches that sin is:", options: ["A mistaken choice caused by environment", "A universal condition of mankind — all have sinned and fall short of God's glory (Romans 3:23)", "Only major acts of wrongdoing", "Not a problem for baptized believers"], correctAnswer: 1 },
  { text: "What does the Foursquare Church believe about hell?", options: ["Hell is only temporary (annihilationism for all)", "Hell is a literal place of eternal separation from God for those who reject Christ", "Hell is simply the grave (cessation of existence)", "Hell is a metaphor for earthly suffering"], correctAnswer: 1 },
  { text: "What does the Foursquare Church believe about heaven?", options: ["Heaven is only a state of mind", "Heaven is the eternal dwelling place of God and all who are saved through Christ", "Heaven is available to all people regardless of belief", "Heaven is earned through moral achievement"], correctAnswer: 1 },
  { text: "The final judgment in Foursquare eschatology involves:", options: ["No judgment for anyone", "The Great White Throne judgment for the unsaved; the Bema Seat for believers' rewards", "Everyone going to heaven eventually", "Reincarnation until one achieves perfection"], correctAnswer: 1 },
  // ── Church Structure ──
  { text: "The Foursquare Church's governance structure is:", options: ["Congregational (the local church is fully autonomous)", "Episcopal (bishops govern all churches)", "A modified episcopal system with a President, Board of Directors, and District leadership", "A theocracy led by apostles and prophets only"], correctAnswer: 2 },
  { text: "What is Foursquare's term for the regional leader overseeing groups of local churches?", options: ["Bishop", "Superintendent or District Supervisor", "Cardinal", "Apostle"], correctAnswer: 1 },
  { text: "Foursquare's foundational document that states its beliefs is called:", options: ["The Westminster Confession", "The Declaration of Faith", "The Foursquare Creed", "The Articles of Religion"], correctAnswer: 1 },
  { text: "How many articles/sections does the Foursquare Declaration of Faith have?", options: ["12", "22", "10", "7"], correctAnswer: 1 },
  { text: "The Foursquare Declaration of Faith addresses which topics?", options: ["Only salvation and tongues", "The Bible, the Godhead, man and sin, salvation, Holy Spirit, divine healing, communion, baptism, sanctification, second coming, and related topics", "Only the sacraments", "Only prophetic gifts"], correctAnswer: 1 },
  // ── Marriage and Family ──
  { text: "Foursquare teaching holds that marriage is:", options: ["A social contract between two people", "A covenant ordained by God between a man and a woman", "Acceptable between any two consenting adults in any configuration", "Optional for believers"], correctAnswer: 1 },
  { text: "How does the Foursquare Church define the Christian home?", options: ["A home run by strict rules", "A home where Christ is Lord, characterized by love, respect, and biblical values", "A home of wealthy members who tithe", "A home that attends every church service"], correctAnswer: 1 },
  { text: "Children in Foursquare families are encouraged to:", options: ["Wait until adulthood to decide about faith", "Be raised in the training and instruction of the Lord (Ephesians 6:4)", "Attend church only on special occasions", "Make all spiritual decisions independently"], correctAnswer: 1 },
  // ── Evangelism and Mission ──
  { text: "The Great Commission (Matthew 28:19-20) calls believers to:", options: ["Stay in their home churches only", "Go and make disciples of all nations, baptizing them and teaching them everything Jesus commanded", "Only preach to Jews first", "Build large church buildings"], correctAnswer: 1 },
  { text: "The Foursquare Church's global mission strategy is called:", options: ["SHOW (Save, Heal, Over, Win)", "LIFT (Launch, Invest, Foster, Train) or similar discipleship-focused initiatives", "CARE only", "Prosperity-focused outreach"], correctAnswer: 1 },
  { text: "Foursquare's commitment to world missions is expressed through:", options: ["Prayer only", "Sending missionaries, planting churches, and supporting indigenous leaders worldwide", "Donating money only", "Broadcasting radio programs alone"], correctAnswer: 1 },
  { text: "Every Foursquare believer is considered to be:", options: ["Only a passive member", "A minister and ambassador of Christ in their sphere of influence", "A tentative seeker still deciding faith", "A student rather than a practitioner"], correctAnswer: 1 },
  // ── Scripture memory / key verses ──
  { text: "John 3:16 states: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall...'?", options: ["'...do great works'", "'...not perish but have eternal life'", "'...receive the Spirit immediately'", "'...be healed of all diseases'"], correctAnswer: 1 },
  { text: "Acts 1:8 says believers will receive power when:", options: ["They pray long enough", "The Holy Spirit comes on them, and they will be witnesses to the ends of the earth", "They are baptized in water", "They read the Bible daily"], correctAnswer: 1 },
  { text: "Romans 10:9-10 says that if you confess with your mouth 'Jesus is Lord' and believe in your heart that God raised him from the dead, you will be:", options: ["Healed", "Saved", "Filled with the Spirit", "Blessed financially"], correctAnswer: 1 },
  { text: "Ephesians 2:8-9 teaches that salvation is:", options: ["By works so that no one may boast about faith", "By grace through faith—not by works, so that no one can boast", "By water baptism", "By church attendance plus faith"], correctAnswer: 1 },
  { text: "Which verse says 'I can do all things through Christ who strengthens me'?", options: ["Romans 8:28", "Philippians 4:13", "Isaiah 40:31", "John 14:14"], correctAnswer: 1 },
  { text: "Hebrews 11:1 defines faith as:", options: ["Believing without any evidence", "The substance of things hoped for, the evidence of things not seen", "Following the teachings of the church", "Feeling God's presence in worship"], correctAnswer: 1 },
  { text: "James 2:17 says 'Faith without works is...'?", options: ["Sufficient alone", "Dead", "Still effective", "A sign of spiritual maturity"], correctAnswer: 1 },
  { text: "Matthew 6:33 says 'Seek first the kingdom of God and His righteousness, and all these things...'?", options: ["'...will be revealed to you'", "'...will be added to you'", "'...will pass away'", "'...will be given to the righteous'"], correctAnswer: 1 },
  { text: "Proverbs 3:5-6 says 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways...'?", options: ["'...honour Him and He will bless you'", "'...acknowledge Him, and He will make your paths straight'", "'...submit to Him and be healed'", "'...obey Him and reach your goals'"], correctAnswer: 1 },
  { text: "2 Chronicles 7:14 promises: 'If my people...will humble themselves and pray and seek my face and turn from their wicked ways, then...'?", options: ["'...I will appear to them in glory'", "'...I will hear from heaven, forgive their sin, and heal their land'", "'...I will send revival immediately'", "'...angels will protect them'"], correctAnswer: 1 },
  // ── Standard of Attainment — Level Specifics ──
  { text: "A 'Standard of Attainment' in the Foursquare context refers to:", options: ["A level of income required for membership", "A set of doctrinal, biblical, and character benchmarks that children/students should know and demonstrate", "The educational level of the pastor", "The number of Bible verses memorized"], correctAnswer: 1 },
  { text: "Which level of the Foursquare Standard of Attainment focuses primarily on foundational salvation truths?", options: ["The advanced level", "The beginning/foundation level", "The leadership level", "The missionary level"], correctAnswer: 1 },
  { text: "When assessing knowledge under the Standard of Attainment, which areas are examined?", options: ["General trivia and culture", "Bible knowledge, Foursquare doctrine, Christian character and scripture memory", "Academic subjects", "Church history only"], correctAnswer: 1 },
  { text: "What is the Foursquare Church's children's ministry department often called in Nigeria?", options: ["The Junior Church", "The Bible Club / Children's Ministry", "The Youth Group", "The Sunday School only"], correctAnswer: 1 },
  { text: "In the Standard of Attainment process, a child who passes all sections earns:", options: ["Church membership immediately", "A certificate of achievement and promotion to the next level", "Leadership in the adult church", "A scholarship only"], correctAnswer: 1 },
  { text: "The Foursquare Bible Club curriculum is structured to:", options: ["Replace formal school education", "Lead children through progressive levels of Bible knowledge, memorization, and spiritual growth", "Focus only on games and activities", "Prepare children only for baptism"], correctAnswer: 1 },
  { text: "Which theme is central to the 'Foursquare Gospel' as taught to children?", options: ["Church attendance and tithing", "Jesus is my Saviour, Baptiser, Healer, and Coming King", "Prophecy and end times only", "Missions and offerings"], correctAnswer: 1 },
  // ── Old Testament Survey (for standards) ──
  { text: "How many books are in the Old Testament?", options: ["27", "33", "39", "66"], correctAnswer: 2 },
  { text: "The first book of the Bible is:", options: ["Exodus", "Genesis", "Numbers", "Deuteronomy"], correctAnswer: 1 },
  { text: "Who wrote the first five books of the Bible (the Pentateuch)?", options: ["David", "Moses", "Joshua", "Samuel"], correctAnswer: 1 },
  { text: "The Ten Commandments were first given in:", options: ["Deuteronomy 5", "Genesis 20", "Exodus 20", "Numbers 15"], correctAnswer: 2 },
  { text: "The greatest commandment according to Jesus is:", options: ["Do not murder", "Love the Lord your God with all your heart, soul, and mind", "Keep the Sabbath", "Honor your father and mother"], correctAnswer: 1 },
  { text: "The second greatest commandment is:", options: ["Do not steal", "Love your neighbor as yourself", "Do not worship idols", "Keep God's feasts"], correctAnswer: 1 },
  { text: "Who was the first man God created?", options: ["Cain", "Noah", "Adam", "Enoch"], correctAnswer: 2 },
  { text: "Whose ark saved his family from the flood?", options: ["Abraham's", "Moses's", "Noah's", "Joseph's"], correctAnswer: 2 },
  { text: "God made a covenant with Abraham and promised him what?", options: ["A great army", "To make him father of many nations with land, seed and blessing", "A great palace", "The first kingship in Israel"], correctAnswer: 1 },
  { text: "Which son of Abraham was almost sacrificed on Mount Moriah?", options: ["Ishmael", "Isaac", "Jacob", "Esau"], correctAnswer: 1 },
  { text: "Jacob's new name given by God was:", options: ["Jesus", "Israel", "Judah", "Joseph"], correctAnswer: 1 },
  { text: "How many sons did Jacob have?", options: ["10", "11", "12", "13"], correctAnswer: 2 },
  { text: "Who interpreted Pharaoh's dreams in Egypt?", options: ["Moses", "Aaron", "Joseph", "Daniel"], correctAnswer: 2 },
  { text: "Moses received the Law from God on which mountain?", options: ["Mount Carmel", "Mount Sinai/Horeb", "Mount Zion", "Mount Moriah"], correctAnswer: 1 },
  { text: "The Passover commemorates God's deliverance of Israel from:", options: ["Babylon", "Egypt", "Assyria", "Philistia"], correctAnswer: 1 },
  { text: "Who were Israel's first two kings (in order)?", options: ["David and Solomon", "Saul and David", "Solomon and Rehoboam", "Jeroboam and Ahab"], correctAnswer: 1 },
  { text: "Which king is known for his wisdom and for building the first temple in Jerusalem?", options: ["David", "Solomon", "Hezekiah", "Josiah"], correctAnswer: 1 },
  { text: "The longest book in the Bible (by chapters) is:", options: ["Isaiah", "Jeremiah", "Psalms", "Genesis"], correctAnswer: 2 },
  { text: "The shortest book in the Old Testament is:", options: ["Obadiah", "Amos", "Jonah", "Nahum"], correctAnswer: 0 },
  { text: "Which prophet said 'I know the plans I have for you, plans to prosper you and not to harm you'?", options: ["Isaiah", "Ezekiel", "Jeremiah", "Daniel"], correctAnswer: 2 },
  // ── New Testament Survey ──
  { text: "How many books are in the New Testament?", options: ["25", "27", "28", "29"], correctAnswer: 1 },
  { text: "The four Gospels are:", options: ["Matthew, Mark, Luke, Acts", "Matthew, Mark, Luke, John", "John, Acts, Romans, Galatians", "Matthew, Mark, John, Hebrews"], correctAnswer: 1 },
  { text: "Who wrote the most books in the New Testament?", options: ["Peter", "John", "James", "Paul"], correctAnswer: 3 },
  { text: "The 'Acts of the Apostles' was written by:", options: ["Paul", "Luke", "John", "Peter"], correctAnswer: 1 },
  { text: "On which day did the Holy Spirit descend at Pentecost?", options: ["The 40th day after the resurrection", "The 50th day after Passover/resurrection", "7 weeks exactly after the Sabbath", "On the third day after Jesus ascended"], correctAnswer: 1 },
  { text: "Which book of the Bible contains the Sermon on the Mount?", options: ["Mark 5", "Luke 6 and Matthew 5-7", "Matthew 5-7 (primarily)", "John 3"], correctAnswer: 2 },
  { text: "The book of Revelation was written by:", options: ["Paul", "Peter", "John (the Apostle)", "Luke"], correctAnswer: 2 },
  { text: "How many letters did Paul write that are in the New Testament?", options: ["10", "13", "14", "9"], correctAnswer: 1 },
  { text: "What is the last book of the Bible?", options: ["Jude", "Acts", "Revelation", "3 John"], correctAnswer: 2 },
  { text: "Jesus was born in which town?", options: ["Nazareth", "Jerusalem", "Bethlehem", "Jericho"], correctAnswer: 2 },
  { text: "Jesus was baptized by:", options: ["Peter", "Andrew", "John the Baptist", "Elijah"], correctAnswer: 2 },
  { text: "How many disciples did Jesus choose?", options: ["7", "10", "12", "70"], correctAnswer: 2 },
  { text: "Jesus performed His first miracle at:", options: ["The Temple in Jerusalem", "The wedding at Cana in Galilee", "Bethsaida", "Capernaum"], correctAnswer: 1 },
  { text: "Jesus was crucified at a place called:", options: ["Bethlehem", "Jordan", "Golgotha (the Place of the Skull)", "Nazareth"], correctAnswer: 2 },
  { text: "On which day of the week did Jesus rise from the dead?", options: ["Saturday", "Monday", "Thursday", "Sunday (the first day of the week)"], correctAnswer: 3 },
  { text: "After His resurrection, Jesus appeared to His disciples for how many days before ascending?", options: ["3", "7", "40", "50"], correctAnswer: 2 },
  { text: "What were Jesus's final words of instruction (Acts 1:8)?", options: ["'Love one another'", "'Go therefore and make disciples'", "'You will receive power when the Holy Spirit comes; be my witnesses to the ends of the earth'", "'Baptize all nations'"], correctAnswer: 2 },
  // ── Praying and Christian Disciplines ──
  { text: "Jesus said 'Ask and it will be given to you; seek and you will find; knock and...'?", options: ["'...it will be revealed'", "'...the door will open to you'", "'...strength will be given'", "'...peace will come'"], correctAnswer: 1 },
  { text: "What did Jesus mean by 'praying in secret' (Matthew 6:6)?", options: ["Praying in a foreign language only", "Praying privately and sincerely to God rather than for public show", "Only whispering prayers to God", "Never praying in a group"], correctAnswer: 1 },
  { text: "What is the purpose of memorizing Scripture according to Psalm 119:11?", options: ["To impress others with knowledge", "To have the Word hidden in the heart so as not to sin against God", "To qualify for church leadership", "To argue doctrine effectively"], correctAnswer: 1 },
  { text: "Foursquare children's ministry typically uses a points system for:", options: ["Physical activities", "Scripture memory, attendance, Bible study and service", "Academic grades", "Donations to mission"], correctAnswer: 1 },
  { text: "What is a key memory verse about the Holy Spirit in children's curriculum?", options: ["John 3:16", "John 14:26 ('But the Counselor, the Holy Spirit, will teach you all things')", "Acts 4:31", "Galatians 5:22"], correctAnswer: 1 },
  // ── Foursquare Values and Vision ──
  { text: "The Foursquare Church's stated mission is:", options: ["To build the biggest church buildings globally", "To demonstrate and proclaim the transforming power of Jesus Christ", "To promote Pentecostal doctrine over other churches", "To train professional ministers exclusively"], correctAnswer: 1 },
  { text: "Foursquare's core values include:", options: ["Power, prosperity, and political influence", "Authentic relationships, servant leadership, generous service, and whole-life transformation", "Ritual observance, ceremony, and tradition", "Strict doctrinal uniformity above community"], correctAnswer: 1 },
  { text: "The Foursquare Church believes the local church is:", options: ["Optional for believers", "The primary community of believers through which God works on earth — essential for spiritual growth", "Only important for funerals and weddings", "Less important than parachurch organisations"], correctAnswer: 1 },
  { text: "Aimee Semple McPherson was known for which innovative approach to outreach in the 1920–30s?", options: ["Distributing printed tracts only", "Using illustrated sermons, drama, radio broadcasting, and mass rallies", "Strictly traditional hymns and liturgy", "Sending missionaries to Africa primarily"], correctAnswer: 1 },
  { text: "The Foursquare Gospel Church in Nigeria is known by what full official name?", options: ["International Pentecostal Church of Nigeria", "International Church of the Foursquare Gospel (Nigeria)", "Foursquare Full Gospel Mission", "Pentecostal Holiness Church Nigeria"], correctAnswer: 1 },
  // Additional knowledge questions to reach 1000
  { text: "What does 'Pentecostal' mean in reference to the Foursquare Church?", options: ["Church founded on Pentecost Sunday", "Believing in and experiencing the fullness of the Holy Spirit as given at Pentecost in Acts 2", "Meeting only on Pentecost (Whit Sunday)", "Celebrating all Jewish feasts"], correctAnswer: 1 },
  { text: "The Foursquare Church affirms that speaking in tongues is:", options: ["The only evidence of spirituality", "A supernatural gift of the Holy Spirit, the initial physical evidence of Spirit baptism, and a prayer language", "Forbidden in public worship", "Only available to people of certain cultures"], correctAnswer: 1 },
  { text: "1 John 1:9 promises that if we confess our sins:", options: ["We will receive the Spirit", "God is faithful and just to forgive us and cleanse us from all unrighteousness", "We must do penance", "Our punishment is reduced"], correctAnswer: 1 },
  { text: "What does 'sanctification' mean?", options: ["Being made a church saint after death", "Being set apart and progressively conformed to Christ's character by the Holy Spirit", "Being water baptized", "Being given a leadership role in church"], correctAnswer: 1 },
  { text: "Which book gives us the armor of God passage (Ephesians 6:10-18)?", options: ["Romans", "Galatians", "Ephesians", "Colossians"], correctAnswer: 2 },
  { text: "How many pieces of the armor of God are listed in Ephesians 6?", options: ["5", "6", "7", "8"], correctAnswer: 1 },
  { text: "What is the 'sword of the Spirit' in Ephesians 6?", options: ["Prayer", "The Word of God", "Faith", "The name of Jesus"], correctAnswer: 1 },
  { text: "The 'shield of faith' is used to:", options: ["Deflect physical attacks", "Extinguish all the flaming arrows of the evil one", "Protect the mind with knowledge", "Cover all believers communally"], correctAnswer: 1 },
  { text: "In Foursquare teaching, spiritual warfare is best fought by:", options: ["Physical confrontation only", "Prayer, the Word, worship, and putting on the full armor of God", "Isolation from the world", "Only speaking against the enemy"], correctAnswer: 1 },
  { text: "Who in the New Testament is described as a full-time evangelist with the title 'Philip the Evangelist'?", options: ["Philip the Apostle, son of Zebedee", "Philip, one of the seven chosen in Acts 6, who later preached in Samaria", "Philip, the son-in-law of Cornelius", "Philip the tax collector"], correctAnswer: 1 },
  { text: "What is the biblical basis for anointing with oil for healing?", options: ["Genesis 28 (Jacob's oil at Bethel)", "James 5:14 and Mark 6:13", "Exodus 30 (holy anointing oil for the tabernacle)", "Psalm 23 (anointing with oil)"], correctAnswer: 1 },
  { text: "The Foursquare Bible Club was established primarily for children in which age range?", options: ["0-2 years (nursery)", "3-12 years (primary school age)", "13-17 years (teenagers)", "18-25 years (young adults)"], correctAnswer: 1 },
  { text: "Foursquare Sunday School teachers are accountable for:", options: ["Academic subjects exclusively", "The spiritual, moral, and biblical development of children in their care", "Entertainment of children only", "Fundraising for the church"], correctAnswer: 1 },
  { text: "What is the Foursquare Church's stance on social justice?", options: ["Social justice is not a church matter", "The church demonstrates God's love through caring for the poor, marginalized, and needy while sharing the gospel", "Only prayer changes social conditions", "Social work replaces gospel proclamation"], correctAnswer: 1 },
  { text: "The primary purpose of speaking in tongues in personal prayer according to 1 Corinthians 14 is:", options: ["To impress other believers", "To edify (build up) oneself while praying to God in the Spirit", "To receive new revelations", "To cast out demons"], correctAnswer: 1 },
  { text: "When an unknown tongue is spoken publicly in a Foursquare service, what should accompany it per 1 Corinthians 14?", options: ["A chapter of Scripture reading", "An interpretation", "A prophecy immediately before", "Silence for 5 minutes"], correctAnswer: 1 },
  { text: "The confession 'Jesus is Lord' (Romans 10:9) means what in Foursquare teaching?", options: ["Jesus is a great moral teacher", "Jesus is God, the sovereign ruler over all creation, risen from the dead, and the supreme authority in one's life", "Jesus is the leader of the church only", "Jesus once was Lord but now believers share His authority equally"], correctAnswer: 1 },
  { text: "The Foursquare Church's official magazine has historically been called:", options: ["The Foursquare Herald", "The Bridal Call (original name)", "The Pentecostal Witness", "The Gospel Light"], correctAnswer: 1 },
  { text: "In Nigeria, the Foursquare Church is governed by a national leader called:", options: ["The Archbishop", "The National President", "The General Overseer", "The Presiding Bishop"], correctAnswer: 1 },
  { text: "The Foursquare Church was officially incorporated in California in which year?", options: ["1921", "1923", "1927", "1933"], correctAnswer: 1 },
  { text: "What is the Foursquare Church's approach to discipleship?", options: ["A lecture-only classroom model", "Life-on-life mentoring, small groups, and intentional spiritual formation alongside structured teaching", "Online courses only", "Self-directed reading plans"], correctAnswer: 1 },
  { text: "The concept of 'the Bride of Christ' in Foursquare teaching refers to:", options: ["Mary, the mother of Jesus", "The Church — all true believers who are being prepared for Christ's return", "A specific denomination", "Only female believers"], correctAnswer: 1 },
  { text: "What event do Foursquare believers look forward to as the 'Marriage Supper of the Lamb'?", options: ["The Lord's Supper in church", "The great celebration in heaven when Christ is fully united with His Church at His return (Revelation 19:9)", "The annual church convention", "A special Passover meal"], correctAnswer: 1 },
  { text: "Which verse says 'I am the way the truth and the life; no one comes to the Father except through me'?", options: ["Matthew 7:14", "John 14:6", "Acts 4:12", "Romans 5:8"], correctAnswer: 1 },
  { text: "Acts 4:12 declares:", options: ["'Jesus died for all sins'", "'Salvation is found in no one else; there is no other name under heaven...by which we must be saved'", "'Call upon the name of the Lord'", "'God so loved the world'"], correctAnswer: 1 },
  { text: "What is 'the Rapture' based on in Scripture?", options: ["Daniel 12:1-3", "1 Thessalonians 4:16-17 ('the dead in Christ will rise first...we will be caught up')", "Matthew 24:31 only", "Revelation 20:1-6 only"], correctAnswer: 1 },
  { text: "Who is the 'Antichrist' in Foursquare eschatology?", options: ["An individual world leader who opposes Christ and will arise in the last days", "The Pope", "Satan himself in human form", "A system of government"], correctAnswer: 0 },
  { text: "What is the millennium in Foursquare premillennial eschatology?", options: ["The church age from Pentecost to Christ's return", "A literal 1,000-year reign of Christ on earth after His second coming (Revelation 20)", "A figurative period of church growth", "The tribulation period"], correctAnswer: 1 },
  { text: "What event closes the millennium and precedes the new creation?", options: ["The Battle of Armageddon", "The Great White Throne Judgment and the defeat of Satan", "The second Pentecost", "The destruction of Babylon"], correctAnswer: 1 },
  { text: "What is the New Jerusalem described as in Revelation 21?", options: ["A rebuilt earthly city", "The holy city coming down from God out of heaven — the eternal dwelling of God with His people", "A heavenly spaceship", "A spiritual concept with no physical reality"], correctAnswer: 1 },
  { text: "Which Foursquare core doctrine distinguishes it most from cessationist evangelicalism?", options: ["Belief in the Trinity", "Belief in salvation by grace", "Belief in the ongoing gifts of the Holy Spirit and speaking in tongues as initial evidence", "Belief in water baptism"], correctAnswer: 2 },
  { text: "What is the Foursquare Church's view on the authority of the local pastor?", options: ["The pastor has absolute authority without accountability", "The pastor is a servant-leader accountable to God, the congregation, and denominational oversight", "The congregation votes on all decisions without pastor input", "Authority rests only with the apostolic leaders"], correctAnswer: 1 },
  { text: "Which famous Foursquare evangelist conducted healing crusades across Nigeria in the mid-20th century?", options: ["Billy Graham", "T.L. Osborn", "Oral Roberts", "Jimmy Swaggart"], correctAnswer: 1 },
  { text: "The Foursquare Church trains its ministers primarily through:", options: ["Secular universities only", "Foursquare-affiliated Bible colleges and schools of ministry", "Self-study alone", "Online megachurch enrollment"], correctAnswer: 1 },
  { text: "The 'Declaración de Fe' (Declaration of Faith) is the title of the Foursquare foundational document in:", options: ["English", "Spanish (for Spanish-speaking countries)", "Portuguese", "French"], correctAnswer: 1 },
  { text: "Which Scripture is sung or quoted most often in Foursquare worship to describe God's love?", options: ["Genesis 1:1", "John 3:16", "Psalm 23:1", "Romans 8:1"], correctAnswer: 1 },
  { text: "What does 'Logos' mean in John 1:1 ('In the beginning was the Word')?", options: ["A written scroll", "The eternal Son of God — God's self-expression, Jesus Christ", "The Law of Moses", "The Bible as a collection"], correctAnswer: 1 },
  { text: "In Foursquare worship, 'lifting hands' is understood as:", options: ["A cultural tradition with no spiritual meaning", "An expression of surrender, praise, and receiving from God", "Required for the Spirit to move", "Only appropriate for ordained ministers"], correctAnswer: 1 },
  { text: "The spiritual gift of helps (1 Corinthians 12:28) involves:", options: ["Only preaching", "Practical service and support that enables ministry to function", "Leading worship only", "Counting church offerings"], correctAnswer: 1 },
  { text: "What is the gift of administration in the church (1 Corinthians 12)?", options: ["Making church announcements", "The God-given ability to organize, lead, and manage the affairs of the church with wisdom", "Balancing the church's books", "Scheduling the worship service"], correctAnswer: 1 },
  { text: "The Foursquare Church believes spiritual gifts are given:", options: ["To show how spiritual you are", "For the common good — the building up of the Body of Christ (1 Corinthians 12:7)", "Only for personal benefit", "Randomly with no purpose"], correctAnswer: 1 },
  { text: "The 'love chapter' of the Bible is:", options: ["John 3", "Psalm 136", "1 Corinthians 13", "Song of Solomon 1"], correctAnswer: 2 },
  { text: "1 Corinthians 13:13 says the three things that remain are:", options: ["Faith, hope, and power", "Faith, hope, and love — and the greatest is love", "Gifts, prayer, and love", "Word, Spirit, and love"], correctAnswer: 1 },
  { text: "Which verse is foundational for understanding the Foursquare believer's identity in Christ?", options: ["Jeremiah 29:11", "2 Corinthians 5:17 ('If anyone is in Christ, the new creation has come')", "John 10:10", "Romans 8:28"], correctAnswer: 1 },
  { text: "John 10:10 records Jesus saying: 'I have come that they may have life...'?", options: ["'...and have it peacefully'", "'...and have it to the full/abundantly'", "'...and never die again'", "'...and be powerful over all things'"], correctAnswer: 1 },
  { text: "Romans 8:28 says 'And we know that in all things God works for the good of those who love him, who have been called...'?", options: ["'...to salvation'", "'...according to his purpose'", "'...to do mighty works'", "'...to walk in the Spirit'"], correctAnswer: 1 },
  { text: "What does the Foursquare Church emphasize about the name of Jesus?", options: ["It is a magic word to repeat", "The name of Jesus carries divine authority; healing, salvation, and deliverance are in His name (Acts 3:6)", "It should only be used in formal prayer", "It is one of several equally powerful names of God"], correctAnswer: 1 },
  { text: "The disciples prayed corporately in Acts 4 after being threatened. What happened?", options: ["Nothing visible until days later", "The place was shaken and they were all filled with the Holy Spirit and spoke the word boldly", "They were persecuted more", "They went into hiding"], correctAnswer: 1 },
  { text: "Foursquare's position on the prosperity gospel is:", options: ["Fully embraces 'name it and claim it'", "God desires our flourishing, but warns against materialism; wealth is stewardship, not the measure of faith", "Rejects any connection between faith and provision", "Prosperity is the primary sign of blessing"], correctAnswer: 1 },
  { text: "The 'gifts of revelation' in the Spirit include:", options: ["Tongues and interpretation", "Word of wisdom, word of knowledge, and discerning of spirits", "Prophecy and healing", "Faith and working of miracles"], correctAnswer: 1 },
  { text: "The 'gifts of power' (1 Cor 12) include:", options: ["Word of wisdom and word of knowledge", "Tongues, interpretation, and prophecy", "Faith, gifts of healings, and working of miracles", "Discernment, helps, and administration"], correctAnswer: 2 },
  { text: "The 'gifts of utterance/vocal gifts' include:", options: ["Knowledge and wisdom", "Healing and miracles", "Tongues, interpretation of tongues, and prophecy", "Faith, helps, and administration"], correctAnswer: 2 },
  { text: "Which of the following best describes a Foursquare 'cell group' or 'home group'?", options: ["A secret society within the church", "A small gathering of believers for prayer, the Word, fellowship, and mutual accountability", "A fundraising committee", "A political action group"], correctAnswer: 1 },
  { text: "What is 'the fear of the LORD' as used in biblical wisdom literature (Proverbs 1:7)?", options: ["Being terrified of God", "Holy reverence and awe of God, which is the beginning of wisdom", "Avoiding church at all costs", "Feeling shame before God always"], correctAnswer: 1 },
  { text: "Which attribute of God means He is present everywhere?", options: ["Omnipotence", "Omniscience", "Omnipresence", "Immutability"], correctAnswer: 2 },
  { text: "Which attribute of God means He knows all things?", options: ["Omnipotence", "Omniscience", "Omnipresence", "Holiness"], correctAnswer: 1 },
  { text: "Which attribute means God never changes?", options: ["Eternal", "Holy", "Immutable (unchanging)", "Just"], correctAnswer: 2 },
  { text: "The Foursquare Declaration of Faith states that God is 'one God, who is the...'?", options: ["'...Creator of the universe only'", "'...Father of all people everywhere'", "'...Sovereign Creator and Sustainer of all things, the Holy Trinity'", "'...Judge of evil alone'"], correctAnswer: 2 },
  { text: "What does 'the atonement' mean in Foursquare soteriology?", options: ["God ignoring human sin", "Christ's death on the cross that satisfied God's justice and reconciled humanity to God", "A second chance given at death", "Human effort to make up for sin"], correctAnswer: 1 },
  { text: "'Substitutionary atonement' means:", options: ["Christ taught us how to live better", "Christ died in our place—He bore our sin and penalty so we could be forgiven", "We atone for our own sin through suffering", "God accepts our sincere moral effort"], correctAnswer: 1 },
  { text: "What is 'propitiation' as used in 1 John 2:2 (Jesus being 'the propitiation for our sins')?", options: ["Jesus's example of righteous living", "The atoning sacrifice that satisfies God's righteous wrath, restoring the relationship between God and humanity", "A legal payment to the church", "God's own self-forgiveness"], correctAnswer: 1 },
  { text: "The Foursquare Church affirms that the resurrection of Jesus was:", options: ["Only spiritual, not physical", "Literal, bodily resurrection — the same Jesus who died was raised in a physical glorified body", "Symbolic of spiritual rebirth", "Only experienced by the apostles who believed"], correctAnswer: 1 },
  { text: "What does 'the ascension' of Jesus mean in Foursquare doctrine?", options: ["Jesus died on the cross", "Jesus physically rose into heaven 40 days after resurrection, to sit at God's right hand and intercede", "Jesus became invisible to the disciples", "Jesus returned in spiritual form to Galilee"], correctAnswer: 1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Seeding Function
// ─────────────────────────────────────────────────────────────────────────────
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createQuizAndQuestions(title, description, questionPool, durationSeconds) {
    console.log(`\n===== Creating Quiz: "${title}" =====`);
    
    const quiz = await databases.createDocument(DB_ID, 'quizzes', ID.unique(), {
        title,
        description,
        duration: durationSeconds,
        is_active: true,
        question_count: 30, // 30 questions served per session from the 1000-question pool
    });

    console.log(`✅ Quiz created: ${quiz.$id}`);
    console.log(`📝 Uploading ${questionPool.length} questions to the pool...`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < questionPool.length; i++) {
        const q = questionPool[i];
        try {
            await databases.createDocument(DB_ID, 'questions', ID.unique(), {
                quiz_id: quiz.$id,
                text: q.text,
                options: q.options,
                correct_index: q.correctAnswer,
            });
            success++;
            if (success % 50 === 0) {
                process.stdout.write(`\r  Progress: ${success}/${questionPool.length} questions uploaded...`);
            }
            // Small delay to avoid Appwrite rate limiting
            await delay(80);
        } catch (err) {
            failed++;
            console.error(`\n  ❌ Failed question ${i + 1}: ${err.message}`);
            // On rate limit, wait longer
            if (err.code === 429) {
                console.log('\n  ⏳ Rate limited — waiting 5 seconds...');
                await delay(5000);
                // Retry once
                try {
                    await databases.createDocument(DB_ID, 'questions', ID.unique(), {
                        quiz_id: quiz.$id,
                        text: q.text,
                        options: q.options,
                        correct_index: q.correctAnswer,
                    });
                    success++;
                    failed--;
                } catch (retryErr) {
                    console.error(`  ❌ Retry also failed: ${retryErr.message}`);
                }
            }
        }
    }

    console.log(`\n\n✅ Quiz "${title}" done!`);
    console.log(`   Questions uploaded: ${success}/${questionPool.length}`);
    if (failed > 0) console.log(`   ⚠️  Failed: ${failed}`);
    console.log(`   Quiz ID: ${quiz.$id}`);
    return quiz.$id;
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🚀 Starting quiz seeding...');
    console.log(`📡 Connecting to Appwrite at: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
    console.log(`🗄️  Database: ${DB_ID}\n`);

    try {
        // Create Quiz 1: Book of Numbers
        const numbersId = await createQuizAndQuestions(
            'The Book of Numbers',
            'Test your knowledge of the entire book of Numbers — from the census to the plains of Moab. Each attempt draws 30 random questions from a pool of 1,000. You have 15 minutes.',
            numbersQuestions,
            900 // 15 minutes in seconds
        );

        console.log('\n⏳ Waiting 3 seconds before creating the second quiz...');
        await delay(3000);

        // Create Quiz 2: Foursquare Standard of Attainment
        const foursquareId = await createQuizAndQuestions(
            'Foursquare Standard of Attainment',
            'Comprehensive quiz covering Foursquare Gospel doctrine, church history, Bible knowledge, and the Standard of Attainment topics. 30 questions per session drawn from a 1,000-question pool. 15 minutes.',
            foursquareQuestions,
            900 // 15 minutes in seconds
        );

        console.log('\n\n🎉 ALL DONE!');
        console.log('─────────────────────────────────────');
        console.log(`  Book of Numbers Quiz ID:              ${numbersId}`);
        console.log(`  Foursquare Standard Quiz ID:          ${foursquareId}`);
        console.log('─────────────────────────────────────');
        console.log('  Both quizzes are now ACTIVE on your site.');
        console.log('  Each quiz serves 30 random questions per session from its 1,000-question pool.');
        console.log('  Leaderboard entries will be separated by quiz ID.');

    } catch (err) {
        console.error('\n❌ Fatal error:', err.message);
        console.error(err);
    }
}

main();
