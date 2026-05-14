import mongoose from 'mongoose';
import User from '@/models/User';
import Game from '@/models/Game';
import FlashDeal from '@/models/FlashDeal';
import Settings from '@/models/Settings';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export async function seedDatabaseIfNeeded() {
  const adminEmail = "sharifstack@gmail.com";
  const adminPassword = "sharif123@@";
  
  const existingAdmin = await User.findOne({ email: adminEmail });
  const hash = await bcrypt.hash(adminPassword, 10);

  if (!existingAdmin) {
    console.log('[DB] Seeding Admin User...');
    await User.create({
      name: "Sharif Admin",
      email: adminEmail,
      passwordHash: hash,
      points: 999999,
      role: "admin",
      isVerified: true
    });
  } else {
    // Ensure the password is correct for the admin
    existingAdmin.passwordHash = hash;
    existingAdmin.role = 'admin';
    existingAdmin.isVerified = true;
    await existingAdmin.save();
  }

  console.log('[DB] Synchronizing database content from data.json...');

  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // 1. Sync Users (other than admin)
    for (const u of data.users) {
      if (u.email === adminEmail) continue;
      const userExists = await User.findOne({ email: u.email });
      if (!userExists) {
        await User.create({
          name: u.name,
          email: u.email,
          passwordHash: u.passwordHash,
          points: u.points || 0,
          role: u.role || 'user',
          isVerified: u.isVerified || false,
          avatar: u.avatar,
          twoFactorEnabled: u.twoFactorEnabled || false,
        });
      }
    }

    // 2. Sync Games (UPSERT - Restoring missing games)
    const flashDealGameIds = data.flashDeals.map((f: any) => f.gameId);

    for (const g of data.games) {
      // Use original ID as slug for consistency with old routes
      const gameSlug = g.id || g.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
      
      const gameData = {
        name: g.name,
        slug: gameSlug,
        coverImage: g.coverImage,
        bannerImage: g.bannerImage,
        featuredBackgroundUrl: g.featuredBackgroundUrl,
        tag: g.tag,
        tagColor: g.tagColor || 'bonus',
        category: g.category,
        type: g.category === 'Mini Game' ? 'minigame' : 'game',
        isMiniGame: g.category === 'Mini Game',
        isFlashDeal: flashDealGameIds.includes(g.id),
        currency: g.currency || 'UC',
        description: g.description,
        requiresZoneId: g.requiresZoneId || false,
        playUrl: g.playUrl,
        isFeatured: g.isFeatured || g.isFeaturedMiniGame || false,
        isActive: true,
        packages: g.packages.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          bonus: p.bonus,
          popular: p.popular || false,
          bestSeller: p.bestSeller || false
        }))
      };

      // Find by slug and update, or create if not exists
      await Game.findOneAndUpdate(
        { slug: gameSlug },
        { $set: gameData },
        { upsert: true, new: true }
      );
    }

    // 3. Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({});
    }

    console.log(`[DB] Synchronization completed. Restored/Synced ${data.games.length} games.`);
  } catch (err: any) {
    console.error('[DB] Synchronization failed:', err.message);
  }
}
