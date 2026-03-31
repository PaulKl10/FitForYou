"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { resetPassword } from "@/features/auth/services/auth";
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
import { Dumbbell, CheckCircle } from "lucide-react";

export function ForgotPasswordView() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
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
              Mot de passe oublié
            </CardTitle>
            <CardDescription>
              Saisis ton email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>

          {success ? (
            <CardContent className="pt-2 pb-6">
              <div className="flex flex-col items-center gap-3 text-center py-4">
                <CheckCircle className="size-10 text-primary" />
                <div>
                  <p className="font-semibold">Email envoyé !</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vérifie ta boîte mail et clique sur le lien pour
                    réinitialiser ton mot de passe.
                  </p>
                </div>
              </div>
            </CardContent>
          ) : (
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
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4">
                <Button
                  type="submit"
                  nativeButton
                  className="w-full font-semibold py-5 cursor-pointer hover:bg-primary/80"
                  isLoading={isPending}
                >
                  {isPending ? "Envoi..." : "Envoyer le lien"}
                </Button>
              </CardFooter>
            </form>
          )}

          <CardFooter className="pt-0 pb-4 justify-center">
            <p className="text-sm text-muted-foreground text-center">
              <Button
                variant="link"
                render={<Link href="/login" />}
                nativeButton={false}
                className="px-0 h-auto font-semibold text-primary"
              >
                Retour à la connexion
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
