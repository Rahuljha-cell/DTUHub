import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IResource extends Document {
  uploader: Types.ObjectId;
  title: string;
  description: string;
  subject: string;
  semester: number;
  branch: string;
  fileUrl?: string;
  link?: string;
  type: "notes" | "pyq" | "assignment" | "book" | "other";
  likes: Types.ObjectId[];
  downloads: number;
  createdAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    uploader: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 1000 },
    subject: { type: String, required: true },
    semester: { type: Number, min: 1, max: 8 },
    branch: { type: String, required: true },
    fileUrl: String,
    link: String,
    type: {
      type: String,
      enum: ["notes", "pyq", "assignment", "book", "other"],
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ResourceSchema.index({ subject: 1, semester: 1, branch: 1 });
ResourceSchema.index({ title: "text", description: "text" });

const Resource: Model<IResource> =
  mongoose.models.Resource ||
  mongoose.model<IResource>("Resource", ResourceSchema);

export default Resource;
