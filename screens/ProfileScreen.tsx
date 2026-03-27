import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/features/profile/repositories/profile.repository";
import { ProfileView } from "@/features/profile/View/ProfileView";

export async function ProfileScreen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await getProfile(user.id);
  if (!profile) redirect("/login");

  return <ProfileView profile={profile} email={user.email ?? ""} />;
}
