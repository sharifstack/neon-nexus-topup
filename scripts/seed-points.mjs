/**
 * Run this script to seed the Points Store rewards:
 *   node scripts/seed-points.mjs
 *
 * Requires MONGODB_URI in .env.local
 */
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not found in .env.local');
  process.exit(1);
}

const PointsRewardSchema = new mongoose.Schema({
  title:           String,
  description:     { type: String, default: '' },
  category:        String,
  pointsCost:      Number,
  rewardValue:     String,
  image:           String,
  isActive:        { type: Boolean, default: true },
  stock:           { type: Number, default: null },
  totalRedeemed:   { type: Number, default: 0 },
  displayPriority: { type: Number, default: 0 },
  isFeatured:      { type: Boolean, default: false },
  badgeLabel:      String,
  game:            String,
}, { timestamps: true });

const PointsReward = mongoose.models.PointsReward || mongoose.model('PointsReward', PointsRewardSchema);

const REWARDS = [
  { title: '60 UC',            category: 'uc',       pointsCost: 50000,  rewardValue: '60 UC',        isFeatured: false, displayPriority: 10, badgeLabel: 'STARTER', game: 'PUBG Mobile',    description: 'Get 60 UC for PUBG Mobile.' },
  { title: '100 UC',           category: 'uc',       pointsCost: 80000,  rewardValue: '100 UC',       isFeatured: true,  displayPriority: 20, badgeLabel: 'POPULAR', game: 'PUBG Mobile',    description: 'Get 100 UC for PUBG Mobile. Perfect for a few items.' },
  { title: '300 UC',           category: 'uc',       pointsCost: 200000, rewardValue: '300 UC',       isFeatured: false, displayPriority: 15, badgeLabel: null,      game: 'PUBG Mobile',    description: 'Get 300 UC for PUBG Mobile.' },
  { title: '600 UC',           category: 'uc',       pointsCost: 380000, rewardValue: '600 UC',       isFeatured: false, displayPriority: 12, badgeLabel: 'VALUE',   game: 'PUBG Mobile',    description: 'Get 600 UC for PUBG Mobile — great value bundle.' },
  { title: '100 Diamonds',     category: 'diamonds', pointsCost: 60000,  rewardValue: '100 Diamonds', isFeatured: false, displayPriority: 10, badgeLabel: 'STARTER', game: 'Free Fire',      description: 'Get 100 Free Fire Diamonds.' },
  { title: '300 Diamonds',     category: 'diamonds', pointsCost: 160000, rewardValue: '300 Diamonds', isFeatured: true,  displayPriority: 20, badgeLabel: 'HOT',     game: 'Free Fire',      description: 'Get 300 Free Fire Diamonds. Enough for a bundle.' },
  { title: '520 Diamonds',     category: 'diamonds', pointsCost: 280000, rewardValue: '520 Diamonds', isFeatured: false, displayPriority: 15, badgeLabel: null,      game: 'Free Fire',      description: 'Get 520 Free Fire Diamonds.' },
  { title: '100 ML Diamonds',  category: 'diamonds', pointsCost: 65000,  rewardValue: '100 Diamonds', isFeatured: false, displayPriority: 10, badgeLabel: null,      game: 'Mobile Legends', description: 'Get 100 Mobile Legends Diamonds.' },
  { title: '300 ML Diamonds',  category: 'diamonds', pointsCost: 180000, rewardValue: '300 Diamonds', isFeatured: false, displayPriority: 12, badgeLabel: 'VALUE',   game: 'Mobile Legends', description: 'Get 300 Mobile Legends Diamonds.' },
  { title: 'Elite Pass',       category: 'passes',   pointsCost: 250000, rewardValue: 'Elite Pass',   isFeatured: true,  displayPriority: 30, badgeLabel: 'LIMITED', game: 'Free Fire',      description: 'Full Free Fire Elite Pass. Unlock exclusive seasonal rewards.' },
  { title: 'Royale Pass M1',   category: 'passes',   pointsCost: 320000, rewardValue: 'Royale Pass',  isFeatured: false, displayPriority: 25, badgeLabel: 'NEW',     game: 'PUBG Mobile',    description: 'PUBG Mobile Royale Pass Monthly.' },
  { title: 'MLBB Battle Pass', category: 'passes',   pointsCost: 180000, rewardValue: 'Battle Pass',  isFeatured: false, displayPriority: 20, badgeLabel: null,      game: 'Mobile Legends', description: 'Mobile Legends Season Battle Pass.' },
  { title: 'Random Rare Skin', category: 'skins',    pointsCost: 150000, rewardValue: 'Rare Skin',    isFeatured: false, displayPriority: 15, badgeLabel: 'CHANCE',  game: 'Any',            description: 'Receive a random Rare skin credit.' },
  { title: 'Random Epic Skin', category: 'skins',    pointsCost: 400000, rewardValue: 'Epic Skin',    isFeatured: true,  displayPriority: 25, badgeLabel: 'HOT',     game: 'Any',            description: 'Receive a random Epic skin credit.' },
  { title: 'PUBG Legendary Crate', category: 'skins', pointsCost: 500000, rewardValue: 'Legendary Crate', isFeatured: false, displayPriority: 20, badgeLabel: 'RARE', game: 'PUBG Mobile', description: 'Open a Legendary Crate in PUBG Mobile.' },
  { title: '$2 Game Voucher',  category: 'vouchers', pointsCost: 100000, rewardValue: '$2 Voucher',   isFeatured: false, displayPriority: 10, badgeLabel: null,      game: 'Any',            description: 'A $2 voucher for your next top-up.' },
  { title: '$5 Game Voucher',  category: 'vouchers', pointsCost: 220000, rewardValue: '$5 Voucher',   isFeatured: true,  displayPriority: 20, badgeLabel: 'POPULAR', game: 'Any',            description: 'A $5 voucher for any game top-up. Save big!' },
  { title: '$10 Game Voucher', category: 'vouchers', pointsCost: 400000, rewardValue: '$10 Voucher',  isFeatured: false, displayPriority: 15, badgeLabel: 'VALUE',   game: 'Any',            description: 'A $10 voucher redeemable on any purchase.' },
  { title: '500 CoC Gold',     category: 'coins',    pointsCost: 70000,  rewardValue: '500 Gold',     isFeatured: false, displayPriority: 10, badgeLabel: null,      game: 'Clash of Clans', description: 'Add 500 Gold to your Clash of Clans village.' },
  { title: '1000 CoC Gems',    category: 'coins',    pointsCost: 200000, rewardValue: '1000 Gems',    isFeatured: true,  displayPriority: 20, badgeLabel: 'HOT',     game: 'Clash of Clans', description: 'Get 1,000 CoC Gems to speed up progress.' },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await PointsReward.countDocuments();
  if (existing > 0) {
    console.log(`ℹ️  ${existing} rewards already exist. Skipping seed.`);
    console.log('   To re-seed, run: await PointsReward.deleteMany({}) in MongoDB first.');
    await mongoose.disconnect();
    return;
  }

  const result = await PointsReward.insertMany(REWARDS);
  console.log(`✅ Seeded ${result.length} points store rewards`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
