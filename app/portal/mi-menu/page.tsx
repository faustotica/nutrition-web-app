/**
 * Pagina de armado del menu semanal.
 *
 * Calcula el lunes de la semana actual (currentWeekStart), carga la grilla
 * guardada en Supabase (si existe) y la pasa a WeeklyMenuGrid como estado inicial.
 * Si no hay sesion o no hay plan asignado, redirige al login.
 */
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalNav } from "@/components/portal/PortalNav";
import { ProtectedPlanViewer } from "@/components/portal/ProtectedPlanViewer";
import { WeeklyMenuGrid } from "@/components/portal/WeeklyMenuGrid";
import { currentWeekStart, getCurrentPatient, getWeekMenu } from "@/lib/portal";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Mi menú" };

export default async function MiMenuPage() {
  const { user, profile, plan } = await getCurrentPatient();
  if (isSupabaseConfigured() && !user) redirect("/portal/login");

  const email = user?.email ?? profile?.email ?? "paciente@nutricionramiroreynoso.com";
  // Obtener el ISO del lunes de la semana actual para identificar el menu de esta semana.
  const weekStart = currentWeekStart();
  // Cargar el menu guardado para esta semana. Si el paciente nunca armo el menu de esta semana, saved es null y WeeklyMenuGrid arranca con una grilla vacia.
  const saved = user ? await getWeekMenu(user.id, weekStart) : null;

  if (profile?.role === "nutritionist") redirect("/portal/admin");
  if (!plan) redirect("/portal/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <PortalNav role={profile?.role} />
      <p className="text-xs uppercase tracking-[0.2em] text-sage-dark">Semana que inicia {weekStart}</p>
      <h1 className="mt-2 font-serif text-5xl">Mi menú</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Lunes a domingo · desayuno, almuerzo, merienda y cena. Las combinaciones respetan las
        reglas de tu plan asignado.
      </p>
      <div className="mt-8">
        <ProtectedPlanViewer email={email}>
          <div className="bg-cream p-4 md:p-8">
            <WeeklyMenuGrid
              initialGrid={saved}
              weekStart={weekStart}
              rules={plan.meal_rules}
            />
          </div>
        </ProtectedPlanViewer>
      </div>
    </div>
  );
}
