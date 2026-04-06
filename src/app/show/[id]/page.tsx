"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, STATUS_LABELS } from "@/types";
import StatusBadge from "@/components/watchlist/StatusBadge";
import { getInitials, getPosterGradient, formatDate } from "@/lib/utils";

export default function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getItem, updateStatus, setRating, setReview, deleteItem } = useWatchlist();
  const item = getItem(id);
  const [reviewText, setReviewText] = useState(item?.review || "");
  const [isEditingReview, setIsEditingReview] = useState(false);

  if (!item) {
    return (
      <div className="text-center py-32">
        <div className="font-heading text-8xl text-white/5">404</div>
        <p className="text-white/45 tracking-wider mt-4">Title not found.</p>
        <Link href="/watchlist" className="inline-block mt-8 px-6 py-2.5 bg-primary text-white font-heading tracking-wider">
          BACK
        </Link>
      </div>
    );
  }

  const handleSaveReview = () => { setReview(item.id, reviewText); setIsEditingReview(false); };
  const handleDelete = () => { deleteItem(item.id); router.push("/watchlist"); };

  return (
    <div className="space-y-12">
      {/* Hero backdrop */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
        {item.posterUrl && (
          <div className="absolute inset-0">
            <img src={item.posterUrl} alt="" className="absolute inset-0 w-full h-full object-cover object-top opacity-20 blur-md scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <Link href="/watchlist" className="inline-flex items-center gap-2 text-white/40 hover:text-primary text-sm tracking-wider transition-colors mb-8">
            ← BACK
          </Link>
          <div className="flex flex-col sm:flex-row gap-8">
            {/* Poster */}
            <div className="w-full sm:w-56 shrink-0">
              <div className="relative aspect-[2/3] overflow-hidden shadow-2xl shadow-primary/10 border border-white/5">
                {item.posterUrl ? (
                  <img src={item.posterUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}>
                    <span className="text-white/10 text-7xl font-heading">{getInitials(item.title)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-xs text-white/45 tracking-[0.3em] mb-2">
                {item.year} <span className="text-primary">|</span> {item.mediaType === "tv" ? "SERIES" : "FILM"}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading tracking-wider leading-[0.9]">{item.title}</h1>
              <div className="w-12 h-0.5 bg-primary mt-4 mb-5" />

              <div className="flex flex-wrap gap-3 mb-4">
                {item.genre.map((g) => (
                  <span key={g} className="px-3 py-1 border border-white/10 text-xs text-white/40 tracking-wider uppercase">{g}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <StatusBadge status={item.status} />
                {item.rating !== null && (
                  <span className="font-heading text-3xl text-accent">{item.rating}<span className="text-white/40 text-xl">/10</span></span>
                )}
              </div>

              <div className="text-[11px] text-white/40 tracking-wider">
                ADDED {formatDate(item.addedAt).toUpperCase()} &middot; UPDATED {formatDate(item.updatedAt).toUpperCase()}
              </div>

              {item.synopsis && (
                <p className="text-white/40 leading-relaxed mt-6 max-w-xl">{item.synopsis}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Status */}
        <div>
          <h2 className="text-2xl font-heading tracking-wider mb-1">STATUS</h2>
          <div className="w-8 h-0.5 bg-primary mb-5" />
          <div className="flex flex-wrap gap-px">
            {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(([value, label]) => (
              <button
                key={value}
                onClick={() => updateStatus(item.id, value)}
                className={`px-5 py-2.5 text-[11px] tracking-[0.2em] font-bold transition-all ${
                  item.status === value ? "bg-primary text-white" : "bg-surface text-white/40 hover:text-white/60"
                }`}
              >
                {label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h2 className="text-2xl font-heading tracking-wider mb-1">RATING</h2>
          <div className="w-8 h-0.5 bg-primary mb-5" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setRating(item.id, n)}
                className={`w-12 h-12 text-sm font-heading text-lg tracking-wide transition-all duration-200 ${
                  item.rating !== null && n <= item.rating
                    ? "bg-primary text-white"
                    : "bg-surface text-white/30 hover:bg-surface-light hover:text-white/50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {item.rating !== null && (
            <p className="text-white/40 text-sm mt-3 tracking-wider">
              YOUR RATING: <span className="text-accent font-bold">{item.rating}/10</span>
            </p>
          )}
        </div>

        {/* Review */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-heading tracking-wider">REVIEW</h2>
            {!isEditingReview && (
              <button onClick={() => setIsEditingReview(true)} className="text-xs text-primary tracking-wider hover:text-primary-hover transition-colors">
                {item.review ? "EDIT" : "WRITE REVIEW"}
              </button>
            )}
          </div>
          <div className="w-8 h-0.5 bg-primary mb-5" />
          {isEditingReview ? (
            <div className="space-y-4">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Your thoughts..."
                rows={5}
                className="w-full bg-surface border border-white/5 px-4 py-3 focus:outline-none focus:border-primary/30 resize-none text-white/70 placeholder-white/35"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveReview} className="px-6 py-2 bg-primary text-white font-heading tracking-wider text-sm">SAVE</button>
                <button
                  onClick={() => { setReviewText(item.review || ""); setIsEditingReview(false); }}
                  className="px-6 py-2 bg-surface text-white/30 hover:text-white/50 font-heading tracking-wider text-sm transition-colors"
                >CANCEL</button>
              </div>
            </div>
          ) : item.review ? (
            <blockquote className="text-white/40 leading-relaxed border-l-2 border-primary pl-5 italic">
              &ldquo;{item.review}&rdquo;
            </blockquote>
          ) : (
            <p className="text-white/40 italic tracking-wider text-sm">No review yet.</p>
          )}
        </div>

        {/* Delete */}
        <button onClick={handleDelete} className="text-xs text-white/30 hover:text-primary tracking-[0.2em] transition-colors">
          REMOVE FROM WATCHLIST
        </button>
      </div>
    </div>
  );
}
