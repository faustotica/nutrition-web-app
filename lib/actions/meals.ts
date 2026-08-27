/**
 * Server Action para guardar el menú semanal del paciente.
 *
 * Usa upsert con clave compuesta (patient_id + week_start) para que guardar dos
 * veces la misma semana actualice el registro existente en lugar de duplicarlo.
 * Esto simplifica la lógica del cliente: siempre llama a la misma acción sin
 * distinguir entre crear o editar.
 */
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WeeklyMealGrid } from "@/types/database";

export async function saveWeeklyMenu(weekStart: string, grid: WeeklyMealGrid) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase no está configurado." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión expirada." };

  // onConflict indica a Supabase que si ya existe un registro con esa combinación de
  // patient_id y week_start, lo actualice en lugar de insertar uno nuevo.
  const { error } = await supabase.from("patient_meal_plans").upsert(
    {
      patient_id: user.id,
      week_start: weekStart,
      grid,
    },
    { onConflict: "patient_id,week_start" },
  );

  if (error) return { error: error.message };
  // Invalidar la caché de la página del menú para que el servidor la regenere con los datos recién guardados.
  revalidatePath("/portal/mi-menu");
  return { error: null };
}
