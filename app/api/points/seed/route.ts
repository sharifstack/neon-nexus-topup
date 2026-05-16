import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PointsReward from '@/models/PointsReward';
import { ensureAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const SEED_REWARDS = [
  // UC Rewards
  { title: '60 UC',      category: 'uc',       pointsCost: 50000,   rewardValue: '60 UC',         isFeatured: false, displayPriority: 10, badgeLabel: 'STARTER', game: 'PUBG Mobile',     description: 'Get 60 UC for PUBG Mobile. Delivered to your account instantly.' },
  { title: '100 UC',     category: 'uc',       pointsCost: 80000,   rewardValue: '100 UC',        isFeatured: true,  displayPriority: 20, badgeLabel: 'POPULAR', game: 'PUBG Mobile',     description: 'Get 100 UC for PUBG Mobile. Perfect for buying a few items.' },
  { title: '300 UC',     category: 'uc',       pointsCost: 200000,  rewardValue: '300 UC',        isFeatured: false, displayPriority: 15, badgeLabel: null,      game: 'PUBG Mobile',     description: 'Get 300 UC for PUBG Mobile.' },
  { title: '600 UC',     category: 'uc',       pointsCost: 380000,  rewardValue: '600 UC',        isFeatured: false, displayPriority: 12, badgeLabel: 'VALUE',   game: 'PUBG Mobile',     description: 'Get 600 UC for PUBG Mobile — great value bundle.' },

  // Diamond Rewards
  { title: '100 Diamonds',  category: 'diamonds', pointsCost: 60000,   rewardValue: '100 Diamonds',  isFeatured: false, displayPriority: 10, badgeLabel: 'STARTER', game: 'Free Fire',       description: 'Get 100 Free Fire Diamonds. Credited instantly.' },
  { title: '300 Diamonds',  category: 'diamonds', pointsCost: 160000,  rewardValue: '300 Diamonds',  isFeatured: true,  displayPriority: 20, badgeLabel: 'HOT',     game: 'Free Fire',       description: 'Get 300 Free Fire Diamonds. Enough for a bundle.' },
  { title: '520 Diamonds',  category: 'diamonds', pointsCost: 280000,  rewardValue: '520 Diamonds',  isFeatured: false, displayPriority: 15, badgeLabel: null,      game: 'Free Fire',       description: 'Get 520 Free Fire Diamonds.' },
  { title: '100 ML Diamonds', category: 'diamonds', pointsCost: 65000, rewardValue: '100 Diamonds', isFeatured: false, displayPriority: 10, badgeLabel: null,     game: 'Mobile Legends',  description: 'Get 100 Mobile Legends Diamonds.' },
  { title: '300 ML Diamonds', category: 'diamonds', pointsCost: 180000, rewardValue: '300 Diamonds', isFeatured: false, displayPriority: 12, badgeLabel: 'VALUE',  game: 'Mobile Legends',  description: 'Get 300 Mobile Legends Diamonds — great for Magic Chests.' },

  // Passes
  { title: 'Elite Pass',       category: 'passes',   pointsCost: 250000,  rewardValue: 'Elite Pass',      isFeatured: true,  displayPriority: 30, badgeLabel: 'LIMITED', game: 'Free Fire',       description: 'Full Free Fire Elite Pass. Unlock exclusive seasonal rewards.' },
  { title: 'Royale Pass M1',   category: 'passes',   pointsCost: 320000,  rewardValue: 'Royale Pass M1',  isFeatured: false, displayPriority: 25, badgeLabel: 'NEW',     game: 'PUBG Mobile',     description: 'PUBG Mobile Royale Pass Monthly. Unlock exclusive outfits & items.' },
  { title: 'MLBB Battle Pass', category: 'passes',   pointsCost: 180000,  rewardValue: 'Battle Pass',     isFeatured: false, displayPriority: 20, badgeLabel: null,      game: 'Mobile Legends',  description: 'Mobile Legends Bang Bang Season Battle Pass.' },

  // Skins
  { title: 'Random Rare Skin',      category: 'skins',    pointsCost: 150000,  rewardValue: 'Rare Skin',         isFeatured: false, displayPriority: 15, badgeLabel: 'CHANCE', game: 'Any',             description: 'Receive a random Rare skin spin credit for your game of choice.' },
  { title: 'Random Epic Skin',      category: 'skins',    pointsCost: 400000,  rewardValue: 'Epic Skin',         isFeatured: true,  displayPriority: 25, badgeLabel: 'HOT',    game: 'Any',             description: 'Receive a random Epic skin credit. Exclusive drop!' },
  { title: 'PUBG Legendary Crate',  category: 'skins',    pointsCost: 500000,  rewardValue: 'Legendary Crate',   isFeatured: false, displayPriority: 20, badgeLabel: 'RARE',   game: 'PUBG Mobile',     description: 'Open a Legendary Crate in PUBG Mobile for a chance at a Legendary outfit.' },

  // Vouchers
  { title: '$2 Game Voucher',   category: 'vouchers',  pointsCost: 100000,  rewardValue: '$2 Voucher',    isFeatured: false, displayPriority: 10, badgeLabel: null,      game: 'Any',             description: 'A $2 voucher redeemable on your next top-up purchase.' },
  { title: '$5 Game Voucher',   category: 'vouchers',  pointsCost: 220000,  rewardValue: '$5 Voucher',    isFeatured: true,  displayPriority: 20, badgeLabel: 'POPULAR', game: 'Any',             description: 'A $5 voucher redeemable on any game top-up. Save big!' },
  { title: '$10 Game Voucher',  category: 'vouchers',  pointsCost: 400000,  rewardValue: '$10 Voucher',   isFeatured: false, displayPriority: 15, badgeLabel: 'VALUE',   game: 'Any',             description: 'A $10 voucher redeemable on your next purchase.' },

  // Coins
  { title: '500 Clash Coins',  category: 'coins',  pointsCost: 70000,   rewardValue: '500 Gold',     isFeatured: false, displayPriority: 10, badgeLabel: null,    game: 'Clash of Clans',  description: 'Add 500 Gold to your Clash of Clans village.' },
  { title: '1000 COC Gems',    category: 'coins',  pointsCost: 200000,  rewardValue: '1000 Gems',    isFeatured: true,  displayPriority: 20, badgeLabel: 'HOT',   game: 'Clash of Clans',  description: 'Get 1,000 Clash of Clans Gems to speed up your progress.' },
];

// POST /api/points/seed — admin only seed
export async function POST(req: NextRequest) {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const existing = await PointsReward.countDocuments();
    if (existing > 0) {
      return NextResponse.json({ message: `Already seeded (${existing} rewards exist). Delete them first to re-seed.` });
    }

    const rewards = await PointsReward.insertMany(SEED_REWARDS);
    return NextResponse.json({ success: true, count: rewards.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
