import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'neon-nexus';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('[UPLOAD] Cloudinary is not configured in .env.local');
      return NextResponse.json({ error: 'Cloudinary is not configured. Please add CLOUDINARY credentials to .env.local' }, { status: 500 });
    }

    const secureUrl = await uploadImage(buffer, folder);
    return NextResponse.json({ url: secureUrl });
  } catch (error: any) {
    console.error('[UPLOAD] Image upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image to Cloudinary' }, { status: 500 });
  }
}
