"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, STATUS_LABELS } from "@/types";
import { getStatusColor } from "@/lib/utils";

export default function StatsPage() {
  const { items } = useWatchlist();

  // Status counts
  const statusCounts: Record<WatchStatus, number> = {
    watching: 0,
    completed: 0,
    plan_to_watch: 0,
    dropped: 0,
  };
  items.forEach((i) => statusCounts[i.status]++);

  // Genre counts
  const genreCounts: Record<string, number> = {};
  items.forEach((i) =>
    i.genre.forEach((g) => (genreCounts[g] = (genreCounts[g] || 0) + 1))
  );
  const topGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);
  const maxGenreCount = topGenres.length > 0 ? topGenres[0][1] : 1;

  // Rating distribution
  const ratingDist: Record<number, number> = {};
  items.forEach((i) => {
    if (i.rating !== null) ratingDist[i.rating] = (ratingDist[i.rating] || 0) + 1;
  });
  const maxRatingCount = Math.max(...Object.values(ratingDist), 1);

  // Type split
  const movieCount = items.filter((i) => i.mediaType === "movie").length;
  const tvCount = items.filter((i) => i.mediaType === "tv").length;

  // Completion rate
  const completionRate =
    items.length > 0
      ? Math.round((statusCounts.completed / items.length) * 100)
      : 0;

  // Average rating
  const rated = items.filter((i) => i.rating !== null);
  const avgRating =
    rated.length > 0
      ? (rated.reduce((sum, i) => sum + i.rating!, 0) / rated.length).toFixed(1)
      : "—";

  const statusColors: Record<WatchStatus, string> = {
    watching: "bg-watching",
    completed: "bg-completed",
    plan_to_watch: "bg-plan",
    dropped: "bg-dropped",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Stats</h1>
        <p className="text-foreground/60">
          A breakdown of your watchlist activity.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-5">
          <div className="text-sm text-foreground/60">Total</div>
          <div className="text-3xl font-bold">{items.length}</div>
        </div>
        <div className="bg-surface rounded-xl p-5">
          <div className="text-sm text-foreground/60">Avg Rating</div>
          <div className="text-3xl font-bold">{avgRating}</div>
        </div>
        <div className="bg-surface rounded-xl p-5">
          <div className="text-sm text-foreground/60">Completion</div>
          <div className="text-3xl font-bold">{completionRate}%</div>
        </div>
        <div className="bg-surface rounded-xl p-5">
          <div className="text-sm text-foreground/60">Reviewed</div>
          <div className="text-3xl font-bold">
            {items.filter((i) => i.review).length}
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="bg-surface rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">By Status</h2>
        <div className="space-y-3">
          {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(
            ([status, label]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="w-28 text-sm text-foreground/60">{label}</span>
                <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${statusColors[status]} rounded-lg transition-all duration-500`}
                    style={{
                      width:
                        items.length > 0
                          ? `${(statusCounts[status] / items.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium">
                  {statusCounts[status]}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Type split */}
      <div className="bg-surface rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Movies vs TV Shows</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex h-10 rounded-lg overflow-hidden">
              {movieCount > 0 && (
                <div
                  className="bg-primary flex items-center justify-center text-sm font-medium text-white"
                  style={{
                    width: `${(movieCount / items.length) * 100}%`,
                  }}
                >
                  {movieCount}
                </div>
              )}
              {tvCount > 0 && (
                <div
                  className="bg-cyan-500 flex items-center justify-center text-sm font-medium text-white"
                  style={{
                    width: `${(tvCount / items.length) * 100}%`,
                  }}
                >
                  {tvCount}
                </div>
              )}
            </div>
            <div className="flex justify-between mt-2 text-sm text-foreground/60">
              <span>Movies ({movieCount})</span>
              <span>TV Shows ({tvCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top genres */}
      <div className="bg-surface rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Top Genres</h2>
        <div className="space-y-2">
          {topGenres.map(([genre, count]) => (
            <div key={genre} className="flex items-center gap-3">
              <span className="w-24 text-sm text-foreground/60 truncate">
                {genre}
              </span>
              <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden">
                <div
                  className="h-full bg-primary/60 rounded transition-all duration-500"
                  style={{ width: `${(count / maxGenreCount) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-sm">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating distribution */}
      <div className="bg-surface rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Rating Distribution</h2>
        <div className="flex items-end gap-2 h-32">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <div key={n} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end h-24">
                <div
                  className="w-full bg-yellow-400/70 rounded-t transition-all duration-500"
                  style={{
                    height: ratingDist[n]
                      ? `${(ratingDist[n] / maxRatingCount) * 100}%`
                      : "0%",
                    minHeight: ratingDist[n] ? "4px" : "0px",
                  }}
                />
              </div>
              <span className="text-xs text-foreground/50">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
