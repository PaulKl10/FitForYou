import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { getSessionById } from "@/features/sessions/repositories/session.repository";
import { SessionDetailView } from "@/features/sessions/View/SessionDetailView";
import type { ExerciseGroup } from "@/features/sessions/types";

interface SessionDetailScreenProps {
  id: string;
}

export async function SessionDetailScreen({ id }: SessionDetailScreenProps) {
  const user = await requireUser();

  const session = await getSessionById(id, user.id);
  if (!session) notFound();

  const setsByExercise = session.sets.reduce<Record<string, ExerciseGroup>>(
    (acc, set) => {
      const key = set.exerciseId;
      if (!acc[key]) {
        acc[key] = { exercise: set.exercise, sets: [] };
      }
      acc[key].sets.push(set);
      return acc;
    },
    {}
  );

  return <SessionDetailView session={session} setsByExercise={setsByExercise} />;
}
