import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashDeal extends Document {
  gameId: string;
  title: string;
  offerTitle: string;
  bonusText: string;
  originalPrice: number;
  discountedPrice: number;
  stockStatus: number; // 0-100 percentage
  limitedQuantity: string;
  backgroundMedia?: string; // GIF/Image URL
  endsAt: Date | 'DAILY_RESET';
  isActive: boolean;
}

const FlashDealSchema: Schema = new Schema({
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  title: { type: String, required: true },
  offerTitle: { type: String, required: true },
  bonusText: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  stockStatus: { type: Number, default: 100 },
  limitedQuantity: { type: String },
  backgroundMedia: { type: String },
  endsAt: { type: Schema.Types.Mixed, required: true }, // Date or "DAILY_RESET"
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.FlashDeal || mongoose.model<IFlashDeal>('FlashDeal', FlashDealSchema);
