# WatchTracker

A personal watchlist app for movies and TV shows built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State**: React Context + useReducer (client-side, in-memory)
- **Testing**: Playwright

## Pages / Routes

| Route | Description |
|---|---|
| `/` | Dashboard — overview stats, recent additions, quick links |
| `/watchlist` | Full watchlist with filters (status, type, search) |
| `/watchlist/add` | Form to add a new movie or show |
| `/show/[id]` | Dynamic detail page — view/edit rating, review, status |
| `/recommend` | Recommendations based on your ratings and genre preferences |
| `/stats` | Visual stats — genre breakdown, rating distribution, status counts |

## Data Model

```typescript
type MediaType = "movie" | "tv"
type WatchStatus = "plan_to_watch" | "watching" | "completed" | "dropped"

interface WatchItem {
  id: string
  title: string
  mediaType: MediaType
  genre: string[]
  year: number
  posterUrl: string
  synopsis: string
  status: WatchStatus
  rating: number | null      // 1-10
  review: string | null
  addedAt: string            // ISO date
  updatedAt: string          // ISO date
}
```

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Running Tests

```bash
npx playwright test
```

## State Management

All data lives in-memory via React Context (`src/context/WatchlistContext.tsx`). The app is seeded with sample data on load. Data resets on page refresh.

## Project Structure

```
src/
  app/              — Pages and layouts (App Router)
  components/       — Reusable UI components
  context/          — WatchlistContext (state management)
  types/            — TypeScript interfaces
  data/             — Seed data and constants
  lib/              — Utility functions and recommendation algorithm
```
