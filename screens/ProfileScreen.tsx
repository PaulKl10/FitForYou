import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { getProfile, getWeightHistory } from "@/features/profile/repositories/profile.repository";
import { ProfileView } from "@/features/profile/View/ProfileView";

export async function ProfileScreen() {
  const user = await requireUser();

  const profile = await getProfile(user.id);
  if (!profile) redirect("/login");

  const weightHistory = await getWeightHistory(profile.id);

  return <ProfileView profile={profile} email={user.email ?? ""} weightHistory={weightHistory} />;
}
