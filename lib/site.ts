/**
 * Configuración global del sitio.
 *
 * Este módulo es la fuente de verdad para todos los datos estáticos del negocio:
 * información del profesional, ítems de navegación y constantes del portal.
 * Al centralizarlo acá, cualquier cambio (nombre, Instagram, credenciales) se
 * propaga automáticamente a header, footer, metadata y páginas.
 *
 * Se declara como `as const` para que TypeScript infiera tipos literales en lugar
 * de tipos genéricos (ej. `"Ramiro"` en lugar de `string`).
 */
export const site = {
  name: "Nutrición Ramiro Reynoso",
  shortName: "RR",
  tagline: "Nutrición clínica, composición corporal y acompañamiento real",
  description:
    "Consultorio del Lic. Ramiro Reynoso en Gualeguaychú, Entre Ríos. Licenciado en Nutrición (UNER), con posgrado en nutrición en gastroenterología y obesidad. Planes personalizados, medición de composición corporal y portal de pacientes.",
  professional: {
    name: "Lic. Ramiro Reynoso",
    firstName: "Ramiro",
    title: "Licenciado en Nutrición",
    /** Matrícula nacional y provincial, se muestran en la página Sobre Mí. */
    credentials: ["MN 5688", "MP 532"],
    university: "Universidad Nacional de Entre Ríos (UNER)",
    location: "Gualeguaychú, Entre Ríos, Argentina",
    specialties: [
      "Posgrado en Nutrición en Gastroenterología y Obesidad",
      "Nutrición y suplementos",
      "Medición de composición corporal",
    ],
    /** Los turnos se coordinan por Instagram; no hay sistema de turnos online en esta versión. */
    email: "Turnos y consultas por Instagram",
    phone: "",
    instagram: "https://www.instagram.com/nutricion.ramiroreynoso/",
    instagramHandle: "@nutricion.ramiroreynoso",
    youtube: "https://www.youtube.com/channel/UCEixxNQJ6Hkpe_g8Uy1XW",
  },
} as const;

/**
 * Ítems de la navegación principal del sitio.
 * Se renderizan en el Header (desktop y mobile) y en el Footer.
 * El orden aquí determina el orden visual en ambos lugares.
 */
export const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/sobre-mi", label: "Sobre Mí" },
  { href: "/planes", label: "Planes & Servicios" },
  { href: "/recetas", label: "Recetas & Videos" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
] as const;

/**
 * Días de la semana con su id tipado y etiqueta de presentación.
 * Se usan en el componente `WeeklyMenuGrid` para generar las columnas de la grilla.
 * El id debe coincidir con el tipo `Weekday` definido en `types/database.ts`.
 */
export const weekdays: { id: import("@/types/database").Weekday; label: string }[] =
  [
    { id: "lunes", label: "Lunes" },
    { id: "martes", label: "Martes" },
    { id: "miercoles", label: "Miércoles" },
    { id: "jueves", label: "Jueves" },
    { id: "viernes", label: "Viernes" },
    { id: "sabado", label: "Sábado" },
    { id: "domingo", label: "Domingo" },
  ];

/**
 * Franjas horarias del día para el armado del menú semanal.
 * Se usan en `WeeklyMenuGrid` para generar las filas de la grilla.
 * El id debe coincidir con el tipo `MealSlot` definido en `types/database.ts`.
 */
export const mealSlots: {
  id: import("@/types/database").MealSlot;
  label: string;
}[] = [
  { id: "desayuno", label: "Desayuno" },
    { id: "colacion_1", label: "Colación (M)" },
  { id: "almuerzo", label: "Almuerzo" },
  { id: "merienda", label: "Merienda" },
    { id: "colacion_2", label: "Colación (T)" },
  { id: "cena", label: "Cena" },
];


