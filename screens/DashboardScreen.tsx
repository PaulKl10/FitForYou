import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/features/dashboard/repositories/dashboard.repository";
import { DashboardView } from "@/features/dashboard/View/DashboardView";

export async function DashboardScreen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { profile, recentSessions, totalSets } = await getDashboardData(user.id);
  if (!profile) redirect("/login");

  return (
    <DashboardView
      profileName={profile.name}
      recentSessions={recentSessions}
      totalSets={totalSets}
    />
  );
}
