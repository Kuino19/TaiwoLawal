// Player Profile, Talents (Faith Points), Daily Manna Streak & Achievements

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'puzzle' | 'speed' | 'dedication' | 'social';
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_win',
        title: 'First Light',
        description: 'Complete your very first Bible game or puzzle level.',
        icon: '🌟',
        category: 'dedication'
    },
    {
        id: 'scribe_5',
        title: 'Scribe of Scripture',
        description: 'Solve 5 different Bible Crossword levels.',
        icon: '📜',
        category: 'puzzle'
    },
    {
        id: 'crossword_25',
        title: 'Grand Master Scribe',
        description: 'Conquer 25 challenging Bible Crossword levels.',
        icon: '👑',
        category: 'puzzle'
    },
    {
        id: 'scramble_ace',
        title: 'Word Altar Builder',
        description: 'Complete 5 Verse Scramble scriptures.',
        icon: '🔤',
        category: 'puzzle'
    },
    {
        id: 'combo_master',
        title: 'Swift Messenger',
        description: 'Achieve a 3x speed combo in Verse Scramble.',
        icon: '⚡',
        category: 'speed'
    },
    {
        id: 'memory_champion',
        title: 'Shield of Remembrance',
        description: 'Win a Memory Match game on Hard or Expert grid.',
        icon: '🧠',
        category: 'puzzle'
    },
    {
        id: 'trivia_streak_5',
        title: 'Sword of the Spirit',
        description: 'Achieve a 5-question answer streak in Bible Trivia Rush.',
        icon: '⚔️',
        category: 'speed'
    },
    {
        id: 'prophet_insight',
        title: 'Eyes of Elisha',
        description: 'Correctly identify a mystery character on Clue #1 in Who Am I.',
        icon: '🕵️',
        category: 'speed'
    },
    {
        id: 'streak_3',
        title: 'Daily Manna Devotee',
        description: 'Maintain a 3-day consecutive Bible games playing streak.',
        icon: '🔥',
        category: 'dedication'
    },
    {
        id: 'talents_250',
        title: 'Faithful Steward',
        description: 'Earn and accumulate 250+ Talents in your treasury.',
        icon: '🪙',
        category: 'dedication'
    },
    {
        id: 'gospel_herald',
        title: 'Gospel Herald',
        description: 'Share your victory or score with friends on WhatsApp.',
        icon: '📢',
        category: 'social'
    }
];

export interface PlayerProfile {
    talents: number;
    streak: number;
    lastPlayedDate: string; // YYYY-MM-DD
    lastMannaClaimDate: string; // YYYY-MM-DD
    unlockedAchievements: string[];
    gamesPlayed: number;
    totalWins: number;
}

const STORAGE_KEY = 'bible_games_player_profile_v1';

const DEFAULT_PROFILE: PlayerProfile = {
    talents: 50, // Welcome gift of 50 Talents
    streak: 1,
    lastPlayedDate: '',
    lastMannaClaimDate: '',
    unlockedAchievements: [],
    gamesPlayed: 0,
    totalWins: 0
};

export const getPlayerProfile = (): PlayerProfile => {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
            return DEFAULT_PROFILE;
        }
        return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    } catch {
        return DEFAULT_PROFILE;
    }
};

export const savePlayerProfile = (profile: PlayerProfile): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        // Dispatch custom event so all active game components update immediately
        window.dispatchEvent(new CustomEvent('bible_games_profile_updated', { detail: profile }));
    } catch {}
};

// Earn Talents
export const earnTalents = (amount: number): number => {
    const profile = getPlayerProfile();
    profile.talents = Math.max(0, profile.talents + amount);
    if (profile.talents >= 250) {
        unlockAchievement('talents_250');
    }
    savePlayerProfile(profile);
    return profile.talents;
};

// Spend Talents (e.g. for lifelines & hints)
export const spendTalents = (amount: number): boolean => {
    const profile = getPlayerProfile();
    if (profile.talents < amount) return false;
    profile.talents -= amount;
    savePlayerProfile(profile);
    return true;
};

// Unlock an achievement
export const unlockAchievement = (id: string): boolean => {
    const profile = getPlayerProfile();
    if (profile.unlockedAchievements.includes(id)) return false;

    profile.unlockedAchievements.push(id);
    // Award 25 bonus talents for unlocking an achievement
    profile.talents += 25;
    savePlayerProfile(profile);
    return true;
};

// Get today string formatted as YYYY-MM-DD
const getTodayString = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Daily Manna Streak tracking
export const checkAndUpdateStreak = (): { streak: number; isNewDay: boolean; canClaimManna: boolean } => {
    const profile = getPlayerProfile();
    const today = getTodayString();

    if (!profile.lastPlayedDate) {
        profile.lastPlayedDate = today;
        profile.streak = 1;
        savePlayerProfile(profile);
        return { streak: 1, isNewDay: true, canClaimManna: profile.lastMannaClaimDate !== today };
    }

    if (profile.lastPlayedDate === today) {
        return {
            streak: profile.streak || 1,
            isNewDay: false,
            canClaimManna: profile.lastMannaClaimDate !== today
        };
    }

    const last = new Date(profile.lastPlayedDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
        profile.streak = (profile.streak || 0) + 1;
        if (profile.streak >= 3) {
            unlockAchievement('streak_3');
        }
    } else if (diffDays > 1) {
        profile.streak = 1; // streak reset
    }

    profile.lastPlayedDate = today;
    savePlayerProfile(profile);

    return {
        streak: profile.streak,
        isNewDay: true,
        canClaimManna: profile.lastMannaClaimDate !== today
    };
};

// Claim Daily Manna Gift (+25 Talents)
export const claimDailyManna = (): { success: boolean; bonus: number; newTotal: number } => {
    const profile = getPlayerProfile();
    const today = getTodayString();

    if (profile.lastMannaClaimDate === today) {
        return { success: false, bonus: 0, newTotal: profile.talents };
    }

    const bonus = 25 + (profile.streak > 1 ? Math.min(profile.streak * 5, 25) : 0);
    profile.lastMannaClaimDate = today;
    profile.talents += bonus;
    savePlayerProfile(profile);

    return { success: true, bonus, newTotal: profile.talents };
};

// Record a completed game
export const recordGameWin = (gameType?: string): void => {
    const profile = getPlayerProfile();
    profile.gamesPlayed = (profile.gamesPlayed || 0) + 1;
    profile.totalWins = (profile.totalWins || 0) + 1;
    savePlayerProfile(profile);
    unlockAchievement('first_win');
};

// WhatsApp Viral Score Sharing
export const shareScoreWhatsApp = (gameName: string, resultDetails: string, urlPath: string = '/games'): void => {
    if (typeof window === 'undefined') return;

    unlockAchievement('gospel_herald');

    const domain = window.location.origin;
    const shareUrl = `${domain}${urlPath}`;
    const text = `🏆 *${gameName} - Holy Bible Arcade (KJV)* ✝️\n\n${resultDetails}\n\nCan you beat my record? Play now:\n👉 ${shareUrl}`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/?text=${encoded}`;

    if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
        navigator.share({
            title: `${gameName} - Bible Games (KJV)`,
            text: text,
            url: shareUrl
        }).catch(() => {
            window.open(waUrl, '_blank');
        });
    } else {
        window.open(waUrl, '_blank');
    }
};
