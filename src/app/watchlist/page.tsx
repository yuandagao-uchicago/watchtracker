"use client";

import { useState } from "react";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, MediaType, STATUS_LABELS } from "@/types";
import WatchCard from "@/components/watchlist/WatchCard";

const statusFilters: ("all" | WatchStatus)[] = [
  "all",
  "watching",
  "completed",
  "plan_to_watch",
  "dropped",
];

export default function WatchlistPage() {
  const { items } = useWatchlist();
  const [statusFilter, setStatusFilter] = useState<"all" | WatchStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (typeFilter !== "all" && item.mediaType !== typeFilter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>
        <Link
          href="/watchlist/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sand to-amber-700 hover:from-sand hover:to-amber-600 text-black rounded-lg font-semibold transition-all shadow-lg shadow-sand/10"
        >
          + Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 bg-surface border border-sand/10 rounded-lg px-4 py-2.5 text-sm placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-sand/30 focus:border-sand/20"
        />

        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                statusFilter === s
                  ? "bg-sand/15 text-sand border border-sand/20"
                  : "bg-surface text-foreground/40 hover:text-foreground/70 hover:bg-surface-light border border-transparent"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Type toggle */}
        <div className="flex gap-2">
          {(["all", "movie", "tv"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                typeFilter === t
                  ? "bg-sand/15 text-sand border border-sand/20"
                  : "bg-surface text-foreground/40 hover:text-foreground/70 hover:bg-surface-light border border-transparent"
              }`}
            >
              {t === "all" ? "All Types" : t === "tv" ? "TV Shows" : "Movies"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-20">🎬</div>
          <p className="text-foreground/50 text-lg">No items found</p>
          <p className="text-foreground/30 text-sm mt-2">
            Try adjusting your filters or{" "}
            <Link href="/watchlist/add" className="text-sand hover:underline">
              add something new
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <WatchCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
