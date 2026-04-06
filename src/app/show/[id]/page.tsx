"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Not Found</h1>
        <p className="text-foreground/60 mb-6">
          This item doesn&apos;t exist in your watchlist.
        </p>
        <Link
          href="/watchlist"
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back link */}
      <Link
        href="/watchlist"
        className="inline-flex items-center gap-1 text-foreground/50 hover:text-foreground text-sm transition-colors"
      >
        ← Back to Watchlist
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div
          className={`w-full sm:w-48 h-56 rounded-xl bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center shrink-0`}
        >
          <span className="text-white text-6xl font-bold opacity-80">
            {getInitials(item.title)}
          </span>
        </div>
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <div className="flex items-center gap-3 text-foreground/60">
            <span>{item.year}</span>
            <span>&middot;</span>
            <span>{item.mediaType === "tv" ? "TV Show" : "Movie"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.genre.map((g) => (
              <span
                key={g}
                className="px-3 py-1 bg-white/5 rounded-full text-sm text-foreground/70"
              >
                {g}
              </span>
            ))}
          </div>
          <StatusBadge status={item.status} />
          <div className="text-sm text-foreground/40">
            Added {formatDate(item.addedAt)} &middot; Updated{" "}
            {formatDate(item.updatedAt)}
          </div>
        </div>
      </div>

      {/* Synopsis */}
      {item.synopsis && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Synopsis</h2>
          <p className="text-foreground/70 leading-relaxed">{item.synopsis}</p>
        </div>
      )}

      {/* Status control */}
      <div className="bg-surface rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Status</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() => updateStatus(item.id, value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.status === value
                    ? "bg-primary text-white"
                    : "bg-white/5 text-foreground/60 hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-surface rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Rating</h2>
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setRating(item.id, n)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                item.rating !== null && n <= item.rating
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-foreground/40 hover:bg-white/10"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {item.rating !== null && (
          <p className="text-foreground/50 text-sm">
            Your rating: <span className="text-yellow-400 font-semibold">{item.rating}/10</span>
          </p>
        )}
      </div>

      {/* Review */}
      <div className="bg-surface rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Review</h2>
          {!isEditingReview && (
            <button
              onClick={() => setIsEditingReview(true)}
              className="text-sm text-primary hover:text-primary-hover transition-colors"
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
              className="w-full bg-background border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveReview}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
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
          <p className="text-foreground/70 leading-relaxed">{item.review}</p>
        ) : (
          <p className="text-foreground/40 italic">No review yet</p>
        )}
      </div>

      {/* Delete */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm text-dropped hover:bg-dropped/10 rounded-lg transition-colors"
        >
          Remove from Watchlist
        </button>
      </div>
    </div>
  );
}
