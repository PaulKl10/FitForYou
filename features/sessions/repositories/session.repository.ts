import { prisma } from "@/lib/prisma";

const SESSIONS_PER_PAGE = 20;

export async function getSessionsByUser(userId: string, page = 1) {
  const skip = (page - 1) * SESSIONS_PER_PAGE;

  const [total, rawSessions] = await Promise.all([
    prisma.session.count({ where: { userId } }),
    prisma.session.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      skip,
      take: SESSIONS_PER_PAGE,
      include: {
        _count: { select: { sets: true } },
        sets: {
          select: { exercise: { select: { nameFr: true } } },
          distinct: ["exerciseId"],
          take: 3,
        },
      },
    }),
  ]);

  const sessionIds = rawSessions.map((s) => s.id);
  const exerciseCountBySession = new Map<string, number>();
  if (sessionIds.length > 0) {
    const setRows = await prisma.set.findMany({
      where: { sessionId: { in: sessionIds } },
      select: { sessionId: true, exerciseId: true },
    });
    const distinctBySession = new Map<string, Set<string>>();
    for (const row of setRows) {
      let ex = distinctBySession.get(row.sessionId);
      if (!ex) {
        ex = new Set();
        distinctBySession.set(row.sessionId, ex);
      }
      ex.add(row.exerciseId);
    }
    for (const [id, ex] of distinctBySession) {
      exerciseCountBySession.set(id, ex.size);
    }
  }

  const filledIds = await prisma.set
    .findMany({
      where: {
        sessionId: { in: rawSessions.map((s) => s.id) },
        OR: [{ reps: { not: null } }, { weightKg: { not: null } }],
      },
      select: { sessionId: true },
      distinct: ["sessionId"],
    })
    .then((rows) => new Set(rows.map((r) => r.sessionId)));

  const sessions = rawSessions.map((s) => ({
    ...s,
    hasFilledSets: filledIds.has(s.id),
    exerciseCount: exerciseCountBySession.get(s.id) ?? 0,
  }));

  return { sessions, total, totalPages: Math.ceil(total / SESSIONS_PER_PAGE) };
}

export async function getSessionById(id: string, userId: string) {
  return prisma.session.findUnique({
    where: { id, userId },
    include: {
      sets: {
        orderBy: [{ exerciseId: "asc" }, { setNumber: "asc" }],
        include: { exercise: true },
      },
    },
  });
}
