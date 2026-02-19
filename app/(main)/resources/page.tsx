"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, BookOpen, Search } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import ResourceCard from "@/components/resources/resource-card";
import { BRANCHES, RESOURCE_TYPES } from "@/types";
import toast from "react-hot-toast";

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><div className="h-96 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" /></div>}>
      <ResourcesContent />
    </Suspense>
  );
}

function ResourcesContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      const res = await fetch(`/api/resources?${params.toString()}`);
      const data = await res.json();
      setResources(data.resources || []);
      setTotal(data.total || 0);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, search]);

  useEffect(() => {
    fetchResources();
  }, [searchParams, fetchResources]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/resources?${params.toString()}`);
  };

  const handleLike = async (resourceId: string) => {
    try {
      const res = await fetch("/api/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, action: "like" }),
      });
      if (res.ok) fetchResources();
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleDownload = async (resourceId: string) => {
    try {
      await fetch("/api/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId, action: "download" }),
      });
    } catch {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", search);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Study Resources
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} resources shared by DTU students
          </p>
        </div>
        <Link href="/resources/upload">
          <Button>
            <Plus className="h-4 w-4" /> Share Resource
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </form>
        <div className="flex flex-wrap gap-3">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            value={searchParams.get("semester") || ""}
            onChange={(e) => updateFilter("semester", e.target.value)}
          >
            <option value="">All Semesters</option>
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Semester {i + 1}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            value={searchParams.get("branch") || ""}
            onChange={(e) => updateFilter("branch", e.target.value)}
          >
            <option value="">All Branches</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            value={searchParams.get("type") || ""}
            onChange={(e) => updateFilter("type", e.target.value)}
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No resources found
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Be the first to share study materials for your course!
          </p>
          <Link href="/resources/upload" className="mt-4 inline-block">
            <Button>
              <Plus className="h-4 w-4" /> Upload a resource
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {resources.map((resource: any) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              userId={(session?.user as any)?.id}
              onLike={handleLike}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
