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
            <h1 className="text-2xl font-extrabold tracking-tight">
              FitForYou
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tracker tes séances de sport
            </p>
          </div>
        </div>

        <Card className="border-border/60 pt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold font-sans">
              Connexion
            </CardTitle>
            <CardDescription>
              Accède à tes séances
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit(new FormData(event.currentTarget));
            }}
          >
            <CardContent className="space-y-2 pb-4">
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2.5 rounded-lg border border-destructive/20">
                  {error}
                </p>
              )}
              <div className="space-y-1">
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
                  className="h-9 bg-card font-semibold font-sans"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="h-9 bg-card"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-4">
              <Button
                type="submit"
                nativeButton
                className="w-full font-semibold py-5 cursor-pointer hover:bg-primary/80"
                disabled={isPending}
              >
                {isPending ? "Connexion..." : "Se connecter"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Pas encore de compte ?{" "}
                <Button
                  variant="link"
                  render={<Link href="/signup" />}
                  nativeButton={false}
                  className="px-0 h-auto font-semibold text-primary"
                >
                  Créer un compte
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
