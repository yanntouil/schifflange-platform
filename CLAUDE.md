# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Schifflange Platform is a monorepo workspace containing a full-stack web application with an AdonisJS backend, Next.js website, and Vite-powered dashboard. The platform manages content, media, projects, and articles for the Schifflange website with multi-language support.

## Monorepo Structure

This is an npm workspaces monorepo with the following structure:

- **`apps/dashboard/`** - Vite + React admin dashboard application
- **`sites/schifflange-website/`** - Next.js 14 public-facing website (alias: `@sites/schifflange-website`)
- **`backend/`** - AdonisJS 6 REST API backend
- **`contents/`** - Content definitions and templates
  - `globals/` - Global content items (headings, dialogs, features, media, etc.)
  - `schifflange-website/` - Site-specific content overrides
- **`packages/features/`** - Domain-specific feature packages (articles, contents, forwards, languages, medias, menu, pages, projects, publications, seos, slugs, templates, trackings, users)
- **`packages/shared/`** - Shared UI and utility packages (dashboard, form, hooks, jollyui, localize, primitives, translations, ui, utils)
- **`packages/services/`** - Service layer packages (dashboard, site)

## Development Commands

### Running the full stack in development

```bash
# Run backend, Next.js site, and dashboard concurrently
npm run dev

# Run individual services
npm run dev:dashboard  # Dashboard on default port
npm run dev:backend    # AdonisJS backend
npm run dev:schifflangeWebsite      # Next.js website on port 3142
```

### Backend (AdonisJS)

```bash
cd backend

# Development with HMR
npm run dev
# Or: node --experimental-json-modules ace serve --hmr --no-clear

# Build for production
npm run build        # Outputs to build/
node ace build

# Run tests
npm run test
node ace test

# Database migrations
node ace migration:run
node ace migration:rollback
node ace migration:fresh

# Type checking
npm run typecheck

# Linting & Formatting
npm run lint
npm run format

# Mail preview server (development)
npm run dev:mail     # Runs on port 3143
```

### Dashboard (Vite + React)

```bash
cd apps/dashboard

# Development server
npm run dev          # Uses PORT from .env or 3000

# Production build
npm run build        # Outputs to out/prod/

# Preview production build
npm run preview

# Linting
npm run lint
```

### Next.js Website

```bash
cd sites/schifflange-website

# Development server
npm run dev          # Runs on port 3142

# Production build
npm run build

# Start production server
npm start           # Port 3142

# Linting
npm run lint
```

### Production Builds

```bash
# Build scripts in root (includes git operations)
bash ./build-backend.sh           # Builds backend, installs prod deps, restarts PM2
bash ./build-dashboard.sh         # Builds dashboard and commits
bash ./build-schifflange-website.sh  # Builds Next.js site
```

## Architecture

### Backend (AdonisJS)

- **Framework**: AdonisJS 6 with TypeScript
- **Database**: MySQL via Lucid ORM (SQLite for development)
- **Authentication**: Session-based auth with `@adonisjs/auth`
- **File Storage**: AWS S3 via `@adonisjs/drive`
- **Real-time**: Server-sent events via `@adonisjs/transmit`
- **Email**: React Email templates with `@adonisjs/mail`
- **Rate Limiting**: `@adonisjs/limiter`
- **Caching**: `@adonisjs/cache`

#### Backend Path Aliases (via imports in package.json)

All backend code uses `#` prefix for internal imports:

- `#controllers/*` - HTTP controllers
- `#models/*` - Lucid models
- `#services/*` - Business logic services
- `#middleware/*` - HTTP middleware
- `#validators/*` - VineJS validators
- `#exceptions/*` - Custom exceptions
- `#mails/*` - Email templates
- `#events/*` - Event classes
- `#listeners/*` - Event listeners
- `#policies/*` - Authorization policies
- `#abilities/*` - User abilities
- `#database/*` - Database utilities
- `#config/*` - Configuration files
- `#utils/*` - Utility functions
- `#providers/*` - Service providers

#### Key Backend Directories

- **`app/controllers/http/`** - HTTP route controllers (auth, languages, workspaces, notifications, etc.)
  - `admin/` - Admin-specific controllers
  - `workspace/` - Workspace-scoped controllers (medias, pages, projects, articles, etc.)
- **`app/models/`** - Lucid ORM models
- **`app/services/`** - Business logic services
- **`app/mails/`** - React Email templates
- **`database/migrations/`** - Database migrations (numbered e.g., 100_languages.ts, 120_workspaces.ts)
- **`start/`** - Preloaded modules (routes, kernel, vine, health, request, transmit)
- **`config/`** - Configuration files
- **`storage/`** - File storage location (local development)

#### Backend Testing

- Unit tests: `tests/unit/**/*.spec.ts`
- Functional tests: `tests/functional/**/*.spec.ts`
- Test runner: Japa with `@japa/plugin-adonisjs`

### Frontend Applications

#### Dashboard (Vite + React)

- **Build Tool**: Vite with SWC
- **Router**: Wouter
- **State Management**: Zustand
- **Data Fetching**: SWR
- **Tables**: TanStack Table
- **Forms**: use-a11y-form
- **Styling**: Tailwind CSS v4
- **Real-time**: Transmit client for SSE

The dashboard uses auto-import for React, common utilities (cx, cxm, match), and connects to the backend API.

#### Website (Next.js)

- **Framework**: Next.js 14 (Pages Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Phosphor Icons
- **Media**: React PDF, React Player
- **Carousel**: Embla Carousel
- **Forms**: use-a11y-form
- **State**: nuqs for URL query state

The website fetches content from the backend API and renders pages based on the content management system.

### Shared Packages

The monorepo uses internal packages for code sharing:

- **`@compo/dashboard`** - Dashboard-specific React components
- **`@services/dashboard`** - Dashboard business logic
- **`@services/site`** - Website business logic
- Feature packages (`packages/features/*`) - Domain logic for articles, contents, medias, projects, etc.
- Shared packages (`packages/shared/*`) - Reusable UI components, hooks, forms, translations, utilities

All packages use TypeScript with barrel exports (`index.ts`) and reference source files directly during development.

## Content Management System

The CMS is built around a flexible content system:

- **Contents**: Modular content blocks that can be composed into pages
- **Templates**: Reusable content templates defined in `contents/globals/src/items/`
- **Categories**: Articles, Dialogs, Features, Headings, Interactives, Medias, Projects
- Each content type has:
  - `export.ts` - Type definitions
  - `index.ts` - Main logic
  - `form.tsx` - Admin form component
  - `thumbnail/` - Preview components
  - `templates/` - Template definitions

Content items are server-side rendered (SSR) with separate server and client rendering paths.

## Multi-language Support

- Languages are managed in the backend via `languages` table
- Translations are stored in separate translation tables (e.g., `article_translations`, `page_translations`)
- Language provider: `#providers/languages_provider`
- Frontend uses `@shared/translations` and `@shared/localize` packages

## Database Conventions

- Migrations are numbered (e.g., `100_languages.ts`, `115_security_logs.ts`, `166_template_translations.ts`)
- Models use Lucid ORM with TypeScript
- Translation tables follow pattern: `{entity}_translations`

## API Integration

- Backend runs on port **3140** (production) or as configured
- Dashboard connects via environment variables
- Website fetches data at build time and runtime
- Real-time updates via Transmit SSE on `__transmit/events` endpoint

## Build Output Locations

- Backend: `backend/build/`
- Dashboard: `apps/dashboard/out/prod/`
- Website: `sites/schifflange-website/.next/`

## Common Patterns

### Adding a New Feature Package

1. Create directory in `packages/features/{feature-name}/`
2. Add `package.json` with name `@features/{feature-name}`
3. Create backend model, controller, and migrations
4. Add routes in `backend/start/routes.ts`
5. Create frontend components and context
6. Export via `index.ts` for use in dashboard/website

### Adding Content Items

1. Create item folder in `contents/globals/src/items/{category}/{name}/`
2. Define types in `export.ts`
3. Implement form in `form.tsx`
4. Create thumbnail component in `thumbnail/index.tsx`
5. Add templates in `templates/index.ts`
6. Export in parent `index.ts`

### Backend Controllers

Controllers follow AdonisJS conventions:

- Place in `app/controllers/http/` or subdirectories
- Use dependency injection for services
- Return responses using context methods
- Validate input with VineJS validators

## Development Notes

- The backend uses experimental JSON modules flag: `--experimental-json-modules`
- Hot module reloading is configured for controllers and middleware only
- TypeScript build errors are ignored in Next.js build (set in next.config.ts)
- React version is locked to 18.3.1 via overrides in root package.json
- Dashboard excludes other workspace files from HMR watch for performance
