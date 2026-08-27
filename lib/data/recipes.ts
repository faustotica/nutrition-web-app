/**
 * Catálogo estático de recetas del consultorio.
 *
 * En una versión futura puede reemplazarse por una query a la tabla `recipes`
 * de Supabase sin cambiar la interfaz que consumen las páginas, ya que
 * `filterRecipes` y `getRecipeBySlug` son la única API que el resto del proyecto
 * importa desde este módulo.
 */
import type { Recipe, RecipeCategory } from "@/types/database";

export const recipeFilters: { id: RecipeCategory | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "desayuno", label: "Desayuno" },
  { id: "almuerzo", label: "Almuerzo" },
  { id: "colaciones", label: "Colaciones" },
  { id: "vegetariano", label: "Vegetariano" },
  { id: "sin-tacc", label: "Sin TACC" },
];

export const recipes: Recipe[] = [
  {
    id: "r1",
    slug: "bowl-avena-frutos-rojos",
    title: "Bowl de avena y frutos rojos",
    excerpt: "Desayuno cremoso con avena, yogur natural y antioxidantes de temporada.",
    image_url:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=1400&q=80",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "desayuno",
    tags: ["desayuno", "vegetariano"],
    ingredients: [
      "40 g de avena tradicional",
      "150 g de yogur natural",
      "1/2 taza de frutos rojos",
      "1 cucharadita de semillas de chía",
    ],
    steps: [
      "Hidratá la avena con yogur durante 10 minutos.",
      "Sumá los frutos y las semillas.",
      "Serví frío o levemente tibio.",
    ],
    is_published: true,
  },
  {
    id: "r2",
    slug: "ensalada-quinoa-garbanzos",
    title: "Ensalada de quinoa y garbanzos",
    excerpt: "Almuerzo completo, rico en fibra y proteína vegetal.",
    image_url:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
    video_url: "https://vimeo.com/76979871",
    category: "almuerzo",
    tags: ["almuerzo", "vegetariano", "sin-tacc"],
    ingredients: [
      "1 taza de quinoa cocida",
      "1/2 taza de garbanzos",
      "Mix de hojas verdes",
      "Tomate cherry, pepino y limón",
    ],
    steps: [
      "Enfriá la quinoa y mezclá con los vegetales.",
      "Aliñá con aceite de oliva, limón, sal y pimienta.",
    ],
    is_published: true,
  },
  {
    id: "r3",
    slug: "wrap-pollo-vegetales",
    title: "Wrap de pollo y vegetales",
    excerpt: "Opción práctica para llevar, con proteína magra y crunch de vegetales.",
    image_url:
      "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1400&q=80",
    video_url: null,
    category: "almuerzo",
    tags: ["almuerzo"],
    ingredients: [
      "1 tortilla integral",
      "120 g de pechuga grillada",
      "Hojas, zanahoria y palta",
    ],
    steps: [
      "Armá el wrap con proteína y vegetales.",
      "Cerrá y cortá al medio para servir.",
    ],
    is_published: true,
  },
  {
    id: "r4",
    slug: "hummus-crudites",
    title: "Hummus con crudités",
    excerpt: "Colación salada, saciante y fácil de preparar el domingo.",
    image_url:
      "https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=1400&q=80",
    video_url: null,
    category: "colaciones",
    tags: ["colaciones", "vegetariano", "sin-tacc"],
    ingredients: [
      "Garbanzos, tahini, ajo y limón",
      "Zanahoria, pepino y apio",
    ],
    steps: [
      "Procesá el hummus hasta lograr textura cremosa.",
      "Serví con palitos de vegetales.",
    ],
    is_published: true,
  },
  {
    id: "r5",
    slug: "tortilla-claras-espinaca",
    title: "Tortilla de claras y espinaca",
    excerpt: "Cena liviana, alta en proteína y sin TACC.",
    image_url:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1400&q=80",
    video_url: "https://www.youtube.com/embed/aqz-KE-bpKQ",
    category: "cena",
    tags: ["cena", "sin-tacc"],
    ingredients: ["3 claras + 1 huevo", "Espinaca fresca", "Pimentón y orégano"],
    steps: [
      "Salteá la espinaca.",
      "Volcá las claras y cociná a fuego bajo.",
    ],
    is_published: true,
  },
  {
    id: "r6",
    slug: "parfait-yogur-granola",
    title: "Parfait de yogur y granola casera",
    excerpt: "Colación dulce con crunch, sin azúcares agregados.",
    image_url:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=80",
    video_url: null,
    category: "colaciones",
    tags: ["colaciones", "desayuno", "vegetariano"],
    ingredients: ["Yogur natural", "Granola de avena", "Fruta de estación"],
    steps: ["Alterná capas de yogur, granola y fruta."],
    is_published: true,
  },
];

/** Simple lookup por slug para la página de detalle de receta. */
export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

/**
 * Normaliza el texto de búsqueda y filtra las recetas publicadas por coincidencia
 * en título, excerpt o tags, y también por categoría. Las recetas con
 * `is_published = false` son excluidas siempre, independientemente del filtro.
 */
export function filterRecipes(
  query: string,
  category: string,
): Recipe[] {
  const normalized = query.trim().toLowerCase();
  return recipes.filter((recipe) => {
    const matchesQuery =
      !normalized ||
      recipe.title.toLowerCase().includes(normalized) ||
      recipe.excerpt.toLowerCase().includes(normalized) ||
      recipe.tags.some((tag) => tag.includes(normalized));
    const matchesCategory =
      !category ||
      category === "todas" ||
      recipe.category === category ||
      recipe.tags.includes(category);
    return matchesQuery && matchesCategory && recipe.is_published;
  });
}
