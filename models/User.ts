import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  avatar?: string;
  provider: "credentials" | "google";
  branch?: string;
  year?: number;
  rollNumber?: string;
  role: "student" | "senior" | "admin" | "banned";
  bio?: string;
  skills: string[];
  interests: string[];
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, select: false },
    avatar: String,
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    branch: String,
    year: { type: Number, min: 1, max: 6 },
    rollNumber: String,
    role: {
      type: String,
      enum: ["student", "senior", "admin", "banned"],
      default: "student",
    },
    bio: { type: String, maxlength: 500 },
    skills: [String],
    interests: [String],
    phone: String,
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
