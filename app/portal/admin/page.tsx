import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PortalNav } from "@/components/portal/PortalNav";
import { PatientRow } from "@/components/admin/PatientRow";


export const metadata: Metadata = { title: "Panel de Nutricionista" };

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/portal/dashboard");

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/portal/login");

  // Verificar rol
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profile?.role !== "nutritionist") {
    redirect("/portal/dashboard"); // Solo para nutricionistas
  }

  const { data: dbPlans } = await supabase.from("plans").select("*");
  // Cargar todos los pacientes
  const { data: patients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "patient")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <PortalNav role={profile?.role} />
      <p className="text-xs uppercase tracking-[0.2em] text-sage-dark">Administración</p>
      <h1 className="mt-2 font-serif text-5xl">Pacientes</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Asigná planes a tus pacientes. El plan asignado determina qué alimentos pueden combinar en su menú.
      </p>

      <div className="mt-10 overflow-hidden rounded-3xl bg-white ring-1 ring-sage-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sage-soft bg-cream/50 text-sage-dark">
            <tr>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Paciente</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Email</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Plan Asignado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-soft">
            {patients?.map((patient) => (
              <PatientRow key={patient.id} patient={patient} availablePlans={dbPlans || []} />
            ))}
            {(!patients || patients.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted">
                  No hay pacientes registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
