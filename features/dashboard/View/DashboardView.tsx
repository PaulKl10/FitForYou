import type { DashboardViewProps } from "@/features/dashboard/types";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { RecentSessionsList } from "@/features/dashboard/components/RecentSessionsList";
import { RecentExercisesList } from "@/features/dashboard/components/RecentExercisesList";
import { SessionsCalendar } from "@/features/dashboard/components/SessionsCalendar";

export function DashboardView({
  profileName,
  recentSessions,
  recentExercises,
  totalSets,
  calendarSessions,
}: DashboardViewProps) {
  return (
    <div className="space-y-8">
      <DashboardHeader profileName={profileName} />
      <DashboardStats
        sessionCount={calendarSessions.length}
        totalSets={totalSets}
        lastSession={recentSessions[0]}
      />
      <RecentSessionsList sessions={recentSessions} />
      <RecentExercisesList exercises={recentExercises} />
      <SessionsCalendar sessions={calendarSessions} />
    </div>
  );
}
