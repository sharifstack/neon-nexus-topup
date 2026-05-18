import mongoose from "mongoose";

const LiveDropSchema = new mongoose.Schema(
  {
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    badge: { type: String, enum: ['Almost Gone', 'Restocked', 'Limited'], default: 'Limited' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.LiveDrop || mongoose.model("LiveDrop", LiveDropSchema);
