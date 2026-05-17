import mongoose, { Schema, Document } from 'mongoose';

export interface IPointsReward extends Document {
  title: string;
  description: string;
  category: 'uc' | 'diamonds' | 'skins' | 'passes' | 'vouchers' | 'coins';
  pointsCost: number;
  rewardValue: string;        // e.g. "100 UC", "Elite Pass", "$5 Voucher"
  image?: string;
  isActive: boolean;
  stock: number | null;       // null = unlimited
  totalRedeemed: number;
  displayPriority: number;
  isFeatured: boolean;
  badgeLabel?: string;         // e.g. "HOT", "LIMITED", "POPULAR"
  game?: string;               // optional game association
  gameId?: string | mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PointsRewardSchema: Schema = new Schema({
  title:           { type: String, required: true },
  description:     { type: String, default: '' },
  category:        { type: String, enum: ['uc', 'diamonds', 'skins', 'passes', 'vouchers', 'coins'], required: true },
  pointsCost:      { type: Number, required: true, min: 1 },
  rewardValue:     { type: String, required: true },
  image:           { type: String },
  isActive:        { type: Boolean, default: true },
  stock:           { type: Number, default: null },
  totalRedeemed:   { type: Number, default: 0 },
  displayPriority: { type: Number, default: 0 },
  isFeatured:      { type: Boolean, default: false },
  badgeLabel:      { type: String },
  game:            { type: String },
  gameId:          { type: Schema.Types.ObjectId, ref: 'Game' },
}, { timestamps: true });

export default mongoose.models.PointsReward || mongoose.model<IPointsReward>('PointsReward', PointsRewardSchema);
