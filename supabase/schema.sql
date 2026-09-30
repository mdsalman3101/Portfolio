-- Portfolio CMS schema
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.admin_users where user_id=auth.uid());
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text, description text, year integer,
  tags text[] not null default '{}',
  live_url text, github_url text, cover_path text,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  file_path text not null,
  media_type text not null check(media_type in ('image','video')),
  alt_text text, sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null, issuer text, issue_date date,
  pdf_path text, thumbnail_path text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key, value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.certificates enable row level security;
alter table public.site_content enable row level security;

create policy "public read projects" on public.projects for select using(published or public.is_admin());
create policy "admin projects" on public.projects for all using(public.is_admin()) with check(public.is_admin());
create policy "public read media" on public.project_media for select using(exists(select 1 from public.projects p where p.id=project_id and (p.published or public.is_admin())));
create policy "admin media" on public.project_media for all using(public.is_admin()) with check(public.is_admin());
create policy "public read certificates" on public.certificates for select using(published or public.is_admin());
create policy "admin certificates" on public.certificates for all using(public.is_admin()) with check(public.is_admin());
create policy "public read site content" on public.site_content for select using(true);
create policy "admin site content" on public.site_content for all using(public.is_admin()) with check(public.is_admin());
create policy "read own admin membership" on public.admin_users for select using(user_id=auth.uid());

-- Create the public media bucket (safe to run repeatedly).
insert into storage.buckets (id,name,public)
values ('portfolio-media','portfolio-media',true)
on conflict (id) do update set public=true;

create policy "public read portfolio media" on storage.objects for select using(bucket_id='portfolio-media');
create policy "admin upload portfolio media" on storage.objects for insert with check(bucket_id='portfolio-media' and public.is_admin());
create policy "admin update portfolio media" on storage.objects for update using(bucket_id='portfolio-media' and public.is_admin()) with check(bucket_id='portfolio-media' and public.is_admin());
create policy "admin delete portfolio media" on storage.objects for delete using(bucket_id='portfolio-media' and public.is_admin());

-- After creating your Auth account, run once:
-- insert into public.admin_users(user_id) values ('YOUR_AUTH_USER_UUID');
