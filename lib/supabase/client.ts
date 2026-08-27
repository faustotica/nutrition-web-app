/**
 * Cliente de Supabase para uso en el navegador (Client Components).
 *
 * A diferencia del cliente de servidor (`server.ts`), este no tiene acceso
 * a las cookies del servidor de Next.js. Lo gestiona `@supabase/ssr` internamente
 * usando el localStorage del browser para mantener la sesión.
 *
 * Retorna `null` si Supabase no está configurado, para que los componentes
 * clientes puedan degradar gracefully sin lanzar errores.
 */
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createBrowserClient(env.url, env.anonKey);
}
