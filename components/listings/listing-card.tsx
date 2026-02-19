"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import Badge from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface ListingCardProps {
  listing: {
    _id: string;
    title: string;
    images: string[];
    price: number;
    priceType: string;
    category: string;
    condition: string;
    location: string;
    owner: { name: string; avatar?: string };
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const conditionVariant =
    listing.condition === "new"
      ? "success"
      : listing.condition === "good"
        ? "info"
        : "warning";

  return (
    <Link href={`/listings/${listing._id}`}>
      <div className="card-3d group overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/80">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="mx-auto mb-2 h-10 w-10 rounded-xl bg-gray-200/50 dark:bg-gray-600/50" />
                <span className="text-xs">No image</span>
              </div>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Condition badge */}
          <div className="absolute left-3 top-3">
            <Badge variant={conditionVariant}>{listing.condition}</Badge>
          </div>

          {/* Arrow indicator on hover */}
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-1.5 line-clamp-1 text-sm font-bold text-gray-900 dark:text-white">
            {listing.title}
          </h3>
          <div className="mb-3 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="h-3 w-3" />
            {listing.location}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold gradient-text">
              {formatPrice(listing.price)}
              {listing.priceType === "per_day" && (
                <span className="text-xs font-normal text-gray-400">
                  /day
                </span>
              )}
            </span>
            <Badge>{listing.category}</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
