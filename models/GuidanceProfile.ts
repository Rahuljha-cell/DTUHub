import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGuidanceProfile extends Document {
  user: Types.ObjectId;
  expertise: string[];
  branch: string;
  year: number;
  available: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const GuidanceProfileSchema = new Schema<IGuidanceProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    expertise: [{ type: String, required: true }],
    branch: { type: String, required: true },
    year: { type: Number, required: true, min: 1, max: 6 },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    description: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

GuidanceProfileSchema.index({ branch: 1, available: 1 });

const GuidanceProfile: Model<IGuidanceProfile> =
  mongoose.models.GuidanceProfile ||
  mongoose.model<IGuidanceProfile>("GuidanceProfile", GuidanceProfileSchema);

export default GuidanceProfile;
