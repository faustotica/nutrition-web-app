import type { Metadata } from "next";
import { AuthForm } from "@/components/portal/AuthForm";

export const metadata: Metadata = { title: "Registro de pacientes" };

export default function RegistroPage() {
  return (
    <div className="px-4 py-16">
      <AuthForm mode="registro" />
    </div>
  );
}
