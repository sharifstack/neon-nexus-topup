import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  points: number;
  totalPointsEarned: number;
  role: 'admin' | 'user';
  isVerified: boolean;
  avatar?: string;
  twoFactorEnabled: boolean;
  walletBalance: number;
  verificationToken?: string;

  // Moderation fields
  status: 'active' | 'suspended' | 'banned';
  suspendedUntil?: Date;
  banReason?: string;
  suspendReason?: string;
  moderationNote?: string;

  // Activity tracking
  lastSeen?: Date;
  isOnline: boolean;
  country?: string;

  // Stats (denormalised for speed)
  totalSpent: number;
  totalOrders: number;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  points:             { type: Number, default: 0 },
  totalPointsEarned:  { type: Number, default: 0 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  verificationToken: { type: String },

  // Moderation
  status: { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
  suspendedUntil: { type: Date },
  banReason: { type: String },
  suspendReason: { type: String },
  moderationNote: { type: String },

  // Activity
  lastSeen: { type: Date },
  isOnline: { type: Boolean, default: false },
  country: { type: String },

  // Stats
  totalSpent: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
