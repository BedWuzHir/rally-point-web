create table public.support_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category text not null check (category in ('booking', 'membership', 'payment', 'technical', 'other')),
  subject text not null check (char_length(subject) between 1 and 120),
  message text not null check (char_length(message) between 1 and 2000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default now()
);

alter table public.support_inquiries enable row level security;

create policy "inquiries_insert_staff_admin"
  on public.support_inquiries for insert to authenticated
  with check (
    user_id = auth.uid()
    and (select private.current_role()) in ('staff', 'admin')
  );

create policy "inquiries_read_own_or_admin"
  on public.support_inquiries for select to authenticated
  using (
    user_id = auth.uid()
    or (select private.current_role()) = 'admin'
  );

grant select, insert on public.support_inquiries to authenticated;
