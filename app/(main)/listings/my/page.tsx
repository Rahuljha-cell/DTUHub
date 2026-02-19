"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Plus, Edit, Trash2, Pause, Play, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function MyListingsPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = useCallback(async () => {
    try {
      const res = await fetch("/api/listings?mine=true");
      const data = await res.json();
      const userId = (session?.user as any)?.id;
      const myListings = (data.listings || []).filter(
        (l: any) => l.owner?._id === userId || l.owner === userId
      );
      setListings(myListings);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchMyListings();
  }, [session, fetchMyListings]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "paused" ? "available" : "paused";
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(newStatus === "paused" ? "Listing paused" : "Listing reactivated");
        fetchMyListings();
      }
    } catch {
      toast.error("Failed to update listing");
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Listing deleted");
        setListings((prev) => prev.filter((l) => l._id !== id));
      }
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Listings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {listings.length} items listed
          </p>
        </div>
        <Link href="/listings/new">
          <Button>
            <Plus className="h-4 w-4" /> New Listing
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No listings yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Start by listing an item you want to rent out.
          </p>
          <Link href="/listings/new" className="mt-4 inline-block">
            <Button>
              <Plus className="h-4 w-4" /> Create your first listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <Card key={listing._id} className="flex gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {listing.images[0] ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <Package className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {listing.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatPrice(listing.price)} • {listing.category}
                    </p>
                  </div>
                  <Badge
                    variant={
                      listing.status === "available"
                        ? "success"
                        : listing.status === "rented"
                          ? "warning"
                          : "default"
                    }
                  >
                    {listing.status}
                  </Badge>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(listing._id, listing.status)}
                    disabled={listing.status === "rented"}
                  >
                    {listing.status === "paused" ? (
                      <Play className="h-3 w-3" />
                    ) : (
                      <Pause className="h-3 w-3" />
                    )}
                    {listing.status === "paused" ? "Activate" : "Pause"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteListing(listing._id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
