import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { WatchlistProvider } from "@/context/WatchlistContext";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "WatchTracker — Movie & TV Show Watchlist",
  description:
    "Track movies and TV shows you want to watch, are watching, or have completed. Rate, review, and get recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <WatchlistProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </WatchlistProvider>
      </body>
    </html>
  );
}
