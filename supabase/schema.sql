-- Kristen's Excellent OS v0.1 starter persistence
-- Run this in the Supabase SQL editor for the first basic sync layer.

create table if not exists public.os_state (
  device_id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.os_state enable row level security;

-- Temporary MVP policy for anon client sync by device_id.
-- This is intentionally simple for v0.1. Replace with authenticated user policies
-- before storing sensitive long-term personal data.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'os_state'
      and policyname = 'anon can read os state'
  ) then
    create policy "anon can read os state"
      on public.os_state for select
      to anon
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'os_state'
      and policyname = 'anon can upsert os state'
  ) then
    create policy "anon can upsert os state"
      on public.os_state for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'os_state'
      and policyname = 'anon can update os state'
  ) then
    create policy "anon can update os state"
      on public.os_state for update
      to anon
      using (true)
      with check (true);
  end if;
end $$;
