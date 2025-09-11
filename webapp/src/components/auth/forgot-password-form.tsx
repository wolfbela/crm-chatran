"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { forgotPassword } from "@/lib/auth-actions";
import { NAVIGATION_ROUTES, NAVIGATION_LABELS } from "@/lib/constants";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const result = await forgotPassword(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {NAVIGATION_LABELS[NAVIGATION_ROUTES.FORGOT_PASSWORD]}
        </CardTitle>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Entrez votre email pour recevoir un lien de réinitialisation de mot
            de passe.
          </p>
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Envoi..." : "Envoyer le lien"}
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Link href={NAVIGATION_ROUTES.LOGIN}>Retour à la connexion</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
