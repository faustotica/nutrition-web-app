"use client";

/**
 * Componente de proteccion de contenido del plan asignado. Client Component.
 *
 * WatermarkOverlay superpone el email del paciente como marca de agua diagonal
 * sobre el contenido protegido. aria-hidden la oculta de los lectores de pantalla
 * porque es puramente decorativa/disuasoria.
 *
 * ProtectedPlanViewer bloquea los eventos de copia, corte, drag y clic derecho
 * para dificultar (no imposibilitar) la extraccion del contenido del plan.
 * Esta proteccion es disuasoria: no es criptografica.
 */
export function WatermarkOverlay({ email }: { email: string }) {
  const tiles = Array.from({ length: 48 }, (_, index) => index);

  return (
    <div className="watermark-layer" aria-hidden>
      <div className="grid h-full grid-cols-3 gap-10 p-6 md:grid-cols-4">
        {tiles.map((tile) => (
          <span key={tile}>{email}</span>
        ))}
      </div>
    </div>
  );
}

export function ProtectedPlanViewer({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="plan-protected relative overflow-hidden rounded-3xl"
      // Bloquear el menu contextual para dificultar la copia de contenido.
      onContextMenu={(event) => event.preventDefault()}
      onCopy={(event) => event.preventDefault()}
      onCut={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <WatermarkOverlay email={email} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
