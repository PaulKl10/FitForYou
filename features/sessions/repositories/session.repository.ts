import { prisma } from "@/lib/prisma";

export async function getSessionsByUser(userId: string) {
  return prisma.session.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: {
      _count: { select: { sets: true } },
      sets: {
        select: { exercise: { select: { nameFr: true } } },
        distinct: ["exerciseId"],
        take: 3,
      },
    },
  });
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
