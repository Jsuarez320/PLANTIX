-- Crear tabla de cosechas conectada a Supabase Auth
create table if not exists public.harvests (
  id uuid primary key default gen_random_uuid(),
  planting_id uuid not null references public.plantings(id) on delete cascade,
  plant_name text not null,
  quantity_plants integer not null check (quantity_plants >= 0),
  weight_kg numeric(10,2) check (weight_kg >= 0),
  harvested_at timestamptz not null default now()
);

-- Remover columna 'notes' si existe (idempotente)
alter table if exists public.harvests drop column if exists notes;

-- Añadir columna user_id y FK a auth.users (idempotente)
alter table public.harvests
  add column if not exists user_id uuid not null default auth.uid();

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.harvests'::regclass
      and contype = 'f'
      and conname = 'fk_harvests_user'
  ) then
    alter table public.harvests drop constraint fk_harvests_user;
  end if;
end $$;

-- Migración idempotente: renombrar columna antigua `quantity` -> `quantity_plants`
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'harvests' and column_name = 'quantity'
  ) and not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'harvests' and column_name = 'quantity_plants'
  ) then
    alter table public.harvests rename column quantity to quantity_plants;
  end if;
end $$;

-- Asegurar columna de peso en kg
alter table public.harvests
  add column if not exists weight_kg numeric(10,2) check (weight_kg >= 0);

-- Índices para consultas
create index if not exists idx_harvests_date
  on public.harvests (harvested_at desc);
create index if not exists idx_harvests_user_date
  on public.harvests (user_id, harvested_at desc);

-- Índice para acelerar joins por siembra
create index if not exists idx_harvests_planting
  on public.harvests (planting_id);

-- Función y triggers para validar disponibilidad de plantas
create or replace function public.ensure_plants_available()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  planting_user uuid;
  planting_qty integer;
  harvested_sum integer;
begin
  -- Si no hay siembra, asegurar user_id y permitir inserción
  if NEW.planting_id is null then
    NEW.user_id := coalesce(NEW.user_id, auth.uid());
    return NEW;
  end if;

  -- Bloquear la siembra para evitar condiciones de carrera
  select p.user_id, p.quantity
    into planting_user, planting_qty
  from public.plantings p
  where p.id = NEW.planting_id
  for update;

  if planting_user is null then
    raise exception 'La siembra referenciada no existe';
  end if;

  -- Asegurar que la cosecha pertenece al mismo usuario que la siembra
  if planting_user <> auth.uid() then
    raise exception 'No puedes registrar cosechas de otro usuario';
  end if;
  NEW.user_id := planting_user;

  -- Suma de cosechas existentes para esta siembra (excluye la fila en actualización)
  select coalesce(sum(h.quantity_plants), 0)
    into harvested_sum
  from public.harvests h
  where h.planting_id = NEW.planting_id
    and (TG_OP <> 'UPDATE' or h.id <> NEW.id);

  -- Validar disponibilidad
  if (planting_qty - harvested_sum) < NEW.quantity_plants then
    raise exception 'No hay plantas suficientes: disponibles=%, solicitado=%',
      (planting_qty - harvested_sum), NEW.quantity_plants;
  end if;

  return NEW;
end;
$$;

-- Recrear triggers de validación
drop trigger if exists ensure_plants_available_on_insert on public.harvests;
drop trigger if exists ensure_plants_available_on_update on public.harvests;

create trigger ensure_plants_available_on_insert
before insert on public.harvests
for each row execute function public.ensure_plants_available();

create trigger ensure_plants_available_on_update
before update of quantity_plants, planting_id on public.harvests
for each row execute function public.ensure_plants_available();

-- Activar RLS
alter table public.harvests enable row level security;

-- Eliminar políticas existentes (si quieres recrearlas limpias)
drop policy if exists "Select own harvests" on public.harvests;
drop policy if exists "Insert own harvests" on public.harvests;
drop policy if exists "Update own harvests" on public.harvests;
drop policy if exists "Delete own harvests" on public.harvests;

-- Política: Seleccionar solo registros propios
create policy "Select own harvests"
  on public.harvests
  for select
  using (user_id = auth.uid());

-- Política: Insertar solo registros propios
create policy "Insert own harvests"
  on public.harvests
  for insert
  with check (user_id = auth.uid());

-- Política: Actualizar solo registros propios
create policy "Update own harvests"
  on public.harvests
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Política: Eliminar solo registros propios
create policy "Delete own harvests"
  on public.harvests
  for delete
  using (user_id = auth.uid());

-- Ajustar FK de planting para conservar cosechas si se elimina la siembra
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conrelid = 'public.harvests'::regclass
      and contype = 'f'
      and conname = 'harvests_planting_id_fkey'
  ) then
    alter table public.harvests drop constraint harvests_planting_id_fkey;
  end if;
end $$;

alter table public.harvests
  alter column planting_id drop not null;
alter table public.harvests
  add constraint harvests_planting_id_fkey
  foreign key (planting_id) references public.plantings(id) on delete set null;