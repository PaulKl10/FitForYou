"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "@/features/auth/services/auth";
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

export function ResetPasswordView() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);

    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(formData);
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
              Nouveau mot de passe
            </CardTitle>
            <CardDescription>Choisis un nouveau mot de passe</CardDescription>
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
                <Label htmlFor="password" className="text-sm font-semibold">
                  Nouveau mot de passe
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-9 bg-card"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm" className="text-sm font-semibold">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="h-9 bg-card"
                />
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                type="submit"
                nativeButton
                className="w-full font-semibold py-5 cursor-pointer hover:bg-primary/80"
                disabled={isPending}
              >
                {isPending ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
