import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { site } from "@/lib/site";
import "./globals.css";

// Source Sans 3: tipografía sin serif para cuerpo de texto. display:swap evita FOIT (flash of invisible text).
const sans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  display: "swap",
});

// Cormorant Garamond: tipografía serif usada en títulos. Se carga en varios pesos para flexibilidad.
const serif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Metadata por defecto del sitio. Las páginas internas sobreescriben solo el title usando el template '%s | Nombre'.
export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      {/* Las variables de fuente se pasan como clases CSS al html para que Tailwind las detecte via var(). */}
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
