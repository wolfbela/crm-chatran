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
import { loginUser } from "@/lib/auth-actions";
import { NAVIGATION_ROUTES, NAVIGATION_LABELS } from "@/lib/constants";
import { toast } from "sonner";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const result = await loginUser(formData);

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
        <CardTitle>{NAVIGATION_LABELS[NAVIGATION_ROUTES.LOGIN]}</CardTitle>
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
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
          <div className="flex flex-col items-center space-y-2 text-sm">
            <Button asChild variant="outline" className="w-full">
              <Link href={NAVIGATION_ROUTES.REGISTER}>
                {NAVIGATION_LABELS[NAVIGATION_ROUTES.REGISTER]}
              </Link>
            </Button>
            <Link
              href={NAVIGATION_ROUTES.FORGOT_PASSWORD}
              className="text-xs underline hover:no-underline text-muted-foreground"
            >
              {NAVIGATION_LABELS[NAVIGATION_ROUTES.FORGOT_PASSWORD]}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
