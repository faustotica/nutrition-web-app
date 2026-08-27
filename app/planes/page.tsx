import type { Metadata } from "next";
import Link from "next/link";
import { plans } from "@/lib/data/plans";

export const metadata: Metadata = {
  title: "Planes & Servicios",
};

export default function PlanesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-sage-dark">Catálogo</p>
      <h1 className="mt-3 font-serif text-5xl">Planes y servicios</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Cada paquete incluye un desglose de lo que vas a recibir. El plan asignado habilita las
        reglas de combinación en el portal de pacientes.
      </p>
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`flex flex-col rounded-3xl p-8 ring-1 ring-sage-soft ${
              plan.featured ? "bg-sage-dark text-white" : "bg-white"
            }`}
          >
            {/* El plan destacado recibe el badge 'Mas elegido' y colores invertidos (fondo oscuro, texto blanco). */}
            {plan.featured ? (
              <span className="mb-3 text-[11px] uppercase tracking-[0.18em]">Más elegido</span>
            ) : null}
            <h2 className="font-serif text-3xl">{plan.name}</h2>
            <p className={`mt-2 text-sm ${plan.featured ? "text-white/80" : "text-muted"}`}>
              {plan.tagline}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.16em]">{plan.priceLabel}</p>
            <p className={`mt-4 text-sm leading-6 ${plan.featured ? "text-white/85" : "text-ink/80"}`}>
              {plan.description}
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm">
              {plan.services.map((service) => (
                <li key={service}>· {service}</li>
              ))}
            </ul>
            {/* Todos los planes dirigen al formulario de contacto; no hay checkout online en esta version. */}
            <Link
              href="/contacto"
              className={`mt-8 inline-flex justify-center rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] ${
                plan.featured ? "bg-white text-ink" : "bg-sage text-white hover:bg-sage-dark"
              }`}
            >
              Quiero este plan
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
