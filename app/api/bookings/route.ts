import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Listing from "@/models/Listing";
import { z } from "zod";

const createBookingSchema = z.object({
  listingId: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  paymentMethod: z.enum(["cod", "half_cash", "full_cash"]),
  borrowerPhone: z.string().min(10),
  meetupLocation: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "borrower";

    await connectDB();

    const filter =
      role === "lender" ? { lender: userId } : { borrower: userId };

    const bookings = await Booking.find(filter)
      .populate("listing", "title images price priceType")
      .populate("borrower", "name avatar")
      .populate("lender", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
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
    const data = createBookingSchema.parse(body);

    await connectDB();

    const listing = await Listing.findById(data.listingId);
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.status !== "available") {
      return NextResponse.json(
        { error: "Item is not available" },
        { status: 400 }
      );
    }

    if (listing.owner.toString() === (session.user as any).id) {
      return NextResponse.json(
        { error: "Cannot rent your own item" },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      listing: listing._id,
      borrower: (session.user as any).id,
      lender: listing.owner,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      totalAmount: listing.price,
      paymentMethod: data.paymentMethod,
      borrowerPhone: data.borrowerPhone,
      meetupLocation: data.meetupLocation,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
