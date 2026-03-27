"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-xl font-semibold">Erreur d&apos;authentification</h2>
      <p className="text-muted-foreground text-sm max-w-sm">
        Une erreur est survenue. Retourne à la page de connexion.
      </p>
      <Button asChild>
        <Link href="/login">Retour à la connexion</Link>
      </Button>
    </div>
  );
}
