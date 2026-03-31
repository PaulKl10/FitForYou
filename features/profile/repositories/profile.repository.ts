import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getProfile = (userId: string) =>
  unstable_cache(
    () => prisma.profile.findUnique({ where: { userId } }),
    ["profile", userId],
    { tags: [`profile-${userId}`] },
  )();

export const getWeightHistory = (profileId: string) =>
  unstable_cache(
    () => prisma.weightEntry.findMany({ where: { profileId }, orderBy: { recordedAt: "asc" } }),
    ["weight-history", profileId],
    { tags: [`profile-${profileId}`] },
  )();
