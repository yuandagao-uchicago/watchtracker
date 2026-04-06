"use client";

import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { getRecommendations } from "@/lib/recommend";
import { getInitials, getPosterGradient } from "@/lib/utils";
import StatusBadge from "@/components/watchlist/StatusBadge";

export default function RecommendPage() {
  const { items } = useWatchlist();
  const recommendations = getRecommendations(items);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Recommended for You</h1>
        <p className="text-foreground/60">
          Suggestions based on your ratings and genre preferences.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-foreground/60 text-lg">
            Not enough data for recommendations yet
          </p>
          <p className="text-foreground/40 text-sm mt-2">
            Rate some completed items and add items to your &quot;Plan to Watch&quot;
            list to get personalized suggestions.
          </p>
          <Link
            href="/watchlist/add"
            className="inline-block mt-6 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            + Add to Watchlist
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map(({ item, reason }, index) => (
            <Link
              key={item.id}
              href={`/show/${item.id}`}
              className="flex items-center gap-5 bg-surface hover:bg-surface-light rounded-xl p-5 transition-colors"
            >
              <div className="text-2xl font-bold text-foreground/20 w-8 text-center shrink-0">
                {index + 1}
              </div>
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center shrink-0`}
              >
                <span className="text-white text-xl font-bold">
                  {getInitials(item.title)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm text-foreground/50 mt-0.5">
                  <span>{item.year}</span>
                  <span>&middot;</span>
                  <span>
                    {item.mediaType === "tv" ? "TV Show" : "Movie"}
                  </span>
                  <span>&middot;</span>
                  <span>{item.genre.join(", ")}</span>
                </div>
                <p className="text-sm text-primary mt-1">{reason}</p>
              </div>
              <StatusBadge status={item.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
