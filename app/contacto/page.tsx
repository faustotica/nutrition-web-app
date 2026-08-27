import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-sage-dark">Escribime</p>
        <h1 className="mt-3 font-serif text-5xl">Contacto</h1>
        <p className="mt-4 text-muted">
          Escribí tu consulta o coordiná el turno por Instagram. El formulario guarda el mensaje
          en Supabase cuando el proyecto está configurado.
        </p>
        <div className="mt-8 space-y-2 text-sm">
          <p>{site.professional.location}</p>
          <a
            href={site.professional.instagram}
            target="_blank"
            rel="noreferrer"
            className="text-sage-dark underline"
          >
            {site.professional.instagramHandle}
          </a>
        </div>
      </div>
      {/* ContactForm es un Client Component que usa useActionState con la Server Action submitContact. */}
      <ContactForm />
    </div>
  );
}
