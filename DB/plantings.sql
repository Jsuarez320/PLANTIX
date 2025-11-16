-- Crear tabla si no existe
create table if not exists public.plantings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
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