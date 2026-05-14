import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Verify JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback');
    } catch (err) {
      return NextResponse.json({ error: 'Token expired or invalid' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'User already verified' }, { status: 200 });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save();

    console.log(`[VERIFY] Account activated for: ${user.email}`);

    return NextResponse.json({ message: 'Account activated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('[VERIFY ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
