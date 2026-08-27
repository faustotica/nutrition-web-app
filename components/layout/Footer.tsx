/**
 * Footer del sitio. Server Component: no necesita estado ni hooks del browser.
 * Estructura de tres columnas: marca, navegacion y datos del consultorio.
 */
import Link from "next/link";
import { navItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-sage-soft bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-serif text-2xl text-ink">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">{site.tagline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sage-dark">Navegación</p>
          <ul className="mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink/80 hover:text-sage-dark">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sage-dark">Consultorio</p>
          <p className="mt-4 text-sm text-ink">{site.professional.name}</p>
          <p className="text-sm text-muted">{site.professional.title}</p>
          <p className="mt-2 text-sm text-muted">{site.professional.location}</p>
          <a
            href={site.professional.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-sage-dark hover:underline"
          >
            {site.professional.instagramHandle}
          </a>
        </div>
      </div>
      <div className="border-t border-sage-soft py-4 text-center text-xs text-muted">
        {/* El anio se calcula en runtime para que no quede desactualizado. */}
        © {new Date().getFullYear()} {site.name}. Hosting en capa gratuita (Vercel + Supabase).
      </div>
    </footer>
  );
}
