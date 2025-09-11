import { Suspense } from "react";
import { EmailConfirmationForm } from "@/components/auth/email-confirmation-form";

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Chargement...</div>}>
        <EmailConfirmationForm />
      </Suspense>
    </div>
  );
}
