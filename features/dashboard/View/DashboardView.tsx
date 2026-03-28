import type { DashboardViewProps } from "@/features/dashboard/types";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { RecentSessionsList } from "@/features/dashboard/components/RecentSessionsList";
import { RecentExercisesList } from "@/features/dashboard/components/RecentExercisesList";

export function DashboardView({
  profileName,
  recentSessions,
  recentExercises,
  totalSets,
}: DashboardViewProps) {
  return (
    <div className="space-y-8">
      <DashboardHeader profileName={profileName} />
      <DashboardStats
        sessionCount={recentSessions.length}
        totalSets={totalSets}
        lastSession={recentSessions[0]}
      />
      <RecentSessionsList sessions={recentSessions} />
      <RecentExercisesList exercises={recentExercises} />
    </div>
  );
}
