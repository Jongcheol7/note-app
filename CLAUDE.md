# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack note-taking app built with Next.js 15 (App Router), React 19, PostgreSQL, and Prisma. JavaScript only (no TypeScript). UI text is in Korean.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # prisma generate && next build
npm run start      # Start production server
npm run lint       # next lint
npx prisma studio  # View/edit database in browser
npx prisma generate # Regenerate Prisma client after schema changes
```

## Architecture

### Routing & API

- **App Router** with grouped routes: `(notes)`, `(calendar)`, `(category)`, `(settings)`
- Dynamic route: `/notes/[no]` for individual notes
- API routes under `app/api/` — RESTful, all require auth via NextAuth session
- Cursor-based pagination (uses `noteNo` as cursor, not offset)

### Data Flow

- **Server state**: React Query (TanStack Query v5) with infinite queries for note lists
- **Client state**: Zustand stores in `store/` — form state, navigation menu, category, color, search
- **HTTP**: Axios for all API calls
- **Auth**: NextAuth v4 with Google OAuth only, Prisma adapter, database sessions. Session callback adds `user.id`.

### Code Organization

- `app/` — Routes and API handlers
- `modules/` — Feature-level page components (notes, calendar, category, settings, common)
- `hooks/` — React Query hooks per feature (notes, category, settings)
- `store/` — Zustand stores
- `components/ui/` — shadcn/ui primitives (new-york style, lucide icons)
- `components/common/` — Providers (Session, ReactQuery)
- `lib/prisma.js` — Prisma singleton
- `prisma/schema.prisma` — Database schema

### Path Aliases (jsconfig.json)

- `@/*` → root, `@app/*` → app/, `@store/*` → store/, `@components/*` → components/, `@lib/*` → lib/

### Database (PostgreSQL + Prisma)

Key models: User, Account, Session, Note, Category, Tags, Like, UserSettings

Notable patterns:
- **Soft deletes**: Notes use `delDatetime` field (not hard delete)
- **Pin sorting**: `isPinned` DESC → `pinDatetime` DESC → `modDatetime` DESC
- **Menu filtering**: `menuFrom` param filters by "", "secret", "trash", "community"
- **KST timezone**: Manually applied (+9h) in `api/notes/save`

### Rich Text Editor

TipTap v3 with extensions: text styling, colors, font size, lists, task lists, alignment, images. Custom `ResizableImageComponent` for image resize. Images uploaded to S3, served via CloudFront. HTML sanitized with DOMPurify.

### Environment Variables

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME`, plus AWS S3 credentials.
