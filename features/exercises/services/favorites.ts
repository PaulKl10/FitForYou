"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/server";

export async function toggleFavorite(exerciseId: string) {
  const user = await requireUser();

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!profile) redirect("/login");

  const existing = await prisma.favoriteExercise.findUnique({
    where: { profileId_exerciseId: { profileId: profile.id, exerciseId } },
  });

  if (existing) {
    await prisma.favoriteExercise.delete({
      where: { profileId_exerciseId: { profileId: profile.id, exerciseId } },
    });
  } else {
    await prisma.favoriteExercise.create({
      data: { profileId: profile.id, exerciseId },
    });
  }

  updateTag(`favorites-${user.id}`);
  updateTag("exercises");
}
