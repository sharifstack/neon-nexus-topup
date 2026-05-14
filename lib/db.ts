import fs from 'fs/promises';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  points: number;
  twoFactorEnabled: boolean;
  avatar?: string;
  role?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: string; // ISO date string
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  pointsEarned: number;
  description: string;
  date: string;
  status: 'Pending' | 'Success' | 'Failed';
}

export interface Package {
  id: string;
  gameId: string;
  name: string;
  price: number;
  bonus?: string;
  popular?: boolean;
}

export interface Game {
  id: string;
  name: string;
  coverImage: string;
  bannerImage: string;
  tag?: string;
  tagColor?: string; // 'discount' | 'bonus' | 'star'
  category: string;
  packages: Package[];
  currency?: string; // e.g. "UC", "Diamonds", etc.
  description?: string;
  requiresZoneId?: boolean; // e.g. Mobile Legends needs Zone ID
  playUrl?: string;         // URL to play the mini-game
  isFeaturedMiniGame?: boolean;
  featuredBackgroundUrl?: string; // Animated GIF or video background for featured card
}

export interface FlashDeal {
  id: string;
  gameId: string;
  title: string;
  offerTitle: string;
  bonusText: string;
  originalPrice: number;
  discountedPrice: number;
  stockStatus: number; // 0-100 percentage
  limitedQuantity: string;
  backgroundMedia: string; // GIF/Image URL
  endsAt: string; // ISO timestamp or special "DAILY_RESET" flag
}

export interface LiveDrop {
  id: string;
  gameId: string;
  name: string;
  description: string;
  image: string;
  badge: 'Almost Gone' | 'Restocked' | 'Limited';
}

export interface Database {
  users: User[];
  sessions: Session[];
  transactions: Transaction[];
  games: Game[];
  paymentMethods: PaymentMethod[];
  flashDeals: FlashDeal[];
  liveDrops: LiveDrop[];
}

const DB_FILE = path.join(process.cwd(), 'data.json');

const DEFAULT_DB: Database = {
  users: [],
  sessions: [],
  transactions: [],
  paymentMethods: [
    { id: "bkash",  name: "bKash",       logo: "💳", fee: 0.015, description: "Mobile banking" },
    { id: "nagad",  name: "Nagad",       logo: "📱", fee: 0.010, description: "Digital wallet" },
    { id: "rocket", name: "Rocket",      logo: "🚀", fee: 0.010, description: "Dutch Bangla" },
    { id: "card",   name: "Card Payment",logo: "💳", fee: 0.025, description: "Visa / Mastercard" },
  ],
  games: [
    {
      id: "pubg-mobile",
      name: "PUBG MOBILE",
      coverImage: "https://cdn2.steamgriddb.com/thumb/13816ba0dd3a36209cbc3cfef265dc7c.jpg",
      bannerImage: "https://cdn2.steamgriddb.com/hero/pubgm.jpg",
      tag: "EXTRA DISCOUNT",
      tagColor: "discount",
      category: "All Games",
      currency: "UC",
      description: "The official PUBG Mobile top-up store. Get your UC instantly.",
      packages: [
        { id: "pubgm-60", gameId: "pubg-mobile", name: "60 UC", price: 0.99 },
        { id: "pubgm-325", gameId: "pubg-mobile", name: "325 UC", price: 4.99, bonus: "+25 UC Bonus" },
        { id: "pubgm-660", gameId: "pubg-mobile", name: "660 UC", price: 9.99, bonus: "+60 UC Bonus", popular: true },
        { id: "pubgm-1800", gameId: "pubg-mobile", name: "1800 UC", price: 24.99, bonus: "+180 UC Bonus" },
        { id: "pubgm-3850", gameId: "pubg-mobile", name: "3850 UC", price: 49.99, bonus: "+350 UC Bonus" },
        { id: "pubgm-8100", gameId: "pubg-mobile", name: "8100 UC", price: 99.99, bonus: "+900 UC Bonus" },
      ]
    },
    {
      id: "delta-force",
      name: "DELTA FORCE",
      coverImage: "https://cdn2.steamgriddb.com/grid/deltaforce.jpg",
      bannerImage: "https://cdn2.steamgriddb.com/hero/deltaforce.jpg",
      tag: "EXTRA BONUS",
      tagColor: "bonus",
      category: "All Games",
      currency: "Delta Coins",
      description: "Top up Delta Coins for Delta Force and get exclusive bonuses.",
      packages: [
        { id: "df-100", gameId: "delta-force", name: "100 Coins", price: 1.99 },
        { id: "df-300", gameId: "delta-force", name: "300 Coins", price: 4.99, bonus: "+30 Coins" },
        { id: "df-500", gameId: "delta-force", name: "500 Coins", price: 8.99, bonus: "+50 Coins", popular: true },
        { id: "df-1000", gameId: "delta-force", name: "1000 Coins", price: 16.99, bonus: "+120 Coins" },
        { id: "df-3000", gameId: "delta-force", name: "3000 Coins", price: 48.99, bonus: "+400 Coins" },
      ]
    },
    {
      id: "honor-of-kings",
      name: "HONOR OF KINGS",
      coverImage: "https://cdn2.steamgriddb.com/grid/hok.jpg",
      bannerImage: "https://cdn2.steamgriddb.com/hero/hok.jpg",
      tag: "EXTRA BONUS",
      tagColor: "bonus",
      category: "All Games",
      currency: "Tokens",
      description: "Official Honor of Kings token recharge. Instant delivery guaranteed.",
      packages: [
        { id: "hok-60", gameId: "honor-of-kings", name: "60 Tokens", price: 0.99 },
        { id: "hok-300", gameId: "honor-of-kings", name: "300 Tokens", price: 4.99, bonus: "+15 Tokens" },
        { id: "hok-680", gameId: "honor-of-kings", name: "680 Tokens", price: 9.99, bonus: "+40 Tokens", popular: true },
        { id: "hok-1980", gameId: "honor-of-kings", name: "1980 Tokens", price: 29.99, bonus: "+120 Tokens" },
      ]
    },
    {
      id: "clash-of-clans",
      name: "CLASH OF CLANS",
      coverImage: "https://m.media-amazon.com/images/M/MV5BYWMyYzc5ZWEtOTk1ZS00NzFlLTkwNjEtZmVhMzlhNDhkMmQ5XkEyXkFqcGc@._V1_.jpg",
      bannerImage: "https://supercell.com/images/85/clashofclans_og.jpg",
      category: "All Games",
      currency: "Gems",
      description: "Official Clash of Clans gems top-up. Build your village and dominate!",
      packages: [
        { id: "coc-500", gameId: "clash-of-clans", name: "500 Gems", price: 4.99 },
        { id: "coc-1200", gameId: "clash-of-clans", name: "1200 Gems", price: 9.99, popular: true },
        { id: "coc-2500", gameId: "clash-of-clans", name: "2500 Gems", price: 19.99 }
      ]
    },
    {
      id: "mobile-legends",
      name: "MOBILE LEGENDS",
      coverImage: "https://cdn2.steamgriddb.com/grid/mlbb.jpg",
      bannerImage: "https://cdn2.steamgriddb.com/hero/mlbb.jpg",
      tag: "EXTRA BONUS",
      tagColor: "bonus",
      category: "All Games",
      currency: "Diamonds",
      requiresZoneId: true,
      description: "Top up Mobile Legends Bang Bang Diamonds. Fast and secure.",
      packages: [
        { id: "mlbb-50", gameId: "mobile-legends", name: "50 Diamonds", price: 0.99 },
        { id: "mlbb-250", gameId: "mobile-legends", name: "250 Diamonds", price: 4.99, bonus: "+17 Diamonds" },
        { id: "mlbb-570", gameId: "mobile-legends", name: "570 Diamonds", price: 9.99, bonus: "+30 Diamonds", popular: true },
        { id: "mlbb-1650", gameId: "mobile-legends", name: "1650 Diamonds", price: 24.99, bonus: "+100 Diamonds" },
      ]
    },
    {
      id: "free-fire",
      name: "FREE FIRE",
      coverImage: "https://cdn2.steamgriddb.com/grid/freefire.jpg",
      bannerImage: "https://cdn2.steamgriddb.com/hero/freefire.jpg",
      tag: "EXTRA BONUS",
      tagColor: "star",
      category: "All Games",
      currency: "Diamonds",
      description: "Official Free Fire diamond top-up. Get exclusive skins and items.",
      packages: [
        { id: "ff-100", gameId: "free-fire", name: "100 Diamonds", price: 0.99 },
        { id: "ff-310", gameId: "free-fire", name: "310 Diamonds", price: 2.99 },
        { id: "ff-520", gameId: "free-fire", name: "520 Diamonds", price: 4.99, bonus: "+20 Diamonds" },
        { id: "ff-1060", gameId: "free-fire", name: "1060 Diamonds", price: 9.99, bonus: "+60 Diamonds", popular: true },
        { id: "ff-2180", gameId: "free-fire", name: "2180 Diamonds", price: 19.99, bonus: "+180 Diamonds" },
      ]
    },
    {
      id: "genshin-impact",
      name: "GENSHIN IMPACT",
      coverImage: "https://www.steamgriddb.com/grid/122705",
      bannerImage: "https://cdn2.steamgriddb.com/hero/genshin.jpg",
      tag: "EXTRA BONUS",
      tagColor: "bonus",
      category: "Entertainment",
      currency: "Genesis Crystals",
      description: "Top up Genesis Crystals for Genshin Impact and unlock all content.",
      packages: [
        { id: "gi-60", gameId: "genshin-impact", name: "60 Crystals", price: 0.99 },
        { id: "gi-300", gameId: "genshin-impact", name: "300 Crystals", price: 4.99, bonus: "+30 Crystals" },
        { id: "gi-980", gameId: "genshin-impact", name: "980 Crystals", price: 14.99, bonus: "+110 Crystals", popular: true },
        { id: "gi-1980", gameId: "genshin-impact", name: "1980 Crystals", price: 29.99, bonus: "+260 Crystals" },
        { id: "gi-3280", gameId: "genshin-impact", name: "3280 Crystals", price: 49.99, bonus: "+600 Crystals" },
        { id: "gi-6480", gameId: "genshin-impact", name: "6480 Crystals", price: 99.99, bonus: "+1600 Crystals" },
      ]
    },
    {
      id: "valorant",
      name: "VALORANT",
      coverImage: "https://cdn2.steamgriddb.com/grid/valorant.jpg",
      bannerImage: "https://cdn2.steamgriddb.com/hero/valorant.jpg",
      category: "All Games",
      currency: "VP",
      description: "Buy Valorant Points and get exclusive weapon skins and agents.",
      packages: [
        { id: "vp-475", gameId: "valorant", name: "475 VP", price: 4.99 },
        { id: "vp-1000", gameId: "valorant", name: "1000 VP", price: 9.99, popular: true },
        { id: "vp-2050", gameId: "valorant", name: "2050 VP", price: 19.99 },
        { id: "vp-3650", gameId: "valorant", name: "3650 VP", price: 34.99 },
        { id: "vp-5350", gameId: "valorant", name: "5350 VP", price: 49.99 },
      ]
    },
    {
      id: "pool-city",
      name: "POOL CITY - 8 BALL",
      coverImage: "https://play-lh.googleusercontent.com/Ej1fFfI0yT6O-i5fW-T7B-8kXG-8mR2Z5x-7r-r-r-r-r-r-r-r-r-r-r-r", // Placeholder logo
      bannerImage: "https://www.midasbuy.com/static/images/mini_game/pool_city_bg.jpg", // Example banner from reference
      category: "Mini Game",
      tag: "Mini Games",
      description: "No app download needed! Play instantly on Neon Nexus!",
      isFeaturedMiniGame: true,
      featuredBackgroundUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWZibXB4bmZzZ3R5enpndnpndnpndnpndnpndnpndnpndnpndnpndnpndnp/l41lTfhuXbY0S6Y7S/giphy.gif",
      playUrl: "https://game.neon-nexus.com/pool",
      packages: [
        { id: "pool-100", gameId: "pool-city", name: "100 Coins", price: 0.99 },
        { id: "pool-500", gameId: "pool-city", name: "500 Coins", price: 4.99, popular: true }
      ]
    },
    {
      id: "ludo-world",
      name: "LUDO WORLD",
      coverImage: "https://play-lh.googleusercontent.com/9-7-r-r-r-r-r-r-r-r-r-r-r-r-r-r", // Placeholder logo
      bannerImage: "https://www.midasbuy.com/static/images/mini_game/ludo_world_bg.jpg",
      category: "Mini Game",
      tag: "Mini Games",
      description: "Classical Ludo game with modern twists. Play with friends!",
      featuredBackgroundUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWZibXB4bmZzZ3R5enpndnpndnpndnpndnpndnpndnpndnpndnpndnpndnp/xT9IgzoKnwFNmIsCi4/giphy.gif",
      playUrl: "https://game.neon-nexus.com/ludo",
      packages: [
        { id: "ludo-50", gameId: "ludo-world", name: "50 Tokens", price: 0.99 },
        { id: "ludo-250", gameId: "ludo-world", name: "250 Tokens", price: 4.99, popular: true }
      ]
    },
    {
      id: "ludo-king",
      name: "LUDO KING",
      coverImage: "https://play-lh.googleusercontent.com/CHZ-3Z9r8r-r-r-r-r-r-r-r-r-r-r-r", 
      bannerImage: "https://midasbuy.akamaized.net/static/images/mini_game/ludo_king_bg.jpg",
      category: "Mini Game",
      tag: "Mini Games",
      description: "The #1 Ludo game on mobile. Join millions of players worldwide!",
      featuredBackgroundUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWZibXB4bmZzZ3R5enpndnpndnpndnpndnpndnpndnpndnpndnpndnpndnp/3o7TKVUn7iM8FMEU24/giphy.gif",
      playUrl: "https://game.neon-nexus.com/ludo-king",
      packages: [
        { id: "lk-100", gameId: "ludo-king", name: "100 Gems", price: 0.99 },
        { id: "lk-500", gameId: "ludo-king", name: "500 Gems", price: 4.99, popular: true }
      ]
    },
    {
      id: "eight-ball-pool",
      name: "8 BALL POOL",
      coverImage: "https://play-lh.googleusercontent.com/9-7-r-r-r-r-r-r-r-r-r-r-r-r-r-r",
      bannerImage: "https://midasbuy.akamaized.net/static/images/mini_game/8ball_pool_bg.jpg",
      category: "Mini Game",
      tag: "Mini Games",
      description: "The world's #1 pool game! Challenge friends or play in tournaments.",
      featuredBackgroundUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWZibXB4bmZzZ3R5enpndnpndnpndnpndnpndnpndnpndnpndnpndnpndnp/l41lTfhuXbY0S6Y7S/giphy.gif",
      playUrl: "https://game.neon-nexus.com/8ball",
      packages: [
        { id: "8bp-100", gameId: "eight-ball-pool", name: "100 Cash", price: 1.99 },
        { id: "8bp-500", gameId: "eight-ball-pool", name: "500 Cash", price: 8.99, popular: true }
      ]
    },
    {
      id: "candy-match",
      name: "CANDY MATCH 3",
      coverImage: "https://play-lh.googleusercontent.com/9-7-r-r-r-r-r-r-r-r-r-r-r-r-r-r",
      bannerImage: "https://midasbuy.akamaized.net/static/images/mini_game/candy_match_bg.jpg",
      category: "Mini Game",
      tag: "Mini Games",
      description: "Sweetest puzzle game ever! Match candies to clear levels.",
      featuredBackgroundUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWZibXB4bmZzZ3R5enpndnpndnpndnpndnpndnpndnpndnpndnpndnpndnp/3o7TKD8f6Tf5E9O_fG/giphy.gif",
      playUrl: "https://game.neon-nexus.com/candy",
      packages: [
        { id: "cm-10", gameId: "candy-match", name: "10 Boosters", price: 0.99 },
        { id: "cm-50", gameId: "candy-match", name: "50 Boosters", price: 3.99, popular: true }
      ]
    }
  ],
  flashDeals: [
    {
      id: "flash-valorant",
      gameId: "valorant",
      title: "Valorant",
      offerTitle: "2000 VP + 500 Bonus",
      bonusText: "60% OFF OVERRIDE",
      originalPrice: 24.99,
      discountedPrice: 9.99,
      stockStatus: 85,
      limitedQuantity: "Only 40 Left",
      backgroundMedia: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWZibXB4bmZzZ3R5enpndnpndnpndnpndnpndnpndnpndnpndnpndnpndnp/v1/giphy.gif",
      endsAt: "DAILY_RESET"
    }
  ],
  liveDrops: [
    {
      id: "drop-ff",
      gameId: "free-fire",
      name: "Free Fire",
      description: "1080 Diamonds + Elite Pass",
      image: "https://cdn2.steamgriddb.com/hero/freefire.jpg",
      badge: "Limited"
    },
    {
      id: "drop-roblox",
      gameId: "roblox",
      name: "Roblox",
      description: "4500 Robux Premium Pack",
      image: "https://cdn2.steamgriddb.com/hero/roblox.jpg",
      badge: "Almost Gone"
    },
    {
      id: "drop-mlbb",
      gameId: "mobile-legends",
      name: "Mobile Legends",
      description: "Starlight Member + 3000 Diamonds",
      image: "https://cdn2.steamgriddb.com/hero/mlbb.jpg",
      badge: "Restocked"
    }
  ]
};

let dbCache: Database | null = null;

export function resetDbCache() {
  dbCache = null;
}

export async function readDb(): Promise<Database> {
  if (dbCache) return dbCache;
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data) as Database;
    // If the stored db has no games or payment methods, seed from DEFAULT_DB
    let needsUpdate = false;
    if (!parsed.games || parsed.games.length === 0) {
      parsed.games = DEFAULT_DB.games;
      needsUpdate = true;
    }
    if (!parsed.paymentMethods || parsed.paymentMethods.length === 0) {
      parsed.paymentMethods = DEFAULT_DB.paymentMethods;
      needsUpdate = true;
    }
    if (!parsed.flashDeals || parsed.flashDeals.length === 0) {
      parsed.flashDeals = DEFAULT_DB.flashDeals;
      needsUpdate = true;
    }
    if (!parsed.liveDrops || parsed.liveDrops.length === 0) {
      parsed.liveDrops = DEFAULT_DB.liveDrops;
      needsUpdate = true;
    }
    if (needsUpdate) {
      await fs.writeFile(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    dbCache = parsed;
    return dbCache;
  } catch {
    dbCache = { ...DEFAULT_DB };
    await writeDb(dbCache);
    return dbCache;
  }
}

export async function writeDb(db: Database): Promise<void> {
  dbCache = db;
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}
