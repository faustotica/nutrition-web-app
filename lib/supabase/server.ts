/**
 * Cliente de Supabase para uso en el servidor (Server Components y Server Actions).
 *
 * A diferencia del cliente de browser, este accede a las cookies del request de
 * Next.js para mantener la sesión del usuario entre requests. Por eso la función
 * es `async`: necesita awaitar el cookieStore que provee `next/headers`.
 *
 * El `try/catch` en `setAll` es necesario porque los Server Components tienen
 * el cookieStore en modo de solo lectura — no pueden escribir cookies directamente.
 * El middleware (`updateSession`) se encarga de refrescar la sesión y propagarla.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // En Server Components el cookieStore es de solo lectura; el middleware se encarga de refrescar la sesion.
        }
      },
    },
  });
}
