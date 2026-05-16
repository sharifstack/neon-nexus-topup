import mongoose from "mongoose";

const HeroBannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    badge: { type: String },
    ctaText: { type: String, default: "GO" },
    href: { type: String, required: true },
    imageUrl: { type: String, required: true },
    accentColor: { type: String, default: "#1a6df0" },
    gradient: { type: String, default: "from-[#1a6df0] to-[#0d3fa8]" },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.HeroBanner || mongoose.model("HeroBanner", HeroBannerSchema);
