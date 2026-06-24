-- Add Enrollment table to track student course enrollments
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed', 'dropped', 'suspended')),
  enrolled_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, program_id)
);

create index if not exists idx_enrollments_user_id on public.enrollments(user_id);
create index if not exists idx_enrollments_program_id on public.enrollments(program_id);
create index if not exists idx_enrollments_status on public.enrollments(status);

-- Add Membership table for tracking student memberships
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended', 'cancelled')),
  tier text default 'student',
  approved_by uuid references auth.users(id),
  approval_notes text,
  rejection_reason text,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_memberships_user_id on public.memberships(user_id);
create index if not exists idx_memberships_program_id on public.memberships(program_id);
create index if not exists idx_memberships_status on public.memberships(status);
create index if not exists idx_memberships_enrollment_id on public.memberships(enrollment_id);

-- Update Supabase Postgres permissions to allow students to insert enrollments
grant usage on schema public to authenticated;
grant select on public.programs to authenticated;
grant insert, select on public.enrollments to authenticated;
grant select on public.memberships to authenticated;

-- Enable RLS on new tables
alter table public.enrollments enable row level security;
alter table public.memberships enable row level security;

-- RLS Policies for Enrollments
drop policy if exists "enrollments_select" on public.enrollments;
create policy "enrollments_select" on public.enrollments
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "enrollments_insert" on public.enrollments;
create policy "enrollments_insert" on public.enrollments
  for insert with check (auth.uid() = user_id);

drop policy if exists "enrollments_update" on public.enrollments;
create policy "enrollments_update" on public.enrollments
  for update using (auth.uid() = user_id or public.is_admin());

drop policy if exists "enrollments_delete" on public.enrollments;
create policy "enrollments_delete" on public.enrollments
  for delete using (public.is_admin());

-- RLS Policies for Memberships
drop policy if exists "memberships_select" on public.memberships;
create policy "memberships_select" on public.memberships
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "memberships_admin_write" on public.memberships;
create policy "memberships_admin_write" on public.memberships
  for all using (public.is_admin()) with check (public.is_admin());
