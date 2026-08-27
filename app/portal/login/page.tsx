import type { Metadata } from "next";
import { AuthForm } from "@/components/portal/AuthForm";

export const metadata: Metadata = { title: "Acceso pacientes" };

export default function LoginPage() {
  return (
    <div className="px-4 py-16">
      <AuthForm mode="login" />
    </div>
  );
}
