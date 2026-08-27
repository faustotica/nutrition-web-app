/**
 * Lectura centralizada de variables de entorno de Supabase.
 *
 * Se centraliza aquí en lugar de acceder a `process.env` directamente desde cada
 * módulo por dos razones:
 *   1. Un único punto de falla: si faltan las variables, el error es claro y localizado.
 *   2. Facilita el modo demo: cuando Supabase no está configurado, todos los módulos
 *      que consumen estas funciones reciben `null` y degradan gracefully (sin lanzar).
 */

/**
 * Devuelve las credenciales de Supabase si están configuradas en el entorno,
 * o `null` si alguna variable falta. Esto permite que la app funcione en modo
 * demo sin variables de entorno definidas.
 */
export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/**
 * Helper booleano para verificar de forma rápida si Supabase está configurado.
 * Se usa en las páginas del portal para decidir si mostrar el banner de modo demo.
 */
export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
