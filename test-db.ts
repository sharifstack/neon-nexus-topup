import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectToDatabase from './lib/mongodb';
import Order from './models/Order';
import Game from './models/Game';

async function main() {
  await connectToDatabase();
  const orders = await Order.find({}).populate('gameId').lean();
  console.log(JSON.stringify(orders, null, 2));
  process.exit(0);
}
main();
