/**
 * Punto de entrada del portal. Redirige inmediatamente al dashboard.
 * Existe para que la ruta /portal tenga un handler en lugar de devolver 404.
 */
import { redirect } from "next/navigation";

export default function PortalIndexPage() {
  redirect("/portal/dashboard");
}
