"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Check,
  X,
  Clock,
  Package,
  MessageCircle,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Avatar from "@/components/ui/avatar";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const statusConfig: Record<string, { variant: any; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  accepted: { variant: "success", label: "Accepted" },
  rejected: { variant: "danger", label: "Rejected" },
  completed: { variant: "info", label: "Completed" },
  cancelled: { variant: "default", label: "Cancelled" },
};

const paymentLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  half_cash: "50% Advance",
  full_cash: "100% Advance",
};

export default function BookingsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<"borrower" | "lender">("borrower");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?role=${tab}`);
      const data = await res.json();
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (session) fetchBookings();
  }, [session, tab, fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Booking ${status}`);
        fetchBookings();
      } else {
        const err = await res.json();
        toast.error(err.error);
      }
    } catch {
      toast.error("Failed to update booking");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        My Bookings
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Track your rental requests and manage incoming requests.
      </p>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTab("borrower")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "borrower"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Renting (Borrower)
        </button>
        <button
          onClick={() => setTab("lender")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            tab === "lender"
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Lending (Lender)
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No bookings yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {tab === "borrower"
              ? "Browse items and start renting!"
              : "List items to receive rental requests."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => {
            const otherUser =
              tab === "borrower" ? booking.lender : booking.borrower;
            const config = statusConfig[booking.status] || statusConfig.pending;

            return (
              <Card key={booking._id} className="p-4">
                <div className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {booking.listing?.images?.[0] ? (
                      <Image
                        src={booking.listing.images[0]}
                        alt={booking.listing.title || ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {booking.listing?.title || "Unknown Item"}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                          <span>{formatPrice(booking.totalAmount)}</span>
                          <span>{paymentLabels[booking.paymentMethod]}</span>
                          <span>{formatDate(booking.startDate)}</span>
                        </div>
                      </div>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {otherUser && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Avatar
                            src={otherUser.avatar}
                            name={otherUser.name}
                            size="sm"
                          />
                          {otherUser.name}
                        </div>
                      )}
                      <span className="text-xs text-gray-400">
                        • {booking.meetupLocation}
                      </span>
                    </div>

                    {/* Lender actions for pending bookings */}
                    {tab === "lender" && booking.status === "pending" && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(booking._id, "accepted")
                          }
                        >
                          <Check className="h-3 w-3" /> Accept
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            updateStatus(booking._id, "rejected")
                          }
                        >
                          <X className="h-3 w-3" /> Reject
                        </Button>
                      </div>
                    )}

                    {/* Complete action for accepted bookings */}
                    {booking.status === "accepted" && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(booking._id, "completed")
                          }
                        >
                          <Check className="h-3 w-3" /> Mark Complete
                        </Button>
                        <Link href="/chat">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-3 w-3" /> Chat
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Cancel for borrower pending */}
                    {tab === "borrower" && booking.status === "pending" && (
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateStatus(booking._id, "cancelled")
                          }
                        >
                          <X className="h-3 w-3" /> Cancel Request
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
