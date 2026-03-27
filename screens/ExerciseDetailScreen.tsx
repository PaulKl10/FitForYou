import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getExerciseById, getFavoriteIds } from "@/features/exercises/repositories/exercise.repository";
import { ExerciseDetailView } from "@/features/exercises/View/ExerciseDetailView";

interface ExerciseDetailScreenProps {
  id: string;
}

export async function ExerciseDetailScreen({ id }: ExerciseDetailScreenProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [exercise, favoriteIds] = await Promise.all([
    getExerciseById(id),
    getFavoriteIds(user.id),
  ]);

  if (!exercise) notFound();

  return (
    <ExerciseDetailView
      exercise={exercise}
      isFavorite={favoriteIds.includes(id)}
    />
  );
}
