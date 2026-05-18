import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectToDatabase from './lib/mongodb';
import Order from './models/Order';
import Game from './models/Game';

async function main() {
  await connectToDatabase();
  console.log('Connected to DB');

  const orders = await Order.find({});
  const games = await Game.find({});

  let updatedCount = 0;

  for (const order of orders) {
    let needsUpdate = false;
    let extractedGameName = '';
    
    // Check if gameId is the placeholder or missing
    if (!order.gameId || order.gameId.toString() === '000000000000000000000000') {
      // packageName format: "Game Name — Package Name | Player: 123"
      // or "Neon Nexus Top Up"
      const parts = order.packageName.split('—');
      if (parts.length > 1) {
        extractedGameName = parts[0].trim();
      } else {
        extractedGameName = order.packageName.trim();
      }

      // Try to find matching game
      if (extractedGameName) {
        const game = games.find(g => 
          g.name.toLowerCase() === extractedGameName.toLowerCase() || 
          g.slug === extractedGameName.toLowerCase().replace(/\s+/g, '-')
        );

        if (game) {
          order.gameId = game._id;
          
          // Try to clean up packageName by removing the Game Name prefix
          if (parts.length > 1) {
            order.packageName = parts.slice(1).join('—').trim();
          }
          
          needsUpdate = true;
          console.log(`Matched Order ${order._id} to Game: ${game.name}`);
        } else {
          console.log(`Could not find game for: "${extractedGameName}"`);
        }
      }
    }

    if (needsUpdate) {
      await order.save();
      updatedCount++;
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} orders.`);
  process.exit(0);
}

main().catch(console.error);
