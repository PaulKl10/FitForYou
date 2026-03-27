"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleFavorite } from "@/features/exercises/services/favorites";
import type { Exercise } from "@/types";

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite: boolean;
}

export function ExerciseCard({ exercise, isFavorite: initialFavorite }: ExerciseCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
    startTransition(async () => {
      await toggleFavorite(exercise.id);
    });
  }

  return (
    <div className="rounded-xl bg-linear-to-br from-transparent via-background to-gray-500 p-px transition-transform hover:-translate-y-0.5">
      <Card className="group h-full ring-0 relative pt-0">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute top-2 right-2 z-10 rounded-full p-1.5 bg-background/70 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
            )}
          />
        </button>

        {exercise.gifUrl && (
          <div className="relative aspect-square bg-muted overflow-hidden">
            <Image
              src={exercise.gifUrl}
              alt={exercise.nameFr}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <CardHeader className="pb-2">
          <CardTitle className="text-base leading-tight">{exercise.nameFr}</CardTitle>
          <p className="text-xs text-muted-foreground">{exercise.nameEn}</p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            <Badge className="text-xs bg-primary/15 text-primary border-0">
              {exercise.bodyPart}
            </Badge>
            <Badge className="text-xs bg-accent/15 text-accent border-0">
              {exercise.targetMuscle}
            </Badge>
            <Badge variant="outline" className="text-xs border-border/60">
              {exercise.equipment}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
