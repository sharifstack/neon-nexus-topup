import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  id: string; // The session_id stored in cookies
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
}

const SessionSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
