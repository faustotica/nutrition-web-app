/**
 * Utilidad para normalizar URLs de video y componente de embed.
 *
 * getEmbedUrl acepta cualquier variante de URL de YouTube (watch?v=, youtu.be/, /embed/)
 * y de Vimeo, y devuelve la URL de embed lista para usar en un iframe.
 * Retorna null si la URL no es reconocida o si el parseo falla, para que el
 * componente VideoEmbed pueda renderizar null sin romper la pagina.
 */
export function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Formato corto de YouTube: youtu.be/ID
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.replace("/", "")}`;
    }
    // Formato largo: youtube.com/watch?v=ID o youtube.com/embed/ID
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // Vimeo: vimeo.com/ID
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = getEmbedUrl(url);
  if (!embed) return null;

  return (
    <div className="aspect-video overflow-hidden rounded-2xl bg-ink shadow-sm">
      <iframe
        src={embed}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
