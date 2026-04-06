export type MediaType = "movie" | "tv";

export type WatchStatus =
  | "plan_to_watch"
  | "watching"
  | "completed"
  | "dropped";

export interface WatchItem {
  id: string;
  title: string;
  mediaType: MediaType;
  genre: string[];
  year: number;
  posterUrl: string;
  synopsis: string;
  status: WatchStatus;
  rating: number | null;
  review: string | null;
  addedAt: string;
  updatedAt: string;
}

export const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
] as const;

export const STATUS_LABELS: Record<WatchStatus, string> = {
  plan_to_watch: "Plan to Watch",
  watching: "Watching",
  completed: "Completed",
  dropped: "Dropped",
};
