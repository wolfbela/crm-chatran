"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { resetPassword } from "@/lib/auth-actions";
import {
  NAVIGATION_ROUTES,
  NAVIGATION_LABELS,
  AUTH_CONFIG,
} from "@/lib/constants";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (formData: FormData) => {
    if (!token) {
      toast.error("Token de réinitialisation manquant");
      return;
    }

    formData.append("token", token);
    setIsLoading(true);

    try {
      const result = await resetPassword(formData);

      if (result.success) {
        toast.success(result.message);
        window.location.href = NAVIGATION_ROUTES.LOGIN;
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Lien de réinitialisation invalide ou expiré.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={NAVIGATION_ROUTES.FORGOT_PASSWORD}>
              Demander un nouveau lien
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {NAVIGATION_LABELS[NAVIGATION_ROUTES.RESET_PASSWORD]}
        </CardTitle>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Input
              name="password"
              type="password"
              placeholder="Nouveau mot de passe"
              minLength={AUTH_CONFIG.PASSWORD_MIN_LENGTH}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              minLength={AUTH_CONFIG.PASSWORD_MIN_LENGTH}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer le mot de passe"}
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
