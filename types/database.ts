/**
 * Definiciones de tipos del dominio de la aplicación.
 *
 * Este archivo es la fuente de verdad para todas las entidades del negocio.
 * Las interfaces que coinciden con tablas de Supabase se agrupan al final
 * en el tipo `Database`, que el cliente de Supabase usa para inferir
 * tipos automáticamente en las queries.
 */

// ----------------------------------------------------------------------------
// Roles y enumeraciones
// ----------------------------------------------------------------------------

/** Roles posibles de un usuario dentro del sistema. */
export type UserRole = "patient" | "nutritionist";

/**
 * Categorías de recetas disponibles en el catálogo.
 * Se usan tanto para filtrar en la página de recetas como para
 * clasificar en la base de datos.
 */
export type RecipeCategory =
  | "desayuno"
  | "almuerzo"
  | "colaciones"
  | "cena"
  | "vegetariano"
  | "sin-tacc";

/**
 * Momentos del día para el armado del menú semanal.
 * Cada paciente llena su grilla con estas cuatro franjas horarias.
 */
export type MealSlot = "desayuno" | "colacion_1" | "almuerzo" | "merienda" | "colacion_2" | "cena";

/**
 * Días de la semana en español, tal como se almacenan en la grilla del menú.
 * Se usa como clave del objeto `WeeklyMealGrid`.
 */
export type Weekday =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

/**
 * Grupos de alimentos del sistema de equivalencias.
 * Cada plan define qué grupos puede combinar el paciente por comida.
 */
export type FoodGroup =
  | "proteinas"
  | "carbohidratos"
  | "vegetales"
  | "frutas"
  | "lacteos"
  | "grasas"
  | "extras";

// ----------------------------------------------------------------------------
// Reglas y configuración del plan
// ----------------------------------------------------------------------------

/**
 * Reglas de combinación de alimentos por comida.
 * Cada plan tiene un `MealRule` que el portal respeta al momento de
 * armar el menú: limita los grupos disponibles y el total de selecciones.
 */
export interface MealRule {
  /** Grupos de alimentos habilitados para este plan. */
  allowedGroups: FoodGroup[];
  /** Cantidad máxima de alimentos que el paciente puede elegir por comida. */
  maxSelectionsPerMeal: number;
  /** Nota orientativa opcional que se muestra al paciente en el portal. */
  notes?: string;
}

// ----------------------------------------------------------------------------
// Entidades principales
// ----------------------------------------------------------------------------

/**
 * Plan de atención ofrecido por el nutricionista.
 * Contiene tanto la información de presentación pública (nombre, precio, servicios)
 * como las reglas de armado de menú que el portal aplica para ese plan.
 */
export interface Plan {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceLabel: string;
  /** Si es true, se resalta visualmente como plan recomendado en la página de planes. */
  featured: boolean;
  /** Lista de servicios incluidos, renderizada como viñetas en la UI. */
  services: string[];
  /** Reglas que gobiernan el armado del menú semanal del paciente. */
  meal_rules: MealRule;
}

/**
 * Receta del catálogo público.
 * Puede tener video embebido (YouTube o Vimeo) y se filtra por categoría y tags.
 * El campo `is_published` permite tener recetas en borrador sin exponerlas.
 */
export interface Recipe {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  /** URL original del video (no el embed). Se normaliza en `VideoEmbed.tsx`. */
  video_url: string | null;
  category: RecipeCategory;
  tags: string[];
  ingredients: string[];
  steps: string[];
  is_published: boolean;
}

/**
 * Perfil extendido del usuario autenticado.
 * Se crea en la tabla `profiles` de Supabase cuando el usuario se registra.
 * El campo `plan_id` lo asigna el nutricionista desde el backend o directamente en la DB.
 */
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  /** ID del plan asignado. Si es null, el portal usa el plan de ejemplo como fallback. */
  plan_id: string | null;
}

// ----------------------------------------------------------------------------
// Menú semanal
// ----------------------------------------------------------------------------

/**
 * Grilla de menú semanal del paciente.
 * Estructura: { dia: { franja: [id_alimento, ...] } }
 * Se serializa como JSONB en la tabla `patient_meal_plans` de Supabase.
 */
export interface WeeklyMealGrid {
  [day: string]: {
    [slot in MealSlot]?: string[];
  };
}

/**
 * Registro completo de un menú semanal guardado en la base de datos.
 * La combinación `patient_id + week_start` es única (constraint en Supabase).
 */
export interface PatientMealPlan {
  id: string;
  patient_id: string;
  /** Fecha del lunes de la semana, formato ISO (YYYY-MM-DD). */
  week_start: string;
  grid: WeeklyMealGrid;
}

// ----------------------------------------------------------------------------
// Formulario de contacto
// ----------------------------------------------------------------------------

/**
 * Payload del formulario de contacto.
 * Se inserta en la tabla `contact_messages` vía Server Action.
 */
export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// ----------------------------------------------------------------------------
// Tipo genérico de la base de datos (para el cliente de Supabase)
// ----------------------------------------------------------------------------

/**
 * Tipo de base de datos que consume el cliente de Supabase para tipado estático.
 * Cada tabla define tres variantes: Row (lectura), Insert (escritura) y Update (parcial).
 * Esto permite que el compilador detecte errores en las queries antes de ejecutarlas.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        /** Al insertar, el rol es opcional: Supabase lo asigna por defecto a "patient". */
        Insert: Omit<Profile, "role"> & { role?: UserRole };
        Update: Partial<Profile>;
      };
      plans: {
        Row: Plan;
        Insert: Plan;
        Update: Partial<Plan>;
      };
      recipes: {
        Row: Recipe;
        Insert: Recipe;
        Update: Partial<Recipe>;
      };
      patient_meal_plans: {
        Row: PatientMealPlan;
        /** Al insertar, el id es opcional: Supabase lo genera automáticamente. */
        Insert: Omit<PatientMealPlan, "id"> & { id?: string };
        Update: Partial<PatientMealPlan>;
      };
    };
  };
}



