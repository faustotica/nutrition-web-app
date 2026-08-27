"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, signUp, type AuthState } from "@/lib/actions/auth";

/**
 * Formulario de autenticacion del portal. Client Component.
 *
 * El prop mode determina si el formulario actua como login o registro,
 * seleccionando la Server Action correspondiente (signIn o signUp).
 * El campo fullName solo se renderiza en modo registro.
 */
const initial: AuthState = { error: null };

export function AuthForm({ mode }: { mode: "login" | "registro" }) {
  // Seleccionar la Server Action correcta segun el modo antes de pasarla a useActionState.
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-sage-soft">
      <p className="text-[11px] uppercase tracking-[0.2em] text-sage-dark">Portal de pacientes</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">
        {mode === "login" ? "Ingresar" : "Crear cuenta"}
      </h1>
      <p className="mt-3 text-sm text-muted">
        Autenticación con Supabase Auth (capa gratuita). Tu plan y menú quedan aislados por RLS.
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        {mode === "registro" ? (
          <label className="block text-sm">
            Nombre
            <input
              name="fullName"
              required
              className="mt-1 w-full rounded-xl border border-sage-soft px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30"
            />
          </label>
        ) : null}
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-sage-soft px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30"
          />
        </label>
        <label className="block text-sm">
          Contraseña
          <input
            name="password"
            type="password"
            minLength={6}
            required
            className="mt-1 w-full rounded-xl border border-sage-soft px-3 py-2 outline-none focus:ring-2 focus:ring-sage/30"
          />
        </label>
        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-sage py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-sage-dark disabled:opacity-60"
        >
          {pending ? "Procesando…" : mode === "login" ? "Entrar" : "Registrarme"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            ¿Aún no tenés acceso?{" "}
            <Link href="/portal/registro" className="text-sage-dark underline">
              Crear cuenta
            </Link>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta?{" "}
            <Link href="/portal/login" className="text-sage-dark underline">
              Ingresar
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
