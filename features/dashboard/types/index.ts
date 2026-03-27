import type { SessionGetPayload } from "@/app/generated/prisma/models/Session";

export type RecentSession = SessionGetPayload<{
  include: { _count: { select: { sets: true } } };
}>;

export interface DashboardViewProps {
  profileName: string;
  recentSessions: RecentSession[];
  totalSets: number;
}
