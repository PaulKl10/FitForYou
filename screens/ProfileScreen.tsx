import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/features/profile/View/ProfileView";

export async function ProfileScreen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });
  if (!profile) redirect("/login");

  return <ProfileView profile={profile} email={user.email ?? ""} />;
}
