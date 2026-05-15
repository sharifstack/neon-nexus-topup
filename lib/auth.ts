import { cookies } from 'next/headers';
import connectToDatabase from './mongodb';
import User from '@/models/User';
import Session from '@/models/Session';
import { randomBytes } from 'crypto';

export async function getSessionUser() {
  try {
    await connectToDatabase();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    
    if (!sessionId) return null;
    
    const session = await Session.findOne({ id: sessionId });
    
    if (!session) return null;
    
    if (session.expiresAt < new Date()) {
      // Session expired
      await Session.deleteOne({ id: sessionId });
      return null;
    }
    
    const user = await User.findById(session.userId);
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (error) {
    console.error('[AUTH] Failed to get session user:', error);
    return null;
  }
}

export async function createSession(userId: string) {
  await connectToDatabase();
  const sessionId = randomBytes(32).toString('hex');
  
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  await Session.create({
    id: sessionId,
    userId,
    expiresAt
  });
  
  const cookieStore = await cookies();
  cookieStore.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt
  });
}

export async function destroySession() {
  await connectToDatabase();
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  
  if (sessionId) {
    await Session.deleteOne({ id: sessionId });
  }
  
  cookieStore.delete('session_id');
}

export async function ensureAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}


