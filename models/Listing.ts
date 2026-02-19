import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IListing extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  category: "books" | "electronics" | "sports" | "clothing" | "other";
  images: string[];
  price: number;
  priceType: "per_day" | "fixed";
  condition: "new" | "good" | "fair";
  status: "available" | "rented" | "paused";
  paymentOptions: {
    cod: boolean;
    halfCash: boolean;
    fullCash: boolean;
  };
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      enum: ["books", "electronics", "sports", "clothing", "other"],
      required: true,
    },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    priceType: { type: String, enum: ["per_day", "fixed"], default: "fixed" },
    condition: {
      type: String,
      enum: ["new", "good", "fair"],
      default: "good",
    },
    status: {
      type: String,
      enum: ["available", "rented", "paused"],
      default: "available",
    },
    paymentOptions: {
      cod: { type: Boolean, default: true },
      halfCash: { type: Boolean, default: true },
      fullCash: { type: Boolean, default: true },
    },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

ListingSchema.index({ title: "text", description: "text" });
ListingSchema.index({ category: 1, status: 1 });
ListingSchema.index({ owner: 1 });

const Listing: Model<IListing> =
  mongoose.models.Listing ||
  mongoose.model<IListing>("Listing", ListingSchema);

export default Listing;
