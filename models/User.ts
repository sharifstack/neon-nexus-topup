import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  points: number;
  role: 'admin' | 'user';
  isVerified: boolean;
  avatar?: string;
  twoFactorEnabled: boolean;
  walletBalance: number;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  points: { type: Number, default: 0 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  verificationToken: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
