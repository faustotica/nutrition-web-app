/**
 * Layout del portal de pacientes.
 *
 * force-dynamic es obligatorio porque las paginas del portal leen cookies de sesion
 * en cada request. Sin esto, Next.js podria cachear la respuesta del servidor y
 * servir la pagina de un usuario a otro.
 */
export const dynamic = "force-dynamic";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
