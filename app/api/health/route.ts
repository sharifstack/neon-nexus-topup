import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    console.log('[PING] Checking MongoDB connection...');
    await connectToDatabase();
    
    const dbState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    return NextResponse.json({
      status: 'healthy',
      database: states[dbState],
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongodb_configured: !!process.env.MONGODB_URI
    });
  } catch (error: any) {
    console.error('[PING ERROR]', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      mongodb_configured: !!process.env.MONGODB_URI
    }, { status: 500 });
  }
}
