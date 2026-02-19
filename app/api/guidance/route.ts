import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import GuidanceProfile from "@/models/GuidanceProfile";
import { z } from "zod";

const createProfileSchema = z.object({
  expertise: z.array(z.string()).min(1),
  branch: z.string().min(1),
  year: z.number().min(1).max(6),
  description: z.string().max(1000).optional(),
  available: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const expertise = searchParams.get("expertise");

    const filter: any = { available: true };
    if (branch) filter.branch = branch;
    if (expertise) {
      filter.expertise = { $regex: expertise, $options: "i" };
    }

    const profiles = await GuidanceProfile.find(filter)
      .populate("user", "name avatar email bio")
      .sort({ rating: -1 })
      .lean();

    return NextResponse.json(profiles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
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
    const data = createProfileSchema.parse(body);
    const userId = (session.user as any).id;

    await connectDB();

    const existing = await GuidanceProfile.findOne({ user: userId });
    if (existing) {
      const updated = await GuidanceProfile.findOneAndUpdate(
        { user: userId },
        data,
        { new: true }
      );
      return NextResponse.json(updated);
    }

    const profile = await GuidanceProfile.create({
      user: userId,
      ...data,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create/update profile" },
      { status: 500 }
    );
  }
}
