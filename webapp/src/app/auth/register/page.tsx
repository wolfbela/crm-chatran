import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Chargement...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
