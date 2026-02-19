import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import { z } from "zod";

const createReviewSchema = z.object({
  bookingId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createReviewSchema.parse(body);
    const userId = (session.user as any).id;

    await connectDB();

    const booking = await Booking.findById(data.bookingId);
    if (!booking || booking.status !== "completed") {
      return NextResponse.json(
        { error: "Can only review completed bookings" },
        { status: 400 }
      );
    }

    const isBorrower = booking.borrower.toString() === userId;
    const isLender = booking.lender.toString() === userId;

    if (!isBorrower && !isLender) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reviewee = isBorrower ? booking.lender : booking.borrower;

    const existingReview = await Review.findOne({
      booking: data.bookingId,
      reviewer: userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Already reviewed this booking" },
        { status: 400 }
      );
    }

    const review = await Review.create({
      reviewer: userId,
      reviewee,
      booking: data.bookingId,
      rating: data.rating,
      comment: data.comment,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
