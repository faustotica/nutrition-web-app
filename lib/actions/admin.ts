"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updatePatientPlan(patientId: string, planId: string | null) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Supabase no está configurado" };

  // 1. Verificar que el usuario actual es nutricionista (Seguridad)
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return { error: "No autorizado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profile?.role !== "nutritionist") {
    return { error: "Acceso denegado: solo nutricionistas pueden hacer esto." };
  }

  // 2. Actualizar el plan del paciente en la base de datos
  const { error } = await supabase
    .from("profiles")
    .update({ plan_id: planId })
    .eq("id", patientId);

  if (error) {
    return { error: "Error al actualizar el plan: " + error.message };
  }

  // Refrescar la página para ver el cambio instantáneo
  revalidatePath("/portal/admin");
  return { error: null };
}
