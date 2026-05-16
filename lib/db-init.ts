import mongoose from 'mongoose';
import User from '@/models/User';
import Game from '@/models/Game';
import FlashDeal from '@/models/FlashDeal';
import Settings from '@/models/Settings';
import LiveDrop from '@/models/LiveDrop';
import HeroBanner from '@/models/HeroBanner';
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
    for (const u of data.users || []) {
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

    // 2. Sync Games
    const flashDealGameIds = (data.flashDeals || []).map((f: any) => f.gameId);

    for (const g of data.games || []) {
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

      await Game.findOneAndUpdate(
        { slug: gameSlug },
        { $set: gameData },
        { upsert: true, new: true }
      );
    }

    // 3. Sync Flash Deals
    for (const fd of data.flashDeals || []) {
      await FlashDeal.findOneAndUpdate(
        { gameId: fd.gameId },
        { $set: { ...fd, isActive: true } },
        { upsert: true }
      );
    }

    // 4. Sync Live Drops
    for (const ld of data.liveDrops || []) {
      await LiveDrop.findOneAndUpdate(
        { gameId: ld.gameId },
        { $set: { ...ld, isActive: true } },
        { upsert: true }
      );
    }

    // 5. Initial Hero Banners (Fallback from old code)
    const bannerCount = await HeroBanner.countDocuments();
    if (bannerCount === 0) {
      await HeroBanner.insertMany([
        {
          accentColor: "#1a6df0",
          gradient: "from-[#1a6df0] to-[#0d3fa8]",
          imageUrl: "https://cdn2.steamgriddb.com/hero_thumb/033522d9bdf796d13c4b594cbdf03184.jpg",
          badge: "PUBG MOBILE",
          title: "Season Pass Direct Purchase!",
          subtitle: "Top up Delta Coins for up to 35% bonus!",
          ctaText: "GO",
          href: "/marketplace/pubg-mobile",
          displayOrder: 1,
          isActive: true
        },
        {
          accentColor: "#7c3aed",
          gradient: "from-[#7c3aed] to-[#4c1d95]",
          imageUrl: "https://cdn2.steamgriddb.com/hero_thumb/714aeac233808ffb2b01e3910edff2bc.jpg",
          badge: "GENSHIN IMPACT",
          title: "Genesis Crystal Special Offer!",
          subtitle: "Get up to 25% extra crystals this week.",
          ctaText: "TOP UP",
          href: "/marketplace/genshin-impact",
          displayOrder: 2,
          isActive: true
        },
        {
          accentColor: "#dc2626",
          gradient: "from-[#dc2626] to-[#7f1d1d]",
          imageUrl: "https://cdn2.steamgriddb.com/hero_thumb/6b68046389020611bcec0f52271e28b6.jpg",
          badge: "MOBILE LEGENDS",
          title: "Diamond Boost Active!",
          subtitle: "Limited time: Extra 20% Diamonds on top-ups.",
          ctaText: "GET NOW",
          href: "/marketplace/mobile-legends",
          displayOrder: 3,
          isActive: true
        }
      ]);
    }

    // 6. Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({});
    }

    console.log(`[DB] Synchronization completed.`);
  } catch (err: any) {
    console.error('[DB] Synchronization failed:', err.message);
  }
}
