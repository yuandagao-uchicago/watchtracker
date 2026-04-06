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
  const [posterUrl, setPosterUrl] = useState("");
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
      posterUrl: posterUrl.trim(),
      synopsis: synopsis.trim(),
      status,
      rating: rating ? parseInt(rating) : null,
      review: null,
    });

    router.push("/watchlist");
  };

  const inputClass =
    "w-full bg-surface border border-sand/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sand/20 focus:border-sand/20 placeholder-foreground/25";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Add to <span className="text-sand">Watchlist</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 tracking-wide text-foreground/70">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Dark Knight"
            className={inputClass}
          />
          {errors.title && (
            <p className="text-dropped text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Poster URL */}
        <div>
          <label className="block text-sm font-medium mb-2 tracking-wide text-foreground/70">
            Poster URL <span className="text-foreground/30 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            placeholder="https://image.tmdb.org/t/p/w500/..."
            className={inputClass}
          />
        </div>

        {/* Media Type */}
        <div>
          <label className="block text-sm font-medium mb-2 tracking-wide text-foreground/70">Type</label>
          <div className="flex gap-3">
            {(["movie", "tv"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMediaType(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  mediaType === t
                    ? "bg-sand/15 text-sand border border-sand/20"
                    : "bg-surface text-foreground/40 hover:bg-surface-light border border-transparent"
                }`}
              >
                {t === "movie" ? "Movie" : "TV Show"}
              </button>
            ))}
          </div>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-2 tracking-wide text-foreground/70">Year *</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2024"
            min="1900"
            max="2030"
            className={`${inputClass} sm:w-40`}
          />
          {errors.year && (
            <p className="text-dropped text-sm mt-1">{errors.year}</p>
          )}
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium mb-2 tracking-wide text-foreground/70">
            Genres * <span className="text-foreground/30 font-normal">(select at least one)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedGenres.includes(genre)
                    ? "bg-sand/15 text-sand border border-sand/20"
                    : "bg-surface text-foreground/40 hover:bg-surface-light border border-transparent"
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
          <label className="block text-sm font-medium mb-2 tracking-wide text-foreground/70">Synopsis</label>
          <textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            placeholder="Brief description..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2 tracking-wide text-foreground/70">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WatchStatus)}
            className={`${inputClass} sm:w-60`}
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
          <label className="block text-sm font-medium mb-2 tracking-wide text-foreground/70">
            Rating <span className="text-foreground/30 font-normal">(1-10, optional)</span>
          </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="—"
            min="1"
            max="10"
            className={`${inputClass} sm:w-32`}
          />
          {errors.rating && (
            <p className="text-dropped text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-sand to-amber-700 hover:from-sand hover:to-amber-600 text-black rounded-lg font-semibold transition-all shadow-lg shadow-sand/10"
          >
            Add to Watchlist
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-sand/10 hover:bg-sand/5 text-foreground rounded-lg font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
