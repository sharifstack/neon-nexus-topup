import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function purgeLegacyMedia() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for purging legacy media...");

    // Dynamically load models
    const FlashDeal = mongoose.models.FlashDeal || mongoose.model('FlashDeal', new mongoose.Schema({}, { strict: false }));
    const LiveDrop = mongoose.models.LiveDrop || mongoose.model('LiveDrop', new mongoose.Schema({}, { strict: false }));

    // Unset backgroundMedia from all FlashDeals
    const flashRes = await FlashDeal.updateMany(
      { backgroundMedia: { $exists: true, $ne: "" } },
      { $unset: { backgroundMedia: "" } }
    );
    console.log(`Unset backgroundMedia from ${flashRes.modifiedCount} FlashDeals`);

    // Unset image from all LiveDrops
    const dropRes = await LiveDrop.updateMany(
      { image: { $exists: true, $ne: "" } },
      { $unset: { image: "" } }
    );
    console.log(`Unset image from ${dropRes.modifiedCount} LiveDrops`);

    console.log("Legacy media purged successfully.");
  } catch (error) {
    console.error("Purge error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

purgeLegacyMedia();
