import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/neonnexus';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    // Optional: Re-run seed check if needed, but usually once per server start is fine
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail fast if no local DB
    };

    console.log(`[DB] Attempting to connect to: ${MONGODB_URI}`);

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then(async (mongoose) => {
        console.log('[DB] Connected to MongoDB');
        const { seedDatabaseIfNeeded } = await import('./db-init');
        await seedDatabaseIfNeeded();
        return mongoose;
      })
      .catch(async (err) => {
        console.warn('[DB] Connection failed. Starting in-memory fallback...');
        console.error(`[DB] Error: ${err.message}`);
        
        // Fallback to in-memory server for development if local DB is missing
        try {
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          const mongoServer = await MongoMemoryServer.create();
          const uri = mongoServer.getUri();
          
          console.log(`[DB] In-memory MongoDB started at: ${uri}`);
          const conn = await mongoose.connect(uri, opts);
          const { seedDatabaseIfNeeded } = await import('./db-init');
          await seedDatabaseIfNeeded();
          return conn;
        } catch (memErr: any) {

          console.error('[DB] Memory server failed to start:', memErr.message);
          throw err; // Throw original error if fallback fails
        }
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;

