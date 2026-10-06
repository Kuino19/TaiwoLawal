export type Clue = { num: number; dir: 'across' | 'down'; text: string; answer: string; row: number; col: number; };
export type Level = { id: number; title: string; subtitle: string; rows: number; cols: number; clues: Clue[]; };

export const LEVELS: Level[] = [
    {
        "id": 1,
        "title": "The Beginning",
        "subtitle": "Genesis & Creation",
        "rows": 4,
        "cols": 5,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "First woman",
                "answer": "EVE",
                "row": 0,
                "col": 2
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Garden of ___",
                "answer": "EDEN",
                "row": 0,
                "col": 4
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Killed Goliath",
                "answer": "DAVID",
                "row": 1,
                "col": 0
            }
        ]
    },
    {
        "id": 2,
        "title": "Faith & Miracles",
        "subtitle": "New Testament Wonders",
        "rows": 7,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Jesus said 'I am the ___'",
                "answer": "VINE",
                "row": 0,
                "col": 6
            },
            {
                "num": 2,
                "dir": "down",
                "text": "God is ___",
                "answer": "HOLY",
                "row": 2,
                "col": 3
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Faith, ___, and Love",
                "answer": "HOPE",
                "row": 3,
                "col": 0
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Jesus fed 5000 with these",
                "answer": "LOAVES",
                "row": 3,
                "col": 2
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Talk to God",
                "answer": "PRAY",
                "row": 5,
                "col": 0
            }
        ]
    },
    {
        "id": 3,
        "title": "Grace & Kings",
        "subtitle": "Old Testament Heroes",
        "rows": 5,
        "cols": 5,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Unmerited favor",
                "answer": "GRACE",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "The first man",
                "answer": "ADAM",
                "row": 1,
                "col": 4
            },
            {
                "num": 3,
                "dir": "across",
                "text": "A man after God's heart",
                "answer": "DAVID",
                "row": 2,
                "col": 0
            }
        ]
    },
    {
        "id": 4,
        "title": "The Prophets",
        "subtitle": "Voices of God",
        "rows": 7,
        "cols": 10,
        "clues": [
            {
                "num": 1,
                "dir": "across",
                "text": "Led Israelites out of Egypt",
                "answer": "MOSES",
                "row": 0,
                "col": 0
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Last of the Judges",
                "answer": "SAMUEL",
                "row": 0,
                "col": 4
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Swallowed by a great fish",
                "answer": "JONAH",
                "row": 0,
                "col": 9
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Prophesied the Messiah",
                "answer": "ISAIAH",
                "row": 1,
                "col": 6
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Taken up in a whirlwind",
                "answer": "ELIJAH",
                "row": 4,
                "col": 4
            }
        ]
    },
    {
        "id": 5,
        "title": "Women of Faith",
        "subtitle": "Biblical Heroines",
        "rows": 6,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Queen who saved her people",
                "answer": "ESTHER",
                "row": 0,
                "col": 3
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Mother of Jesus",
                "answer": "MARY",
                "row": 1,
                "col": 0
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Wife of Abraham",
                "answer": "SARAH",
                "row": 1,
                "col": 5
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Loyal daughter-in-law",
                "answer": "RUTH",
                "row": 3,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Sister of Mary and Lazarus",
                "answer": "MARTHA",
                "row": 5,
                "col": 1
            }
        ]
    },
    {
        "id": 6,
        "title": "The Apostles",
        "subtitle": "Followers of Christ",
        "rows": 8,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Doubted the resurrection",
                "answer": "THOMAS",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "across",
                "text": "The beloved disciple",
                "answer": "JOHN",
                "row": 2,
                "col": 0
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Walked on water",
                "answer": "PETER",
                "row": 3,
                "col": 5
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Former tax collector",
                "answer": "MATTHEW",
                "row": 4,
                "col": 0
            }
        ]
    },
    {
        "id": 7,
        "title": "Places in the Bible",
        "subtitle": "Holy Geography",
        "rows": 13,
        "cols": 9,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Jesus grew up here",
                "answer": "NAZARETH",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Walls fell down",
                "answer": "JERICHO",
                "row": 0,
                "col": 3
            },
            {
                "num": 3,
                "dir": "down",
                "text": "The Holy City",
                "answer": "JERUSALEM",
                "row": 4,
                "col": 7
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Birthplace of Jesus",
                "answer": "BETHLEHEM",
                "row": 5,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Sea where Jesus walked",
                "answer": "GALILEE",
                "row": 11,
                "col": 2
            }
        ]
    },
    {
        "id": 8,
        "title": "Fruits of the Spirit",
        "subtitle": "Galatians 5",
        "rows": 10,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Passes all understanding",
                "answer": "PEACE",
                "row": 0,
                "col": 7
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Be ___ to one another",
                "answer": "KINDNESS",
                "row": 2,
                "col": 5
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Wait on the Lord",
                "answer": "PATIENCE",
                "row": 4,
                "col": 0
            },
            {
                "num": 4,
                "dir": "down",
                "text": "The ___ of the Lord is my strength",
                "answer": "JOY",
                "row": 6,
                "col": 3
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Greatest of these is ___",
                "answer": "LOVE",
                "row": 7,
                "col": 2
            }
        ]
    },
    {
        "id": 9,
        "title": "Animals in the Bible",
        "subtitle": "Creatures of the Word",
        "rows": 7,
        "cols": 5,
        "clues": [
            {
                "num": 1,
                "dir": "across",
                "text": "Jesus fed thousands with two ___",
                "answer": "FISH",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Tempted Eve",
                "answer": "SERPENT",
                "row": 0,
                "col": 3
            },
            {
                "num": 3,
                "dir": "down",
                "text": "___ of Judah",
                "answer": "LION",
                "row": 2,
                "col": 1
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Brought an olive leaf to Noah",
                "answer": "DOVE",
                "row": 4,
                "col": 0
            }
        ]
    },
    {
        "id": 10,
        "title": "Parables of Jesus",
        "subtitle": "Lessons in Stories",
        "rows": 12,
        "cols": 12,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Parable of the ___",
                "answer": "SOWER",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "The Good ___",
                "answer": "SAMARITAN",
                "row": 3,
                "col": 6
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Seed of faith",
                "answer": "MUSTARD",
                "row": 3,
                "col": 10
            },
            {
                "num": 4,
                "dir": "across",
                "text": "The ___ Son",
                "answer": "PRODIGAL",
                "row": 4,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Parable of the three servants",
                "answer": "TALENTS",
                "row": 6,
                "col": 5
            }
        ]
    },
    {
        "id": 11,
        "title": "Armor of God",
        "subtitle": "Ephesians 6",
        "rows": 11,
        "cols": 6,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Belt of ___",
                "answer": "TRUTH",
                "row": 0,
                "col": 4
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Helmet of ___",
                "answer": "SALVATION",
                "row": 2,
                "col": 2
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Shield of ___",
                "answer": "FAITH",
                "row": 3,
                "col": 1
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Gospel of ___",
                "answer": "PEACE",
                "row": 6,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Sword of the ___",
                "answer": "SPIRIT",
                "row": 8,
                "col": 0
            }
        ]
    },
    {
        "id": 12,
        "title": "Ten Commandments",
        "subtitle": "Exodus 20",
        "rows": 7,
        "cols": 10,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Remember the ___ day",
                "answer": "SABBATH",
                "row": 0,
                "col": 8
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Thou shalt not ___",
                "answer": "MURDER",
                "row": 1,
                "col": 6
            },
            {
                "num": 3,
                "dir": "across",
                "text": "No graven ___",
                "answer": "IDOLS",
                "row": 2,
                "col": 0
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Thou shalt not ___",
                "answer": "STEAL",
                "row": 2,
                "col": 4
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Honor thy ___",
                "answer": "PARENTS",
                "row": 5,
                "col": 3
            }
        ]
    },
    {
        "id": 13,
        "title": "Miracles of Jesus",
        "subtitle": "Signs and Wonders",
        "rows": 9,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Calmed by Jesus",
                "answer": "STORM",
                "row": 0,
                "col": 7
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Raised from the dead",
                "answer": "LAZARUS",
                "row": 2,
                "col": 4
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Turned into wine",
                "answer": "WATER",
                "row": 3,
                "col": 3
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Ten were healed",
                "answer": "LEPERS",
                "row": 6,
                "col": 0
            }
        ]
    },
    {
        "id": 14,
        "title": "Names of God",
        "subtitle": "Divine Titles",
        "rows": 9,
        "cols": 10,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "I AM WHO I AM",
                "answer": "YAHWEH",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "God with us",
                "answer": "IMMANUEL",
                "row": 1,
                "col": 5
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Lord and Master",
                "answer": "ADONAI",
                "row": 2,
                "col": 3
            },
            {
                "num": 4,
                "dir": "across",
                "text": "The LORD",
                "answer": "JEHOVAH",
                "row": 4,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "God the Creator",
                "answer": "ELOHIM",
                "row": 8,
                "col": 4
            }
        ]
    },
    {
        "id": 15,
        "title": "Gospel of John",
        "subtitle": "The Fourth Gospel",
        "rows": 8,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "The Good ___",
                "answer": "SHEPHERD",
                "row": 0,
                "col": 3
            },
            {
                "num": 2,
                "dir": "across",
                "text": "___ of the world",
                "answer": "LIGHT",
                "row": 1,
                "col": 0
            },
            {
                "num": 3,
                "dir": "down",
                "text": "In the beginning was the ___",
                "answer": "WORD",
                "row": 3,
                "col": 6
            },
            {
                "num": 4,
                "dir": "across",
                "text": "___ of life",
                "answer": "BREAD",
                "row": 6,
                "col": 2
            }
        ]
    },
    {
        "id": 16,
        "title": "The Exodus",
        "subtitle": "Journey to Freedom",
        "rows": 8,
        "cols": 10,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Angel of death passed over",
                "answer": "PASSOVER",
                "row": 0,
                "col": 6
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Bread from heaven",
                "answer": "MANNA",
                "row": 2,
                "col": 2
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Ten were sent",
                "answer": "PLAGUES",
                "row": 3,
                "col": 0
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Mountain of the Law",
                "answer": "SINAI",
                "row": 5,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "King of Egypt",
                "answer": "PHARAOH",
                "row": 7,
                "col": 3
            }
        ]
    },
    {
        "id": 17,
        "title": "Kings of Israel",
        "subtitle": "The Monarchy",
        "rows": 7,
        "cols": 9,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Found the Book of the Law",
                "answer": "JOSIAH",
                "row": 0,
                "col": 0
            },
            {
                "num": 2,
                "dir": "across",
                "text": "First king of Israel",
                "answer": "SAUL",
                "row": 3,
                "col": 5
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Wicked king, husband of Jezebel",
                "answer": "AHAB",
                "row": 3,
                "col": 6
            },
            {
                "num": 4,
                "dir": "across",
                "text": "King who prayed for healing",
                "answer": "HEZEKIAH",
                "row": 5,
                "col": 0
            }
        ]
    },
    {
        "id": 18,
        "title": "Books of the Bible",
        "subtitle": "The Canon",
        "rows": 12,
        "cols": 11,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Book of wisdom",
                "answer": "PROVERBS",
                "row": 0,
                "col": 4
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Departure from Egypt",
                "answer": "EXODUS",
                "row": 2,
                "col": 2
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Final book of the Bible",
                "answer": "REVELATION",
                "row": 4,
                "col": 1
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Book of songs",
                "answer": "PSALMS",
                "row": 6,
                "col": 6
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Book of Beginnings",
                "answer": "GENESIS",
                "row": 7,
                "col": 0
            }
        ]
    },
    {
        "id": 19,
        "title": "The Nativity",
        "subtitle": "Birth of Christ",
        "rows": 6,
        "cols": 9,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Jesus' first bed",
                "answer": "MANGER",
                "row": 0,
                "col": 3
            },
            {
                "num": 2,
                "dir": "down",
                "text": "King who sought the child",
                "answer": "HEROD",
                "row": 0,
                "col": 6
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Sang to the shepherds",
                "answer": "ANGELS",
                "row": 1,
                "col": 3
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Gift for a king",
                "answer": "GOLD",
                "row": 3,
                "col": 5
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Guided the wise men",
                "answer": "STAR",
                "row": 5,
                "col": 0
            }
        ]
    },
    {
        "id": 20,
        "title": "The Crucifixion",
        "subtitle": "The Cross",
        "rows": 9,
        "cols": 10,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Crown of ___",
                "answer": "THORNS",
                "row": 0,
                "col": 8
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Used to pierce hands and feet",
                "answer": "NAILS",
                "row": 2,
                "col": 4
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Place of the skull",
                "answer": "CALVARY",
                "row": 3,
                "col": 3
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Where Jesus was laid",
                "answer": "TOMB",
                "row": 5,
                "col": 2
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Where Jesus was crucified",
                "answer": "CROSS",
                "row": 6,
                "col": 0
            }
        ]
    },
    {
        "id": 21,
        "title": "The Resurrection",
        "subtitle": "He is Risen",
        "rows": 9,
        "cols": 6,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "First to see risen Lord",
                "answer": "MARY",
                "row": 0,
                "col": 2
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Where the tomb was",
                "answer": "GARDEN",
                "row": 2,
                "col": 0
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Road where Jesus appeared",
                "answer": "EMMAUS",
                "row": 2,
                "col": 4
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Rolled away",
                "answer": "STONE",
                "row": 4,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Needed to touch scars",
                "answer": "THOMAS",
                "row": 5,
                "col": 0
            }
        ]
    },
    {
        "id": 22,
        "title": "Acts of the Apostles",
        "subtitle": "The Early Church",
        "rows": 9,
        "cols": 9,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Paul's companion in prison",
                "answer": "SILAS",
                "row": 0,
                "col": 7
            },
            {
                "num": 2,
                "dir": "down",
                "text": "First martyr",
                "answer": "STEPHEN",
                "row": 2,
                "col": 1
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Converted on road to Damascus",
                "answer": "PAUL",
                "row": 2,
                "col": 4
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Holy Spirit descended",
                "answer": "PENTECOST",
                "row": 4,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Baptized the Ethiopian",
                "answer": "PHILIP",
                "row": 6,
                "col": 0
            }
        ]
    },
    {
        "id": 23,
        "title": "Fruit of the Spirit II",
        "subtitle": "Galatians 5 cont.",
        "rows": 15,
        "cols": 11,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Remaining true",
                "answer": "FAITHFULNESS",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Soft answer turns away wrath",
                "answer": "GENTLENESS",
                "row": 5,
                "col": 10
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Walk by the ___",
                "answer": "SPIRIT",
                "row": 6,
                "col": 8
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Mastery of oneself",
                "answer": "SELFCONTROL",
                "row": 9,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Fruit of ___",
                "answer": "GOODNESS",
                "row": 13,
                "col": 3
            }
        ]
    },
    {
        "id": 24,
        "title": "Old Testament Prophets",
        "subtitle": "Messengers of God",
        "rows": 9,
        "cols": 10,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Married Gomer",
                "answer": "HOSEA",
                "row": 0,
                "col": 2
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Shepherd prophet",
                "answer": "AMOS",
                "row": 1,
                "col": 0
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Valley of dry bones",
                "answer": "EZEKIEL",
                "row": 2,
                "col": 5
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Lion's den",
                "answer": "DANIEL",
                "row": 4,
                "col": 1
            },
            {
                "num": 5,
                "dir": "across",
                "text": "The weeping prophet",
                "answer": "JEREMIAH",
                "row": 7,
                "col": 2
            }
        ]
    },
    {
        "id": 25,
        "title": "Mountains of the Bible",
        "subtitle": "High Places",
        "rows": 8,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Noah's ark rested here",
                "answer": "ARARAT",
                "row": 0,
                "col": 6
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Elijah vs prophets of Baal",
                "answer": "CARMEL",
                "row": 2,
                "col": 4
            },
            {
                "num": 3,
                "dir": "down",
                "text": "City of David",
                "answer": "ZION",
                "row": 4,
                "col": 0
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Abraham's test",
                "answer": "MORIAH",
                "row": 4,
                "col": 2
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Mount of ___",
                "answer": "OLIVES",
                "row": 6,
                "col": 0
            }
        ]
    },
    {
        "id": 26,
        "title": "Biblical Rivers",
        "subtitle": "Flowing Waters",
        "rows": 9,
        "cols": 11,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Another river in Eden",
                "answer": "TIGRIS",
                "row": 0,
                "col": 8
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Baby Moses floated here",
                "answer": "NILE",
                "row": 1,
                "col": 7
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Jesus was baptized here",
                "answer": "JORDAN",
                "row": 3,
                "col": 4
            },
            {
                "num": 4,
                "dir": "across",
                "text": "River in Eden",
                "answer": "EUPHRATES",
                "row": 5,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Border of Moab",
                "answer": "ARNON",
                "row": 8,
                "col": 0
            }
        ]
    },
    {
        "id": 27,
        "title": "Trees and Plants",
        "subtitle": "Flora of the Word",
        "rows": 5,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Cursed by Jesus",
                "answer": "FIG",
                "row": 0,
                "col": 3
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Used for Solomon's temple",
                "answer": "CEDAR",
                "row": 0,
                "col": 5
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Branch brought by dove",
                "answer": "OLIVE",
                "row": 1,
                "col": 1
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Smallest of seeds",
                "answer": "MUSTARD",
                "row": 4,
                "col": 0
            }
        ]
    },
    {
        "id": 28,
        "title": "Gems and Minerals",
        "subtitle": "Precious Stones",
        "rows": 7,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Rainbow around the throne",
                "answer": "EMERALD",
                "row": 0,
                "col": 6
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Gates of ___",
                "answer": "PEARL",
                "row": 1,
                "col": 1
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Foundation of New Jerusalem",
                "answer": "SAPPHIRE",
                "row": 3,
                "col": 0
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Streets of New Jerusalem",
                "answer": "GOLD",
                "row": 5,
                "col": 4
            }
        ]
    },
    {
        "id": 29,
        "title": "Biblical Instruments",
        "subtitle": "Praise the Lord",
        "rows": 9,
        "cols": 10,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Clashing ___",
                "answer": "CYMBAL",
                "row": 0,
                "col": 3
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Played by David",
                "answer": "HARP",
                "row": 2,
                "col": 1
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Blown at Jericho",
                "answer": "TRUMPET",
                "row": 2,
                "col": 6
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Played by Miriam",
                "answer": "TAMBOURINE",
                "row": 3,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Played by pipers",
                "answer": "FLUTE",
                "row": 8,
                "col": 3
            }
        ]
    },
    {
        "id": 30,
        "title": "Numbers in the Bible",
        "subtitle": "Divine Mathematics",
        "rows": 8,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "across",
                "text": "Days of rain",
                "answer": "FORTY",
                "row": 0,
                "col": 0
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Days in the tomb",
                "answer": "THREE",
                "row": 0,
                "col": 3
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Number of apostles",
                "answer": "TWELVE",
                "row": 2,
                "col": 5
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Days of creation",
                "answer": "SEVEN",
                "row": 4,
                "col": 2
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Number of commandments",
                "answer": "TEN",
                "row": 7,
                "col": 4
            }
        ]
    },
    {
        "id": 31,
        "title": "Colors in the Bible",
        "subtitle": "Spectrum of Faith",
        "rows": 9,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Robes of the saints",
                "answer": "WHITE",
                "row": 0,
                "col": 3
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Sins like ___",
                "answer": "CRIMSON",
                "row": 2,
                "col": 1
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Cord of Rahab",
                "answer": "SCARLET",
                "row": 2,
                "col": 5
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Fringes of garments",
                "answer": "BLUE",
                "row": 4,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Color of royalty",
                "answer": "PURPLE",
                "row": 7,
                "col": 0
            }
        ]
    },
    {
        "id": 32,
        "title": "Biblical Metals",
        "subtitle": "Elements of the Word",
        "rows": 6,
        "cols": 9,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Serpent in the wilderness",
                "answer": "BRONZE",
                "row": 0,
                "col": 4
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Sank like ___ in the sea",
                "answer": "LEAD",
                "row": 1,
                "col": 7
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Mined from the hills",
                "answer": "COPPER",
                "row": 2,
                "col": 3
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Thirty pieces of ___",
                "answer": "SILVER",
                "row": 5,
                "col": 0
            }
        ]
    },
    {
        "id": 33,
        "title": "Weather in the Bible",
        "subtitle": "Elements of Nature",
        "rows": 7,
        "cols": 5,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Fell for forty days",
                "answer": "RAIN",
                "row": 0,
                "col": 2
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Plague in Egypt",
                "answer": "HAIL",
                "row": 1,
                "col": 1
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Wash me whiter than ___",
                "answer": "SNOW",
                "row": 3,
                "col": 1
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Parted the Red Sea",
                "answer": "WIND",
                "row": 3,
                "col": 4
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Guided Israelites by day",
                "answer": "CLOUD",
                "row": 6,
                "col": 0
            }
        ]
    },
    {
        "id": 34,
        "title": "Birds in the Bible",
        "subtitle": "Feathered Creatures",
        "rows": 9,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Flesh given to Israelites",
                "answer": "QUAIL",
                "row": 0,
                "col": 5
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Not one falls to the ground",
                "answer": "SPARROW",
                "row": 2,
                "col": 3
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Mount up with wings like ___",
                "answer": "EAGLE",
                "row": 4,
                "col": 2
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Leaves her eggs in the earth",
                "answer": "OSTRICH",
                "row": 6,
                "col": 0
            }
        ]
    },
    {
        "id": 35,
        "title": "Insects in the Bible",
        "subtitle": "Creeping Things",
        "rows": 7,
        "cols": 6,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Plague in Egypt",
                "answer": "LOCUST",
                "row": 0,
                "col": 3
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Corrupts treasures on earth",
                "answer": "MOTH",
                "row": 1,
                "col": 2
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Consider her ways",
                "answer": "ANT",
                "row": 4,
                "col": 1
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Strain out a ___",
                "answer": "GNAT",
                "row": 5,
                "col": 0
            }
        ]
    },
    {
        "id": 36,
        "title": "Family in the Bible",
        "subtitle": "Kinsmen and Relations",
        "rows": 9,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "And your ___",
                "answer": "MOTHER",
                "row": 0,
                "col": 3
            },
            {
                "num": 2,
                "dir": "across",
                "text": "This is my beloved ___",
                "answer": "SON",
                "row": 1,
                "col": 2
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Am I my ___'s keeper",
                "answer": "BROTHER",
                "row": 2,
                "col": 5
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Honor your ___",
                "answer": "FATHER",
                "row": 3,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Miriam was Aaron's ___",
                "answer": "SISTER",
                "row": 7,
                "col": 1
            }
        ]
    },
    {
        "id": 37,
        "title": "Clothing in the Bible",
        "subtitle": "Garments of the Word",
        "rows": 7,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Joseph's colorful coat",
                "answer": "TUNIC",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Remove them, for the ground is holy",
                "answer": "SANDALS",
                "row": 0,
                "col": 3
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Put the best ___ on him",
                "answer": "ROBE",
                "row": 0,
                "col": 5
            },
            {
                "num": 4,
                "dir": "across",
                "text": "John the Baptist wore a leather ___",
                "answer": "GIRDLE",
                "row": 3,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Left behind by Paul",
                "answer": "CLOAK",
                "row": 5,
                "col": 2
            }
        ]
    },
    {
        "id": 38,
        "title": "Food in the Bible",
        "subtitle": "Daily Bread",
        "rows": 5,
        "cols": 6,
        "clues": [
            {
                "num": 1,
                "dir": "across",
                "text": "Five loaves and two ___",
                "answer": "FISH",
                "row": 0,
                "col": 0
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Taste and see",
                "answer": "HONEY",
                "row": 0,
                "col": 3
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Man shall not live by ___ alone",
                "answer": "BREAD",
                "row": 3,
                "col": 1
            }
        ]
    },
    {
        "id": 39,
        "title": "Professions in the Bible",
        "subtitle": "Workers of the Word",
        "rows": 15,
        "cols": 13,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Paul's craft",
                "answer": "TENTMAKER",
                "row": 0,
                "col": 9
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Joseph's trade",
                "answer": "CARPENTER",
                "row": 1,
                "col": 2
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Matthew's profession",
                "answer": "TAXCOLLECTOR",
                "row": 3,
                "col": 0
            },
            {
                "num": 4,
                "dir": "down",
                "text": "David's early job",
                "answer": "SHEPHERD",
                "row": 7,
                "col": 7
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Peter's occupation",
                "answer": "FISHERMAN",
                "row": 8,
                "col": 4
            }
        ]
    },
    {
        "id": 40,
        "title": "Weapons in the Bible",
        "subtitle": "Arms of the Word",
        "rows": 5,
        "cols": 5,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Saul threw a ___ at David",
                "answer": "SPEAR",
                "row": 0,
                "col": 0
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Word of God is sharper than any two-edged ___",
                "answer": "SWORD",
                "row": 0,
                "col": 2
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Jonathan's weapon",
                "answer": "BOW",
                "row": 1,
                "col": 4
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Shot by Jonathan",
                "answer": "ARROW",
                "row": 3,
                "col": 0
            }
        ]
    },
    {
        "id": 41,
        "title": "Diseases in the Bible",
        "subtitle": "Afflictions of the Flesh",
        "rows": 15,
        "cols": 10,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Ephphatha, be opened",
                "answer": "DEAFNESS",
                "row": 0,
                "col": 9
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Bartimaeus was cured of ___",
                "answer": "BLINDNESS",
                "row": 5,
                "col": 5
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Man let down through the roof was cured of ___",
                "answer": "PARALYSIS",
                "row": 6,
                "col": 1
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Peter's mother-in-law was cured of a ___",
                "answer": "FEVER",
                "row": 10,
                "col": 1
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Naaman was cured of ___",
                "answer": "LEPROSY",
                "row": 13,
                "col": 0
            }
        ]
    },
    {
        "id": 42,
        "title": "Cities of Refuge",
        "subtitle": "Places of Safety",
        "rows": 10,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "In Gilead",
                "answer": "RAMOTH",
                "row": 0,
                "col": 6
            },
            {
                "num": 2,
                "dir": "down",
                "text": "In Mount Ephraim",
                "answer": "SHECHEM",
                "row": 1,
                "col": 3
            },
            {
                "num": 3,
                "dir": "across",
                "text": "In Judah",
                "answer": "HEBRON",
                "row": 3,
                "col": 2
            },
            {
                "num": 4,
                "dir": "down",
                "text": "In the wilderness",
                "answer": "BEZER",
                "row": 5,
                "col": 1
            },
            {
                "num": 5,
                "dir": "across",
                "text": "In Naphtali",
                "answer": "KEDESH",
                "row": 6,
                "col": 0
            }
        ]
    },
    {
        "id": 43,
        "title": "Judges of Israel",
        "subtitle": "Deliverers of the Land",
        "rows": 12,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Defeated Midianites with 300 men",
                "answer": "GIDEON",
                "row": 0,
                "col": 7
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Left-handed judge",
                "answer": "EHUD",
                "row": 4,
                "col": 0
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Strong man",
                "answer": "SAMSON",
                "row": 5,
                "col": 2
            },
            {
                "num": 4,
                "dir": "down",
                "text": "First judge",
                "answer": "OTHNIEL",
                "row": 5,
                "col": 6
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Female judge",
                "answer": "DEBORAH",
                "row": 7,
                "col": 0
            }
        ]
    },
    {
        "id": 44,
        "title": "Feasts of Israel",
        "subtitle": "Appointed Times",
        "rows": 11,
        "cols": 11,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Feast of Booths",
                "answer": "TABERNACLES",
                "row": 0,
                "col": 4
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Rosh Hashanah",
                "answer": "TRUMPETS",
                "row": 0,
                "col": 10
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Feast of Unleavened Bread",
                "answer": "PASSOVER",
                "row": 1,
                "col": 3
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Feast of Weeks",
                "answer": "PENTECOST",
                "row": 3,
                "col": 0
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Yom Kippur",
                "answer": "ATONEMENT",
                "row": 9,
                "col": 0
            }
        ]
    },
    {
        "id": 45,
        "title": "Tribes of Israel",
        "subtitle": "Sons of Jacob",
        "rows": 8,
        "cols": 9,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Firstborn",
                "answer": "REUBEN",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Royal tribe",
                "answer": "JUDAH",
                "row": 0,
                "col": 5
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Priestly tribe",
                "answer": "LEVI",
                "row": 1,
                "col": 0
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Second son",
                "answer": "SIMEON",
                "row": 2,
                "col": 7
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Youngest son",
                "answer": "BENJAMIN",
                "row": 3,
                "col": 1
            }
        ]
    },
    {
        "id": 46,
        "title": "The Tabernacle",
        "subtitle": "Dwelling Place",
        "rows": 8,
        "cols": 7,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "___ of Showbread",
                "answer": "TABLE",
                "row": 0,
                "col": 5
            },
            {
                "num": 2,
                "dir": "across",
                "text": "Golden lampstand",
                "answer": "MENORAH",
                "row": 1,
                "col": 0
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Place of sacrifice",
                "answer": "ALTAR",
                "row": 3,
                "col": 2
            },
            {
                "num": 4,
                "dir": "across",
                "text": "Basin for washing",
                "answer": "LAVER",
                "row": 4,
                "col": 2
            },
            {
                "num": 5,
                "dir": "across",
                "text": "___ of the Covenant",
                "answer": "ARK",
                "row": 7,
                "col": 1
            }
        ]
    },
    {
        "id": 47,
        "title": "Gifts of the Spirit",
        "subtitle": "1 Corinthians 12",
        "rows": 9,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Gifts of ___",
                "answer": "HEALING",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Word of ___",
                "answer": "KNOWLEDGE",
                "row": 0,
                "col": 5
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Word of ___",
                "answer": "WISDOM",
                "row": 2,
                "col": 7
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Gift of ___",
                "answer": "FAITH",
                "row": 3,
                "col": 3
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Working of ___",
                "answer": "MIRACLES",
                "row": 4,
                "col": 0
            }
        ]
    },
    {
        "id": 48,
        "title": "Beatitudes",
        "subtitle": "Matthew 5",
        "rows": 8,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Blessed are the ___",
                "answer": "MEEK",
                "row": 0,
                "col": 1
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Blessed are those who ___ and thirst for righteousness",
                "answer": "HUNGER",
                "row": 1,
                "col": 6
            },
            {
                "num": 3,
                "dir": "across",
                "text": "Blessed are the ___",
                "answer": "MERCIFUL",
                "row": 2,
                "col": 0
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Blessed are the ___ in spirit",
                "answer": "POOR",
                "row": 4,
                "col": 4
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Blessed are those who ___",
                "answer": "MOURN",
                "row": 6,
                "col": 3
            }
        ]
    },
    {
        "id": 49,
        "title": "Armor of God II",
        "subtitle": "Ephesians 6 cont.",
        "rows": 7,
        "cols": 11,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "___ of salvation",
                "answer": "HELMET",
                "row": 0,
                "col": 5
            },
            {
                "num": 2,
                "dir": "down",
                "text": "___ of faith",
                "answer": "SHIELD",
                "row": 1,
                "col": 7
            },
            {
                "num": 3,
                "dir": "down",
                "text": "___ of the gospel of peace",
                "answer": "SHOES",
                "row": 2,
                "col": 2
            },
            {
                "num": 4,
                "dir": "down",
                "text": "___ of truth",
                "answer": "BELT",
                "row": 2,
                "col": 9
            },
            {
                "num": 5,
                "dir": "across",
                "text": "___ of righteousness",
                "answer": "BREASTPLATE",
                "row": 5,
                "col": 0
            }
        ]
    },
    {
        "id": 50,
        "title": "Seven Churches of Asia",
        "subtitle": "Revelation 2-3",
        "rows": 10,
        "cols": 8,
        "clues": [
            {
                "num": 1,
                "dir": "down",
                "text": "Persecuted church",
                "answer": "SMYRNA",
                "row": 0,
                "col": 7
            },
            {
                "num": 2,
                "dir": "down",
                "text": "Where Satan's throne is",
                "answer": "PERGAMUM",
                "row": 1,
                "col": 3
            },
            {
                "num": 3,
                "dir": "down",
                "text": "Dead church",
                "answer": "SARDIS",
                "row": 1,
                "col": 5
            },
            {
                "num": 4,
                "dir": "down",
                "text": "Lost their first love",
                "answer": "EPHESUS",
                "row": 3,
                "col": 1
            },
            {
                "num": 5,
                "dir": "across",
                "text": "Tolerated Jezebel",
                "answer": "THYATIRA",
                "row": 5,
                "col": 0
            }
        ]
    }
];