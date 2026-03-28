import { prisma } from "@/lib/prisma";
import type { RecentExercise } from "@/features/dashboard/types";

export async function getDashboardData(userId: string) {
  const [profile, recentSessions, totalSets] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.session.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
      include: { _count: { select: { sets: true } } },
    }),
    prisma.set.count({ where: { session: { userId } } }),
  ]);

  // Most recent session per exercise (up to 6 distinct exercises)
  const latestPerExercise = await prisma.set.findMany({
    where: { session: { userId } },
    orderBy: { session: { date: "desc" } },
    distinct: ["exerciseId"],
    take: 6,
    select: {
      exerciseId: true,
      sessionId: true,
      exercise: { select: { id: true, nameFr: true, targetMuscle: true } },
      session: { select: { id: true, date: true, name: true } },
    },
  });

  // Fetch all sets for each (exerciseId, sessionId) pair in one query
  const allSets =
    latestPerExercise.length > 0
      ? await prisma.set.findMany({
          where: {
            OR: latestPerExercise.map((r) => ({
              exerciseId: r.exerciseId,
              sessionId: r.sessionId,
            })),
          },
          orderBy: { setNumber: "asc" },
          select: {
            exerciseId: true,
            sessionId: true,
            setNumber: true,
            reps: true,
            weightKg: true,
          },
        })
      : [];

  const recentExercises: RecentExercise[] = latestPerExercise.map((item) => ({
    exercise: item.exercise,
    session: item.session,
    sets: allSets.filter(
      (s) => s.exerciseId === item.exerciseId && s.sessionId === item.sessionId,
    ),
  }));

  return { profile, recentSessions, recentExercises, totalSets };
}
