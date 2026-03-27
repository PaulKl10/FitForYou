import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/features/exercises/components/FavoriteButton";
import type { ExerciseWithMuscles } from "@/features/exercises/types";

interface ExerciseDetailViewProps {
  exercise: ExerciseWithMuscles;
  isFavorite: boolean;
}

const BADGE_META: Record<string, string> = {
  level: "Niveau",
  force: "Force",
  mechanic: "Mécanique",
  equipment: "Équipement",
  category: "Catégorie",
};

export function ExerciseDetailView({
  exercise,
  isFavorite,
}: ExerciseDetailViewProps) {
  const primaryMuscles = exercise.muscles
    .filter((m) => m.isPrimary)
    .map((m) => m.muscle.name);
  const secondaryMuscles = exercise.muscles
    .filter((m) => !m.isPrimary)
    .map((m) => m.muscle.name);
  const instructions = exercise.instructionsFr
    ? exercise.instructionsFr.split("\n").filter(Boolean)
    : [];

  const meta = [
    { key: "level", value: exercise.level },
    { key: "force", value: exercise.force },
    { key: "mechanic", value: exercise.mechanic },
    { key: "equipment", value: exercise.equipment },
    { key: "category", value: exercise.category },
  ].filter((m) => m.value);

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/exercises"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Retour aux exercices
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {exercise.nameFr}
          </h1>
          <p className="text-muted-foreground mt-1">{exercise.nameEn}</p>
        </div>
        <FavoriteButton exerciseId={exercise.id} isFavorite={isFavorite} />
      </div>

      {/* GIF */}
      <div className="flex flex-col gap-4 md:flex-row">
        {exercise.gifUrl && (
          <div className="relative aspect-video max-w-[600px] flex-1 rounded-2xl bg-muted">
            <Image
              src={exercise.gifUrl}
              alt={exercise.nameFr}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        )}
        {/* Meta badges */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex justify-between flex-wrap">
            {meta.map(({ key, value }) => (
              <div key={key} className="flex flex-col items-start gap-0.5">
                <span className="text-xs text-muted-foreground">
                  {BADGE_META[key]}
                </span>
                <Badge
                  variant="outline"
                  className="capitalize border-border/60"
                >
                  {value}
                </Badge>
              </div>
            ))}
          </div>
          {/* Muscles */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Muscles</h2>
            <div className="flex flex-col md:flex-row gap-2">
              {primaryMuscles.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Primaires
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {primaryMuscles.map((m) => (
                      <Badge
                        key={m}
                        className="bg-primary/15 text-blue-500 border-0 capitalize"
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {secondaryMuscles.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Secondaires
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {secondaryMuscles.map((m) => (
                      <Badge
                        key={m}
                        variant="outline"
                        className="border-border/60 capitalize"
                      >
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {instructions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Instructions</h2>
          <ol className="space-y-3">
            {instructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-blue-500">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
