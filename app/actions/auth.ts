"use server";

import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { createSession, destroySession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { redirect } from 'next/navigation';
import { sendVerificationEmail } from '@/lib/email';

export async function login(formData: FormData) {
  await connectToDatabase();
  const email = (formData.get('email') as string)?.toLowerCase();
  const password = formData.get('password') as string;
  
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  
  console.log(`[LOGIN ATTEMPT] Email: ${email}`);
  
  const user = await User.findOne({ email });
  
  if (!user) {
    console.log(`[LOGIN FAILED] User not found: ${email}`);
    return { error: 'User not found' };
  }

  console.log(`[LOGIN DATA] User: ${user.email}, Role: ${user.role}, Verified: ${user.isVerified}`);
  
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  console.log(`[LOGIN DEBUG] Email: ${email}, Found: true, Role: ${user.role}, Password Valid: ${isPasswordValid}`);

  if (!isPasswordValid) {
    return { error: 'Invalid password' };
  }

  // Force verify and grant role for admin account on successful login
  if (email === 'sharifstack@gmail.com') {
    let modified = false;
    if (!user.isVerified) { user.isVerified = true; modified = true; }
    if (user.role !== 'admin') { user.role = 'admin'; modified = true; }
    
    if (modified) {
      await user.save();
      console.log(`[LOGIN] Fixed admin status/role for: ${email}`);
    }
  }

  if (!user.isVerified) {
    console.log(`[LOGIN FAILED] Email not verified: ${email}`);
    return { error: 'Email not verified' };
  }
  
  console.log(`[LOGIN SUCCESS] User: ${email}`);
  await createSession(user._id.toString());
  
  // Redirect based on role
  if (user.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/account');
  }
}


import jwt from 'jsonwebtoken';

export async function register(formData: FormData) {
  await connectToDatabase();
  const name = formData.get('name') as string;
  const email = (formData.get('email') as string)?.toLowerCase();
  const password = formData.get('password') as string;
  
  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }
  
  if (await User.findOne({ email })) {
    return { error: 'Email is already in use' };
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Generate JWT Token for verification (valid for 24h)
  const verificationToken = jwt.sign(
    { email }, 
    process.env.JWT_SECRET || 'fallback', 
    { expiresIn: '24h' }
  );

  await User.create({
    name,
    email,
    passwordHash,
    points: 0,
    twoFactorEnabled: false,
    role: 'user',
    isVerified: false,
    verificationToken // Store for reference or manually verify if needed
  });
  
  // Send the email
  const emailSent = await sendVerificationEmail(email, verificationToken);
  
  if (!emailSent) {
    console.warn(`[REGISTER] Account created for ${email} but email failed to send.`);
  }
  
  redirect('/verify/check-email');
}


export async function logout() {
  await destroySession();
  redirect('/');
}

