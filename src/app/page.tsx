"use client";

import Link from "next/link";
import Image from "next/image";
import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, STATUS_LABELS } from "@/types";
import StatusBadge from "@/components/watchlist/StatusBadge";
import { getInitials, getPosterGradient, formatDate } from "@/lib/utils";

export default function Dashboard() {
  const { items } = useWatchlist();

  const counts = items.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<WatchStatus, number>
  );

  const recentItems = [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const rated = items.filter((i) => i.rating !== null);
  const avgRating = rated.length > 0
    ? (rated.reduce((sum, i) => sum + i.rating!, 0) / rated.length).toFixed(1)
    : "—";

  // Hero featured poster
  const heroItem = items.find((i) => i.posterUrl && i.status === "watching") || items.find((i) => i.posterUrl);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
        {heroItem?.posterUrl && (
          <div className="absolute inset-0">
            <Image src={heroItem.posterUrl} alt="" fill className="object-cover object-top opacity-15 blur-sm scale-110" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="max-w-2xl">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading leading-[0.85] tracking-wide">
              YOUR<br />
              <span className="text-primary">WATCHLIST</span>
            </h1>
            <div className="w-16 h-1 bg-primary mt-6 mb-6" />
            <p className="text-white/40 text-lg">
              {items.length} titles &middot; {counts.watching || 0} watching &middot; avg {avgRating} rating
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-px bg-white/5">
        {([
          { label: "WATCHING", value: counts.watching || 0, color: "text-watching" },
          { label: "COMPLETED", value: counts.completed || 0, color: "text-completed" },
          { label: "PLAN TO WATCH", value: counts.plan_to_watch || 0, color: "text-white" },
          { label: "DROPPED", value: counts.dropped || 0, color: "text-dropped" },
        ] as const).map(({ label, value, color }) => (
          <div key={label} className="bg-black p-5 text-center">
            <div className={`text-4xl font-heading ${color}`}>{value}</div>
            <div className="text-[10px] tracking-[0.25em] text-white/20 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          href="/watchlist/add"
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-heading text-lg tracking-wider transition-colors"
        >
          + ADD TITLE
        </Link>
        <Link
          href="/watchlist"
          className="px-8 py-3 border border-white/20 hover:border-white/50 text-white font-heading text-lg tracking-wider transition-colors"
        >
          BROWSE ALL
        </Link>
        <Link
          href="/recommend"
          className="px-8 py-3 border border-white/20 hover:border-white/50 text-white font-heading text-lg tracking-wider transition-colors"
        >
          RECOMMENDATIONS
        </Link>
      </div>

      {/* Recently Updated */}
      <div>
        <h2 className="text-3xl font-heading tracking-wider mb-1">RECENTLY UPDATED</h2>
        <div className="w-10 h-0.5 bg-primary mb-8" />
        <div className="space-y-px">
          {recentItems.map((item, i) => (
            <Link
              key={item.id}
              href={`/show/${item.id}`}
              className="flex items-center gap-5 bg-surface hover:bg-surface-light p-4 transition-all duration-300 group border-l-2 border-transparent hover:border-primary"
            >
              <span className="text-white/10 font-heading text-3xl w-8">{String(i + 1).padStart(2, "0")}</span>
              <div className="w-10 h-14 shrink-0 relative overflow-hidden">
                {item.posterUrl ? (
                  <Image src={item.posterUrl} alt={item.title} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}>
                    <span className="text-white/20 text-xs font-bold">{getInitials(item.title)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading text-xl tracking-wide group-hover:text-primary transition-colors truncate">{item.title}</div>
                <div className="text-xs text-white/25 tracking-wider uppercase">
                  {item.year} <span className="text-primary">|</span> {item.mediaType === "tv" ? "Series" : "Film"}
                </div>
              </div>
              <StatusBadge status={item.status} />
              <div className="text-[11px] text-white/15 hidden sm:block tracking-wider">{formatDate(item.updatedAt)}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
