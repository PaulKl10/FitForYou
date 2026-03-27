"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        Quelque chose s&apos;est mal passé. Tu peux réessayer ou revenir plus tard.
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
