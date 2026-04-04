"use server";

import { requireUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export interface ExerciseHistorySet {
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
}

export interface ExerciseHistory {
  sessionDate: Date;
  sessionName: string | null;
  sets: ExerciseHistorySet[];
}

export async function getExerciseLastHistory(
  exerciseId: string,
  excludeSessionId?: string,
): Promise<ExerciseHistory | null> {
  const user = await requireUser();

  const session = await prisma.session.findFirst({
    where: {
      userId: user.id,
      sets: { some: { exerciseId } },
      ...(excludeSessionId ? { id: { not: excludeSessionId } } : {}),
    },
    orderBy: { date: "desc" },
    include: {
      sets: {
        where: { exerciseId },
        orderBy: { setNumber: "asc" },
        select: { setNumber: true, reps: true, weightKg: true },
      },
    },
  });

  if (!session) return null;

  return {
    sessionDate: session.date,
    sessionName: session.name,
    sets: session.sets,
  };
}
