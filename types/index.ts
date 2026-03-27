import type { ProfileGetPayload } from "@/app/generated/prisma/models/Profile";
import type { ExerciseGetPayload } from "@/app/generated/prisma/models/Exercise";
import type { SessionGetPayload } from "@/app/generated/prisma/models/Session";
import type { WeightEntryGetPayload } from "@/app/generated/prisma/models/WeightEntry";

// ─── Prisma model types ────────────────────────────────────────────────────

export type Profile = ProfileGetPayload<{}>;
export type WeightEntry = WeightEntryGetPayload<{}>;
export type Exercise = ExerciseGetPayload<{}>;

export type SessionWithSets = SessionGetPayload<{
  include: {
    sets: { include: { exercise: true } };
  };
}>;

export type SessionListItem = SessionGetPayload<{
  include: {
    _count: { select: { sets: true } };
    sets: { select: { exercise: { select: { nameFr: true } } } };
  };
}>;

export type RecentSession = SessionGetPayload<{
  include: { _count: { select: { sets: true } } };
}>;

// ─── Exercise group for session detail ────────────────────────────────────

export type ExerciseGroup = {
  exercise: SessionWithSets["sets"][0]["exercise"];
  sets: SessionWithSets["sets"];
};

// ─── View Props ───────────────────────────────────────────────────────────

export interface DashboardViewProps {
  profileName: string;
  recentSessions: RecentSession[];
  totalSets: number;
}

export interface ExercisesViewProps {
  exercises: Exercise[];
  totalExercises: number;
  totalPages: number;
  currentPage: number;
  allMuscles: string[];
  allEquipments: string[];
  filters: {
    q?: string;
    muscle?: string[];
    equipment?: string[];
    page?: number;
    favoritesOnly?: boolean;
  };
  favoriteIds: string[];
}

export interface SessionsViewProps {
  sessions: SessionListItem[];
}

export interface SessionDetailViewProps {
  session: SessionWithSets;
  setsByExercise: Record<string, ExerciseGroup>;
}

export interface ProfileViewProps {
  profile: Profile;
  email: string;
  weightHistory: WeightEntry[];
}
