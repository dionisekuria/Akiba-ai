create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (
    display_name is null or char_length(display_name) between 2 and 80
  )
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  category text not null,
  target_amount numeric(14, 2) not null,
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_name_length check (char_length(name) between 1 and 120),
  constraint goals_description_length check (
    description is null or char_length(description) <= 1000
  ),
  constraint goals_category_length check (char_length(category) between 1 and 80),
  constraint goals_target_amount_positive check (target_amount > 0),
  constraint goals_id_user_id_unique unique (id, user_id)
);

create table public.goal_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal_id uuid not null,
  amount numeric(14, 2) not null,
  noted_on date not null default current_date,
  note text,
  created_at timestamptz not null default now(),
  constraint goal_contributions_owner_goal_fk
    foreign key (goal_id, user_id)
    references public.goals (id, user_id)
    on delete cascade,
  constraint goal_contributions_amount_positive check (amount > 0),
  constraint goal_contributions_note_length check (
    note is null or char_length(note) <= 500
  )
);

create index goals_user_created_at_idx
  on public.goals (user_id, created_at desc);
create index goal_contributions_user_goal_idx
  on public.goal_contributions (user_id, goal_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger goals_set_updated_at
  before update on public.goals
  for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate_name text;
begin
  candidate_name := nullif(
    btrim(left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 80)),
    ''
  );

  if candidate_name is not null and char_length(candidate_name) < 2 then
    candidate_name := null;
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, candidate_name);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.goal_contributions enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can manage their own goals"
  on public.goals for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can manage their own goal contributions"
  on public.goal_contributions for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.goals
      where goals.id = goal_contributions.goal_id
        and goals.user_id = (select auth.uid())
    )
  );

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.goals to authenticated;
grant select, insert, update, delete on public.goal_contributions to authenticated;
