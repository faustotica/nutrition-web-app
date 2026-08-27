# Nutrición Ramiro Reynoso

Plataforma Next.js (App Router) del consultorio del Lic. Ramiro Reynoso en Gualeguaychú, Entre Ríos. Hosting y base de datos en capas gratuitas: **Vercel** + **Supabase**. Videos embebidos (YouTube/Vimeo). Instagram: [@nutricion.ramiroreynoso](https://www.instagram.com/nutricion.ramiroreynoso/).

## Stack

- Next.js 16 · React 19 · TypeScript estricto · Tailwind CSS 4
- Supabase Auth + PostgreSQL + Row Level Security
- Sin librerías de pago ni CDNs propios

## Carpetas

- `app/` rutas públicas y `/portal`
- `components/` layout, recetas, contacto, portal
- `lib/supabase/` clientes browser/server y refresh de sesión
- `types/database.ts` modelos
- `schema.sql` tablas `plans`, `profiles`, `recipes`, `patient_meal_plans` (+ `contact_messages`) y políticas RLS

## Setup local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Completá en `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Sin esas variables el sitio público funciona con datos de ejemplo y el portal corre en **modo demo**.

## Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com) (free tier, sin tarjeta para el plan gratuito actual).
2. SQL Editor → pegá y ejecutá `schema.sql`.
3. Authentication → Providers → Email habilitado.
4. Copiá URL y anon key a `.env.local` y a Vercel → Environment Variables.

Las políticas RLS aíslan `profiles` y `patient_meal_plans` por `auth.uid()`. Un paciente no puede leer el menú de otro.

## Deploy $0/mes

1. Subí el repo a GitHub.
2. Importá el proyecto en [vercel.com](https://vercel.com) (Hobby).
3. Cargá las dos variables `NEXT_PUBLIC_*`.
4. Deploy. No hace falta servidor extra ni storage de video.

## Protección del visor de plan

En dashboard y menú: `user-select: none`, menú contextual bloqueado y marca de agua con el email del paciente. Es una capa de disuasión en UI; la fuente de verdad sigue siendo RLS.
