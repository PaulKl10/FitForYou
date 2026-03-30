import type { ExerciseGetPayload } from "@/app/generated/prisma/models/Exercise";
import type { MuscleGetPayload } from "@/app/generated/prisma/models/Muscle";

export type Exercise = ExerciseGetPayload<{}>;
export type ExerciseWithMuscles = ExerciseGetPayload<{
  include: { muscles: { include: { muscle: true } } };
}>;
export type Muscle = MuscleGetPayload<{}>;

export interface ExerciseProgressPoint {
  date: Date;
  maxWeightKg: number | null;
  maxReps: number | null;
  sessionName: string | null;
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
