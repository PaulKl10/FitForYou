"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/features/exercises/services/favorites";

interface FavoriteButtonProps {
  exerciseId: string;
  isFavorite: boolean;
  size?: "sm" | "default";
}

export function FavoriteButton({ exerciseId, isFavorite: initial, size = "default" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initial);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    setIsFavorite((prev) => !prev);
    startTransition(async () => {
      await toggleFavorite(exerciseId);
    });
  }

  return (
    <Button
      variant={size === "sm" ? "ghost" : "outline"}
      size={size === "sm" ? "icon" : "icon-lg"}
      disabled={isPending}
      onClick={handleToggle}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={size === "sm" ? "size-7 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background" : ""}
    >
      <Heart className={cn(
        "transition-colors",
        size === "sm" ? "size-3.5" : "size-5",
        isFavorite && "fill-red-500 text-red-500",
      )} />
    </Button>
  );
}
