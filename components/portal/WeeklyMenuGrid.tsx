"use client";

import { useMemo, useState, useTransition } from "react";
import { foods, foodGroupLabels } from "@/lib/data/foods";
import { mealSlots, weekdays } from "@/lib/site";
import { saveWeeklyMenu } from "@/lib/actions/meals";
import type { MealRule, MealSlot, Weekday, WeeklyMealGrid } from "@/types/database";

/**
 * Grilla de armado del menu semanal. Client Component.
 *
 * Estado local:
 *   - grid: la grilla completa (7 dias x 4 franjas x [ids de alimentos]).
 *   - active: la celda actualmente seleccionada para editar.
 *   - message: feedback de guardado.
 *
 * La lista de alimentos permitidos se filtra por los grupos del plan (allowedFoods)
 * y se memoiza para no recalcular en cada render. toggleFood aplica el limite de
 * maxSelectionsPerMeal truncando el array si se supera.
 *
 * El guardado usa useTransition para no bloquear la UI mientras la Server Action
 * se ejecuta en el servidor.
 */
// Genera una grilla vacia con todos los dias y franjas inicializados como arrays vacios.
function emptyGrid(): WeeklyMealGrid {
  return Object.fromEntries(
    weekdays.map((day) => [
      day.id,
      Object.fromEntries(mealSlots.map((slot) => [slot.id, [] as string[]])),
    ]),
  );
}

export function WeeklyMenuGrid({
  initialGrid,
  weekStart,
  rules,
}: {
  initialGrid: WeeklyMealGrid | null;
  weekStart: string;
  rules: MealRule;
}) {
  const [grid, setGrid] = useState<WeeklyMealGrid>(initialGrid ?? emptyGrid());
  const [active, setActive] = useState<{ day: Weekday; slot: MealSlot }>({
    day: "lunes",
    slot: "desayuno",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Filtrar los alimentos permitidos segun los grupos del plan. Se memoiza porque rules.allowedGroups no cambia entre renders.
  const allowedFoods = useMemo(
    () => foods.filter((food) => rules.allowedGroups.includes(food.group)),
    [rules.allowedGroups],
  );

  // Alimentos seleccionados en la celda activa. Se usa para pintar los botones de alimentos como activos/inactivos.
  const current = grid[active.day]?.[active.slot] ?? [];

  // Agrega o quita un alimento de la celda activa. Si al agregar se supera el maximo, trunca el array al limite del plan.
  function toggleFood(foodId: string) {
    setGrid((prev) => {
      const slotItems = [...(prev[active.day]?.[active.slot] ?? [])];
      const exists = slotItems.includes(foodId);
      let next = exists ? slotItems.filter((id) => id !== foodId) : [...slotItems, foodId];
      if (!exists && next.length > rules.maxSelectionsPerMeal) {
        next = next.slice(0, rules.maxSelectionsPerMeal);
      }
      return {
        ...prev,
        [active.day]: {
          ...prev[active.day],
          [active.slot]: next,
        },
      };
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-sage-soft">
        <p className="text-xs uppercase tracking-[0.16em] text-sage-dark">Reglas de tu plan</p>
        <p className="mt-2 text-sm text-ink">
          Máximo {rules.maxSelectionsPerMeal} alimentos por comida. Grupos permitidos:{" "}
          {rules.allowedGroups.map((group) => foodGroupLabels[group]).join(", ")}.
        </p>
        {rules.notes ? <p className="mt-2 text-sm text-muted">{rules.notes}</p> : null}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white/90 ring-1 ring-sage-soft">
        <table className="min-w-[860px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-sage-soft/60">
              <th className="p-3 text-left font-medium"> </th>
              {weekdays.map((day) => (
                <th key={day.id} className="p-3 text-left font-medium">
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealSlots.map((slot) => (
              <tr key={slot.id} className="border-t border-sage-soft">
                <th className="bg-cream/70 p-3 text-left text-xs uppercase tracking-[0.12em]">
                  {slot.label}
                </th>
                {weekdays.map((day) => {
                  const selected = grid[day.id]?.[slot.id] ?? [];
                  const isActive = active.day === day.id && active.slot === slot.id;
                  return (
                    <td key={`${day.id}-${slot.id}`} className="p-2 align-top">
                      <button
                        type="button"
                        onClick={() => setActive({ day: day.id, slot: slot.id })}
                        className={`min-h-24 w-full rounded-xl p-2 text-left transition ${
                          isActive ? "bg-sage-soft ring-2 ring-sage" : "bg-cream hover:bg-sage-soft/50"
                        }`}
                      >
                        {selected.length === 0 ? (
                          <span className="text-xs text-muted">Elegir</span>
                        ) : (
                          <ul className="space-y-1">
                            {selected.map((id) => {
                              const food = foods.find((item) => item.id === id);
                              return (
                                <li key={id} className="text-xs text-ink">
                                  {food?.name}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl bg-white/90 p-5 ring-1 ring-sage-soft">
        <p className="text-sm text-ink">
          Editando:{" "}
          <strong>
            {weekdays.find((day) => day.id === active.day)?.label} ·{" "}
            {mealSlots.find((slot) => slot.id === active.slot)?.label}
          </strong>
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {allowedFoods.map((food) => {
            const selected = current.includes(food.id);
            return (
              <button
                key={food.id}
                type="button"
                onClick={() => toggleFood(food.id)}
                className={`rounded-xl px-3 py-3 text-left text-sm ring-1 transition ${
                  selected
                    ? "bg-sage text-white ring-sage"
                    : "bg-cream ring-sage-soft hover:bg-sage-soft"
                }`}
              >
                <span className="block font-medium">{food.name}</span>
                <span className={`text-xs ${selected ? "text-white/80" : "text-muted"}`}>
                  {foodGroupLabels[food.group]} · {food.portion}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* El boton de guardar usa startTransition para que la UI no se congele mientras la Server Action persiste la grilla en Supabase. */}
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await saveWeeklyMenu(weekStart, grid);
              setMessage(result.error ?? "Menú guardado en tu cuenta.");
            });
          }}
          className="rounded-full bg-sage px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-sage-dark disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar menú de la semana"}
        </button>
        {message ? <p className="text-sm text-muted">{message}</p> : null}
      </div>
    </div>
  );
}
