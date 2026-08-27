import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre Mí",
};

// Formaciones y habilitaciones del profesional. Se renderizan como lista en la seccion de perfil.
const certifications = [
  `Licenciatura en Nutrición — ${site.professional.university}`,
  "Posgrado en Nutrición en Gastroenterología y Obesidad",
  "Nutrición y suplementos",
  "Medición de composición corporal",
];

export default function SobreMiPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6">
      {/* Imagen del profesional: ocupa toda la altura minima del contenedor con object-top para priorizar el rostro. */}
      <div className="relative min-h-[420px] overflow-hidden rounded-3xl">
        <Image
          src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1400&q=80"
          alt={site.professional.name}
          fill
          className="object-cover object-top"
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-sage-dark">Perfil profesional</p>
        <h1 className="mt-3 font-serif text-5xl">{site.professional.name}</h1>
        <p className="mt-2 text-muted">
          {site.professional.title} · {site.professional.credentials.join(" · ")}
        </p>
        <p className="mt-2 text-sm text-muted">{site.professional.location}</p>
        <p className="mt-6 text-lg leading-8 text-ink/85">
          Soy licenciado en Nutrición egresado de la Universidad Nacional de Entre Ríos (UNER).
          Atiendo en Gualeguaychú con un enfoque clínico: gastroenterología, obesidad, educación
          alimentaria y seguimiento con medición de composición corporal. El portal de pacientes
          sirve para que armes tu menú con las reglas de tu plan, no para dietas de moda.
        </p>
        <h2 className="mt-10 font-serif text-3xl">Formación y práctica</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink/90">
          {certifications.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        {/* Enlace externo a Instagram con rel=noreferrer para no enviar el Referer header al dominio externo. */}
        <a
          href={site.professional.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex rounded-full bg-sage px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-sage-dark"
        >
          Instagram {site.professional.instagramHandle}
        </a>
      </div>
    </div>
  );
}
