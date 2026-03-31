"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AVATAR_OPTIONS } from "@/lib/avatars";

const VALID_AVATAR_URLS = new Set(AVATAR_OPTIONS.map((a) => a.url));

const UpdateProfileSchema = z.object({
  name: z.string().min(1).max(100),
  weight: z.coerce.number().positive().max(500).nullable(),
  height: z.coerce.number().positive().max(300).nullable(),
  avatarUrl: z
    .string()
    .refine((url) => VALID_AVATAR_URLS.has(url), { message: "Avatar invalide." })
    .nullable(),
});

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const rawWeight = formData.get("weight");
  const rawHeight = formData.get("height");
  const rawAvatarUrl = formData.get("avatarUrl");

  const parsed = UpdateProfileSchema.safeParse({
    name: formData.get("name"),
    weight: rawWeight ? rawWeight : null,
    height: rawHeight ? rawHeight : null,
    avatarUrl: rawAvatarUrl || null,
  });
  if (!parsed.success) return { error: "Données invalides." };

  const { name, weight, height, avatarUrl } = parsed.data;

  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: { name, weight, height, avatarUrl },
  });

  if (weight !== null) {
    await prisma.weightEntry.create({
      data: { profileId: updatedProfile.id, weight },
    });
  }

  revalidateTag(`profile-${user.id}`, 'max');
}
