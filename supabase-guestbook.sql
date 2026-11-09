-- Chạy thủ công trong SQL Editor của dự án Supabase của bạn.
-- invitation_id phải khớp config.js. Lời chúc sẽ hiển thị công khai.
create table if not exists public.wedding_wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id text not null check (invitation_id = 'damcuoibachthu'),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  message text not null check (char_length(btrim(message)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists wedding_wishes_invitation_date
  on public.wedding_wishes (invitation_id, created_at desc);

alter table public.wedding_wishes enable row level security;
revoke all on table public.wedding_wishes from anon, authenticated;
grant select (invitation_id, name, message, created_at)
  on table public.wedding_wishes to anon, authenticated;
grant insert (invitation_id, name, message)
  on table public.wedding_wishes to anon, authenticated;

drop policy if exists "Read invitation wishes" on public.wedding_wishes;
create policy "Read invitation wishes" on public.wedding_wishes
  for select to anon, authenticated
  using (invitation_id = 'damcuoibachthu');

drop policy if exists "Send invitation wishes" on public.wedding_wishes;
create policy "Send invitation wishes" on public.wedding_wishes
  for insert to anon, authenticated
  with check (invitation_id = 'damcuoibachthu');
