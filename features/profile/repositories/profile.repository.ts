import { prisma } from "@/lib/prisma";

export async function getProfile(userId: string) {
  return prisma.profile.findUnique({ where: { userId } });
}

export async function getWeightHistory(profileId: string) {
  return prisma.weightEntry.findMany({
    where: { profileId },
    orderBy: { recordedAt: "asc" },
  });
}
