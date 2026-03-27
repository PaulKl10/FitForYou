import { getExercisePage, getExerciseFilterOptions } from "@/features/exercises/repositories/exercise.repository";
import { ExercisesView } from "@/features/exercises/View/ExercisesView";

interface ExercisesScreenProps {
  filters: {
    q?: string;
    muscle?: string[];
    equipment?: string[];
    page?: number;
  };
}

export async function ExercisesScreen({ filters }: ExercisesScreenProps) {
  const [{ exercises, totalExercises, totalPages, currentPage }, { muscles, equipments }] =
    await Promise.all([getExercisePage(filters), getExerciseFilterOptions()]);

  return (
    <ExercisesView
      exercises={exercises}
      totalExercises={totalExercises}
      totalPages={totalPages}
      currentPage={currentPage}
      allMuscles={muscles}
      allEquipments={equipments}
      filters={{ ...filters, page: currentPage }}
    />
  );
}
