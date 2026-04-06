"use client";

import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, STATUS_LABELS } from "@/types";

export default function StatsPage() {
  const { items } = useWatchlist();

  const statusCounts: Record<WatchStatus, number> = {
    watching: 0, completed: 0, plan_to_watch: 0, dropped: 0,
  };
  items.forEach((i) => statusCounts[i.status]++);

  const genreCounts: Record<string, number> = {};
  items.forEach((i) => i.genre.forEach((g) => (genreCounts[g] = (genreCounts[g] || 0) + 1)));
  const topGenres = Object.entries(genreCounts).sort(([, a], [, b]) => b - a).slice(0, 10);
  const maxGenreCount = topGenres.length > 0 ? topGenres[0][1] : 1;

  const ratingDist: Record<number, number> = {};
  items.forEach((i) => {
    if (i.rating !== null) ratingDist[i.rating] = (ratingDist[i.rating] || 0) + 1;
  });
  const maxRatingCount = Math.max(...Object.values(ratingDist), 1);

  const movieCount = items.filter((i) => i.mediaType === "movie").length;
  const tvCount = items.filter((i) => i.mediaType === "tv").length;

  const completionRate = items.length > 0 ? Math.round((statusCounts.completed / items.length) * 100) : 0;

  const rated = items.filter((i) => i.rating !== null);
  const avgRating = rated.length > 0
    ? (rated.reduce((sum, i) => sum + i.rating!, 0) / rated.length).toFixed(1)
    : "—";

  const statusColors: Record<WatchStatus, string> = {
    watching: "bg-watching",
    completed: "bg-completed",
    plan_to_watch: "bg-plan",
    dropped: "bg-dropped",
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-1">Analytics</p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
          Your Insights
        </h1>
        <p className="text-foreground/30 mt-2">A breakdown of your viewing habits.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: items.length },
          { label: "Avg Rating", value: avgRating },
          { label: "Completion", value: `${completionRate}%` },
          { label: "Reviewed", value: items.filter((i) => i.review).length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-surface rounded-2xl p-5 border border-white/5">
            <div className="text-xs text-foreground/25 tracking-widest uppercase">{label}</div>
            <div className="text-3xl font-heading font-bold text-primary mt-2">{value}</div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-heading font-semibold mb-5">By Status</h2>
        <div className="space-y-3">
          {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(
            ([status, label]) => (
              <div key={status} className="flex items-center gap-3">
                <span className="w-28 text-sm text-foreground/30">{label}</span>
                <div className="flex-1 h-6 bg-white/3 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${statusColors[status]} rounded-full transition-all duration-700`}
                    style={{
                      width: items.length > 0 ? `${(statusCounts[status] / items.length) * 100}%` : "0%",
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-medium text-foreground/40">
                  {statusCounts[status]}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Type split */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-heading font-semibold mb-5">Films vs Series</h2>
        <div className="flex h-12 rounded-full overflow-hidden border border-white/5">
          {movieCount > 0 && (
            <div
              className="bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-sm font-bold text-white"
              style={{ width: `${(movieCount / items.length) * 100}%` }}
            >
              {movieCount}
            </div>
          )}
          {tvCount > 0 && (
            <div
              className="bg-gradient-to-r from-accent to-accent/70 flex items-center justify-center text-sm font-bold text-white"
              style={{ width: `${(tvCount / items.length) * 100}%` }}
            >
              {tvCount}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-3 text-sm text-foreground/30">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            Films ({movieCount})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            Series ({tvCount})
          </span>
        </div>
      </div>

      {/* Top genres */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-heading font-semibold mb-5">Top Genres</h2>
        <div className="space-y-2.5">
          {topGenres.map(([genre, count]) => (
            <div key={genre} className="flex items-center gap-3">
              <span className="w-24 text-sm text-foreground/30 truncate">{genre}</span>
              <div className="flex-1 h-5 bg-white/3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary/50 to-primary/30 rounded-full transition-all duration-700"
                  style={{ width: `${(count / maxGenreCount) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-sm text-foreground/30">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating distribution */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5">
        <h2 className="text-lg font-heading font-semibold mb-5">Rating Distribution</h2>
        <div className="flex items-end gap-2 h-40">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <div key={n} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end h-32">
                <div
                  className="w-full bg-gradient-to-t from-accent to-accent/40 rounded-t-lg transition-all duration-700"
                  style={{
                    height: ratingDist[n] ? `${(ratingDist[n] / maxRatingCount) * 100}%` : "0%",
                    minHeight: ratingDist[n] ? "8px" : "0px",
                  }}
                />
              </div>
              <span className="text-xs text-foreground/25 font-mono">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
