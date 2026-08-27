import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { VideoEmbed } from "@/components/recipes/VideoEmbed";
import { getRecipeBySlug, recipes } from "@/lib/data/recipes";

// Pre-genera todas las rutas de recetas en build time para que sean estaticas (SSG). No se necesita base de datos en runtime.
export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

// Metadata dinamica por receta: el title cambia segun la receta que se esta viendo.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  return { title: recipe?.title ?? "Receta" };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-sage-dark">
        {recipe.tags.join(" · ")}
      </p>
      <h1 className="mt-3 font-serif text-5xl">{recipe.title}</h1>
      <p className="mt-4 text-lg text-muted">{recipe.excerpt}</p>
      {/* Imagen de portada de la receta con aspect ratio 16:9 fijo. */}
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
        <Image src={recipe.image_url} alt={recipe.title} fill className="object-cover" />
      </div>
      {/* Si la receta tiene video, se muestra el embed debajo de la imagen. VideoEmbed normaliza la URL (watch, youtu.be o vimeo). */}
      {recipe.video_url ? (
        <div className="mt-8">
          <VideoEmbed url={recipe.video_url} title={recipe.title} />
        </div>
      ) : null}
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="font-serif text-3xl">Ingredientes</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/90">
            {recipe.ingredients.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-serif text-3xl">Preparación</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-ink/90">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
