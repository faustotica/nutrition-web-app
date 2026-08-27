/**
 * Lógica de sesión y protección de rutas del portal para el middleware de Next.js.
 *
 * `updateSession` es invocada por el middleware principal (`middleware.ts` en la raíz)
 * en cada request. Su responsabilidad es doble:
 *   1. Refrescar la sesión de Supabase a través de cookies, de modo que el token
 *      JWT se renueve automáticamente sin intervención del cliente.
 *   2. Implementar la protección de rutas del portal: redirigir al login si el usuario
 *      no está autenticado, o al dashboard si ya lo está e intenta acceder a auth.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const env = getSupabaseEnv();

  if (!env) {
    return supabaseResponse;
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Evaluar la ruta actual para decidir si hay que proteger o redirigir.
  const path = request.nextUrl.pathname;
  const isAuthPage =
    path.startsWith("/portal/login") || path.startsWith("/portal/registro");
  const isPortal = path.startsWith("/portal");

  // Si el usuario no está autenticado e intenta acceder a una ruta protegida del portal,
  // redirigir al login preservando la ruta de destino en ?next=.
  if (isPortal && !isAuthPage && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/portal/login";
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Si el usuario ya está autenticado y accede a una página de auth (login/registro),
  // redirigir al dashboard directamente.
  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/portal/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
