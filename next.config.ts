// Configuración de Next.js. Cualquier feature flag o extension del bundler va aqui.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // remotePatterns habilita la optimización de imágenes externas de Unsplash. Sin esta entrada, next/image rechaza URLs de dominios no listados por seguridad.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
