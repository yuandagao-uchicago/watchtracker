import Link from "next/link";
import Image from "next/image";
import { WatchItem } from "@/types";
import StatusBadge from "./StatusBadge";
import { getInitials, getPosterGradient } from "@/lib/utils";

export default function WatchCard({ item }: { item: WatchItem }) {
  return (
    <Link
      href={`/show/${item.id}`}
      className="group card-glow bg-surface rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {item.posterUrl ? (
          <>
            <Image
              src={item.posterUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
          </>
        ) : (
          <div
            className={`h-full bg-gradient-to-br ${getPosterGradient(item.id)} flex items-center justify-center`}
          >
            <span className="text-white/30 text-6xl font-heading font-bold">
              {getInitials(item.title)}
            </span>
          </div>
        )}

        {/* Rating overlay */}
        {item.rating !== null && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            <span className="text-sm font-bold text-accent">
              {item.rating}<span className="text-foreground/40 text-xs">/10</span>
            </span>
          </div>
        )}

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="font-heading font-bold text-lg leading-tight text-white drop-shadow-lg line-clamp-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span>{item.year}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>{item.mediaType === "tv" ? "Series" : "Film"}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] px-2 py-0.5 bg-white/5 backdrop-blur-sm rounded-full text-white/50 border border-white/5"
              >
                {g}
              </span>
            ))}
          </div>
          <StatusBadge status={item.status} />
        </div>
      </div>
    </Link>
  );
}
