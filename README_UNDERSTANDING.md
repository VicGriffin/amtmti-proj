# Project Understanding – AMTMTI Platform

## 1. What the platform does
The **Africa Medication Therapy Management Training Institute (AMTMTI)** platform is a **Next.js (v16) web application** that provides:
- A public marketing website that showcases the institute, its programs, news, and membership information.
- A **student portal** where enrolled learners can view courses, certificates, notifications, resources and manage their profile.
- An **admin area** for staff to manage enrollments, programs, memberships, contacts and messages.
- Authentication via **Supabase Auth** for students and a custom **admin token** (signed cookie) for administrators.
- Email communications (confirmation, enrollment, newsletters) using **Nodemailer**, **Resend**, and **SendGrid** integrations.
- Data persistence in **Supabase PostgreSQL** with tables such as `profiles`, `enrollments`, `programs`, `memberships`, etc.
- UI built with **TailwindCSS**, **shadcn/ui**, **lucide-react**, and custom React components.

## 2. Who uses it
| Role | Typical Actions |
|------|-----------------|
| **Visitor / Prospective Student** | Browse marketing pages, view program catalog, sign‑up for newsletters. |
| **Student (Portal User)** | Log in via Supabase, view enrolled courses, download certificates, edit profile, receive notifications. |
| **Admin** | Log in via custom admin token, manage enrollments, approve/reject memberships, send emails, view contact submissions. |
| **Developer / DevOps** | Deploy via Vercel (auto‑deploy on main), run CI/lint/type‑check, maintain Supabase configuration. |

## 3. Core Business Workflows
1. **User Registration & Login** – Students sign up through Supabase Auth (email/password or magic link). Admins log in via a one‑time signed token stored in a cookie (`amtmti_admin`).
2. **Program Enrollment** – Students select a program, submit an enrollment form (`app/api/enrollment/submit/route.ts`). The request is validated, stored in Supabase, and a confirmation email is sent.
3. **Membership Management** – Similar to enrollment but for membership plans, handled under `app/api/membership/submit/route.ts`.
4. **Course Access** – Authenticated students can browse `/portal/courses` and view course details pulled from Supabase.
5. **Admin Review** – Admins view pending enrollments/memberships, approve or reject using routes under `app/api/admin/*`. Actions trigger email notifications.
6. **Email Notifications** – All transactional emails are generated from templates in `lib/email/templates/*` and sent via the chosen provider.
7. **Analytics** – Site traffic is optionally tracked via Google Analytics (`NEXT_PUBLIC_GA_ID`).

## 4. Architecture Overview
### Front‑end (Next.js)
- **Pages / Routes** – Located under `app/`. Uses **App Router** (`layout.tsx`, `page.tsx`).
- **Layouts** – `RootLayout` (global) and domain‑specific layouts (`marketing`, `admin`, `portal`).
- **Components** – UI components in `components/ui/` (shadcn wrappers) and domain components in `components/marketing/`, `components/portal/`, `components/admin/`.
- **State / Data Fetching** – Server‑side data fetch via Supabase client (`createServerClient`), client‑side via `createBrowserClient`.
- **Styling** – TailwindCSS with custom theme variables defined in `globals.css`.

### Back‑end (API Routes)
- All API endpoints live under `app/api/` (e.g., `courses/route.ts`, `contact/submit/route.ts`).
- Each route validates input (Zod schemas where present) and interacts with Supabase via the shared client.
- **Middleware** (`middleware.ts`) runs `updateSession` to protect admin routes and enforce Supabase auth for portal routes.

### Database (Supabase)
- **Tables**: `profiles`, `enrollments`, `programs`, `memberships`, `contact_messages`, etc.
- **Access**: Supabase client created by `lib/supabase/server.ts` (SSR) and `lib/supabase/client.ts` (client).
- **RLS**: Row‑level security policies are expected to restrict access to a user’s own profile and enrollment records (to be verified in the security audit).

### Authentication & Authorization
- **Student Auth** – Supabase Auth (email/password, magic link). Session cookies handled by Supabase client.
- **Admin Auth** – Custom signed cookie (`amtmti_admin`). Verified by `lib/admin-token.ts` and enforced in `middleware.ts` for any `/admin/*` route.
- **Authorization** – Guarded by checks in middleware and individual route handlers (e.g., `requireUser()` in `lib/portal.ts`).

### Email / External Services
- Email provider selected via `EMAIL_PROVIDER` env var. Implementations in `lib/email/*` use Nodemailer for SMTP, Resend API, or SendGrid API.
- **Supabase** – Primary data store and auth provider.
- **Google Analytics** – Optional via `NEXT_PUBLIC_GA_ID`.

## 5. Configuration & Environment Variables
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Connect to Supabase project (client‑side). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server‑side privileged API (used for admin actions). |
| `EMAIL_PROVIDER` | Selects email backend (`nodemailer`, `resend`, `sendgrid`). |
| `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASSWORD` | SMTP credentials for Nodemailer. |
| `RESEND_API_KEY`, `SENDGRID_API_KEY` | API keys for alternative email services. |
| `NEXT_PUBLIC_AUTH_REDIRECT_URL` | URL used after Supabase auth callback. |
| `NEXT_PUBLIC_APP_URL` | Base URL for constructing links in emails. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional). |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Hard‑coded admin creds (present in `.env` – **security risk**; should be moved to env or removed). |

> **NOTE**: The repository currently contains a `.env` file with real credentials. These must be removed from source control and replaced with placeholder values. See the **Security Hardening** phase for remediation steps.

## 6. Deployment Flow
- **Vercel** – Automatic deployments on pushes to `main`. The `package.json` scripts (`dev`, `build`, `start`, `lint`) are used by the CI.
- **CI/CD** – Vercel runs `npm install`, `npm run lint`, `npm run build`. No explicit GitHub Actions are present; Vercel handles the pipeline.
- **Environment** – Production environment variables are set in the Vercel dashboard (must match the variables described above).

## 7. Risks Identified (Pre‑audit)
- **Hard‑coded secrets** in `.env` (Supabase keys, SMTP password, admin password) – exposes credentials if the repo is ever made public.
- **Potential missing RLS policies** on Supabase tables – could allow users to access others' data.
- **No explicit CSRF protection** on POST API routes – risk of cross‑site request forgery.
- **Limited input validation** – some routes lack Zod schemas, increasing injection risk.
- **Performance** – Large bundle size due to many UI components; no caching on frequent data (e.g., profiles).
- **Accessibility** – Some UI components lack ARIA attributes (to be reviewed).

---
*This document provides the foundational understanding required for the subsequent audit, bug detection, refactoring, and hardening phases.*