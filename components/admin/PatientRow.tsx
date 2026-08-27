"use client";

import { useTransition } from "react";
import { updatePatientPlan } from "@/lib/actions/admin";
import type { Profile, Plan } from "@/types/database";

export function PatientRow({
  patient,
  availablePlans,
}: {
  patient: Profile;
  availablePlans: Plan[];
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newPlanId = e.target.value === "none" ? null : e.target.value;
    startTransition(async () => {
      await updatePatientPlan(patient.id, newPlanId);
    });
  }

  return (
    <tr className={`transition-colors hover:bg-cream/30 ${pending ? "opacity-50" : ""}`}>
      <td className="px-6 py-4 font-medium text-ink">{patient.full_name || "Sin nombre"}</td>
      <td className="px-6 py-4 text-muted">{patient.email}</td>
      <td className="px-6 py-4">
        <select
          disabled={pending}
          value={patient.plan_id || "none"}
          onChange={handleChange}
          className="rounded-lg border border-sage-soft bg-transparent px-3 py-1.5 text-sm outline-none focus:border-sage-dark focus:ring-1 focus:ring-sage-dark disabled:cursor-not-allowed"
        >
          <option value="none">Sin plan asignado</option>
          {availablePlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
