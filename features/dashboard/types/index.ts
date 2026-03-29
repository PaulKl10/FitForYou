import type { SessionGetPayload } from "@/app/generated/prisma/models/Session";

export type RecentSession = SessionGetPayload<Record<string, never>> & {
  exerciseCount: number;
};

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

export interface SessionCalendarEntry {
  id: string;
  date: Date;
  name: string | null;
}

export interface DashboardViewProps {
  profileName: string;
  recentSessions: RecentSession[];
  recentExercises: RecentExercise[];
  totalSets: number;
  calendarSessions: SessionCalendarEntry[];
}
