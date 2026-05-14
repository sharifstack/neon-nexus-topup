import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  bonus?: string;
  popular?: boolean;
  bestSeller?: boolean;
}

export interface IGame extends Document {
  name: string;
  slug: string;
  coverImage: string;
  bannerImage: string;
  featuredBackgroundUrl?: string;
  tag?: string;
  tagColor?: 'discount' | 'bonus' | 'star' | 'hot' | 'new';
  category: string;
  type: 'game' | 'minigame' | 'flashdeal' | 'entertainment';
  
  // Placement Flags
  isMiniGame: boolean;
  isFlashDeal: boolean;
  isFeatured: boolean;
  isActive: boolean;
  
  currency: string;
  description: string;
  requiresZoneId: boolean;
  playUrl?: string;
  stock: number;
  displayPriority: number;
  packages: IPackage[];
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  bonus: { type: String },
  popular: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
});

const GameSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  coverImage: { type: String, required: true },
  bannerImage: { type: String, required: true },
  featuredBackgroundUrl: { type: String },
  tag: { type: String },
  tagColor: { type: String, enum: ['discount', 'bonus', 'star', 'hot', 'new'], default: 'bonus' },
  category: { type: String, required: true },
  type: { type: String, enum: ['game', 'minigame', 'flashdeal', 'entertainment'], default: 'game' },
  
  // Placement Flags
  isMiniGame: { type: Boolean, default: false },
  isFlashDeal: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  currency: { type: String, required: true },
  description: { type: String },
  requiresZoneId: { type: Boolean, default: false },
  playUrl: { type: String },
  stock: { type: Number, default: 100 },
  displayPriority: { type: Number, default: 0 },
  packages: [PackageSchema],
}, { timestamps: true });

// Auto-generate slug before saving if not provided
GameSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  }
  next();
});

export default mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);
