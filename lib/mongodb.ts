import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, mongoServer: null };
}

async function connectToDatabase() {
  let MONGODB_URI = process.env.MONGODB_URI;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout faster in dev if local DB is down
    };

    const connectWithUri = async (uri: string) => {
      console.log(`[DB] Connecting to MongoDB at ${uri.split('@').pop()}...`);
      return mongoose.connect(uri, opts);
    };

    cached.promise = (async () => {
      try {
        if (!MONGODB_URI) {
          throw new Error('MONGODB_URI is missing');
        }
        
        const conn = await connectWithUri(MONGODB_URI);
        console.log('[DB] Connected successfully to provided URI');
        return conn;
      } catch (error: any) {
        // If local connection fails in development, try starting an in-memory server
        if (process.env.NODE_ENV === 'development' && (error.message.includes('ECONNREFUSED') || error.message.includes('ServerSelectionError'))) {
          console.warn('[DB] Local MongoDB connection failed. Attempting to start In-Memory MongoDB Server...');
          
          try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            if (!cached.mongoServer) {
              cached.mongoServer = await MongoMemoryServer.create();
            }
            const memoryUri = cached.mongoServer.getUri();
            console.log('[DB] Using In-Memory MongoDB Server:', memoryUri);
            
            const conn = await connectWithUri(memoryUri);
            console.log('[DB] Connected successfully to In-Memory MongoDB');
            return conn;
          } catch (memErr: any) {
            console.error('[DB] Failed to start In-Memory MongoDB Server:', memErr.message);
            throw error; // Throw the original error if fallback also fails
          }
        }
        
        console.error('[DB] Connection error:', error.message);
        throw error;
      }
    })().then(async (mongooseInstance) => {
      // Seed data once per connection in dev/first-time
      try {
        const { seedDatabaseIfNeeded } = await import('./db-init');
        await seedDatabaseIfNeeded();
      } catch (seedErr) {
        console.error('[DB] Seeding failed:', seedErr);
      }
      
      return mongooseInstance;
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
