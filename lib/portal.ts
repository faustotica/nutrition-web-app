/**
 * Capa de acceso a datos del portal de pacientes.
 *
 * Centraliza las queries de Supabase que necesitan las páginas del portal,
 * manteniendo los Server Components limpios de lógica de fetching. Toda la
 * comunicación con la base de datos pasa por este módulo, facilitando el
 * testeo y el reemplazo futuro de la fuente de datos.
 */
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { foods } from "@/lib/data/foods";

import { getPlanById } from "@/lib/data/plans";
import type { Plan, Profile, WeeklyMealGrid } from "@/types/database";

export async function getCurrentPatient() {
  const supabase = await createSupabaseServerClient();
  // Modo demo: Supabase no está configurado, devolver el plan de ejemplo (plan-integral)
  // para que el portal sea navegable sin credenciales.
  if (!supabase) {
    return {
      configured: false as const,
      user: null,
      profile: null,
      plan: getPlanById("plan-integral") as Plan,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true as const, user: null, profile: null, plan: null };
  }

  // Obtener el perfil extendido del usuario. Puede no existir si el trigger de Supabase no lo creó aún.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,plan_id")
    .eq("id", user.id)
    .maybeSingle();

  const plan = getPlanById(profile?.plan_id ?? null) as Plan;

  return {
    configured: true as const,
    user,
    profile: profile as Profile | null,
    plan,
  };
}

/**
 * Devuelve la grilla de alimentos guardada para la semana indicada,
 * o null si el paciente aún no armó el menú de esa semana.
 */
export async function getWeekMenu(patientId: string, weekStart: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("patient_meal_plans")
    .select("grid")
    .eq("patient_id", patientId)
    .eq("week_start", weekStart)
    .maybeSingle();
  
    const grid = data?.grid as WeeklyMealGrid | undefined;
    if (!grid) return null;

    // Limpiar alimentos "fantasma" que hayan quedado en la BD pero ya no existan en el catálogo actual
    const validFoodIds = new Set(foods.map((f) => f.id));
    for (const day of Object.keys(grid)) {
      const dayKey = day as keyof WeeklyMealGrid;
      for (const slot of Object.keys(grid[dayKey])) {
        const slotKey = slot as keyof WeeklyMealGrid[typeof dayKey];
        if (Array.isArray(grid[dayKey][slotKey])) {
          grid[dayKey][slotKey] = grid[dayKey][slotKey].filter((id) => validFoodIds.has(id));
        }
      }
    }

    return grid;
}

/**
 * Calcula la fecha ISO (YYYY-MM-DD) del lunes de la semana que contiene `date`.
 *
 * El día 0 en JavaScript es domingo, por lo que si getDay() === 0 se resta 6 días
 * para llegar al lunes anterior. Para cualquier otro día se resta (dia - 1),
 * retrocediendo hasta el lunes de esa misma semana.
 */
export function currentWeekStart(date = new Date()): string {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy.toISOString().slice(0, 10);
}
