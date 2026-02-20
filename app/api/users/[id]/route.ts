import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Listing from "@/models/Listing";
import Resource from "@/models/Resource";
import Review from "@/models/Review";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await User.findById(params.id)
      .select("-passwordHash")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [listings, resources, reviews] = await Promise.all([
      Listing.find({ owner: params.id, status: "available" })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Resource.find({ uploader: params.id })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Review.find({ reviewee: params.id })
        .populate("reviewer", "name avatar")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({
      user,
      listings,
      resources,
      reviews,
      stats: {
        listingCount: await Listing.countDocuments({ owner: params.id }),
        resourceCount: await Resource.countDocuments({ uploader: params.id }),
        avgRating: avgRating.toFixed(1),
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isOwnProfile = (session.user as any).id === params.id;
    const isAdmin = (session.user as any).role === "admin";

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (isAdmin && body.adminAction) {
      await connectDB();

      if (body.adminAction === "ban") {
        await User.findByIdAndUpdate(params.id, { role: "banned" });
        return NextResponse.json({ message: "User banned" });
      }

      if (body.adminAction === "unban") {
        await User.findByIdAndUpdate(params.id, { role: "student" });
        return NextResponse.json({ message: "User unbanned" });
      }

      if (body.adminAction === "makeAdmin") {
        await User.findByIdAndUpdate(params.id, { role: "admin" });
        return NextResponse.json({ message: "User promoted to admin" });
      }

      if (body.adminAction === "delete") {
        await User.findByIdAndDelete(params.id);
        await Listing.deleteMany({ owner: params.id });
        await Resource.deleteMany({ uploader: params.id });
        return NextResponse.json({ message: "User and all their content deleted" });
      }
    }

    const allowedFields = ["name", "bio", "skills", "interests", "phone", "branch", "year", "avatar"];
    const update: any = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(params.id, update, {
      new: true,
    }).select("-passwordHash");

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
