/**
 * Barra de navegacion interna del portal de pacientes. Server Component.
 *
 * El cerrar sesion se implementa como un formulario nativo con action={signOut}.
 * Esto permite invocar la Server Action directamente desde el servidor sin
 * necesidad de un Client Component ni de un fetch manual.
 */
import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

export function PortalNav({ role }: { role?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-sage-soft">
      <nav className="flex flex-wrap gap-4 text-sm">
        <Link href="/portal/dashboard" className="text-sage-dark">
          Dashboard
        </Link>
        <Link href="/portal/mi-menu" className="text-sage-dark">
          Mi menú
        </Link>
        <Link href="/recetas" className="text-muted">
          Recetas
        </Link>
        {role === "nutritionist" && (
          <Link href="/portal/admin" className="text-sage-dark font-bold">
            Pacientes (Admin)
          </Link>
        )}
      </nav>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-full border border-sage-soft px-4 py-2 text-xs uppercase tracking-[0.14em]"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
