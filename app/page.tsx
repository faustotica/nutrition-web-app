import Image from "next/image";
import Link from "next/link";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { plans } from "@/lib/data/plans";
import { recipes } from "@/lib/data/recipes";
import { testimonials } from "@/lib/data/testimonials";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero: imagen de portada con overlay oscuro y call-to-action. Usa position:fill de next/image para cubrir el contenedor sin definir dimensiones fijas. */}
      <section className="relative min-h-[78vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2000&q=80"
          alt="Mesa con alimentos frescos"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 py-24 text-white md:px-6">
          <p className="text-xs uppercase tracking-[0.28em]">
            Hola, soy {site.professional.firstName}
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-tight md:text-7xl">
            Tu nutricionista en Gualeguaychú
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sobre-mi"
              className="rounded-full bg-sage px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-sage-dark"
            >
              Conóceme
            </Link>
            <Link
              href="/planes"
              className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:bg-cream"
            >
              Comienza hoy
            </Link>
          </div>
        </div>
      </section>

      {/* Propuesta de valor: frase central que resume el enfoque clinico del consultorio. */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <p className="font-serif text-3xl leading-snug text-ink md:text-4xl">
          Consultorio en Gualeguaychú: criterio clínico, medición de composición corporal y un
          plan que podés sostener.
        </p>
      </section>

      {/* Bloque de dos columnas con los dos ejes del servicio: planes de seguimiento y evaluacion de composicion corporal. */}
      <section className="grid md:grid-cols-2">
        <div className="bg-sage-dark px-6 py-16 text-white md:px-12">
          <p className="text-xs uppercase tracking-[0.22em] text-white/70">Planes</p>
          <h2 className="mt-3 font-serif text-4xl">
            Gastroenterología, obesidad y seguimiento con datos
          </h2>
          <Link
            href="/planes"
            className="mt-8 inline-flex rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink"
          >
            Selecciona tu plan
          </Link>
        </div>
        <div className="bg-sage px-6 py-16 text-white md:px-12">
          <p className="text-xs uppercase tracking-[0.22em] text-white/70">Evaluación</p>
          <h2 className="mt-3 font-serif text-4xl">
            Composición corporal y nutrición con suplementos, cuando corresponde
          </h2>
          <Link
            href="/sobre-mi"
            className="mt-8 inline-flex rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink"
          >
            Ver formación y consulta
          </Link>
        </div>
      </section>

      {/* Preview de los planes disponibles. Se renderizan desde el catalogo estatico en lib/data/plans.ts. */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sage-dark">Servicios</p>
            <h2 className="mt-2 font-serif text-4xl">Planes con desglose claro</h2>
          </div>
          <Link href="/planes" className="text-sm text-sage-dark underline">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-3xl p-6 ring-1 ring-sage-soft ${plan.featured ? "bg-sage-dark text-white" : "bg-white"}`}
            >
              <p className="text-[11px] uppercase tracking-[0.16em] opacity-80">{plan.priceLabel}</p>
              <h3 className="mt-2 font-serif text-3xl">{plan.name}</h3>
              <p className={`mt-3 text-sm ${plan.featured ? "text-white/80" : "text-muted"}`}>
                {plan.tagline}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Ultimas tres recetas del catalogo. RecipeCard maneja la imagen, los tags y el excerpt. */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-sage-dark">Cocina</p>
          <h2 className="mt-2 font-serif text-4xl">Últimas recetas</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {recipes.slice(0, 3).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios de pacientes. Datos estaticos en lib/data/testimonials.ts. */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-sage-dark">Historias</p>
        <h2 className="mt-2 font-serif text-4xl">Testimonios</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="rounded-3xl bg-white p-6 ring-1 ring-sage-soft">
              <p className="font-serif text-2xl leading-snug text-ink">“{item.quote}”</p>
              <footer className="mt-6 text-sm text-muted">
                {item.name} · {item.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}
