"use client";

import Link from "next/link";
import Image from "next/image";
import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, STATUS_LABELS } from "@/types";
import StatusBadge from "@/components/watchlist/StatusBadge";
import { getInitials, getPosterGradient, formatDate } from "@/lib/utils";

const statConfigs: { status: WatchStatus; icon: string; gradient: string }[] = [
  { status: "watching", icon: "▶", gradient: "from-watching/20 to-watching/5" },
  { status: "completed", icon: "✓", gradient: "from-completed/20 to-completed/5" },
  { status: "plan_to_watch", icon: "◷", gradient: "from-plan/20 to-plan/5" },
  { status: "dropped", icon: "✕", gradient: "from-dropped/20 to-dropped/5" },
];

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
  const avgRating =
    rated.length > 0
      ? (rated.reduce((sum, i) => sum + i.rating!, 0) / rated.length).toFixed(1)
      : "—";

  // Get 4 featured posters for the hero
  const featured = items.filter((i) => i.posterUrl).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-surface to-accent/5 border border-primary/10 p-8 sm:p-12 min-h-[280px]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        {/* Floating poster thumbnails */}
        <div className="absolute top-6 right-6 hidden lg:flex gap-3 opacity-40">
          {featured.map((item, i) => (
            <div
              key={item.id}
              className="w-20 h-28 rounded-xl overflow-hidden shadow-2xl border border-white/5"
              style={{ transform: `rotate(${(i - 1.5) * 4}deg) translateY(${i * 6}px)` }}
            >
              <Image
                src={item.posterUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>

        <div className="relative">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Your Library</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-4">
            {items.length} Titles<br />
            <span className="text-foreground/30">Tracked</span>
          </h1>
          <p className="text-foreground/40 text-lg max-w-md">
            {counts.watching || 0} currently watching &middot; {counts.completed || 0} completed &middot; Avg {avgRating} rating
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfigs.map(({ status, icon, gradient }) => (
          <div
            key={status}
            className={`rounded-2xl p-5 bg-gradient-to-br ${gradient} border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:border-white/10`}
          >
            <div className="text-lg mb-3 opacity-50">{icon}</div>
            <div className="text-3xl font-heading font-bold">{counts[status] || 0}</div>
            <div className="text-xs text-foreground/35 tracking-widest uppercase mt-1">
              {STATUS_LABELS[status]}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/watchlist/add"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/70 hover:from-primary hover:to-primary text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30"
        >
          + Add New Title
        </Link>
        <Link
          href="/watchlist"
          className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-primary/30 hover:bg-primary/5 text-foreground/70 rounded-full font-medium transition-all"
        >
          Browse Collection
        </Link>
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-accent/30 hover:bg-accent/5 text-foreground/70 rounded-full font-medium transition-all"
        >
          Get Recommendations
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-2xl font-heading font-bold mb-6">Recently Updated</h2>
        <div className="space-y-2">
          {recentItems.map((item) => (
            <Link
              key={item.id}
              href={`/show/${item.id}`}
              className="flex items-center gap-4 bg-surface/50 hover:bg-surface border border-transparent hover:border-primary/10 rounded-2xl p-3.5 transition-all duration-300 group"
            >
              {/* Poster thumbnail */}
              <div className="w-11 h-16 rounded-xl overflow-hidden shrink-0 relative shadow-lg shadow-black/40 border border-white/5">
                {item.posterUrl ? (
                  <Image src={item.posterUrl} alt={item.title} fill className="object-cover" sizes="44px" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}>
                    <span className="text-white/40 text-xs font-bold">{getInitials(item.title)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium group-hover:text-primary transition-colors truncate">{item.title}</div>
                <div className="text-sm text-foreground/30">
                  {item.year} &middot; {item.mediaType === "tv" ? "Series" : "Film"}
                </div>
              </div>
              <StatusBadge status={item.status} />
              <div className="text-xs text-foreground/20 hidden sm:block font-mono">
                {formatDate(item.updatedAt)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
