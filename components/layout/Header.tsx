"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, site } from "@/lib/site";

/**
 * Header principal del sitio. Client Component porque necesita usePathname para
 * resaltar el item activo y useState para el menu mobile.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // El header se oculta parcialmente en el portal; este flag lo usa el boton de acceso para cambiar su destino.
  const isPortal = pathname.startsWith("/portal");

  return (
    <header className="sticky top-0 z-40 border-b border-sage-soft/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-sage text-[11px] font-semibold tracking-tight text-white">
            {site.shortName}
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg text-ink">{site.name}</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-muted">
              Consultorio
            </span>
          </span>
        </Link>

        {/* Navegacion desktop: oculta en mobile (hidden), visible desde lg. */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            // El item de inicio solo es activo en la ruta exacta '/'; el resto activa con startsWith.
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] font-medium uppercase tracking-[0.16em] transition ${
                  active ? "text-sage-dark" : "text-ink/80 hover:text-sage-dark"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={isPortal ? "/portal/dashboard" : "/portal/login"}
            className="hidden rounded-full bg-sage px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-sage-dark sm:inline-flex"
          >
            Acceso Pacientes
          </Link>
          {/* Boton hamburguesa: visible solo en mobile (lg:hidden). Alterna el menu desplegable. */}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-sage-soft text-ink lg:hidden"
            aria-label="Abrir menú"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="text-lg">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Menu mobile desplegable: se monta solo cuando open === true para evitar animaciones innecesarias. */}
      {open ? (
        <div className="border-t border-sage-soft bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm uppercase tracking-[0.14em] text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/portal/login"
              className="mt-2 rounded-full bg-sage px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
              onClick={() => setOpen(false)}
            >
              Acceso Pacientes
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
