import random
import json
import os

class Crossword:
    def __init__(self, cols, rows, empty='-', maxloops=2000, available_words=[]):
        self.cols = cols
        self.rows = rows
        self.empty = empty
        self.maxloops = maxloops
        self.available_words = available_words
        self.randomize_word_list()
        self.current_word_list = []
        self.debug = 0
        self.clear_grid()

    def clear_grid(self): # initialize grid and fill with empty character
        self.grid = []
        for i in range(self.rows):
            ea_row = []
            for j in range(self.cols):
                ea_row.append(self.empty)
            self.grid.append(ea_row)

    def randomize_word_list(self): # also resets words and sorts by length
        temp_list = []
        for word in self.available_words:
            if isinstance(word, Word):
                temp_list.append(Word(word.word, word.clue))
            else:
                temp_list.append(Word(word[0], word[1]))
        random.shuffle(temp_list) # randomize word list
        temp_list.sort(key=lambda i: len(i.word), reverse=True) # sort by length
        self.available_words = temp_list

    def compute_crossword(self, time_permitted=1.00, spins=2):
        import time
        time_permitted = float(time_permitted)
        count = 0
        copy = Crossword(self.cols, self.rows, self.empty, self.maxloops, self.available_words)

        start_time = time.time()
        while (time.time() - start_time) < time_permitted or count == 0: # only run for x seconds
            self.debug += 1
            self.randomize_word_list()
            self.clear_grid()
            self.current_word_list = []
            for word in self.available_words:
                self.fit_and_add(word)
            if len(self.current_word_list) > len(copy.current_word_list):
                copy.current_word_list = self.current_word_list
                copy.grid = self.grid
            count += 1
        return copy

    def suggest_coord(self, word):
        count = 0
        coordlist = []
        glc = -1
        for given_letter in word.word: # iterate over given word
            glc += 1
            rowc = 0
            for row in self.grid: # iterate over grid
                rowc += 1
                colc = 0
                for cell in row: # iterate over each letter in row
                    colc += 1
                    if given_letter == cell: # check match letter in word to letters in row
                        try: # suggest vertical placement 
                            if self.grid[rowc - 1 - glc][colc - 1] == self.empty:
                                coordlist.append([colc - 1, rowc - 1 - glc, 1, colc - 1, rowc - 1])
                        except: pass
                        try: # suggest horizontal placement 
                            if self.grid[rowc - 1][colc - 1 - glc] == self.empty:
                                coordlist.append([colc - 1 - glc, rowc - 1, 0, colc - 1, rowc - 1])
                        except: pass
        # example: coordlist[0] = [col, row, vertical, col_on_grid, row_on_grid]
        new_coordlist = self.sort_coordlist(coordlist, word)
        return new_coordlist

    def sort_coordlist(self, coordlist, word): # give much higher scores to placements that cross multiple words
        new_coordlist = []
        for coord in coordlist:
            col, row, vertical = coord[0], coord[1], coord[2]
            coord[3] = self.check_fit_score(col, row, vertical, word) # checking scores
            if coord[3]: # 0 scores are filtered
                new_coordlist.append(coord)
        random.shuffle(new_coordlist) # randomize coord list
        new_coordlist.sort(key=lambda i: i[3], reverse=True) # put the best scores first
        return new_coordlist

    def fit_and_add(self, word): # doesn't really check fit except for the first word
        fit = False
        count = 0
        coordlist = self.suggest_coord(word)

        while not fit and count < self.maxloops:
            if len(self.current_word_list) == 0: # this is the first word
                vertical, col, row = random.randrange(0, 2), random.randrange(0, self.cols - len(word.word)), random.randrange(0, self.rows - len(word.word))
                if self.check_fit_score(col, row, vertical, word): 
                    fit = True
                    self.set_word(col, row, vertical, word, force=True)
            else: # a subsequence word
                try: 
                    col, row, vertical = coordlist[count][0], coordlist[count][1], coordlist[count][2]
                except IndexError: return # no more coords
                if coordlist[count][3]: # already checked score
                    fit = True 
                    self.set_word(col, row, vertical, word, force=True)
            count += 1
        return

    def check_fit_score(self, col, row, vertical, word):
        if col < 0 or row < 0: return 0
        count, score = 1, 1 # give score a standard value of 1, will override with 0 if collisions detected
        for letter in word.word:
            try:
                active_cell = self.grid[row][col]
            except IndexError: return 0

            if active_cell == self.empty or active_cell == letter:
                pass
            else:
                return 0

            if active_cell == letter:
                score += 1

            if vertical:
                if active_cell != letter: # check surroundings
                    if self.get_cell(col - 1, row) != self.empty or self.get_cell(col + 1, row) != self.empty: return 0
                if count == 1: # check top
                    if self.get_cell(col, row - 1) != self.empty: return 0
                if count == len(word.word): # check bottom
                    if self.get_cell(col, row + 1) != self.empty: return 0
            else: # horizontal
                if active_cell != letter: # check surroundings
                    if self.get_cell(col, row - 1) != self.empty or self.get_cell(col, row + 1) != self.empty: return 0
                if count == 1: # check left
                    if self.get_cell(col - 1, row) != self.empty: return 0
                if count == len(word.word): # check right
                    if self.get_cell(col + 1, row) != self.empty: return 0

            if vertical: row += 1
            else: col += 1
            count += 1
        return score

    def set_word(self, col, row, vertical, word, force=False): # forces placement, does not check fit
        if force:
            word.col = col
            word.row = row
            word.vertical = vertical
            self.current_word_list.append(word)
            for letter in word.word:
                self.grid[row][col] = letter
                if vertical: row += 1
                else: col += 1

    def get_cell(self, col, row):
        try:
            if col < 0 or row < 0: return ''
            return self.grid[row][col]
        except IndexError: return ''

class Word:
    def __init__(self, word, clue):
        self.word = word.replace(' ', '').upper()
        self.clue = clue
        self.col = -1
        self.row = -1
        self.vertical = 0

def export_level(level_id, title, subtitle, word_list):
    a = Crossword(20, 20, '-', 5000, word_list)
    a = a.compute_crossword(0.05)
    
    if len(a.current_word_list) == 0:
        return None
        
    # Calculate bounding box to shrink grid
    min_row, max_row = a.rows, -1
    min_col, max_col = a.cols, -1
    
    for word in a.current_word_list:
        if word.row < min_row: min_row = word.row
        if word.col < min_col: min_col = word.col
        
        if word.vertical:
            if word.row + len(word.word) - 1 > max_row: max_row = word.row + len(word.word) - 1
            if word.col > max_col: max_col = word.col
        else:
            if word.row > max_row: max_row = word.row
            if word.col + len(word.word) - 1 > max_col: max_col = word.col + len(word.word) - 1
            
    # Numbering clues
    # Need to group by (row, col) to assign numbers
    cells_with_starts = {}
    for word in a.current_word_list:
        coord = (word.row, word.col)
        if coord not in cells_with_starts:
            cells_with_starts[coord] = []
        cells_with_starts[coord].append(word)
        
    sorted_coords = sorted(cells_with_starts.keys(), key=lambda x: (x[0], x[1]))
    num = 1
    clues_out = []
    
    for coord in sorted_coords:
        words_here = cells_with_starts[coord]
        for w in words_here:
            w.num = num
            clues_out.append({
                "num": num,
                "dir": "down" if w.vertical else "across",
                "text": w.clue,
                "answer": w.word,
                "row": w.row - min_row,
                "col": w.col - min_col
            })
        num += 1
        
    level = {
        "id": level_id,
        "title": title,
        "subtitle": subtitle,
        "rows": max_row - min_row + 1,
        "cols": max_col - min_col + 1,
        "clues": clues_out
    }
    return level

themes = [
    ("The Beginning", "Genesis & Creation", [("DAVID", "Killed Goliath"), ("ABEL", "Brother of Cain"), ("EVE", "First woman"), ("EDEN", "Garden of ___")]),
    ("Faith & Miracles", "New Testament Wonders", [("HOLY", "God is ___"), ("HOPE", "Faith, ___, and Love"), ("LOAVES", "Jesus fed 5000 with these"), ("PRAY", "Talk to God"), ("VINE", "Jesus said 'I am the ___'")]),
    ("Grace & Kings", "Old Testament Heroes", [("GRACE", "Unmerited favor"), ("GOD", "Creator of heaven and earth"), ("ADAM", "The first man"), ("DAVID", "A man after God's heart")]),
    ("The Prophets", "Voices of God", [("ELIJAH", "Taken up in a whirlwind"), ("ISAIAH", "Prophesied the Messiah"), ("JONAH", "Swallowed by a great fish"), ("MOSES", "Led Israelites out of Egypt"), ("SAMUEL", "Last of the Judges")]),
    ("Women of Faith", "Biblical Heroines", [("RUTH", "Loyal daughter-in-law"), ("ESTHER", "Queen who saved her people"), ("MARY", "Mother of Jesus"), ("SARAH", "Wife of Abraham"), ("MARTHA", "Sister of Mary and Lazarus")]),
    ("The Apostles", "Followers of Christ", [("PETER", "Walked on water"), ("JOHN", "The beloved disciple"), ("THOMAS", "Doubted the resurrection"), ("MATTHEW", "Former tax collector"), ("PAUL", "Apostle to the Gentiles")]),
    ("Places in the Bible", "Holy Geography", [("JERUSALEM", "The Holy City"), ("BETHLEHEM", "Birthplace of Jesus"), ("NAZARETH", "Jesus grew up here"), ("JERICHO", "Walls fell down"), ("GALILEE", "Sea where Jesus walked")]),
    ("Fruits of the Spirit", "Galatians 5", [("LOVE", "Greatest of these is ___"), ("JOY", "The ___ of the Lord is my strength"), ("PEACE", "Passes all understanding"), ("PATIENCE", "Wait on the Lord"), ("KINDNESS", "Be ___ to one another")]),
    ("Animals in the Bible", "Creatures of the Word", [("LAMB", "___ of God"), ("DOVE", "Brought an olive leaf to Noah"), ("LION", "___ of Judah"), ("SERPENT", "Tempted Eve"), ("FISH", "Jesus fed thousands with two ___")]),
    ("Parables of Jesus", "Lessons in Stories", [("SOWER", "Parable of the ___"), ("MUSTARD", "Seed of faith"), ("TALENTS", "Parable of the three servants"), ("PRODIGAL", "The ___ Son"), ("SAMARITAN", "The Good ___")]),
    ("Armor of God", "Ephesians 6", [("TRUTH", "Belt of ___"), ("FAITH", "Shield of ___"), ("SPIRIT", "Sword of the ___"), ("SALVATION", "Helmet of ___"), ("PEACE", "Gospel of ___")]),
    ("Ten Commandments", "Exodus 20", [("SABBATH", "Remember the ___ day"), ("PARENTS", "Honor thy ___"), ("MURDER", "Thou shalt not ___"), ("STEAL", "Thou shalt not ___"), ("IDOLS", "No graven ___")]),
    ("Miracles of Jesus", "Signs and Wonders", [("WATER", "Turned into wine"), ("LAZARUS", "Raised from the dead"), ("SIGHT", "Given to the blind"), ("STORM", "Calmed by Jesus"), ("LEPERS", "Ten were healed")]),
    ("Names of God", "Divine Titles", [("JEHOVAH", "The LORD"), ("ELOHIM", "God the Creator"), ("ADONAI", "Lord and Master"), ("IMMANUEL", "God with us"), ("YAHWEH", "I AM WHO I AM")]),
    ("Gospel of John", "The Fourth Gospel", [("WORD", "In the beginning was the ___"), ("LIGHT", "___ of the world"), ("BREAD", "___ of life"), ("SHEPHERD", "The Good ___"), ("WAY", "The ___, the Truth, and the Life")]),
    ("The Exodus", "Journey to Freedom", [("PHARAOH", "King of Egypt"), ("PLAGUES", "Ten were sent"), ("PASSOVER", "Angel of death passed over"), ("MANNA", "Bread from heaven"), ("SINAI", "Mountain of the Law")]),
    ("Kings of Israel", "The Monarchy", [("SAUL", "First king of Israel"), ("SOLOMON", "Known for his wisdom"), ("JOSIAH", "Found the Book of the Law"), ("HEZEKIAH", "King who prayed for healing"), ("AHAB", "Wicked king, husband of Jezebel")]),
    ("Books of the Bible", "The Canon", [("GENESIS", "Book of Beginnings"), ("EXODUS", "Departure from Egypt"), ("PSALMS", "Book of songs"), ("PROVERBS", "Book of wisdom"), ("REVELATION", "Final book of the Bible")]),
    ("The Nativity", "Birth of Christ", [("MANGER", "Jesus' first bed"), ("STAR", "Guided the wise men"), ("ANGELS", "Sang to the shepherds"), ("HEROD", "King who sought the child"), ("GOLD", "Gift for a king")]),
    ("The Crucifixion", "The Cross", [("CALVARY", "Place of the skull"), ("CROSS", "Where Jesus was crucified"), ("THORNS", "Crown of ___"), ("NAILS", "Used to pierce hands and feet"), ("TOMB", "Where Jesus was laid")]),
]

# Generate more themes to reach 50
additional_themes = [
    ("The Resurrection", "He is Risen", [("STONE", "Rolled away"), ("MARY", "First to see risen Lord"), ("GARDEN", "Where the tomb was"), ("THOMAS", "Needed to touch scars"), ("EMMAUS", "Road where Jesus appeared")]),
    ("Acts of the Apostles", "The Early Church", [("PENTECOST", "Holy Spirit descended"), ("STEPHEN", "First martyr"), ("PHILIP", "Baptized the Ethiopian"), ("PAUL", "Converted on road to Damascus"), ("SILAS", "Paul's companion in prison")]),
    ("Fruit of the Spirit II", "Galatians 5 cont.", [("GOODNESS", "Fruit of ___"), ("FAITHFULNESS", "Remaining true"), ("GENTLENESS", "Soft answer turns away wrath"), ("SELFCONTROL", "Mastery of oneself"), ("SPIRIT", "Walk by the ___")]),
    ("Old Testament Prophets", "Messengers of God", [("JEREMIAH", "The weeping prophet"), ("EZEKIEL", "Valley of dry bones"), ("DANIEL", "Lion's den"), ("HOSEA", "Married Gomer"), ("AMOS", "Shepherd prophet")]),
    ("Mountains of the Bible", "High Places", [("ARARAT", "Noah's ark rested here"), ("MORIAH", "Abraham's test"), ("CARMEL", "Elijah vs prophets of Baal"), ("ZION", "City of David"), ("OLIVES", "Mount of ___")]),
    ("Biblical Rivers", "Flowing Waters", [("JORDAN", "Jesus was baptized here"), ("NILE", "Baby Moses floated here"), ("EUPHRATES", "River in Eden"), ("TIGRIS", "Another river in Eden"), ("ARNON", "Border of Moab")]),
    ("Trees and Plants", "Flora of the Word", [("OLIVE", "Branch brought by dove"), ("FIG", "Cursed by Jesus"), ("CEDAR", "Used for Solomon's temple"), ("MUSTARD", "Smallest of seeds"), ("THORN", "Crown placed on Jesus")]),
    ("Gems and Minerals", "Precious Stones", [("RUBY", "Wisdom is better than ___"), ("SAPPHIRE", "Foundation of New Jerusalem"), ("EMERALD", "Rainbow around the throne"), ("GOLD", "Streets of New Jerusalem"), ("PEARL", "Gates of ___")]),
    ("Biblical Instruments", "Praise the Lord", [("HARP", "Played by David"), ("TRUMPET", "Blown at Jericho"), ("CYMBAL", "Clashing ___"), ("TAMBOURINE", "Played by Miriam"), ("FLUTE", "Played by pipers")]),
    ("Numbers in the Bible", "Divine Mathematics", [("FORTY", "Days of rain"), ("TWELVE", "Number of apostles"), ("SEVEN", "Days of creation"), ("THREE", "Days in the tomb"), ("TEN", "Number of commandments")]),
    ("Colors in the Bible", "Spectrum of Faith", [("SCARLET", "Cord of Rahab"), ("PURPLE", "Color of royalty"), ("WHITE", "Robes of the saints"), ("CRIMSON", "Sins like ___"), ("BLUE", "Fringes of garments")]),
    ("Biblical Metals", "Elements of the Word", [("IRON", "Sharpens ___"), ("BRONZE", "Serpent in the wilderness"), ("SILVER", "Thirty pieces of ___"), ("COPPER", "Mined from the hills"), ("LEAD", "Sank like ___ in the sea")]),
    ("Weather in the Bible", "Elements of Nature", [("RAIN", "Fell for forty days"), ("WIND", "Parted the Red Sea"), ("SNOW", "Wash me whiter than ___"), ("HAIL", "Plague in Egypt"), ("CLOUD", "Guided Israelites by day")]),
    ("Birds in the Bible", "Feathered Creatures", [("RAVEN", "Fed Elijah"), ("SPARROW", "Not one falls to the ground"), ("EAGLE", "Mount up with wings like ___"), ("OSTRICH", "Leaves her eggs in the earth"), ("QUAIL", "Flesh given to Israelites")]),
    ("Insects in the Bible", "Creeping Things", [("LOCUST", "Plague in Egypt"), ("ANT", "Consider her ways"), ("BEE", "Land flowing with milk and ___"), ("MOTH", "Corrupts treasures on earth"), ("GNAT", "Strain out a ___")]),
    ("Family in the Bible", "Kinsmen and Relations", [("FATHER", "Honor your ___"), ("MOTHER", "And your ___"), ("BROTHER", "Am I my ___'s keeper"), ("SISTER", "Miriam was Aaron's ___"), ("SON", "This is my beloved ___")]),
    ("Clothing in the Bible", "Garments of the Word", [("TUNIC", "Joseph's colorful coat"), ("CLOAK", "Left behind by Paul"), ("SANDALS", "Remove them, for the ground is holy"), ("ROBE", "Put the best ___ on him"), ("GIRDLE", "John the Baptist wore a leather ___")]),
    ("Food in the Bible", "Daily Bread", [("HONEY", "Taste and see"), ("MILK", "Land flowing with ___ and honey"), ("BREAD", "Man shall not live by ___ alone"), ("WINE", "New ___ in old wineskins"), ("FISH", "Five loaves and two ___")]),
    ("Professions in the Bible", "Workers of the Word", [("CARPENTER", "Joseph's trade"), ("FISHERMAN", "Peter's occupation"), ("TENTMAKER", "Paul's craft"), ("SHEPHERD", "David's early job"), ("TAXCOLLECTOR", "Matthew's profession")]),
    ("Weapons in the Bible", "Arms of the Word", [("SWORD", "Word of God is sharper than any two-edged ___"), ("SPEAR", "Saul threw a ___ at David"), ("SLING", "Used by David against Goliath"), ("BOW", "Jonathan's weapon"), ("ARROW", "Shot by Jonathan")]),
    ("Diseases in the Bible", "Afflictions of the Flesh", [("LEPROSY", "Naaman was cured of ___"), ("BLINDNESS", "Bartimaeus was cured of ___"), ("DEAFNESS", "Ephphatha, be opened"), ("FEVER", "Peter's mother-in-law was cured of a ___"), ("PARALYSIS", "Man let down through the roof was cured of ___")]),
    ("Cities of Refuge", "Places of Safety", [("KEDESH", "In Naphtali"), ("SHECHEM", "In Mount Ephraim"), ("HEBRON", "In Judah"), ("BEZER", "In the wilderness"), ("RAMOTH", "In Gilead")]),
    ("Judges of Israel", "Deliverers of the Land", [("OTHNIEL", "First judge"), ("EHUD", "Left-handed judge"), ("DEBORAH", "Female judge"), ("GIDEON", "Defeated Midianites with 300 men"), ("SAMSON", "Strong man")]),
    ("Feasts of Israel", "Appointed Times", [("PASSOVER", "Feast of Unleavened Bread"), ("PENTECOST", "Feast of Weeks"), ("TABERNACLES", "Feast of Booths"), ("TRUMPETS", "Rosh Hashanah"), ("ATONEMENT", "Yom Kippur")]),
    ("Tribes of Israel", "Sons of Jacob", [("REUBEN", "Firstborn"), ("SIMEON", "Second son"), ("LEVI", "Priestly tribe"), ("JUDAH", "Royal tribe"), ("BENJAMIN", "Youngest son")]),
    ("The Tabernacle", "Dwelling Place", [("ARK", "___ of the Covenant"), ("ALTAR", "Place of sacrifice"), ("LAVER", "Basin for washing"), ("MENORAH", "Golden lampstand"), ("TABLE", "___ of Showbread")]),
    ("Gifts of the Spirit", "1 Corinthians 12", [("WISDOM", "Word of ___"), ("KNOWLEDGE", "Word of ___"), ("FAITH", "Gift of ___"), ("HEALING", "Gifts of ___"), ("MIRACLES", "Working of ___")]),
    ("Beatitudes", "Matthew 5", [("POOR", "Blessed are the ___ in spirit"), ("MOURN", "Blessed are those who ___"), ("MEEK", "Blessed are the ___"), ("HUNGER", "Blessed are those who ___ and thirst for righteousness"), ("MERCIFUL", "Blessed are the ___")]),
    ("Armor of God II", "Ephesians 6 cont.", [("BELT", "___ of truth"), ("BREASTPLATE", "___ of righteousness"), ("SHOES", "___ of the gospel of peace"), ("SHIELD", "___ of faith"), ("HELMET", "___ of salvation")]),
    ("Seven Churches of Asia", "Revelation 2-3", [("EPHESUS", "Lost their first love"), ("SMYRNA", "Persecuted church"), ("PERGAMUM", "Where Satan's throne is"), ("THYATIRA", "Tolerated Jezebel"), ("SARDIS", "Dead church")]),
]

themes.extend(additional_themes)

levels_out = []
level_id = 1
for i, theme in enumerate(themes):
    title = theme[0]
    subtitle = theme[1]
    word_list = theme[2]
    
    # Try multiple times to get a valid crossword
    best_lvl = None
    max_words = 0
    for attempt in range(20):
        lvl = export_level(level_id, title, subtitle, word_list)
        if lvl:
            num_words = len(lvl["clues"])
            if num_words == len(word_list):
                best_lvl = lvl
                max_words = num_words
                break
            if num_words > max_words:
                max_words = num_words
                best_lvl = lvl
            
    if best_lvl and max_words >= 3:
        levels_out.append(best_lvl)
        level_id += 1
    else:
        print(f"Failed to generate level for {title}")

# Write to a JS/TS formatted string
with open("generated_levels.ts", "w") as f:
    f.write("export const LEVELS = ")
    f.write(json.dumps(levels_out, indent=4))
    f.write(";")
    
print(f"Successfully generated {len(levels_out)} levels.")
