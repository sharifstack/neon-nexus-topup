"use server";

import { readDb, writeDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return { error: 'Not logged in' };

  const name = formData.get('name') as string;
  const avatar = formData.get('avatar') as string;

  if (!name) return { error: 'Name is required' };

  const db = await readDb();
  const dbUser = db.users.find(u => u.id === user.id);
  
  if (dbUser) {
    dbUser.name = name;
    if (avatar) dbUser.avatar = avatar;
    await writeDb(db);
    revalidatePath('/account');
    return { success: 'Profile updated successfully' };
  }
  return { error: 'User not found' };
}

export async function updatePassword(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return { error: 'Not logged in' };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!currentPassword || !newPassword) {
    return { error: 'Both fields are required' };
  }

  const db = await readDb();
  const dbUser = db.users.find(u => u.id === user.id);
  
  if (dbUser) {
    if (!(await bcrypt.compare(currentPassword, dbUser.passwordHash))) {
      return { error: 'Incorrect current password' };
    }
    dbUser.passwordHash = await bcrypt.hash(newPassword, 10);
    await writeDb(db);
    return { success: 'Password changed successfully' };
  }
  return { error: 'User not found' };
}

export async function toggleTwoFactor() {
  const user = await getSessionUser();
  if (!user) return { error: 'Not logged in' };

  const db = await readDb();
  const dbUser = db.users.find(u => u.id === user.id);
  
  if (dbUser) {
    dbUser.twoFactorEnabled = !dbUser.twoFactorEnabled;
    await writeDb(db);
    revalidatePath('/account');
    return { success: `2FA ${dbUser.twoFactorEnabled ? 'Enabled' : 'Disabled'} successfully` };
  }
  return { error: 'User not found' };
}
