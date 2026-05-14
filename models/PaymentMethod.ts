import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentMethod extends Document {
  id: string;
  name: string;
  logo: string;
  fee: number;
  description: string;
  isActive: boolean;
}

const PaymentMethodSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  fee: { type: Number, default: 0 },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.PaymentMethod || mongoose.model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);
