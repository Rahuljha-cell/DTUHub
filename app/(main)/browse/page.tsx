"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Package, Sparkles, Search } from "lucide-react";
import Link from "next/link";
import ListingCard from "@/components/listings/listing-card";
import ListingFilters from "@/components/listings/listing-filters";
import Button from "@/components/ui/button";

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseLoading />}>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseLoading() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark opacity-30" />
      <div className="relative">
        <div className="mb-8 h-16 animate-pulse rounded-2xl bg-gray-200/50 dark:bg-gray-700/50" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-gray-200/50 backdrop-blur-xl dark:bg-gray-700/50"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        const res = await fetch(`/api/listings?${params.toString()}`);
        const data = await res.json();
        setListings(data.listings || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams, page]);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Background mesh */}
      <div className="fixed inset-0 gradient-mesh dark:gradient-mesh-dark opacity-30 -z-10" />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50/80 px-3 py-1 text-xs font-semibold text-primary-700 backdrop-blur-sm dark:bg-primary-950/50 dark:text-primary-300">
            <Search className="h-3 w-3" />
            Discover
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Browse <span className="gradient-text">Rentals</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {total} items available from DTU students
          </p>
        </div>
        <Link href="/listings/new">
          <Button>
            <Plus className="h-4 w-4" /> List Item
          </Button>
        </Link>
      </div>

      <ListingFilters />

      {loading ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl bg-gray-200/50 backdrop-blur-xl dark:bg-gray-700/50"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="mt-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
            <Package className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            No items found
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters or be the first to list an item!
          </p>
          <Link href="/listings/new" className="mt-6 inline-block">
            <Button size="lg">
              <Sparkles className="h-4 w-4" /> List your first item
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing: any) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                        page === pageNum
                          ? "bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-glow-sm"
                          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
