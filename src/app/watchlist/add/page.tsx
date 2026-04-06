"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWatchlist } from "@/context/WatchlistContext";
import { GENRES, MediaType, WatchStatus, STATUS_LABELS } from "@/types";

export default function AddItemPage() {
  const router = useRouter();
  const { addItem } = useWatchlist();

  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [year, setYear] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [synopsis, setSynopsis] = useState("");
  const [status, setStatus] = useState<WatchStatus>("plan_to_watch");
  const [rating, setRating] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    if (!year.trim()) errs.year = "Year is required";
    else if (parseInt(year) < 1900 || parseInt(year) > 2030)
      errs.year = "Year must be between 1900 and 2030";
    if (selectedGenres.length === 0) errs.genres = "Select at least one genre";
    if (rating && (parseInt(rating) < 1 || parseInt(rating) > 10))
      errs.rating = "Rating must be 1-10";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    addItem({
      title: title.trim(),
      mediaType,
      genre: selectedGenres,
      year: parseInt(year),
      posterUrl: "",
      synopsis: synopsis.trim(),
      status,
      rating: rating ? parseInt(rating) : null,
      review: null,
    });

    router.push("/watchlist");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add to Watchlist</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Dark Knight"
            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {errors.title && (
            <p className="text-dropped text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Media Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="flex gap-3">
            {(["movie", "tv"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMediaType(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mediaType === t
                    ? "bg-primary text-white"
                    : "bg-surface text-foreground/60 hover:bg-surface-light"
                }`}
              >
                {t === "movie" ? "Movie" : "TV Show"}
              </button>
            ))}
          </div>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-2">Year *</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2024"
            min="1900"
            max="2030"
            className="w-full sm:w-40 bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {errors.year && (
            <p className="text-dropped text-sm mt-1">{errors.year}</p>
          )}
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Genres * <span className="text-foreground/40 font-normal">(select at least one)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedGenres.includes(genre)
                    ? "bg-primary text-white"
                    : "bg-surface text-foreground/60 hover:bg-surface-light"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          {errors.genres && (
            <p className="text-dropped text-sm mt-1">{errors.genres}</p>
          )}
        </div>

        {/* Synopsis */}
        <div>
          <label className="block text-sm font-medium mb-2">Synopsis</label>
          <textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            placeholder="Brief description..."
            rows={3}
            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WatchStatus)}
            className="w-full sm:w-60 bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating <span className="text-foreground/40 font-normal">(1-10, optional)</span>
          </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="—"
            min="1"
            max="10"
            className="w-full sm:w-32 bg-surface border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {errors.rating && (
            <p className="text-dropped text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            Add to Watchlist
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-surface hover:bg-surface-light text-foreground rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
