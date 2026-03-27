import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExercisesFilters } from "@/features/exercises/components/ExercisesFilters";
import { ExercisesViewProps } from "@/types";
import { Search } from "lucide-react";
import Image from "next/image";

export function ExercisesView({
  exercises,
  totalExercises,
  totalPages,
  currentPage,
  allMuscles,
  allEquipments,
  filters,
}: ExercisesViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
          Bibliothèque
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Exercices</h1>
        <p className="text-muted-foreground mt-1">
          {totalExercises} exercice{totalExercises > 1 ? "s" : ""} disponible
          {totalExercises > 1 ? "s" : ""}
        </p>
      </div>

      <ExercisesFilters
        allMuscles={allMuscles}
        allEquipments={allEquipments}
        totalPages={totalPages}
        currentPage={currentPage}
        filters={filters}
      />

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="size-10 text-muted-foreground mb-3" />
          <p className="font-semibold mb-1">Aucun exercice trouvé</p>
          <p className="text-sm text-muted-foreground">
            Essaie d&apos;autres filtres
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          {exercises.map((exercise: ExercisesViewProps["exercises"][0]) => (
            <div
              key={exercise.id}
              className="rounded-xl bg-linear-to-br from-transparent via-background to-gray-500 p-px transition-transform hover:-translate-y-0.5"
            >
              <Card className="group h-full ring-0">
                {exercise.gifUrl && (
                  <div className="relative aspect-square bg-muted">
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
                  <CardTitle className="text-base leading-tight">
                    {exercise.nameFr}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {exercise.nameEn}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className="text-xs bg-primary/15 text-primary border-0">
                      {exercise.bodyPart}
                    </Badge>
                    <Badge className="text-xs bg-accent/15 text-accent border-0">
                      {exercise.targetMuscle}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-border/60"
                    >
                      {exercise.equipment}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
