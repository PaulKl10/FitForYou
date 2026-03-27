import { createClient } from "@/lib/supabase/server";
import {
  getExercisePage,
  getExerciseFilterOptions,
  getFavoriteIds,
} from "@/features/exercises/repositories/exercise.repository";
import { ExercisesView } from "@/features/exercises/View/ExercisesView";

interface ExercisesScreenProps {
  filters: {
    q?: string;
    muscle?: string[];
    equipment?: string[];
    page?: number;
    favoritesOnly?: boolean;
  };
}

export async function ExercisesScreen({ filters }: ExercisesScreenProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const favoriteIds = user ? await getFavoriteIds(user.id) : [];

  const [{ exercises, totalExercises, totalPages, currentPage }, { muscles, equipments }] =
    await Promise.all([
      getExercisePage(filters, favoriteIds),
      getExerciseFilterOptions(),
    ]);

  return (
    <ExercisesView
      exercises={exercises}
      totalExercises={totalExercises}
      totalPages={totalPages}
      currentPage={currentPage}
      allMuscles={muscles}
      allEquipments={equipments}
      filters={{ ...filters, page: currentPage }}
      favoriteIds={favoriteIds}
    />
  );
}
