import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
};

// Posts de ejemplo hardcodeados. En el futuro pueden migrarse a la tabla recipes de Supabase (con un campo type='blog') o a un CMS headless como Sanity o Contentful.
const posts = [
  {
    title: "Por qué las equivalencias funcionan mejor que contar calorías",
    excerpt: "Una guía breve para entender grupos de alimentos y porciones visuales.",
  },
  {
    title: "Cómo armar un tupper que respete tu plan",
    excerpt: "Combinaciones de almuerzo para oficina, en 15 minutos.",
  },
  {
    title: "Sin TACC sin aburrirse: ideas de colaciones",
    excerpt: "Opciones seguras, ricas y fáciles de llevar.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-sage-dark">Lecturas</p>
      <h1 className="mt-3 font-serif text-5xl">Blog</h1>
      <p className="mt-4 text-muted">
        Contenido educativo. Podés migrar estos artículos a la tabla <code>recipes</code> o a un
        CMS headless gratuito más adelante.
      </p>
      <div className="mt-10 space-y-6">
        {posts.map((post) => (
          <article key={post.title} className="rounded-3xl bg-white p-6 ring-1 ring-sage-soft">
            <h2 className="font-serif text-3xl">{post.title}</h2>
            <p className="mt-2 text-muted">{post.excerpt}</p>
            <Link href="/contacto" className="mt-4 inline-block text-sm text-sage-dark underline">
              Pedir consulta
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
