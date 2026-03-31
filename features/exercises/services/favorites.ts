"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(exerciseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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

  revalidateTag(`favorites-${user.id}`, 'max');
  revalidateTag("exercises", 'max');
}
