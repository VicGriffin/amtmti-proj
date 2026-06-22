# AMTMTI Platform Build

This repository is a Next.js web application for the AMTMTI training platform. It provides marketing pages, student portal pages, authentication, and admin access, all backed by Supabase for data, auth, and session handling.

## What this project does

- Serves a responsive marketing site with pages for home, about, contact, membership, news, programs, and research.
- Enables user authentication and password reset using Supabase Auth.
- Provides a protected student portal with profile, courses, certificates, payments, resources, and notifications.
- Supports an admin login area with separate admin authentication.
- Uses real-time and server-side Supabase integration through `@supabase/ssr`.
- Includes reusable UI components built with Tailwind CSS and shadcn-style patterns.

## Key directories

### `app/`
Contains the Next.js application routes and layouts.

- `app/layout.tsx` — root layout for the whole site.
- `app/globals.css` — global styles and Tailwind imports.
- `app/(auth)/` — authentication pages and layout.
- `app/(marketing)/` — public marketing pages like home, about, contact, membership, news, programs, and research.
- `app/admin/` — admin login and admin-specific pages.
- `app/auth/` — Supabase auth callback route.
- `app/portal/` — protected portal pages for signed-in users.

### `components/`
Reusable UI and content components.

- `components/ui/` — design system primitives such as buttons, inputs, dialogs, cards, tabs, tables, and more.
- `components/site/` — site-level components like header, footer, logo, hero sections, and page headings.
- `components/marketing/` — marketing-specific components used by public pages.
- `components/auth/` — login, register, and forgot-password forms.
- `components/admin/` — admin login form.
- `components/portal/` — portal shell, sidebar, profile form, and dashboard cards.
- `components/theme-provider.tsx` — handles theme switching for the site.

### `lib/`
Application logic, data helpers, and Supabase utilities.

- `lib/site-data.ts` — marketing content and site constants.
- `lib/programs-data.ts` — program listings and related metadata.
- `lib/news-data.ts` — news and events content.
- `lib/portal.ts` — portal authentication and user guard logic.
- `lib/admin-auth.ts` — admin credential validation and session creation.
- `lib/admin-token.ts` — admin token signing and verification.
- `lib/supabase/` — Supabase client helpers for browser, server, and proxy usage.
- `lib/utils.ts` — shared utility functions.

### `public/`
Static public assets.

- `public/images/` — image assets used across the site.
- favicons, placeholder images, and icons.

### `scripts/`
SQL migration and seed scripts for the database.

- `scripts/001_schema.sql`
- `scripts/002_rls.sql`
- `scripts/003_seed.sql`

## Endpoints

- `GET /auth/callback` — handles the Supabase OAuth callback. It exchanges `code` from the query string for a Supabase session and redirects the user to the portal or an error page.

The project does not currently expose additional custom API routes; most app behavior is handled by Next.js page routes and Supabase client/server helpers.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in required values:

```bash
cp .env.example .env
```

3. Run the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

## Useful scripts

- `npm run dev` — start the Next.js development server
- `npm run build` — build the production site
- `npm run start` — start the production server after building
- `npm run lint` — run ESLint across the repo

## Notes

- The app uses Supabase environment variables such as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` are required for the admin area.
- Keep `.env` out of version control; use `.env.example` as a template.
