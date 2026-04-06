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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-1">Collection</p>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Your Watchlist</h1>
        </div>
        <Link
          href="/watchlist/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/70 text-white rounded-full font-semibold text-sm transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
        >
          + Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-surface border border-white/5 rounded-full pl-11 pr-4 py-2.5 text-sm placeholder-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/20 transition-all"
          />
        </div>

        {/* Status tabs */}
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                statusFilter === s
                  ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                  : "text-foreground/30 hover:text-foreground/60 hover:bg-surface"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Type toggle */}
        <div className="flex gap-1.5">
          {(["all", "movie", "tv"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                typeFilter === t
                  ? "bg-accent/15 text-accent ring-1 ring-accent/20"
                  : "text-foreground/30 hover:text-foreground/60 hover:bg-surface"
              }`}
            >
              {t === "all" ? "All Types" : t === "tv" ? "Series" : "Films"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
            <svg className="w-8 h-8 text-foreground/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <p className="text-foreground/40 text-lg font-heading">Nothing here yet</p>
          <p className="text-foreground/20 text-sm mt-2">
            Try adjusting your filters or{" "}
            <Link href="/watchlist/add" className="text-primary hover:underline">
              add something new
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <WatchCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
