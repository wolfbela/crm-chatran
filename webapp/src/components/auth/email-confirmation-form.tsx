"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { confirmEmail } from "@/lib/auth-actions";
import { NAVIGATION_ROUTES, NAVIGATION_LABELS } from "@/lib/constants";
import { toast } from "sonner";

export function EmailConfirmationForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [, setIsConfirmed] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const handleConfirmation = async () => {
      if (!token) {
        setError("Token de confirmation manquant");
        setIsLoading(false);
        return;
      }

      try {
        const result = await confirmEmail(token);

        if (result.success) {
          setIsConfirmed(true);
          toast.success(result.message);
        } else {
          setError(result.message);
        }
      } catch {
        setError("Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    handleConfirmation();
  }, [token]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center">Confirmation de votre email en cours...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Erreur de confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">{error}</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={NAVIGATION_ROUTES.LOGIN}>Retour à la connexion</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {NAVIGATION_LABELS[NAVIGATION_ROUTES.CONFIRM_EMAIL]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-green-600">
          Votre email a été confirmé avec succès ! Vous pouvez maintenant vous
          connecter.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={NAVIGATION_ROUTES.LOGIN}>Se connecter</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
