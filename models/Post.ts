import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: Types.ObjectId;
  content: string;
  images: string[];
  tags: string[];
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 3000 },
    images: [String],
    tags: [{ type: String, lowercase: true }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

PostSchema.index({ tags: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ createdAt: -1 });

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
