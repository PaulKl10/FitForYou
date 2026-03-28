import type { SessionGetPayload } from "@/app/generated/prisma/models/Session";

export type RecentSession = SessionGetPayload<{
  include: { _count: { select: { sets: true } } };
}>;

export interface RecentExerciseSet {
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
}

export interface RecentExercise {
  exercise: { id: string; nameFr: string; targetMuscle: string };
  session: { id: string; date: Date; name: string | null };
  sets: RecentExerciseSet[];
}

export interface DashboardViewProps {
  profileName: string;
  recentSessions: RecentSession[];
  recentExercises: RecentExercise[];
  totalSets: number;
}
