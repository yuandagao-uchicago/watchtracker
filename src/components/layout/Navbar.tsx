"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "HOME" },
  { href: "/watchlist", label: "WATCHLIST" },
  { href: "/watchlist/add", label: "ADD" },
  { href: "/recommend", label: "FOR YOU" },
  { href: "/stats", label: "STATS" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-1.5 h-6 bg-primary" />
            <span className="font-heading text-2xl tracking-wider text-white">
              WATCHTRACKER
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-4 text-[13px] font-medium tracking-widest transition-colors ${
                    active
                      ? "text-white"
                      : "text-white/30 hover:text-white/70"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-white/50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/5">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm tracking-widest font-medium border-l-2 transition-all ${
                    active
                      ? "border-primary text-white bg-white/3"
                      : "border-transparent text-white/30 hover:text-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
