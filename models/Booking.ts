import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBooking extends Document {
  listing: Types.ObjectId;
  borrower: Types.ObjectId;
  lender: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  totalAmount: number;
  paymentMethod: "cod" | "half_cash" | "full_cash";
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  borrowerPhone: string;
  meetupLocation: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["cod", "half_cash", "full_cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    borrowerPhone: { type: String, required: true },
    meetupLocation: { type: String, required: true },
  },
  { timestamps: true }
);

BookingSchema.index({ borrower: 1 });
BookingSchema.index({ lender: 1 });
BookingSchema.index({ listing: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
