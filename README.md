# Task Flow ✓

**Trusted help for everyday tasks — whenever you need it.**

Task Flow is a mobile-first web app that helps older adults quickly find
reliable, **background-checked** local helpers for everyday household tasks —
grocery shopping, minor repairs, pet care, rides to appointments and more.

### The problem it solves

Many elderly individuals spend **3–5 hours every week** — across phone calls,
texts and social posts — just trying to find someone trustworthy and available
to help with recurring or urgent household tasks. It's time-consuming,
stressful, and can leave people feeling like a burden on their limited social
circle.

Task Flow turns all of that into a few simple taps: **post what you need, pick
a verified helper, and pay securely only when it's done.**

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**,
**Tailwind CSS** and **Supabase** (auth + Postgres with Row Level Security).

---

## Designed for older adults

Accessibility isn't an afterthought — it's the core of the design:

- **Large type** (18px base, big headings) and generous line spacing
- **Big, obvious touch targets** (buttons are ≥56px tall)
- **High-contrast, light** color scheme that's easy on older eyes
- **Plain language** everywhere — no jargon
- **One primary action at a time** with a simple step-by-step task flow
- Pinch-to-zoom is never disabled; strong, always-visible focus outlines

---

## Core features

| Area | What's included |
|------|-----------------|
| **Post Your First Task** | The very first action after signing up. A friendly 3-step wizard: choose a task → add details → pick a time. |
| **Verified Tasker Network** | Browse a pre-vetted pool of local helpers — every one background-checked, identity-verified, and with references and reviews. |
| **Simplified Request & Scheduling** | Post a task with details, preferred times and recurrence; suitable helpers confirm availability right away. |
| **Secure In-App Messaging** | Chat safely with your helper — no need to share your phone number. |
| **Secure, Transparent Payment** | Pay in-app only after the task is done. A clear fee breakdown; funds are held and released to the helper. |
| **My Tasks** | Every request in one place, filterable by status. |
| **Messages** | All your helper conversations together. |
| **Help & Support** | Plain-language how-to, FAQ and one-tap call/email support. |
| **Settings** | Your details, emergency contact, payment methods, notifications, password, account. |
| **Admin Panel** (`/admin`) | Manage members and helpers, platform stats — admin-only. |

Every table has **Row Level Security** so users can only ever read or write
their own data; the verified helper network is shared read-only; admins get
cross-user access via a `SECURITY DEFINER` `is_admin()` helper.

The **first-user experience is intentional**: after sign-up you land directly
on "Post your first task", so you experience the core value immediately.

---

## Task categories

🛒 Grocery Shopping · 🚗 Rides & Transportation · 🔧 Minor Repairs ·
🐾 Pet Care · 🧹 Housekeeping · 🌿 Yard Work · 💻 Technology Help ·
💊 Prescription Pickup · 🍲 Meal Preparation · 🤝 Companionship

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
profile trigger, the `is_admin()` helper, **all RLS policies**, and seeds the
**verified helper network** so the app works end-to-end immediately.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
Supabase → Project Settings → API. `SUPABASE_SERVICE_ROLE_KEY` is optional
(enables full auth-user deletion).

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

Reload — the **Admin** link appears in the sidebar.

---

## Installing on phones & computers

Task Flow is a responsive, installable web app (PWA-ready metadata included):

- **iPhone/iPad**: open in Safari → Share → *Add to Home Screen*.
- **Android**: open in Chrome → menu → *Add to Home screen / Install app*.
- **Windows/Mac**: open in Chrome or Edge → *Install* from the address bar.

The same codebase serves mobile and web from one URL.

---

## Project structure

```
src/
  app/
    (auth)/        login, signup, forgot-password, auth actions
    (app)/         protected: dashboard (home), tasks, tasks/new, tasks/[id],
                   taskers, taskers/[id], messages, settings, help, admin
    actions/       server actions (tasks, messages, payments, settings, admin)
    onboarding/    "post your first task" — the priority first-run action
    auth/callback  OAuth / email-confirmation handler
    setup/         env configuration guide
  components/      ui, auth, app, tasks, taskers, admin
  lib/             supabase clients, types, constants, matching, format, data
supabase/migrations/  SQL schema + RLS + seeded helper network
```
