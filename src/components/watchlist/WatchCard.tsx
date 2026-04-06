import Link from "next/link";
import { WatchItem } from "@/types";
import StatusBadge from "./StatusBadge";
import { getInitials, getPosterGradient } from "@/lib/utils";

export default function WatchCard({ item }: { item: WatchItem }) {
  return (
    <Link
      href={`/show/${item.id}`}
      className="group bg-surface rounded-xl overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
    >
      {/* Poster */}
      <div
        className={`h-40 bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}
      >
        <span className="text-white text-4xl font-bold opacity-80 group-hover:opacity-100 transition-opacity">
          {getInitials(item.title)}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight line-clamp-2">
            {item.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-foreground/50">
          <span>{item.year}</span>
          <span>&middot;</span>
          <span>{item.mediaType === "tv" ? "TV Show" : "Movie"}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.genre.slice(0, 3).map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-foreground/60"
            >
              {g}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <StatusBadge status={item.status} />
          {item.rating !== null && (
            <span className="text-sm font-medium text-yellow-400">
              ★ {item.rating}/10
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
