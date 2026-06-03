create table public.profiles (
  id uuid primary key,
  email text unique not null,
  name text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.skill_vectors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  vector_data jsonb not null,
  source_filename text,
  version integer default 1,
  created_at timestamptz default now()
);

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  vector_id uuid references public.skill_vectors(id) on delete set null,
  jd_title text,
  jd_company text,
  jd_raw text not null,
  jd_parsed jsonb,
  confidence text check (confidence in ('LOW', 'MEDIUM', 'HIGH')),
  summary text,
  gaps jsonb default '[]'::jsonb,
  pros jsonb default '[]'::jsonb,
  cons jsonb default '[]'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  preferences_snapshot jsonb,
  latency_phase1_ms integer,
  latency_phase2_ms integer,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.skill_vectors enable row level security;
alter table public.analyses enable row level security;

create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users read own vectors" on public.skill_vectors for select using (auth.uid() = user_id);
create policy "Users insert own vectors" on public.skill_vectors for insert with check (auth.uid() = user_id);
create policy "Users delete own vectors" on public.skill_vectors for delete using (auth.uid() = user_id);

create policy "Users read own analyses" on public.analyses for select using (auth.uid() = user_id);
create policy "Users insert own analyses" on public.analyses for insert with check (auth.uid() = user_id);
create policy "Users delete own analyses" on public.analyses for delete using (auth.uid() = user_id);
