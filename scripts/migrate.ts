import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import User from '../models/User';
import Game from '../models/Game';
import FlashDeal from '../models/FlashDeal';
import Settings from '../models/Settings';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neonnexus';

async function migrate() {
  try {
    console.log('[MIGRATE] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('[MIGRATE] Connected.');

    const dataPath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // 1. Migrate Users
    console.log('[MIGRATE] Migrating Users...');
    await User.deleteMany({});
    const userMap: Record<string, any> = {};
    for (const u of data.users) {
      const newUser = await User.create({
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        points: u.points || 0,
        role: u.role || 'user',
        isVerified: u.isVerified || false,
        avatar: u.avatar,
        twoFactorEnabled: u.twoFactorEnabled || false,
      });
      userMap[u.id] = newUser._id;
    }
    console.log(`[MIGRATE] Migrated ${data.users.length} users.`);

    // 2. Migrate Games
    console.log('[MIGRATE] Migrating Games...');
    await Game.deleteMany({});
    const gameMap: Record<string, any> = {};
    for (const g of data.games) {
      const newGame = await Game.create({
        name: g.name,
        coverImage: g.coverImage,
        bannerImage: g.bannerImage,
        tag: g.tag,
        tagColor: g.tagColor,
        category: g.category,
        currency: g.currency,
        description: g.description,
        requiresZoneId: g.requiresZoneId || false,
        playUrl: g.playUrl,
        isFeaturedMiniGame: g.isFeaturedMiniGame || false,
        featuredBackgroundUrl: g.featuredBackgroundUrl,
        packages: g.packages.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          bonus: p.bonus,
          popular: p.popular || false,
        })),
        stock: 100,
        isActive: true,
      });
      gameMap[g.id] = newGame._id;
    }
    console.log(`[MIGRATE] Migrated ${data.games.length} games.`);

    // 3. Migrate Flash Deals
    console.log('[MIGRATE] Migrating Flash Deals...');
    await FlashDeal.deleteMany({});
    for (const fd of data.flashDeals) {
      if (gameMap[fd.gameId]) {
        await FlashDeal.create({
          gameId: gameMap[fd.gameId],
          title: fd.title,
          offerTitle: fd.offerTitle,
          bonusText: fd.bonusText,
          originalPrice: fd.originalPrice,
          discountedPrice: fd.discountedPrice,
          stockStatus: fd.stockStatus,
          limitedQuantity: fd.limitedQuantity,
          backgroundMedia: fd.backgroundMedia,
          endsAt: fd.endsAt, // "DAILY_RESET" is handled by mixed type
        });
      }
    }
    console.log(`[MIGRATE] Migrated ${data.flashDeals.length} flash deals.`);

    // 4. Create Default Settings
    console.log('[MIGRATE] Creating default settings...');
    await Settings.deleteMany({});
    await Settings.create({});
    console.log('[MIGRATE] Default settings created.');

    console.log('[MIGRATE] Success! Migration completed.');
    process.exit(0);
  } catch (error) {
    console.error('[MIGRATE] Error during migration:', error);
    process.exit(1);
  }
}

migrate();
