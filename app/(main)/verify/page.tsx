import { readDb, writeDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import VerificationClient from './VerificationClient';

export default async function VerifyPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ token?: string }> 
}) {
  const { token } = await searchParams;
  
  if (!token) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[70vh]">
        <div className="text-center text-error bg-error/10 border border-error/20 p-8 rounded-3xl">
          <span className="material-symbols-outlined text-5xl mb-4">error</span>
          <h1 className="text-2xl font-bold">Invalid Link</h1>
          <p>No verification token was provided.</p>
        </div>
      </div>
    );
  }

  const db = await readDb();
  const userIndex = db.users.findIndex(u => u.verificationToken === token);
  
  if (userIndex === -1) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[70vh]">
        <div className="text-center text-error bg-error/10 border border-error/20 p-8 rounded-3xl">
          <span className="material-symbols-outlined text-5xl mb-4">link_off</span>
          <h1 className="text-2xl font-bold">Invalid Token</h1>
          <p>The verification link is invalid or has already been used.</p>
        </div>
      </div>
    );
  }

  const user = db.users[userIndex];
  const isExpired = user.verificationTokenExpires ? new Date() > new Date(user.verificationTokenExpires) : true;

  if (isExpired) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[70vh]">
        <div className="text-center text-error bg-error/10 border border-error/20 p-8 rounded-3xl">
          <span className="material-symbols-outlined text-5xl mb-4">timer_off</span>
          <h1 className="text-2xl font-bold">Expired Link</h1>
          <p>This verification link has expired. Please register again or request a new link.</p>
        </div>
      </div>
    );
  }

  // Update user status
  console.log(`[VERIFYING] User found: ${user.email}`);
  db.users[userIndex].isVerified = true;
  db.users[userIndex].verificationToken = undefined;
  db.users[userIndex].verificationTokenExpires = undefined;
  
  await writeDb(db);
  console.log(`[VERIFIED SUCCESS] User: ${user.email} is now verified in DB.`);

  return <VerificationClient />;
}
