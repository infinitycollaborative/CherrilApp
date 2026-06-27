# AI Sage ✦

**On-brand content across every channel, in minutes.**

AI Sage is an AI-powered writing assistant for B2B SaaS Content Marketing
Managers. It turns a single prompt into platform-perfect drafts — blog,
LinkedIn, X thread, newsletter, website and ad copy — all enforcing your brand
voice, with research, outlining, an editor with revision history, and
performance insights.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**,
**Tailwind CSS** and **Supabase** (auth + Postgres with Row Level Security).
Content generation uses the **Anthropic API** when configured, and falls back
to high-quality on-brand templates so every flow works end-to-end without a key.

---

## Features

| Area | What's included |
|------|-----------------|
| **Landing page** | Hero, features, stats, testimonials, pricing, CTAs |
| **Auth** | Email/password + Google OAuth, signup, login, forgot-password, protected routes |
| **Onboarding wizard** | 4-step Brand Voice & Style Guide setup with progress, autosave (localStorage draft) and persistence — the priority first-user action |
| **Dashboard** | Stats, quick-generate shortcuts, recent activity, brand nudge |
| **Generation Studio** | One prompt → multi-platform drafts, loading states, instant editor links |
| **Content Editor** | Rich editing, live readability/sentiment/word-count, AI suggestions, revision history + restore, status workflow, export/copy/delete |
| **Research & Outlining** | Topic → research summary, keyword angles, structured outline, one-click "draft from outline" |
| **My Content** | Searchable, filterable library by status & platform |
| **Brand Voice** | Full editable brand profile applied to every generation |
| **Integrations** | Connect/disconnect HubSpot, Buffer, WordPress, Mailchimp, GA4, Notion, Slack… |
| **Settings** | Profile, password change, notification prefs, billing summary, account deletion |
| **Admin Panel** (`/admin`) | User table with search/filter, suspend/activate, promote/demote, delete, system stats — admin-only route protection |

Every table has **Row Level Security** enabled so users can only ever read or
write their own data; admins are granted cross-user read/manage access via a
`SECURITY DEFINER` `is_admin()` helper.

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

Create a free project at [supabase.com](https://supabase.com). In the
**SQL Editor**, run the migration:

```
supabase/migrations/0001_init.sql
```

This creates all tables, enums, the `updated_at` triggers, the new-user
profile trigger, the `is_admin()` helper, and **all RLS policies**.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from
  Supabase → Project Settings → API.
- `ANTHROPIC_API_KEY` *(optional)* — enables real AI generation. Without it,
  the app uses on-brand template drafts so every flow still works.
- `SUPABASE_SERVICE_ROLE_KEY` *(optional)* — enables full auth-user deletion
  from the admin panel and the account-deletion flow.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000. If env isn't set yet you'll be guided to `/setup`.

---

## Making yourself an admin

After signing up, run this in the Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Then reload — the **Admin Panel** link appears in the sidebar.

---

## Design system

Dark-mode-first, mobile-first, Inter typeface, rounded corners, subtle
gradients and shadows, loading states for every action, and success/error
toasts. Brand palette: primary `#0057B8`, secondary `#AEC6CF`, accent
`#FF6B6B`.

## Project structure

```
src/
  app/
    (auth)/        login, signup, forgot-password, auth actions
    (app)/         protected: dashboard, generate, research, content,
                   brand, integrations, settings, admin (shared sidebar)
    actions/       server actions (brand, content, research, settings,
                   integrations, admin)
    onboarding/    brand voice wizard (first-run)
    auth/callback  OAuth / email-confirmation handler
    setup/         env configuration guide
  components/      ui, auth, app, brand, content, admin
  lib/             supabase clients, ai engine, analytics, types, constants
supabase/migrations/  SQL schema + RLS
```
