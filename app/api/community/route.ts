import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1).max(3000),
  images: z.array(z.string()).max(4).optional(),
  tags: z.array(z.string()).max(5).optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const filter: any = {};
    if (tag) filter.tags = tag;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name avatar branch year")
        .populate("comments.user", "name avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createPostSchema.parse(body);

    await connectDB();
    const post = await Post.create({
      author: (session.user as any).id,
      ...data,
    });

    const populated = await Post.findById(post._id)
      .populate("author", "name avatar branch year")
      .lean();

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { postId, action, text } = await req.json();

    await connectDB();

    if (action === "like") {
      const post = await Post.findById(postId);
      if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const hasLiked = post.likes.includes(userId);
      if (hasLiked) {
        post.likes = post.likes.filter((id: any) => id.toString() !== userId);
      } else {
        post.likes.push(userId);
      }
      await post.save();
      return NextResponse.json({ likes: post.likes.length, liked: !hasLiked });
    }

    if (action === "comment") {
      if (!text || text.length > 500) {
        return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
      }
      const post = await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: { user: userId, text, createdAt: new Date() } } },
        { new: true }
      )
        .populate("comments.user", "name avatar")
        .lean();

      return NextResponse.json({ comments: post?.comments });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
