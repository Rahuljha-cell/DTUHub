"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Avatar from "@/components/ui/avatar";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Modal from "@/components/ui/modal";
import { formatPrice, formatDate } from "@/lib/utils";
import { CAMPUS_LOCATIONS } from "@/types";
import toast from "react-hot-toast";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState({
    paymentMethod: "",
    borrowerPhone: "",
    meetupLocation: "",
    startDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setListing(data);
      } catch {
        toast.error("Listing not found");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  const handleBooking = async () => {
    if (!booking.paymentMethod || !booking.borrowerPhone || !booking.meetupLocation || !booking.startDate) {
      toast.error("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing._id,
          startDate: booking.startDate,
          paymentMethod: booking.paymentMethod,
          borrowerPhone: booking.borrowerPhone,
          meetupLocation: booking.meetupLocation,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }

      toast.success("Booking request sent! The lender will be notified.");
      setShowBooking(false);
      router.push("/bookings");
    } catch (error: any) {
      toast.error(error.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Listing not found
        </h2>
        <Link href="/browse" className="mt-4 inline-block text-primary-600">
          Back to browse
        </Link>
      </div>
    );
  }

  const isOwner = session?.user && (session.user as any).id === listing.owner?._id;

  const paymentOptions = [];
  if (listing.paymentOptions?.cod) paymentOptions.push({ value: "cod", label: "Cash on Delivery" });
  if (listing.paymentOptions?.halfCash) paymentOptions.push({ value: "half_cash", label: "50% Advance + 50% on Delivery" });
  if (listing.paymentOptions?.fullCash) paymentOptions.push({ value: "full_cash", label: "100% Advance" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href="/browse"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
            {listing.images[activeImg] ? (
              <Image
                src={listing.images[activeImg]}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          {listing.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {listing.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                    i === activeImg
                      ? "border-primary-500"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start gap-2">
            <Badge>{listing.category}</Badge>
            <Badge
              variant={
                listing.condition === "new"
                  ? "success"
                  : listing.condition === "good"
                    ? "info"
                    : "warning"
              }
            >
              {listing.condition}
            </Badge>
            {listing.status === "rented" && (
              <Badge variant="danger">Rented Out</Badge>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            {listing.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(listing.price)}
            </span>
            {listing.priceType === "per_day" && (
              <span className="text-gray-500">/day</span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            {listing.location}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            Listed {formatDate(listing.createdAt)}
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {listing.description}
            </p>
          </div>

          {/* Payment options */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Options
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {listing.paymentOptions?.cod && (
                <Badge variant="info">Cash on Delivery</Badge>
              )}
              {listing.paymentOptions?.halfCash && (
                <Badge variant="info">50% Advance</Badge>
              )}
              {listing.paymentOptions?.fullCash && (
                <Badge variant="info">100% Advance</Badge>
              )}
            </div>
          </div>

          {/* Owner info */}
          {listing.owner && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <Avatar
                src={listing.owner.avatar}
                name={listing.owner.name}
                size="lg"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {listing.owner.name}
                </p>
                {listing.owner.branch && (
                  <p className="text-sm text-gray-500">
                    {listing.owner.branch}
                    {listing.owner.year && ` • Year ${listing.owner.year}`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {!isOwner && listing.status === "available" && (
              <Button
                size="lg"
                className="flex-1"
                onClick={() => setShowBooking(true)}
              >
                Rent This Item
              </Button>
            )}
            {isOwner && (
              <Link href={`/listings/my`} className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Manage Listing
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
        title="Request to Rent"
        className="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in the details below. The lender will review your request and
            you&apos;ll coordinate the meetup via chat.
          </p>

          <Select
            label="Payment Method"
            placeholder="How do you want to pay?"
            options={paymentOptions}
            value={booking.paymentMethod}
            onChange={(e) =>
              setBooking((prev) => ({
                ...prev,
                paymentMethod: e.target.value,
              }))
            }
          />

          <Input
            label="Your Phone Number"
            type="tel"
            placeholder="9876543210"
            value={booking.borrowerPhone}
            onChange={(e) =>
              setBooking((prev) => ({
                ...prev,
                borrowerPhone: e.target.value,
              }))
            }
          />

          <Select
            label="Preferred Meetup Location"
            placeholder="Where to meet?"
            options={CAMPUS_LOCATIONS.map((l) => ({ value: l, label: l }))}
            value={booking.meetupLocation}
            onChange={(e) =>
              setBooking((prev) => ({
                ...prev,
                meetupLocation: e.target.value,
              }))
            }
          />

          <Input
            label="Pickup Date"
            type="date"
            value={booking.startDate}
            onChange={(e) =>
              setBooking((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowBooking(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              loading={submitting}
              className="flex-1"
            >
              Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
