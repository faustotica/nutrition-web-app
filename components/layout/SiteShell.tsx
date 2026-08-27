/**
 * Shell principal de la aplicacion.
 *
 * Implementa el patron sticky footer: flex-col en el contenedor raiz con flex-1 en main
 * garantiza que el footer siempre quede al fondo, incluso en paginas con poco contenido.
 * Envuelve todas las paginas publicas (no el portal, que tiene su propio layout).
 */
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-cream font-sans text-ink">
      <Header />
      {/* flex-1 hace que main ocupe todo el espacio sobrante, empujando el footer hacia abajo. */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
