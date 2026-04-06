"use client";

import { useState } from "react";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, MediaType, STATUS_LABELS } from "@/types";
import WatchCard from "@/components/watchlist/WatchCard";

const statusFilters: ("all" | WatchStatus)[] = [
  "all", "watching", "completed", "plan_to_watch", "dropped",
];

export default function WatchlistPage() {
  const { items } = useWatchlist();
  const [statusFilter, setStatusFilter] = useState<"all" | WatchStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (typeFilter !== "all" && item.mediaType !== typeFilter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-5xl font-heading tracking-wider">WATCHLIST</h1>
          <div className="w-10 h-0.5 bg-primary mt-3" />
        </div>
        <Link
          href="/watchlist/add"
          className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-heading text-base tracking-wider transition-colors"
        >
          + ADD TITLE
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="SEARCH..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-transparent border-b border-white/10 focus:border-primary px-0 py-2 text-sm tracking-widest placeholder-white/15 focus:outline-none transition-colors"
        />

        <div className="flex flex-wrap gap-px">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-5 py-2 text-[11px] tracking-[0.2em] font-bold transition-all ${
                statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-surface text-white/25 hover:text-white/50"
              }`}
            >
              {s === "all" ? "ALL" : STATUS_LABELS[s].toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex gap-px">
          {(["all", "movie", "tv"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-5 py-2 text-[11px] tracking-[0.2em] font-bold transition-all ${
                typeFilter === t
                  ? "bg-white/10 text-white"
                  : "bg-surface text-white/25 hover:text-white/50"
              }`}
            >
              {t === "all" ? "ALL" : t === "tv" ? "SERIES" : "FILMS"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="font-heading text-6xl text-white/5 mb-4">EMPTY</div>
          <p className="text-white/20 text-sm tracking-wider">
            No titles found.{" "}
            <Link href="/watchlist/add" className="text-primary hover:underline">Add one</Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((item) => (
            <WatchCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
