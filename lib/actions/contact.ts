/**
 * Server Action del formulario de contacto.
 *
 * Valida los campos en el servidor antes de intentar insertar en Supabase,
 * evitando viajes innecesarios a la base de datos cuando los datos son inválidos.
 *
 * Si Supabase no está configurado (modo demo), devuelve ok=true silenciosamente
 * para que la aplicación sea navegable sin credenciales de entorno definidas.
 */
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ContactState = { ok: boolean; error: string | null };

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Completá nombre, email y mensaje." };
  }

  // Modo demo: si Supabase no está configurado, fingimos éxito para no bloquear al usuario.
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: true,
      error: null,
    };
  }

  // Insertar el mensaje en la tabla contact_messages. El nutricionista lo gestiona desde el panel de Supabase.
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    return { ok: false, error: "No pudimos enviar el mensaje. Probá de nuevo." };
  }

  return { ok: true, error: null };
}
