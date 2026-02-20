import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { z } from "zod";

const createResourceSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).optional(),
  subject: z.string().min(1),
  semester: z.number().min(1).max(8),
  branch: z.string().min(1),
  fileUrl: z.string().optional(),
  link: z.string().url().optional(),
  type: z.enum(["notes", "pyq", "assignment", "book", "other"]),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const semester = searchParams.get("semester");
    const branch = searchParams.get("branch");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const filter: any = {};
    if (subject) filter.subject = { $regex: subject, $options: "i" };
    if (semester) filter.semester = parseInt(semester);
    if (branch) filter.branch = branch;
    if (type) filter.type = type;
    if (search) filter.$text = { $search: search };

    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .populate("uploader", "name avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Resource.countDocuments(filter),
    ]);

    return NextResponse.json({
      resources,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createResourceSchema.parse(body);

    if (!data.fileUrl && !data.link) {
      return NextResponse.json(
        { error: "Provide either a file or a link" },
        { status: 400 }
      );
    }

    await connectDB();
    const resource = await Resource.create({
      ...data,
      uploader: (session.user as any).id,
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resourceId, action } = await req.json();
    await connectDB();

    const userId = (session.user as any).id;

    if (action === "like") {
      const resource = await Resource.findById(resourceId);
      if (!resource) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const hasLiked = resource.likes.includes(userId);
      if (hasLiked) {
        resource.likes = resource.likes.filter(
          (id: any) => id.toString() !== userId
        );
      } else {
        resource.likes.push(userId);
      }
      await resource.save();
      return NextResponse.json({ likes: resource.likes.length, liked: !hasLiked });
    }

    if (action === "delete") {
      const userRole = (session.user as any).role;
      const resource = await Resource.findById(resourceId);
      if (!resource) return NextResponse.json({ error: "Not found" }, { status: 404 });

      if (resource.uploader.toString() !== userId && userRole !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      await Resource.findByIdAndDelete(resourceId);
      return NextResponse.json({ deleted: true });
    }

    if (action === "download") {
      await Resource.findByIdAndUpdate(resourceId, {
        $inc: { downloads: 1 },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}
