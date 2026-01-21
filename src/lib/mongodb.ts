import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efatura';

if (!MONGODB_URI) {
  throw new Error('Lütfen MONGODB_URI ortam değişkenini tanımlayın');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Auto-fix for Coolify MongoDB auth issue
    let uri = MONGODB_URI;

    // Check if the URI already has a database name. 
    // A simple way is to check the part after the last slash but before query params.
    const urlWithoutQuery = uri.split('?')[0];
    const hasDbName = urlWithoutQuery.split('/').length > 3 && urlWithoutQuery.split('/')[3].length > 0;

    if (!hasDbName) {
      // If no DB name, assume 'accounting'
      const queryPart = uri.includes('?') ? '?' + uri.split('?')[1] : '';
      uri = `${urlWithoutQuery}/accounting${queryPart}`;
    }

    // Check if authSource is missing
    if (!uri.includes('authSource=')) {
      const separator = uri.includes('?') ? '&' : '?';
      uri = `${uri}${separator}authSource=admin`;
    }

    console.log('Using MongoDB URI:', uri.replace(/:([^:@]+)@/, ':****@'));

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
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

export default connectDB;
