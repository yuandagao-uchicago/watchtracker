"use client";

import Link from "next/link";
import Image from "next/image";
import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, STATUS_LABELS } from "@/types";
import StatusBadge from "@/components/watchlist/StatusBadge";
import { getInitials, getPosterGradient, formatDate } from "@/lib/utils";

const statConfigs: { status: WatchStatus; color: string; icon: string }[] = [
  { status: "watching", color: "border-watching/50 bg-watching/5", icon: "▶" },
  { status: "completed", color: "border-completed/50 bg-completed/5", icon: "✓" },
  { status: "plan_to_watch", color: "border-plan/50 bg-plan/5", icon: "◷" },
  { status: "dropped", color: "border-dropped/50 bg-dropped/5", icon: "✕" },
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

  const avgRating =
    items.filter((i) => i.rating !== null).length > 0
      ? (
          items.filter((i) => i.rating !== null).reduce((sum, i) => sum + i.rating!, 0) /
          items.filter((i) => i.rating !== null).length
        ).toFixed(1)
      : "—";

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface via-deep to-surface border border-sand/10 p-8 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,164,78,0.08),_transparent_60%)]" />
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            Your <span className="text-sand">Watchlist</span>
          </h1>
          <p className="text-foreground/50 text-lg max-w-lg">
            {items.length} titles tracked. {counts.watching || 0} currently watching.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfigs.map(({ status, color, icon }) => (
          <div
            key={status}
            className={`rounded-xl p-5 border ${color} transition-all hover:scale-[1.02]`}
          >
            <div className="text-xl mb-2 opacity-60">{icon}</div>
            <div className="text-3xl font-bold">{counts[status] || 0}</div>
            <div className="text-sm text-foreground/40 tracking-wide uppercase mt-1">
              {STATUS_LABELS[status]}
            </div>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl p-5 border border-sand/10 bg-surface">
          <div className="text-sm text-foreground/40 uppercase tracking-wide mb-1">Total</div>
          <div className="text-3xl font-bold text-sand">{items.length}</div>
        </div>
        <div className="rounded-xl p-5 border border-sand/10 bg-surface">
          <div className="text-sm text-foreground/40 uppercase tracking-wide mb-1">Avg Rating</div>
          <div className="text-3xl font-bold text-sand">{avgRating}</div>
        </div>
        <div className="rounded-xl p-5 border border-sand/10 bg-surface col-span-2 lg:col-span-1">
          <div className="text-sm text-foreground/40 uppercase tracking-wide mb-1">Reviewed</div>
          <div className="text-3xl font-bold text-sand">
            {items.filter((i) => i.review).length}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/watchlist/add"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sand to-amber-700 hover:from-sand hover:to-amber-600 text-black rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-sand/10"
        >
          + Add New
        </Link>
        <Link
          href="/watchlist"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-sand/20 hover:bg-sand/5 text-foreground rounded-lg font-medium transition-all"
        >
          View Watchlist
        </Link>
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-sand/20 hover:bg-sand/5 text-foreground rounded-lg font-medium transition-all"
        >
          Get Recommendations
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4 tracking-wide">Recent Activity</h2>
        <div className="space-y-2">
          {recentItems.map((item) => (
            <Link
              key={item.id}
              href={`/show/${item.id}`}
              className="flex items-center gap-4 bg-surface hover:bg-surface-light border border-transparent hover:border-sand/10 rounded-xl p-3 transition-all duration-300"
            >
              {/* Poster thumbnail */}
              <div className="w-10 h-14 rounded overflow-hidden shrink-0 relative">
                {item.posterUrl ? (
                  <Image
                    src={item.posterUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}
                  >
                    <span className="text-white text-xs font-bold">
                      {getInitials(item.title)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.title}</div>
                <div className="text-sm text-foreground/40">
                  {item.year} &middot; {item.mediaType === "tv" ? "TV Show" : "Movie"}
                </div>
              </div>
              <StatusBadge status={item.status} />
              <div className="text-sm text-foreground/30 hidden sm:block">
                {formatDate(item.updatedAt)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
