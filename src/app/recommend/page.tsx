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
    <div className="space-y-10">
      <div>
        <h1 className="text-5xl font-heading tracking-wider">
          RECOMMENDED<br /><span className="text-primary">FOR YOU</span>
        </h1>
        <div className="w-12 h-0.5 bg-primary mt-4" />
        <p className="text-white/50 mt-4 tracking-wider text-sm">Based on your ratings and taste.</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-32">
          <div className="font-heading text-7xl text-white/5">NO DATA</div>
          <p className="text-white/40 text-sm tracking-wider mt-4 max-w-sm mx-auto">
            Rate completed titles and add to your plan to watch list for personalized picks.
          </p>
          <Link href="/watchlist/add" className="inline-block mt-8 px-8 py-3 bg-primary text-white font-heading tracking-wider">
            + ADD TITLE
          </Link>
        </div>
      ) : (
        <div className="space-y-px">
          {recommendations.map(({ item, reason }, index) => (
            <Link
              key={item.id}
              href={`/show/${item.id}`}
              className="flex items-center gap-5 bg-surface hover:bg-surface-light p-4 transition-all duration-300 group border-l-2 border-transparent hover:border-primary"
            >
              <span className="font-heading text-4xl text-white/[0.04] w-12 text-center">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="w-12 h-18 shrink-0 relative overflow-hidden shadow-lg border border-white/5">
                {item.posterUrl ? (
                  <img src={item.posterUrl} alt={item.title} className="w-12 h-[72px] object-cover" />
                ) : (
                  <div className={`w-12 h-18 bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}>
                    <span className="text-white/15 text-xs font-bold">{getInitials(item.title)}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-2xl tracking-wide group-hover:text-primary transition-colors">{item.title}</h3>
                <div className="text-xs text-white/40 tracking-wider mt-0.5">
                  {item.year} <span className="text-primary">|</span> {item.mediaType === "tv" ? "SERIES" : "FILM"} <span className="text-primary">|</span> {item.genre.join(", ").toUpperCase()}
                </div>
                <p className="text-xs text-accent/60 mt-1 italic">{reason}</p>
              </div>
              <StatusBadge status={item.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
