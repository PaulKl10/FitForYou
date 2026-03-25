"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { login } from "@/features/auth/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export function LoginView() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center size-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Dumbbell className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">FitForYou</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tracker tes séances de sport
            </p>
          </div>
        </div>

        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Connexion</CardTitle>
            <CardDescription>
              Accède à tes séances d&apos;entraînement
            </CardDescription>
          </CardHeader>
          <form action={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2.5 rounded-lg border border-destructive/20">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@exemple.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button type="submit" className="w-full font-semibold" disabled={isPending}>
                {isPending ? "Connexion..." : "Se connecter"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Pas encore de compte ?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-semibold underline-offset-4 hover:underline"
                >
                  Créer un compte
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
