import Link from "next/link";
import Image from "next/image";
import { WatchItem } from "@/types";
import StatusBadge from "./StatusBadge";
import { getInitials, getPosterGradient } from "@/lib/utils";

export default function WatchCard({ item }: { item: WatchItem }) {
  return (
    <Link
      href={`/show/${item.id}`}
      className="group card-glow bg-surface rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-sand/5"
    >
      {/* Poster */}
      <div className="relative h-64 overflow-hidden">
        {item.posterUrl ? (
          <>
            <Image
              src={item.posterUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
          </>
        ) : (
          <div
            className={`h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}
          >
            <span className="text-white/60 text-5xl font-bold">
              {getInitials(item.title)}
            </span>
          </div>
        )}
        {/* Rating badge overlay */}
        {item.rating !== null && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md border border-sand/20">
            <span className="text-sm font-bold text-sand">
              ★ {item.rating}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold leading-tight line-clamp-1 text-foreground group-hover:text-sand transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-foreground/40">
          <span>{item.year}</span>
          <span className="text-sand/30">/</span>
          <span>{item.mediaType === "tv" ? "TV Show" : "Movie"}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-0.5 bg-sand/5 border border-sand/10 rounded text-foreground/50"
            >
              {g}
            </span>
          ))}
        </div>
        <div className="pt-1">
          <StatusBadge status={item.status} />
        </div>
      </div>
    </Link>
  );
}
