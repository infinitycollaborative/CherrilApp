-- ============================================================================
-- AI Sage — initial schema with Row Level Security
-- Run this in the Supabase SQL editor (or via the Supabase CLI) once per project.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_status as enum ('active', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('draft', 'in_review', 'published', 'archived');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  avatar_url text,
  role user_role not null default 'user',
  status user_status not null default 'active',
  onboarding_completed boolean not null default false,
  notify_product boolean not null default true,
  notify_marketing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- brand_profiles  (1:1 with a user — their brand voice / style guide)
-- ---------------------------------------------------------------------------
create table if not exists public.brand_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  brand_name text,
  personality text[] not null default '{}',
  tone text,
  audience text,
  values text,
  example_content text,
  style_rules text,
  words_to_avoid text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- content_items
-- ---------------------------------------------------------------------------
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled',
  prompt text not null default '',
  platform text not null default 'blog',
  body text not null default '',
  status content_status not null default 'draft',
  readability_score int,
  sentiment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_items_user_idx on public.content_items(user_id);
create index if not exists content_items_status_idx on public.content_items(status);

-- ---------------------------------------------------------------------------
-- content_revisions
-- ---------------------------------------------------------------------------
create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.content_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists content_revisions_content_idx on public.content_revisions(content_id);

-- ---------------------------------------------------------------------------
-- integrations
-- ---------------------------------------------------------------------------
create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  connected boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists brand_profiles_updated_at on public.brand_profiles;
create trigger brand_profiles_updated_at before update on public.brand_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists content_items_updated_at on public.content_items;
create trigger content_items_updated_at before update on public.content_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, company_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name'
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
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles         enable row level security;
alter table public.brand_profiles   enable row level security;
alter table public.content_items    enable row level security;
alter table public.content_revisions enable row level security;
alter table public.integrations     enable row level security;

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

-- brand_profiles -------------------------------------------------------------
drop policy if exists "brand owner all" on public.brand_profiles;
create policy "brand owner all" on public.brand_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- content_items --------------------------------------------------------------
drop policy if exists "content owner all" on public.content_items;
create policy "content owner all" on public.content_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- content_revisions ----------------------------------------------------------
drop policy if exists "revision owner all" on public.content_revisions;
create policy "revision owner all" on public.content_revisions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- integrations ---------------------------------------------------------------
drop policy if exists "integration owner all" on public.integrations;
create policy "integration owner all" on public.integrations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
