# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (uses Turbopack)
npm run build      # Production build
npm run lint       # ESLint
npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Apply migrations
npm run db:seed      # Seed the database with initial data
```

There are no tests configured in this project.

## Architecture

**Stack:** Next.js 14 (App Router) + SQLite (via better-sqlite3) + Drizzle ORM + Tailwind CSS + shadcn/ui patterns.

**Database:** SQLite file at `./data/vibe-journal.db`. The schema is defined in `src/db/schema.ts` and tables are auto-created on startup in `src/db/index.ts` (no migration step needed for local dev). Drizzle migrations output to `./drizzle/`. `better-sqlite3` must be listed in `serverExternalPackages` in `next.config.js` to work with Next.js.

**Data model:**
- `pillars` — user-defined life themes/intentions (3–5, set during onboarding)
- `entries` — one journal entry per date (UNIQUE on `date` column, format: `YYYY-MM-DD`)
- `entry_tags` — links entries to pillars with optional confidence score
- `prompts` — writing prompts optionally linked to a pillar
- `settings` — key/value store for app settings

**API routes** (`src/app/api/`):
- `GET/POST /api/entries` — list entries (supports `from`, `to`, `limit` query params) or create
- `GET/PUT /api/entries/[date]` — fetch or update entry by date string
- `GET/POST /api/pillars` — list or create pillars
- `PUT/DELETE /api/pillars/[id]` — update or delete a pillar
- `GET /api/stats` — streak and total entry count calculations
- `GET /api/prompts/today` — fetch today's writing prompt
- `POST /api/onboarding` — create initial pillars in bulk

**Pages** (`src/app/`):
- `/` (home) — today's entry input + yesterday's entry; redirects to `/onboarding` if no pillars exist
- `/calendar` — monthly calendar view with date-selected entry display/edit
- `/review` — reverse-chronological list of all entries
- `/settings` — pillar management
- `/onboarding` — first-run setup to choose pillars

**Components** (`src/components/`): `EntryInput`, `EntryCard`, `CalendarView`, `PromptDisplay`, `StreakCounter`, `Nav`, `PillarForm`.

**Utilities** (`src/lib/utils.ts`): `cn()` (clsx + tailwind-merge), `getTodayDate()`, `getYesterdayDate()`, `formatDate()`, `formatDateShort()`. All date utilities return/accept `YYYY-MM-DD` strings; dates are constructed with `T12:00:00` suffix to avoid timezone offset issues.

**Typography:** `Source Serif 4` (`font-serif`, primary body/headings) and `DM Sans` (`font-sans`, UI labels/metadata) loaded via `next/font/google`.
