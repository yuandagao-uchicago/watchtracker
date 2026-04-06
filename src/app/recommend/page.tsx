"use client";

import Link from "next/link";
import Image from "next/image";
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Recommended <span className="text-sand">for You</span>
        </h1>
        <p className="text-foreground/40">
          Curated suggestions based on your ratings and genre preferences.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 opacity-20">🎯</div>
          <p className="text-foreground/50 text-lg">
            Not enough data for recommendations yet
          </p>
          <p className="text-foreground/30 text-sm mt-2">
            Rate some completed items and add items to your &quot;Plan to Watch&quot;
            list to get personalized suggestions.
          </p>
          <Link
            href="/watchlist/add"
            className="inline-block mt-6 px-6 py-2.5 bg-gradient-to-r from-sand to-amber-700 text-black rounded-lg font-semibold transition-all shadow-lg shadow-sand/10"
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
              className="flex items-center gap-5 bg-surface hover:bg-surface-light border border-sand/5 hover:border-sand/15 rounded-xl p-4 transition-all duration-300"
            >
              {/* Rank */}
              <div className="text-3xl font-black text-sand/15 w-8 text-center shrink-0">
                {index + 1}
              </div>

              {/* Poster */}
              <div className="w-14 h-20 rounded-lg overflow-hidden shrink-0 relative shadow-lg shadow-black/30">
                {item.posterUrl ? (
                  <Image
                    src={item.posterUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}
                  >
                    <span className="text-white text-sm font-bold">
                      {getInitials(item.title)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm text-foreground/35 mt-0.5">
                  <span>{item.year}</span>
                  <span className="text-sand/20">/</span>
                  <span>
                    {item.mediaType === "tv" ? "TV Show" : "Movie"}
                  </span>
                  <span className="text-sand/20">/</span>
                  <span>{item.genre.join(", ")}</span>
                </div>
                <p className="text-sm text-sand/80 mt-1 italic">{reason}</p>
              </div>
              <StatusBadge status={item.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
