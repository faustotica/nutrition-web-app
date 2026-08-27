-- Nutrición Ramiro Reynoso — schema PostgreSQL + RLS (Supabase Free Tier)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  description text not null,
  price_label text not null default 'Consulta',
  featured boolean not null default false,
  services jsonb not null default '[]'::jsonb,
  meal_rules jsonb not null default '{
    "allowedGroups": ["proteinas", "carbohidratos", "vegetales", "frutas"],
    "maxSelectionsPerMeal": 3
  }'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'patient' check (role in ('patient', 'nutritionist')),
  plan_id uuid references public.plans (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  image_url text,
  video_url text,
  category text not null check (
    category in ('desayuno', 'almuerzo', 'colaciones', 'cena', 'vegetariano', 'sin-tacc')
  ),
  tags text[] not null default '{}',
  ingredients text[] not null default '{}',
  steps text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.patient_meal_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles (id) on delete cascade,
  week_start date not null,
  grid jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (patient_id, week_start)
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profile bootstrap on signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_plan uuid;
begin
  select id into default_plan
  from public.plans
  where featured = true
  order by created_at
  limit 1;

  insert into public.profiles (id, email, full_name, role, plan_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'patient',
    default_plan
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Helpers (SECURITY DEFINER) — evita recursión en políticas RLS
-- ---------------------------------------------------------------------------

create or replace function public.is_nutritionist()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'nutritionist'
  );
$$;

create or replace function public.current_plan_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select plan_id
  from public.profiles
  where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.plans enable row level security;
alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.patient_meal_plans enable row level security;
alter table public.contact_messages enable row level security;

-- plans: catálogo público de lectura; escritura solo nutricionista
drop policy if exists "plans_public_read" on public.plans;
create policy "plans_public_read"
  on public.plans for select
  using (true);

drop policy if exists "plans_nutritionist_write" on public.plans;
create policy "plans_nutritionist_write"
  on public.plans for all
  using (public.is_nutritionist())
  with check (public.is_nutritionist());

-- recipes: lecturas públicas de recetas publicadas
drop policy if exists "recipes_public_read" on public.recipes;
create policy "recipes_public_read"
  on public.recipes for select
  using (is_published = true or public.is_nutritionist());

drop policy if exists "recipes_nutritionist_write" on public.recipes;
create policy "recipes_nutritionist_write"
  on public.recipes for all
  using (public.is_nutritionist())
  with check (public.is_nutritionist());

-- profiles: cada paciente ve y edita SOLO su fila
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid() or public.is_nutritionist());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'patient');

drop policy if exists "profiles_nutritionist_update" on public.profiles;
create policy "profiles_nutritionist_update"
  on public.profiles for update
  using (public.is_nutritionist())
  with check (public.is_nutritionist());

-- patient_meal_plans: aislamiento estricto por patient_id
drop policy if exists "meal_plans_select_own" on public.patient_meal_plans;
create policy "meal_plans_select_own"
  on public.patient_meal_plans for select
  using (patient_id = auth.uid() or public.is_nutritionist());

drop policy if exists "meal_plans_insert_own" on public.patient_meal_plans;
create policy "meal_plans_insert_own"
  on public.patient_meal_plans for insert
  with check (patient_id = auth.uid());

drop policy if exists "meal_plans_update_own" on public.patient_meal_plans;
create policy "meal_plans_update_own"
  on public.patient_meal_plans for update
  using (patient_id = auth.uid())
  with check (patient_id = auth.uid());

drop policy if exists "meal_plans_delete_own" on public.patient_meal_plans;
create policy "meal_plans_delete_own"
  on public.patient_meal_plans for delete
  using (patient_id = auth.uid() or public.is_nutritionist());

-- contact_messages: inserción anónima (formulario público), lectura solo staff
drop policy if exists "contact_insert_anyone" on public.contact_messages;
create policy "contact_insert_anyone"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "contact_select_staff" on public.contact_messages;
create policy "contact_select_staff"
  on public.contact_messages for select
  using (public.is_nutritionist());

-- ---------------------------------------------------------------------------
-- Seed mínimo para arrancar el catálogo público
-- ---------------------------------------------------------------------------

insert into public.plans (slug, name, tagline, description, price_label, featured, services, meal_rules)
values
  (
    'inicio-consciente',
    'Inicio consciente',
    'Para ordenar hábitos sin dietas extremas',
    'Evaluación inicial, plan de equivalencias y seguimiento quincenal.',
    'Consulta puntual',
    false,
    '["Consulta inicial de 60 minutos","Plan de equivalencias","Guía de porciones","1 control a los 15 días"]'::jsonb,
    '{"allowedGroups":["proteinas","carbohidratos","vegetales","frutas","lacteos"],"maxSelectionsPerMeal":3}'::jsonb
  ),
  (
    'acompanamiento-integral',
    'Acompañamiento integral',
    'El más elegido para resultados sostenidos',
    'Seguimiento mensual con menú flexible y acceso al portal de pacientes.',
    'Mensual',
    true,
    '["Consulta inicial + 3 controles","Plan personalizado","Portal de pacientes","Recetas filtradas"]'::jsonb,
    '{"allowedGroups":["proteinas","carbohidratos","vegetales","frutas","lacteos","grasas"],"maxSelectionsPerMeal":4}'::jsonb
  )
on conflict (slug) do nothing;
