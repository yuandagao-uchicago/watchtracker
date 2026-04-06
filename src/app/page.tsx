"use client";

import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, STATUS_LABELS } from "@/types";
import StatusBadge from "@/components/watchlist/StatusBadge";
import { getInitials, getPosterGradient, formatDate } from "@/lib/utils";

const statConfigs: { status: WatchStatus; color: string; icon: string }[] = [
  { status: "watching", color: "border-watching", icon: "▶" },
  { status: "completed", color: "border-completed", icon: "✓" },
  { status: "plan_to_watch", color: "border-plan", icon: "+" },
  { status: "dropped", color: "border-dropped", icon: "✕" },
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground/60">
          Welcome back! You have {items.length} items in your watchlist.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfigs.map(({ status, color, icon }) => (
          <div
            key={status}
            className={`bg-surface rounded-xl p-5 border-l-4 ${color}`}
          >
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-3xl font-bold">{counts[status] || 0}</div>
            <div className="text-sm text-foreground/60">
              {STATUS_LABELS[status]}
            </div>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl p-5">
          <div className="text-sm text-foreground/60 mb-1">Total Items</div>
          <div className="text-3xl font-bold">{items.length}</div>
        </div>
        <div className="bg-surface rounded-xl p-5">
          <div className="text-sm text-foreground/60 mb-1">Avg Rating</div>
          <div className="text-3xl font-bold">{avgRating}</div>
        </div>
        <div className="bg-surface rounded-xl p-5 col-span-2 lg:col-span-1">
          <div className="text-sm text-foreground/60 mb-1">Reviewed</div>
          <div className="text-3xl font-bold">
            {items.filter((i) => i.review).length}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/watchlist/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
        >
          + Add New
        </Link>
        <Link
          href="/watchlist"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-light text-foreground rounded-lg font-medium transition-colors"
        >
          View Watchlist
        </Link>
        <Link
          href="/recommend"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-light text-foreground rounded-lg font-medium transition-colors"
        >
          Get Recommendations
        </Link>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentItems.map((item) => (
            <Link
              key={item.id}
              href={`/show/${item.id}`}
              className="flex items-center gap-4 bg-surface hover:bg-surface-light rounded-xl p-4 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center text-white font-bold text-sm shrink-0`}
              >
                {getInitials(item.title)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{item.title}</div>
                <div className="text-sm text-foreground/50">
                  {item.year} &middot; {item.mediaType === "tv" ? "TV Show" : "Movie"}
                </div>
              </div>
              <StatusBadge status={item.status} />
              <div className="text-sm text-foreground/40 hidden sm:block">
                {formatDate(item.updatedAt)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
