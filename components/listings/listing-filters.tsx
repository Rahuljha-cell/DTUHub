"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/types";

export default function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const currentCategory = searchParams.get("category") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/browse?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", search);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/20 bg-white/80 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-glass backdrop-blur-xl transition-all duration-300 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:border-white/10 dark:bg-gray-800/80 dark:text-white dark:focus:bg-gray-800"
        />
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilters("category", "all")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
            currentCategory === "all"
              ? "bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-glow-sm"
              : "bg-white/80 text-gray-600 border border-white/20 backdrop-blur-sm hover:bg-white hover:shadow-glass dark:bg-gray-800/80 dark:text-gray-300 dark:border-white/10 dark:hover:bg-gray-700/80"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateFilters("category", cat.value)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              currentCategory === cat.value
                ? "bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow-glow-sm"
                : "bg-white/80 text-gray-600 border border-white/20 backdrop-blur-sm hover:bg-white hover:shadow-glass dark:bg-gray-800/80 dark:text-gray-300 dark:border-white/10 dark:hover:bg-gray-700/80"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
