import { prisma } from "@/lib/prisma";

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

  return { profile, recentSessions, totalSets };
}
