-- ============================================================================
-- Task Flow — initial schema with Row Level Security
-- Run once per project in the Supabase SQL editor (or via the Supabase CLI).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin create type user_role as enum ('member', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin create type user_status as enum ('active', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin create type account_type as enum ('senior', 'tasker');
exception when duplicate_object then null; end $$;

do $$ begin create type task_status as enum
  ('open', 'matched', 'scheduled', 'in_progress', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin create type recurrence as enum
  ('once', 'weekly', 'biweekly', 'monthly');
exception when duplicate_object then null; end $$;

do $$ begin create type urgency as enum ('flexible', 'soon', 'urgent');
exception when duplicate_object then null; end $$;

do $$ begin create type payment_status as enum
  ('pending', 'held', 'released', 'refunded');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  city text,
  account_type account_type not null default 'senior',
  avatar_url text,
  role user_role not null default 'member',
  status user_status not null default 'active',
  onboarding_completed boolean not null default false,
  emergency_contact text,
  notify_sms boolean not null default true,
  notify_email boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- taskers  (the pre-vetted, verified network — shared, read-only reference)
-- ---------------------------------------------------------------------------
create table if not exists public.taskers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  headline text not null default '',
  bio text not null default '',
  emoji text not null default '🙂',
  city text not null default '',
  skills text[] not null default '{}',
  hourly_rate numeric not null default 25,
  rating numeric not null default 5,
  reviews_count int not null default 0,
  tasks_completed int not null default 0,
  years_experience int not null default 1,
  background_checked boolean not null default true,
  identity_verified boolean not null default true,
  references_count int not null default 0,
  response_time text not null default 'Usually replies within a few hours',
  languages text[] not null default '{English}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- tasks  (a senior's request for help)
-- ---------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  category text not null default 'grocery',
  description text,
  location text,
  scheduled_date date,
  scheduled_time text,
  recurrence recurrence not null default 'once',
  urgency urgency not null default 'flexible',
  budget numeric,
  status task_status not null default 'open',
  tasker_id uuid references public.taskers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_user_idx on public.tasks(user_id);
create index if not exists tasks_status_idx on public.tasks(status);

-- ---------------------------------------------------------------------------
-- task_messages  (secure in-app communication)
-- ---------------------------------------------------------------------------
create table if not exists public.task_messages (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  sender text not null default 'senior',
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists task_messages_task_idx on public.task_messages(task_id);

-- ---------------------------------------------------------------------------
-- payments  (secure, transparent payment upon completion)
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null unique references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  tasker_id uuid references public.taskers(id) on delete set null,
  amount numeric not null default 0,
  service_fee numeric not null default 0,
  status payment_status not null default 'pending',
  method text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Admin helper (SECURITY DEFINER avoids recursive RLS on profiles)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles      enable row level security;
alter table public.taskers        enable row level security;
alter table public.tasks          enable row level security;
alter table public.task_messages  enable row level security;
alter table public.payments       enable row level security;

-- profiles -------------------------------------------------------------------
drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles update own or admin" on public.profiles;
create policy "profiles update own or admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles
  for insert with check (auth.uid() = id);

-- taskers: the verified network is readable by any signed-in user; only
-- admins may modify it.
drop policy if exists "taskers readable by authenticated" on public.taskers;
create policy "taskers readable by authenticated" on public.taskers
  for select using (auth.role() = 'authenticated');

drop policy if exists "taskers admin manage" on public.taskers;
create policy "taskers admin manage" on public.taskers
  for all using (public.is_admin()) with check (public.is_admin());

-- tasks ----------------------------------------------------------------------
drop policy if exists "tasks owner all" on public.tasks;
create policy "tasks owner all" on public.tasks
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- task_messages --------------------------------------------------------------
drop policy if exists "messages owner all" on public.task_messages;
create policy "messages owner all" on public.task_messages
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- payments -------------------------------------------------------------------
drop policy if exists "payments owner all" on public.payments;
create policy "payments owner all" on public.payments
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ============================================================================
-- Seed: the verified tasker network
-- ============================================================================
insert into public.taskers
  (name, headline, bio, emoji, city, skills, hourly_rate, rating,
   reviews_count, tasks_completed, years_experience, references_count,
   response_time, languages)
values
  ('Maria Gonzalez',
   'Patient, reliable help with shopping & errands',
   'I have spent eight years helping older neighbors with their weekly shopping and errands. I am gentle, punctual, and always double-check your list. Nothing makes me happier than making someone''s week a little easier.',
   '👩🏽', 'Tampa',
   '{grocery,prescriptions,transport,companionship}', 24, 4.9,
   187, 240, 8, 5,
   'Usually replies within 1 hour', '{English,Spanish}'),

  ('James Carter',
   'Handyman for small home repairs done right',
   'Retired contractor of 25 years. I take on the small jobs the big companies won''t bother with — leaky faucets, sticky doors, safety grab-bars. I explain everything in plain language and clean up after myself.',
   '👨🏼‍🔧', 'Tampa',
   '{repairs,yardwork,housekeeping}', 32, 4.8,
   142, 198, 25, 6,
   'Usually replies within 2 hours', '{English}'),

  ('Aisha Bello',
   'Kind, dependable companion & tech helper',
   'I love spending time with people and I am endlessly patient with phones, tablets and computers. Whether it is a video call with your grandchildren or setting up a new TV, I will walk you through it slowly.',
   '👩🏾', 'Tampa',
   '{technology,companionship,housekeeping,mealprep}', 26, 5.0,
   96, 130, 4, 4,
   'Usually replies within 30 minutes', '{English}'),

  ('Robert Nguyen',
   'Safe, friendly rides to appointments',
   'Careful driver with a clean record and a comfortable car. I help you in and out, wait during appointments, and get you home safely. I am also happy to run pharmacy and grocery stops on the way.',
   '👨🏻', 'Clearwater',
   '{transport,grocery,prescriptions}', 28, 4.9,
   210, 305, 12, 7,
   'Usually replies within 1 hour', '{English,Vietnamese}'),

  ('Dorothy Fields',
   'Loving pet care & light housekeeping',
   'Lifelong animal lover. I walk, feed and sit with pets as if they were my own, and I keep things tidy while I am there. Your furry friends will be in the best of hands.',
   '👩🏼‍🦳', 'St. Petersburg',
   '{petcare,housekeeping,companionship}', 22, 4.9,
   158, 220, 10, 6,
   'Usually replies within 2 hours', '{English}'),

  ('Samuel Okafor',
   'Yard work and seasonal home help',
   'Strong, dependable and thorough. Mowing, raking, weeding, hauling — I keep your yard neat so you don''t have to lift a thing. I also help bring in groceries and move heavy items.',
   '👨🏾‍🌾', 'St. Petersburg',
   '{yardwork,repairs,grocery}', 27, 4.7,
   88, 120, 5, 3,
   'Usually replies within 3 hours', '{English}'),

  ('Linda Park',
   'Home cooking & meal prep for the week',
   'I cook wholesome, home-style meals and can prep a whole week at once. I happily accommodate low-salt, diabetic and other special diets. Everything is labeled and ready to heat.',
   '👩🏻‍🍳', 'Tampa',
   '{mealprep,grocery,housekeeping}', 30, 5.0,
   74, 95, 9, 5,
   'Usually replies within 1 hour', '{English,Korean}'),

  ('Frank DiMarco',
   'Steady tech & TV help, no rushing',
   'I used to teach computer classes at the senior center. I never rush, never talk down to you, and I write down simple steps you can keep. Phones, Wi-Fi, printers, streaming — we''ll sort it out together.',
   '👨🏼‍🦳', 'Clearwater',
   '{technology,companionship,repairs}', 25, 4.8,
   119, 165, 15, 4,
   'Usually replies within 2 hours', '{English,Italian}');
