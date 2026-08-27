import type { Metadata } from "next";
import { Suspense } from "react";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { filterRecipes } from "@/lib/data/recipes";

export const metadata: Metadata = {
  title: "Recetas & Videos",
};

export default async function RecetasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  // En Next.js 16 searchParams es una Promise; hay que awaitearlo antes de leer los valores.
  const params = await searchParams;
  const list = filterRecipes(params.q ?? "", params.categoria ?? "todas");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-sage-dark">Cocina real</p>
      <h1 className="mt-3 font-serif text-5xl">Recetas y videos</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Feed filtrable. Los videos se reproducen embebidos desde YouTube o Vimeo: sin CDN propio ni
        costo extra.
      </p>
      <div className="mt-10">
        {/* RecipeFilters usa useSearchParams (client hook), por eso necesita Suspense para no bloquear el Server Component padre. */}
        <Suspense>
          <RecipeFilters />
        </Suspense>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      {/* Estado vacio: se muestra solo cuando ningun filtro activo coincide con alguna receta publicada. */}
      {list.length === 0 ? (
        <p className="mt-10 text-muted">No hay recetas con ese criterio. Probá otro filtro.</p>
      ) : null}
    </div>
  );
}
