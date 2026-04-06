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
    "w-full bg-surface border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 placeholder-foreground/15 transition-all";

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-1">New Entry</p>
      <h1 className="text-3xl font-heading font-bold tracking-tight mb-8">
        Add to Collection
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/50">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Dark Knight"
            className={inputClass}
          />
          {errors.title && <p className="text-dropped text-sm mt-1.5">{errors.title}</p>}
        </div>

        {/* Poster URL */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/50">
            Poster URL <span className="text-foreground/20">(optional)</span>
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
          <label className="block text-sm font-medium mb-2 text-foreground/50">Type</label>
          <div className="flex gap-2">
            {(["movie", "tv"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMediaType(t)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  mediaType === t
                    ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                    : "text-foreground/30 hover:text-foreground/60 bg-surface hover:bg-surface-light"
                }`}
              >
                {t === "movie" ? "Film" : "Series"}
              </button>
            ))}
          </div>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/50">Year *</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2024"
            min="1900"
            max="2030"
            className={`${inputClass} sm:w-40`}
          />
          {errors.year && <p className="text-dropped text-sm mt-1.5">{errors.year}</p>}
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/50">
            Genres * <span className="text-foreground/20">(select at least one)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  selectedGenres.includes(genre)
                    ? "bg-primary/15 text-primary ring-1 ring-primary/20"
                    : "text-foreground/30 hover:text-foreground/60 bg-surface hover:bg-surface-light"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          {errors.genres && <p className="text-dropped text-sm mt-1.5">{errors.genres}</p>}
        </div>

        {/* Synopsis */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/50">Synopsis</label>
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
          <label className="block text-sm font-medium mb-2 text-foreground/50">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WatchStatus)}
            className={`${inputClass} sm:w-60`}
          >
            {(Object.entries(STATUS_LABELS) as [WatchStatus, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>{label}</option>
              )
            )}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/50">
            Rating <span className="text-foreground/20">(1-10, optional)</span>
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
          {errors.rating && <p className="text-dropped text-sm mt-1.5">{errors.rating}</p>}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-6">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary/70 text-white rounded-full font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            Add to Collection
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-white/10 hover:bg-surface text-foreground/60 rounded-full font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
