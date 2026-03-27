import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionById } from "@/features/sessions/repositories/session.repository";
import { SessionDetailView } from "@/features/sessions/View/SessionDetailView";
import type { ExerciseGroup } from "@/types";

interface SessionDetailScreenProps {
  id: string;
}

export async function SessionDetailScreen({ id }: SessionDetailScreenProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
