import { Search } from "lucide-react";
import { ExercisesFilters } from "@/features/exercises/components/ExercisesFilters";
import { ExerciseCard } from "@/features/exercises/components/ExerciseCard";
import type { ExercisesViewProps } from "@/features/exercises/types";

export function ExercisesView({
  exercises,
  totalExercises,
  totalPages,
  currentPage,
  allMuscles,
  allEquipments,
  filters,
  favoriteIds,
}: ExercisesViewProps) {
  const favoriteSet = new Set(favoriteIds);

  return (
    <div className="space-y-4">
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
            {filters.favoritesOnly
              ? "Tu n'as pas encore de favoris"
              : "Essaie d'autres filtres"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isFavorite={favoriteSet.has(exercise.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
