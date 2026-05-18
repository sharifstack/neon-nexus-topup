import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { ensureAdmin } from '@/lib/auth';

// Helper to get or create settings
async function getSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

export async function GET(request: Request, context: { params: Promise<{ category?: string[] }> }) {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const settings = await getSettings();
    const { category } = await context.params;

    // If a specific category is requested, return just that category
    if (category && category.length > 0) {
      const cat = category[0];
      const data = settings.get(cat);
      if (data !== undefined) {
        return NextResponse.json({ [cat]: data });
      }
      // If it's not a nested object but a direct field group (like 'general')
      // we can return the whole settings to the client and let the client filter
      return NextResponse.json(settings);
    }

    // Return all settings
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ category?: string[] }> }) {
  try {
    await ensureAdmin();
    await connectToDatabase();

    const body = await request.json();
    const settings = await getSettings();
    const { category } = await context.params;

    if (category && category.length > 0) {
      const cat = category[0];
      
      // Update specific category
      if (cat === 'general') {
        Object.assign(settings, body);
      } else if (cat === 'payment') {
        settings.paymentGateways = { ...settings.paymentGateways, ...body.paymentGateways };
      } else if (cat === 'security') {
        Object.assign(settings, body);
      } else if (cat === 'email') {
        settings.smtp = { ...settings.smtp, ...body.smtp };
      } else if (cat === 'seo') {
        settings.seo = { ...settings.seo, ...body.seo };
      } else if (cat === 'points') {
        Object.assign(settings, body);
      } else if (cat === 'media') {
        settings.cloudinary = { ...settings.cloudinary, ...body.cloudinary };
      } else if (cat === 'social') {
        settings.social = { ...settings.social, ...body.social };
        if (body.contactWidget) settings.contactWidget = { ...settings.contactWidget, ...body.contactWidget };
      } else if (cat === 'marketplace') {
        Object.assign(settings, body);
      } else if (cat === 'flashdeals') {
        Object.assign(settings, body);
      } else {
        // Fallback catch-all
        Object.assign(settings, body);
      }
    } else {
      // Update all at once if no category
      Object.assign(settings, body);
    }

    await settings.save();

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
