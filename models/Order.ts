import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  gameId: string;
  packageName: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Refunded';
  paymentMethod: string;
  transactionId?: string;
  pointsEarned: number;
  gamePlayerId?: string;
  gameZoneId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  packageName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending' 
  },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String },
  pointsEarned: { type: Number, default: 0 },
  gamePlayerId: { type: String },
  gameZoneId: { type: String },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
