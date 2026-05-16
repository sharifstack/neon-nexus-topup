import mongoose, { Schema, Document } from 'mongoose';

export interface IPointsTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  // For 'earned' type
  orderId?: mongoose.Types.ObjectId;
  // For 'redeemed' type
  rewardId?: mongoose.Types.ObjectId;
  rewardTitle?: string;
  createdAt: Date;
}

const PointsTransactionSchema: Schema = new Schema({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['earned', 'redeemed'], required: true },
  points:      { type: Number, required: true },
  description: { type: String, required: true },
  orderId:     { type: Schema.Types.ObjectId, ref: 'Order' },
  rewardId:    { type: Schema.Types.ObjectId, ref: 'PointsReward' },
  rewardTitle: { type: String },
}, { timestamps: true });

// Index for efficient user history lookups
PointsTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.PointsTransaction || mongoose.model<IPointsTransaction>('PointsTransaction', PointsTransactionSchema);
