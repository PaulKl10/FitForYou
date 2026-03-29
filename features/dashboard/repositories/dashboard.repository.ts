import { prisma } from "@/lib/prisma";
import type { RecentExercise } from "@/features/dashboard/types";

export async function getDashboardData(userId: string) {
  const [profile, rawSessions, totalSets, calendarSessions] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.session.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.set.count({ where: { session: { userId } } }),
    prisma.session.findMany({
      where: { userId },
      select: { id: true, date: true, name: true },
      orderBy: { date: "desc" },
    }),
  ]);

  const sessionIds = rawSessions.map((s) => s.id);
  const distinctExercises = await prisma.set.findMany({
    where: { sessionId: { in: sessionIds } },
    select: { sessionId: true, exerciseId: true },
    distinct: ["sessionId", "exerciseId"],
  });

  const exerciseCountBySession = new Map<string, number>();
  for (const { sessionId } of distinctExercises) {
    exerciseCountBySession.set(sessionId, (exerciseCountBySession.get(sessionId) ?? 0) + 1);
  }

  const recentSessions = rawSessions.map((s) => ({
    ...s,
    exerciseCount: exerciseCountBySession.get(s.id) ?? 0,
  }));

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

  return { profile, recentSessions, recentExercises, totalSets, calendarSessions };
}
