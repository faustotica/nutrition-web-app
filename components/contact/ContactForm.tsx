"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/lib/actions/contact";

/**
 * Formulario de contacto. Client Component.
 *
 * Usa useActionState de React 19 para conectar el formulario con la Server Action
 * submitContact. El estado (ok, error) lo maneja el servidor; el componente solo
 * muestra lo que recibe. El campo pending deshabilita el boton mientras la accion
 * esta en curso para prevenir envios duplicados.
 */
// Estado inicial: sin ok ni error. Se pasa como segundo argumento a useActionState.
const initial: ContactState = { ok: false, error: null };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  return (
    <form action={action} className="space-y-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-soft md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Nombre
          <input
            name="name"
            required
            className="mt-1 w-full rounded-xl border border-sage-soft px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30"
          />
        </label>
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-sage-soft px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30"
          />
        </label>
      </div>
      <label className="block text-sm">
        Teléfono (opcional)
        <input
          name="phone"
          className="mt-1 w-full rounded-xl border border-sage-soft px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30"
        />
      </label>
      <label className="block text-sm">
        Mensaje
        <textarea
          name="message"
          required
          rows={5}
          className="mt-1 w-full rounded-xl border border-sage-soft px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30"
        />
      </label>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.ok ? (
        <p className="text-sm text-sage-dark">Recibimos tu consulta. Te respondemos a la brevedad.</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-sage px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-sage-dark disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
