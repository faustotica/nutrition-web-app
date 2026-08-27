/**
 * Catálogo estático de alimentos del sistema de equivalencias.
 * 
 * Basado en las indicaciones clínicas: División de vegetales (A, B, C),
 * tipos de carnes, lácteos descremados y porciones recomendadas.
 */
import type { FoodGroup } from "@/types/database";

export interface FoodItem {
  id: string;
  name: string;
  group: FoodGroup;
  portion: string;
}

export const foods: FoodItem[] = [
  // LÁCTEOS
  { id: "leche-descremada", name: "Leche descremada (líquida)", group: "lacteos", portion: "1 taza" },
  { id: "yogur-descremado", name: "Yogur descremado (ej: Tregar, Ser)", group: "lacteos", portion: "120-125 cc" },
  { id: "queso-untable", name: "Queso untable descremado", group: "lacteos", portion: "Moderado" },
  { id: "queso-blando", name: "Queso pasta blanda desc. (Por Salut)", group: "lacteos", portion: "1 porción chica" },
  
  // PROTEÍNAS (Carnes y Legumbres)
  { id: "carne-magra", name: "Carnes Rojas Magras (Nalga, Peceto, Lomo)", group: "proteinas", portion: "1 porción" },
  { id: "pollo", name: "Pollo/Pavo (sin piel, pref. pechuga)", group: "proteinas", portion: "1 porción" },
  { id: "pescado-magro", name: "Pescado Magro (Merluza, Lenguado, Brótola)", group: "proteinas", portion: "1 porción" },
  { id: "pescado-graso", name: "Pescado Graso (Atún, Salmón - máx 2/3 x sem)", group: "proteinas", portion: "1 porción" },
  { id: "huevo", name: "Huevo", group: "proteinas", portion: "1 a 2 unidades" },
  { id: "legumbres", name: "Legumbres (Arvejas, Lentejas, Garbanzos)", group: "proteinas", portion: "1 taza cocida" },

  // VEGETALES
  { id: "vegetales-a", name: "Vegetales A (Acelga, Espinaca, Lechuga, Tomate, etc)", group: "vegetales", portion: "Abundante / Libre" },
  { id: "vegetales-b", name: "Vegetales B (Cebolla, Calabaza, Zanahoria, Remolacha)", group: "vegetales", portion: "Moderado (Acompañar con crudos)" },

  // CARBOHIDRATOS (Vegetales C, Cereales, Panes)
  { id: "vegetales-c", name: "Vegetales C (Papa, Batata, Choclo, Mandioca)", group: "carbohidratos", portion: "1 unidad mediana" },
  { id: "cereales", name: "Cereales Integrales (Arroz, Fideos integrales)", group: "carbohidratos", portion: "1 porción" },
  { id: "pseudocereales", name: "Pseudocereales (Quinoa, Amaranto)", group: "carbohidratos", portion: "1 taza cocida" },
  { id: "pan-integral", name: "Pan Integral o de garbanzos (ej: Bimbo Balance)", group: "carbohidratos", portion: "2 rodajas" },
  { id: "galletitas", name: "Galletitas integrales / salvado (sin azúcar)", group: "carbohidratos", portion: "Moderado" },

  // FRUTAS
  { id: "fruta-mediana", name: "Fruta Mediana (Manzana, Pera, Durazno, Naranja)", group: "frutas", portion: "1 unidad" },
  { id: "fruta-grande", name: "Frutas Grandes (Sandía, Melón, Frutilla)", group: "frutas", portion: "1 taza tipo té (200g)" },
  { id: "banana", name: "Banana", group: "frutas", portion: "1 unidad chica (2 a 3 veces x sem)" },
  { id: "fruta-moderada", name: "Higo, Uva, Mango", group: "frutas", portion: "Moderado (1 a 2 veces x sem)" },

  // GRASAS
  { id: "aceite", name: "Aceite en frío (Oliva extra virgen, Girasol)", group: "grasas", portion: "Solo para condimentar" },
  { id: "frutos-secos", name: "Frutos Secos (Nueces, Almendras, Castañas)", group: "grasas", portion: "1 puñado chico" },
  { id: "semillas", name: "Semillas (Lino, Sésamo, Chia)", group: "grasas", portion: "1 a 2 cdas" },
  { id: "palta", name: "Palta", group: "grasas", portion: "1/4 a 1/2 unidad" },

  // EXTRAS Y COMPLEMENTOS
  { id: "bebidas", name: "Bebidas (Agua, Soda, Infusiones, Gaseosas Zero)", group: "extras", portion: "Libre" },
  { id: "condimentos", name: "Condimentos (Sal, Especias, Limón, Vinagre)", group: "extras", portion: "Libre" },
  { id: "edulcorante", name: "Edulcorante (Eritritol, Stevia, Sucralosa)", group: "extras", portion: "A gusto" },
  { id: "dulces-light", name: "Dulces Light (Mermeladas, Dulce de leche diet)", group: "extras", portion: "Moderado" },
  { id: "gelatina", name: "Gelatina Diet", group: "extras", portion: "Libre" },
  { id: "golosinas-light", name: "Turrón / Barra cereal / Postre Ser", group: "extras", portion: "1 unid (ocasional)" },
  { id: "frutas-desecadas", name: "Frutas desecadas (Pasas, Orejones, Dátiles)", group: "extras", portion: "Moderado" },
  { id: "fibras", name: "Fibras (Salvado de avena / trigo)", group: "extras", portion: "Complemento" }
];

export const foodGroupLabels: Record<FoodGroup, string> = {
  proteinas: "Proteínas / Legumbres",
  carbohidratos: "Carbohidratos (Cereales y Veg. C)",
  vegetales: "Vegetales A y B",
  frutas: "Frutas",
  lacteos: "Lácteos",
  grasas: "Grasas y Semillas",
  extras: "Extras y Complementos",
};
