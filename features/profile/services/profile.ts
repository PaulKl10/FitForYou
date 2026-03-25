"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = formData.get("name") as string;
  const weight = formData.get("weight") ? Number(formData.get("weight")) : null;
  const height = formData.get("height") ? Number(formData.get("height")) : null;

  await prisma.profile.update({
    where: { userId: user.id },
    data: { name, weight, height },
  });

  revalidatePath("/profile");
}
