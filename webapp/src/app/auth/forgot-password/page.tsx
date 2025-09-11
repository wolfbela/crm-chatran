import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Chargement...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
