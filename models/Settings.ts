import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  // General
  websiteName: string;
  websiteDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  supportEmail: string;
  supportPhone?: string;
  footerText?: string;
  currencySymbol: string;
  defaultLanguage: string;
  timezone: string;

  // Marketplace
  enableMarketplace: boolean;
  enableMiniGames: boolean;
  enableFlashDeals: boolean;
  enablePointsStore: boolean;
  featuredGamesCount: number;
  bannerAutoplaySpeed: number;

  // Payment
  paymentGateways: {
    bkash: { enabled: boolean; accountNumber: string; feePercentage: number; instructions?: string };
    nagad: { enabled: boolean; accountNumber: string; feePercentage: number; instructions?: string };
    rocket: { enabled: boolean; accountNumber: string; feePercentage: number; instructions?: string };
    binance: { enabled: boolean; accountId: string; feePercentage: number; instructions?: string };
    stripe: { enabled: boolean; publicKey: string; secretKey: string; webhookSecret: string; feePercentage: number };
    paypal: { enabled: boolean; clientId: string; clientSecret: string; feePercentage: number };
  };

  // Email
  smtp: {
    host: string;
    port: number;
    user: string;
    password?: string;
    senderEmail: string;
    senderName: string;
  };

  // Security
  jwtExpiryHours: number;
  sessionTimeoutHours: number;
  maxLoginAttempts: number;
  require2FAForAdmin: boolean;
  maintenanceMode: boolean;
  adminOnlyMode: boolean;
  ipWhitelist: string[];

  // Points
  pointsRate: number; // e.g., 100 BDT = X points
  pointsCashbackPercentage: number;
  minimumRedeemPoints: number;
  redemptionLimitsPerDay: number;

  // Flash Deals
  flashDealsActive: boolean;
  liveDropsActive: boolean;
  stockSystemActive: boolean;

  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
    keywords: string;
    robots: string;
  };

  // Media
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret?: string;
    maxUploadSizeMB: number;
  };

  // Social
  social: {
    facebook?: string;
    discord?: string;
    telegram?: string;
    instagram?: string;
    whatsapp?: string;
    youtube?: string;
  };

  contactWidget: {
    enabled: boolean;
    supportText: string;
  };

  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
  // General
  websiteName: { type: String, default: 'Neon Nexus' },
  websiteDescription: { type: String, default: 'Premium Gaming Marketplace' },
  logoUrl: { type: String },
  faviconUrl: { type: String },
  supportEmail: { type: String, default: 'support@neonnexus.com' },
  supportPhone: { type: String, default: '+1234567890' },
  footerText: { type: String, default: '© 2026 Neon Nexus. All rights reserved.' },
  currencySymbol: { type: String, default: '$' },
  defaultLanguage: { type: String, default: 'en' },
  timezone: { type: String, default: 'UTC' },

  // Marketplace
  enableMarketplace: { type: Boolean, default: true },
  enableMiniGames: { type: Boolean, default: true },
  enableFlashDeals: { type: Boolean, default: true },
  enablePointsStore: { type: Boolean, default: true },
  featuredGamesCount: { type: Number, default: 6 },
  bannerAutoplaySpeed: { type: Number, default: 5000 },

  // Payment
  paymentGateways: {
    bkash: { 
      enabled: { type: Boolean, default: true },
      accountNumber: { type: String, default: '' },
      feePercentage: { type: Number, default: 0 },
      instructions: { type: String, default: 'Send money to our bKash personal number.' }
    },
    nagad: { 
      enabled: { type: Boolean, default: true },
      accountNumber: { type: String, default: '' },
      feePercentage: { type: Number, default: 0 },
      instructions: { type: String, default: 'Send money to our Nagad personal number.' }
    },
    rocket: { 
      enabled: { type: Boolean, default: false },
      accountNumber: { type: String, default: '' },
      feePercentage: { type: Number, default: 0 },
      instructions: { type: String, default: 'Send money to our Rocket personal number.' }
    },
    binance: { 
      enabled: { type: Boolean, default: false },
      accountId: { type: String, default: '' },
      feePercentage: { type: Number, default: 0 },
      instructions: { type: String, default: 'Pay via Binance Pay.' }
    },
    stripe: { 
      enabled: { type: Boolean, default: false },
      publicKey: { type: String, default: '' },
      secretKey: { type: String, default: '' },
      webhookSecret: { type: String, default: '' },
      feePercentage: { type: Number, default: 2.9 }
    },
    paypal: { 
      enabled: { type: Boolean, default: false },
      clientId: { type: String, default: '' },
      clientSecret: { type: String, default: '' },
      feePercentage: { type: Number, default: 3.4 }
    }
  },

  // Email
  smtp: {
    host: { type: String, default: '' },
    port: { type: Number, default: 587 },
    user: { type: String, default: '' },
    password: { type: String, default: '' },
    senderEmail: { type: String, default: 'noreply@neonnexus.com' },
    senderName: { type: String, default: 'Neon Nexus' }
  },

  // Security
  jwtExpiryHours: { type: Number, default: 24 },
  sessionTimeoutHours: { type: Number, default: 12 },
  maxLoginAttempts: { type: Number, default: 5 },
  require2FAForAdmin: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
  adminOnlyMode: { type: Boolean, default: false },
  ipWhitelist: [{ type: String }],

  // Points
  pointsRate: { type: Number, default: 1 }, // e.g., 100 spent = 1 point
  pointsCashbackPercentage: { type: Number, default: 0 },
  minimumRedeemPoints: { type: Number, default: 50 },
  redemptionLimitsPerDay: { type: Number, default: 5 },

  // Flash Deals
  flashDealsActive: { type: Boolean, default: true },
  liveDropsActive: { type: Boolean, default: true },
  stockSystemActive: { type: Boolean, default: true },

  // SEO
  seo: {
    metaTitle: { type: String, default: 'Neon Nexus - Premium Gaming Marketplace' },
    metaDescription: { type: String, default: 'The ultimate marketplace for game top-ups, accounts, and items.' },
    ogImage: { type: String, default: '' },
    keywords: { type: String, default: 'gaming, topup, pubg, freefire' },
    robots: { type: String, default: 'index, follow' }
  },

  // Media
  cloudinary: {
    cloudName: { type: String, default: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '' },
    apiKey: { type: String, default: '' },
    apiSecret: { type: String, default: '' },
    maxUploadSizeMB: { type: Number, default: 5 }
  },

  // Social
  social: {
    facebook: { type: String, default: '' },
    discord: { type: String, default: '' },
    telegram: { type: String, default: '' },
    instagram: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },

  contactWidget: {
    enabled: { type: Boolean, default: true },
    supportText: { type: String, default: 'Need help? Contact support.' }
  }

}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
