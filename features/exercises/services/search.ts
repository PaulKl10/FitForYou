"use server";

import { prisma } from "@/lib/prisma";

export async function searchExercises(query: string) {
  if (!query.trim()) return [];

  return prisma.exercise.findMany({
    where: {
      OR: [
        { nameFr: { contains: query, mode: "insensitive" } },
        { nameEn: { contains: query, mode: "insensitive" } },
      ],
    },
    select: { id: true, nameFr: true, targetMuscle: true, equipment: true },
    orderBy: { nameFr: "asc" },
    take: 8,
  });
}
