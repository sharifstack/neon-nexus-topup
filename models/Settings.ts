import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteLogo: string;
  maintenanceMode: boolean;
  currency: string;
  timezone: string;
  smtpConfig: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  paymentGateways: {
    bkash: { enabled: boolean; fee: number };
    nagad: { enabled: boolean; fee: number };
    rocket: { enabled: boolean; fee: number };
    card: { enabled: boolean; fee: number };
  };
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'Neon Nexus' },
  siteLogo: { type: String, default: '/logo.png' },
  maintenanceMode: { type: Boolean, default: false },
  currency: { type: String, default: 'USD' },
  timezone: { type: String, default: 'Asia/Dhaka' },
  smtpConfig: {
    host: { type: String },
    port: { type: Number },
    user: { type: String },
    pass: { type: String },
    from: { type: String },
  },
  paymentGateways: {
    bkash: { enabled: { type: Boolean, default: true }, fee: { type: Number, default: 0.015 } },
    nagad: { enabled: { type: Boolean, default: true }, fee: { type: Number, default: 0.010 } },
    rocket: { enabled: { type: Boolean, default: true }, fee: { type: Number, default: 0.010 } },
    card: { enabled: { type: Boolean, default: true }, fee: { type: Number, default: 0.025 } },
  },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
