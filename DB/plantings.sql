-- Crear tabla si no existe (con FK a profiles)
create table if not exists public.plantings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plant_name text not null,
  quantity integer not null check (quantity >= 0),
  planted_at timestamptz not null default now()
);

-- Índice para consultas por usuario y orden por fecha
create index if not exists idx_plantings_user_date
  on public.plantings (user_id, planted_at desc);

-- Activar RLS
alter table public.plantings enable row level security;

-- Eliminar políticas existentes (si quieres recrearlas limpias)
drop policy if exists "Select own plantings" on public.plantings;
drop policy if exists "Insert own plantings" on public.plantings;
drop policy if exists "Update own plantings" on public.plantings;
drop policy if exists "Delete own plantings" on public.plantings;

-- Política: Seleccionar solo registros propios
create policy "Select own plantings"
  on public.plantings
  for select
using (auth.uid() = user_id);

-- Política: Insertar solo registros propios
create policy "Insert own plantings"
  on public.plantings
  for insert
with check (auth.uid() = user_id);

-- Política: Eliminar solo registros propios
create policy "Delete own plantings"
  on public.plantings
  for delete
using (auth.uid() = user_id);

-- Establecer default de user_id a auth.uid() para inserciones desde el cliente
alter table public.plantings
  alter column user_id set default auth.uid();

-- Crear perfil automáticamente para nuevos usuarios en auth.users
create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, updated_at)
  values (NEW.id, now())
  on conflict (id) do nothing;
  return NEW;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

-- Backfill de perfiles faltantes para usuarios existentes
insert into public.profiles (id)
select u.id
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- Migración idempotente: ajustar FK user_id a profiles si venía de auth.users
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.plantings'::regclass
      and contype = 'f'
      and conname = 'plantings_user_id_fkey'
  ) then
    alter table public.plantings drop constraint plantings_user_id_fkey;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint c
    join pg_class rc on rc.oid = c.confrelid
    join pg_namespace rn on rn.oid = rc.relnamespace
    where c.conrelid = 'public.plantings'::regclass
      and c.contype = 'f'
      and rc.relname = 'profiles'
      and rn.nspname = 'public'
  ) then
    alter table public.plantings
      add constraint plantings_user_id_fkey
      foreign key (user_id) references public.profiles(id) on delete cascade;
  end if;
end $$;