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
      <div className="text-center py-24">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
          <span className="text-3xl opacity-30">?</span>
        </div>
        <h1 className="text-2xl font-heading font-bold mb-2">Not Found</h1>
        <p className="text-foreground/30 mb-8">
          This title doesn&apos;t exist in your collection.
        </p>
        <Link
          href="/watchlist"
          className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary/70 text-white rounded-full font-semibold transition-all"
        >
          Back to Collection
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
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Back link */}
      <Link
        href="/watchlist"
        className="inline-flex items-center gap-2 text-foreground/30 hover:text-primary text-sm transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Collection
      </Link>

      {/* Header with poster */}
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Poster */}
        <div className="w-full sm:w-64 shrink-0">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/5">
            {item.posterUrl ? (
              <Image
                src={item.posterUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="256px"
                priority
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}
              >
                <span className="text-white/20 text-7xl font-heading font-bold">
                  {getInitials(item.title)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-5">
          <div>
            <div className="flex items-center gap-3 text-foreground/30 text-sm mb-2">
              <span>{item.year}</span>
              <span className="w-1 h-1 rounded-full bg-foreground/20" />
              <span>{item.mediaType === "tv" ? "Series" : "Film"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight leading-tight">{item.title}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.genre.map((g) => (
              <span
                key={g}
                className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-sm text-foreground/50"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <StatusBadge status={item.status} />
            {item.rating !== null && (
              <div className="flex items-center gap-1.5">
                <span className="text-accent text-lg font-bold">{item.rating}</span>
                <span className="text-foreground/25 text-sm">/10</span>
              </div>
            )}
          </div>

          <div className="text-xs text-foreground/20 font-mono">
            Added {formatDate(item.addedAt)} &middot; Updated {formatDate(item.updatedAt)}
          </div>

          {/* Synopsis */}
          {item.synopsis && (
            <p className="text-foreground/50 leading-relaxed pt-4 border-t border-white/5">
              {item.synopsis}
            </p>
          )}
        </div>
      </div>

      {/* Status control */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
        <h2 className="text-lg font-heading font-semibold">Status</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() => updateStatus(item.id, value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  item.status === value
                    ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                    : "text-foreground/30 hover:text-foreground/60 hover:bg-white/3"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
        <h2 className="text-lg font-heading font-semibold">Your Rating</h2>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setRating(item.id, n)}
              className={`w-11 h-11 rounded-xl text-sm font-bold transition-all duration-200 ${
                item.rating !== null && n <= item.rating
                  ? "bg-gradient-to-br from-accent to-accent/70 text-white shadow-md shadow-accent/20"
                  : "bg-white/3 text-foreground/20 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {item.rating !== null && (
          <p className="text-foreground/30 text-sm">
            Your rating: <span className="text-accent font-semibold">{item.rating}/10</span>
          </p>
        )}
      </div>

      {/* Review */}
      <div className="bg-surface rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold">Review</h2>
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
              className="w-full bg-deep border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-foreground/80 placeholder-foreground/20"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveReview}
                className="px-5 py-2 bg-gradient-to-r from-primary to-primary/70 text-white rounded-full text-sm font-semibold transition-all"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setReviewText(item.review || "");
                  setIsEditingReview(false);
                }}
                className="px-5 py-2 bg-white/5 hover:bg-white/8 rounded-full text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : item.review ? (
          <blockquote className="text-foreground/50 leading-relaxed italic border-l-2 border-primary/30 pl-4">
            &ldquo;{item.review}&rdquo;
          </blockquote>
        ) : (
          <p className="text-foreground/20 italic">No review yet</p>
        )}
      </div>

      {/* Delete */}
      <div className="pt-2">
        <button
          onClick={handleDelete}
          className="text-sm text-foreground/20 hover:text-dropped transition-colors"
        >
          Remove from collection
        </button>
      </div>
    </div>
  );
}
