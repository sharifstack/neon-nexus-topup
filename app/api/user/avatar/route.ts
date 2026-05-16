import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { getSessionUser } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: Request) {
  let currentUser: any = null;
  try {
    currentUser = await getSessionUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 });
    }

    // Validate size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const avatarUrl = await uploadImage(buffer, 'neon-nexus-avatars');

    await connectToDatabase();
    await User.findByIdAndUpdate(currentUser._id, { avatar: avatarUrl });

    return NextResponse.json({ url: avatarUrl, success: true });
  } catch (error: any) {
    console.error('[AVATAR UPLOAD]', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
