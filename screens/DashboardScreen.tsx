import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { getDashboardData } from "@/features/dashboard/repositories/dashboard.repository";
import { DashboardView } from "@/features/dashboard/View/DashboardView";

export async function DashboardScreen() {
  const user = await requireUser();

  const { profile, recentSessions, recentExercises, totalSets, calendarSessions } = await getDashboardData(user.id);
  if (!profile) redirect("/login");

  return (
    <DashboardView
      profileName={profile.name}
      recentSessions={recentSessions}
      recentExercises={recentExercises}
      totalSets={totalSets}
      calendarSessions={calendarSessions}
    />
  );
}
