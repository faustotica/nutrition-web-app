"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { recipeFilters } from "@/lib/data/recipes";

/**
 * Filtros de busqueda del catalogo de recetas. Client Component.
 *
 * El estado de los filtros vive en la URL (search params), no en useState.
 * Esto permite compartir links con filtros aplicados y que el Server Component
 * padre pueda leer los parametros sin prop drilling.
 * useTransition envuelve el push del router para marcar la UI como pendiente
 * mientras Next.js procesa la nueva ruta.
 */
export function RecipeFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const query = params.get("q") ?? "";
  const category = params.get("categoria") ?? "todas";

  // Construye la nueva URL con los parametros actualizados y navega a ella. Los filtros vacios se eliminan de la URL para mantenerla limpia.
  function update(next: { q?: string; categoria?: string }) {
    const search = new URLSearchParams(params.toString());
    const q = next.q ?? query;
    const categoria = next.categoria ?? category;
    if (q) search.set("q", q);
    else search.delete("q");
    if (categoria && categoria !== "todas") search.set("categoria", categoria);
    else search.delete("categoria");
    startTransition(() => {
      router.push(`/recetas?${search.toString()}`);
    });
  }

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="sr-only">Buscar recetas</span>
        <input
          defaultValue={query}
          onChange={(event) => update({ q: event.target.value })}
          placeholder="Buscar por nombre, ingrediente o etiqueta…"
          className="w-full rounded-full border border-sage-soft bg-white px-5 py-3 text-sm outline-none ring-sage/30 focus:ring-2"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {recipeFilters.map((filter) => {
          const active = category === filter.id || (filter.id === "todas" && !params.get("categoria"));
          return (
            <button
              key={filter.id}
              type="button"
              disabled={pending}
              onClick={() => update({ categoria: filter.id })}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                active
                  ? "bg-sage text-white"
                  : "bg-white text-ink ring-1 ring-sage-soft hover:bg-sage-soft"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
