import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import {
  getExerciseById,
  getExerciseProgress,
  getFavoriteIds,
} from "@/features/exercises/repositories/exercise.repository";
import { ExerciseDetailView } from "@/features/exercises/View/ExerciseDetailView";

interface ExerciseDetailScreenProps {
  id: string;
}

export async function ExerciseDetailScreen({ id }: ExerciseDetailScreenProps) {
  const user = await requireUser();

  const [exercise, favoriteIds, progress] = await Promise.all([
    getExerciseById(id),
    getFavoriteIds(user.id),
    getExerciseProgress(id, user.id),
  ]);

  if (!exercise) notFound();

  return (
    <ExerciseDetailView
      exercise={exercise}
      isFavorite={favoriteIds.includes(id)}
      progress={progress}
    />
  );
}
