"use server";

import { readDb, writeDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function processCheckout(formData: FormData) {
  const user = await getSessionUser();
  if (!user) {
    return { error: 'You must be logged in to make a purchase.' };
  }

  const amountStr = formData.get('amount') as string;
  const description = formData.get('description') as string || 'Neon Nexus Top Up';
  
  if (!amountStr) {
    return { error: 'Invalid amount.' };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Invalid payment amount.' };
  }

  // Calculate points: 10 points for every $1 spent
  const pointsEarned = Math.floor(amount * 10);

  const db = await readDb();
  
  // Create transaction
  const newTransaction = {
    id: `NX-${randomUUID().slice(0, 8).toUpperCase()}`,
    userId: user.id,
    amount,
    pointsEarned,
    description,
    date: new Date().toISOString(),
    status: 'Success' as const
  };

  db.transactions.push(newTransaction);

  // Add points to user
  const dbUser = db.users.find(u => u.id === user.id);
  if (dbUser) {
    dbUser.points += pointsEarned;
  }

  await writeDb(db);

  return { success: true, transactionId: newTransaction.id };
}
