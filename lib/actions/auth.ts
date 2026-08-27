/**
 * Server Actions de autenticación del portal.
 *
 * Se ejecutan exclusivamente en el servidor; el cliente las invoca a través de
 * formularios con `useActionState`. Cada función devuelve un `AuthState` con el
 * mensaje de error (o null si tuvo éxito) para que el componente pueda mostrarlo
 * sin recargar la página.
 *
 * En caso de éxito, `redirect()` interrumpe la ejecución de la función lanzando
 * internamente una excepción especial de Next.js que genera una respuesta de
 * redirección desde el servidor — el navegador hace el redireccionamiento, no el JS
 * del cliente.
 */
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthState = { error: string | null };

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      error:
        "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. Configuralas en Vercel / .env.local.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  // redirect() lanza internamente una excepción de Next.js; no se ejecuta nada después de esta línea.
  redirect("/portal/dashboard");
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      error:
        "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. Configuralas en Vercel / .env.local.",
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };
  // redirect() lanza internamente una excepción de Next.js; no se ejecuta nada después de esta línea.
  redirect("/portal/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  // No importa si la sesión ya expiró; siempre redirigimos al login.
  if (supabase) await supabase.auth.signOut();
  redirect("/portal/login");
}
