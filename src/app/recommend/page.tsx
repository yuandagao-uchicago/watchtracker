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
    <div className="space-y-10">
      <div>
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-1">Curated</p>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight">
          Recommended for You
        </h1>
        <p className="text-foreground/30 mt-2">
          Personalized picks based on your taste and ratings.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-foreground/40 text-lg font-heading">
            Not enough data yet
          </p>
          <p className="text-foreground/20 text-sm mt-2 max-w-sm mx-auto">
            Rate some completed titles and add items to your &quot;Plan to Watch&quot;
            list for personalized suggestions.
          </p>
          <Link
            href="/watchlist/add"
            className="inline-block mt-8 px-6 py-2.5 bg-gradient-to-r from-primary to-primary/70 text-white rounded-full font-semibold transition-all shadow-lg shadow-primary/20"
          >
            + Add to Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map(({ item, reason }, index) => (
            <Link
              key={item.id}
              href={`/show/${item.id}`}
              className="flex items-center gap-5 bg-surface/50 hover:bg-surface border border-transparent hover:border-primary/10 rounded-2xl p-4 transition-all duration-300 group"
            >
              {/* Rank */}
              <div className="text-4xl font-heading font-black text-foreground/[0.06] w-10 text-center shrink-0">
                {index + 1}
              </div>

              {/* Poster */}
              <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 relative shadow-lg shadow-black/40 border border-white/5">
                {item.posterUrl ? (
                  <Image src={item.posterUrl} alt={item.title} fill className="object-cover" sizes="56px" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}>
                    <span className="text-white/30 text-sm font-bold">{getInitials(item.title)}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm text-foreground/25 mt-0.5">
                  <span>{item.year}</span>
                  <span className="w-1 h-1 rounded-full bg-foreground/15" />
                  <span>{item.mediaType === "tv" ? "Series" : "Film"}</span>
                  <span className="w-1 h-1 rounded-full bg-foreground/15" />
                  <span>{item.genre.join(", ")}</span>
                </div>
                <p className="text-sm text-accent/70 mt-1 italic">{reason}</p>
              </div>
              <StatusBadge status={item.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
