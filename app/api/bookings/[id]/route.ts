import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Listing from "@/models/Listing";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const booking = await Booking.findById(params.id)
      .populate("listing")
      .populate("borrower", "name avatar email phone")
      .populate("lender", "name avatar email phone")
      .lean();

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch booking" },
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

    const userId = (session.user as any).id;

    await connectDB();
    const booking = await Booking.findById(params.id);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const { status } = await req.json();
    const isLender = booking.lender.toString() === userId;
    const isBorrower = booking.borrower.toString() === userId;

    if (status === "accepted" && isLender && booking.status === "pending") {
      booking.status = "accepted";
      await Listing.findByIdAndUpdate(booking.listing, { status: "rented" });
    } else if (
      status === "rejected" &&
      isLender &&
      booking.status === "pending"
    ) {
      booking.status = "rejected";
    } else if (
      status === "completed" &&
      (isLender || isBorrower) &&
      booking.status === "accepted"
    ) {
      booking.status = "completed";
      await Listing.findByIdAndUpdate(booking.listing, {
        status: "available",
      });
    } else if (
      status === "cancelled" &&
      isBorrower &&
      booking.status === "pending"
    ) {
      booking.status = "cancelled";
    } else {
      return NextResponse.json(
        { error: "Invalid status transition" },
        { status: 400 }
      );
    }

    await booking.save();
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
