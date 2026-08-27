/**
 * Catálogo estático de planes del consultorio.
 *
 * Contiene tanto la información de presentación pública (nombre, precio, servicios)
 * como las reglas de armado de menú (meal_rules) que el portal aplica para validar
 * las selecciones del paciente según su plan asignado.
 */
import type { Plan } from "@/types/database";

export const plans: Plan[] = [
  {
    id: "plan-inicio",
    slug: "evaluacion-inicial",
    name: "Evaluación inicial",
    tagline: "Consulta + medición de composición corporal",
    description:
      "Primera consulta en Gualeguaychú para conocer tu historia clínica, objetivos y composición corporal. Salís con un plan de equivalencias para empezar.",
    priceLabel: "Consulta puntual",
    featured: false,
    services: [
      "Consulta inicial de 60 minutos",
      "Medición de composición corporal",
      "Plan de equivalencias por grupos de alimentos",
      "1 control a los 15 días (presencial o virtual)",
    ],
    meal_rules: {
      allowedGroups: ["proteinas", "carbohidratos", "vegetales", "frutas", "lacteos", "extras"],
      maxSelectionsPerMeal: 3,
      notes: "Elegí 1 proteína o lácteo, 1 carbohidrato y vegetales a libre demanda.",
    },
  },
  {
    id: "plan-integral",
    slug: "acompanamiento-clinico",
    name: "Acompañamiento clínico",
    tagline: "Obesidad, digestivo y hábitos sostenibles",
    description:
      "Seguimiento mensual con enfoque en nutrición en gastroenterología y obesidad. Incluye portal de pacientes para armar el menú según las reglas de tu plan.",
    priceLabel: "Mensual",
    featured: true,
    services: [
      "Consulta inicial + controles mensuales",
      "Ajustes según laboratorios, síntomas digestivos y evolución",
      "Acceso al portal de pacientes y armado de menú",
      "Recetas y videos filtrados a tu plan",
      "Canal de dudas en horario hábil",
    ],
    meal_rules: {
      allowedGroups: [
        "proteinas",
        "carbohidratos",
        "vegetales",
        "frutas",
        "lacteos", "extras",
        "grasas", "extras",
      ],
      maxSelectionsPerMeal: 4,
      notes: "Hasta 4 grupos por comida. Grasas en porción controlada (1 cucharada o 1 puñado).",
    },
  },
  {
    id: "plan-suplementos",
    slug: "nutricion-y-suplementos",
    name: "Nutrición y suplementos",
    tagline: "Qué usar, cuándo y para qué",
    description:
      "Para quienes entrenan o ya tienen un plan y necesitan criterio sobre suplementación alimentaria, porciones y timing — sin recetas mágicas.",
    priceLabel: "Mensual",
    featured: false,
    services: [
      "Revisión de suplementos actuales",
      "Indicaciones de uso según tu objetivo y tu plan",
      "Menú semanal editable en el portal",
      "Educación sobre evidencia (creatina, proteína, etc.)",
    ],
    meal_rules: {
      allowedGroups: [
        "proteinas",
        "carbohidratos",
        "vegetales",
        "frutas",
        "lacteos", "extras",
        "grasas", "extras",
      ],
      maxSelectionsPerMeal: 5,
      notes: "En almuerzo y cena priorizá proteína + carbohidrato complejo + vegetales.",
    },
  },
];

/**
 * Busca un plan por id en el catálogo.
 * Si no se pasa un id o el id no existe, se devuelve plans[1] (Acompañamiento clínico)
 * como plan de referencia para el modo demo.
 */
export function getPlanById(id: string | null | undefined): Plan | undefined {
  if (!id) return plans[1];
  return plans.find((plan) => plan.id === id) ?? plans[1];
}
