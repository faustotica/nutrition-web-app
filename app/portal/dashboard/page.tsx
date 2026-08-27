/**
 * Dashboard del portal de pacientes.
 *
 * Lee el perfil y el plan del paciente en el servidor (getCurrentPatient).
 * Si Supabase esta configurado y no hay sesion activa, redirige al login.
 * Si no esta configurado, muestra el modo demo con el plan de ejemplo.
 * El contenido del plan se envuelve en ProtectedPlanViewer para aplicar
 * la marca de agua y bloquear la copia.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PortalNav } from "@/components/portal/PortalNav";
import { ProtectedPlanViewer } from "@/components/portal/ProtectedPlanViewer";
import { getCurrentPatient } from "@/lib/portal";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { user, profile, plan } = await getCurrentPatient();
  if (isSupabaseConfigured() && !user) redirect("/portal/login");
  if (profile?.role === "nutritionist") redirect("/portal/admin");

  const email = user?.email ?? profile?.email ?? "paciente@nutricionramiroreynoso.com";
  // Resolver el nombre a mostrar: primero el perfil de Supabase, luego el metadata del registro.
  const name =
    profile?.full_name ||
    (typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "Paciente");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <PortalNav role={profile?.role} />
      <p className="text-xs uppercase tracking-[0.2em] text-sage-dark">Portal</p>
      <h1 className="mt-2 font-serif text-5xl">Hola, {name}</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Este visor está protegido: no se puede seleccionar texto, el clic derecho está bloqueado y
        tu email aparece como marca de agua.
      </p>
      {/* Banner de modo demo: visible cuando no hay credenciales de Supabase configuradas. */}
      {!isSupabaseConfigured() ? (
        <p className="mt-4 rounded-xl bg-sage-soft px-4 py-3 text-sm">
          Modo demo: configurá Supabase para autenticación real. Mientras tanto ves el plan de
          ejemplo.
        </p>
      ) : null}

      <div className="mt-10">
        {/* El plan asignado se muestra dentro del ProtectedPlanViewer para aplicar marca de agua y bloqueo de copia. */}
      <ProtectedPlanViewer email={email}>
          <article className="bg-cream p-6 md:p-10">
            <p className="text-xs uppercase tracking-[0.18em] text-sage-dark">Plan asignado</p>
            <h2 className="mt-2 font-serif text-4xl">{plan?.name}</h2>
            <p className="mt-2 text-muted">{plan?.tagline}</p>
            <p className="mt-6 max-w-2xl text-sm leading-7">{plan?.description}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {plan?.services.map((service) => (
                <li key={service}>· {service}</li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-sage-dark">Reglas de combinación</p>
              <p className="mt-2 text-sm">
                Hasta {plan?.meal_rules.maxSelectionsPerMeal} selecciones por comida. Grupos:{" "}
                {plan?.meal_rules.allowedGroups.join(", ")}.
              </p>
              {plan?.meal_rules.notes ? (
                <p className="mt-2 text-sm text-muted">{plan.meal_rules.notes}</p>
              ) : null}
            </div>
            <Link
              href="/portal/mi-menu"
              className="mt-8 inline-flex rounded-full bg-sage px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white"
            >
              Armar mi menú semanal
            </Link>
          </article>
        </ProtectedPlanViewer>
      </div>
    </div>
  );
}
