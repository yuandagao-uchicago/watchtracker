"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useWatchlist } from "@/context/WatchlistContext";
import { WatchStatus, STATUS_LABELS } from "@/types";
import StatusBadge from "@/components/watchlist/StatusBadge";
import { getInitials, getPosterGradient, formatDate } from "@/lib/utils";

export default function ShowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getItem, updateStatus, setRating, setReview, deleteItem } =
    useWatchlist();
  const item = getItem(id);

  const [reviewText, setReviewText] = useState(item?.review || "");
  const [isEditingReview, setIsEditingReview] = useState(false);

  if (!item) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4 opacity-20">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Not Found</h1>
        <p className="text-foreground/40 mb-6">
          This item doesn&apos;t exist in your watchlist.
        </p>
        <Link
          href="/watchlist"
          className="px-5 py-2.5 bg-gradient-to-r from-sand to-amber-700 text-black rounded-lg font-semibold transition-all"
        >
          Back to Watchlist
        </Link>
      </div>
    );
  }

  const handleSaveReview = () => {
    setReview(item.id, reviewText);
    setIsEditingReview(false);
  };

  const handleDelete = () => {
    deleteItem(item.id);
    router.push("/watchlist");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        href="/watchlist"
        className="inline-flex items-center gap-1 text-foreground/40 hover:text-sand text-sm transition-colors tracking-wide"
      >
        ← Back to Watchlist
      </Link>

      {/* Header with poster */}
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Poster */}
        <div className="w-full sm:w-56 shrink-0">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-sand/10">
            {item.posterUrl ? (
              <Image
                src={item.posterUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="224px"
                priority
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}
              >
                <span className="text-white/60 text-6xl font-bold">
                  {getInitials(item.title)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{item.title}</h1>
          <div className="flex items-center gap-3 text-foreground/40">
            <span className="text-lg">{item.year}</span>
            <span className="text-sand/30">/</span>
            <span className="text-lg">{item.mediaType === "tv" ? "TV Show" : "Movie"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.genre.map((g) => (
              <span
                key={g}
                className="px-3 py-1 bg-sand/5 border border-sand/10 rounded text-sm text-foreground/60"
              >
                {g}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={item.status} />
            {item.rating !== null && (
              <span className="text-sand font-bold">★ {item.rating}/10</span>
            )}
          </div>
          <div className="text-sm text-foreground/30">
            Added {formatDate(item.addedAt)} &middot; Updated{" "}
            {formatDate(item.updatedAt)}
          </div>

          {/* Synopsis */}
          {item.synopsis && (
            <p className="text-foreground/60 leading-relaxed pt-2 border-t border-sand/10">
              {item.synopsis}
            </p>
          )}
        </div>
      </div>

      {/* Status control */}
      <div className="bg-surface rounded-xl p-6 border border-sand/5 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">Status</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() => updateStatus(item.id, value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  item.status === value
                    ? "bg-sand/15 text-sand border border-sand/20"
                    : "bg-white/3 text-foreground/40 hover:text-foreground/70 hover:bg-white/5 border border-transparent"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-surface rounded-xl p-6 border border-sand/5 space-y-4">
        <h2 className="text-lg font-semibold tracking-wide">Rating</h2>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setRating(item.id, n)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 ${
                item.rating !== null && n <= item.rating
                  ? "bg-gradient-to-br from-sand to-amber-700 text-black shadow-md shadow-sand/20"
                  : "bg-white/3 text-foreground/30 hover:bg-sand/10 hover:text-sand border border-transparent hover:border-sand/20"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {item.rating !== null && (
          <p className="text-foreground/40 text-sm">
            Your rating: <span className="text-sand font-semibold">{item.rating}/10</span>
          </p>
        )}
      </div>

      {/* Review */}
      <div className="bg-surface rounded-xl p-6 border border-sand/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-wide">Review</h2>
          {!isEditingReview && (
            <button
              onClick={() => setIsEditingReview(true)}
              className="text-sm text-sand hover:text-primary-hover transition-colors"
            >
              {item.review ? "Edit" : "Write a review"}
            </button>
          )}
        </div>
        {isEditingReview ? (
          <div className="space-y-3">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you think?"
              rows={4}
              className="w-full bg-deep border border-sand/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sand/20 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveReview}
                className="px-4 py-2 bg-gradient-to-r from-sand to-amber-700 text-black rounded-lg text-sm font-semibold transition-all"
              >
                Save Review
              </button>
              <button
                onClick={() => {
                  setReviewText(item.review || "");
                  setIsEditingReview(false);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : item.review ? (
          <p className="text-foreground/60 leading-relaxed italic">&ldquo;{item.review}&rdquo;</p>
        ) : (
          <p className="text-foreground/30 italic">No review yet</p>
        )}
      </div>

      {/* Delete */}
      <div className="pt-4 border-t border-sand/5">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm text-dropped/70 hover:text-dropped hover:bg-dropped/5 rounded-lg transition-all"
        >
          Remove from Watchlist
        </button>
      </div>
    </div>
  );
}
