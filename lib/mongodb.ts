import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('[DB] MONGODB_URI is missing!');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('[DB] Connecting to MongoDB...');

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongoose) => {
      console.log('[DB] Connected successfully');
      
      // Seed data once per connection in dev/first-time
      try {
        const { seedDatabaseIfNeeded } = await import('./db-init');
        await seedDatabaseIfNeeded();
      } catch (seedErr) {
        console.error('[DB] Seeding failed:', seedErr);
      }
      
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('[DB] Connection error:', e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
