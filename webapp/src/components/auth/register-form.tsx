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
import { registerUser } from "@/lib/auth-actions";
import {
  NAVIGATION_ROUTES,
  NAVIGATION_LABELS,
  AUTH_CONFIG,
} from "@/lib/constants";
import { toast } from "sonner";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const result = await registerUser(formData);

      if (result.success) {
        toast.success(result.message);
        window.location.href = "/";
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
        <CardTitle>{NAVIGATION_LABELS[NAVIGATION_ROUTES.REGISTER]}</CardTitle>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              name="password"
              type="password"
              placeholder="Mot de passe"
              minLength={AUTH_CONFIG.PASSWORD_MIN_LENGTH}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              minLength={AUTH_CONFIG.PASSWORD_MIN_LENGTH}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer le compte"}
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Link href={NAVIGATION_ROUTES.LOGIN}>Annuler</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
