/**
 * Tarjeta de receta para el feed y la home.
 * Usa next/image con fill en un contenedor de aspect ratio fijo (4:3) para que la imagen
 * siempre ocupe el mismo espacio sin layout shift. El efecto scale en hover se maneja
 * con Tailwind para evitar reflows.
 */
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/types/database";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recetas/${recipe.slug}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sage-soft transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Contenedor con aspect ratio fijo. next/image fill requiere que el padre tenga position:relative. */}
      <div className="relative aspect-[4/3]">
        <Image
          src={recipe.image_url}
          alt={recipe.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      {/* Cuerpo de la tarjeta: tags, titulo y excerpt. */}
      <div className="space-y-2 p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-sage-dark">
          {recipe.tags.join(" · ")}
        </p>
        <h3 className="font-serif text-2xl leading-tight text-ink">{recipe.title}</h3>
        <p className="text-sm leading-6 text-muted">{recipe.excerpt}</p>
      </div>
    </Link>
  );
}
