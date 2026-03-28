import type { SessionGetPayload } from "@/app/generated/prisma/models/Session";

export type SessionWithSets = SessionGetPayload<{
  include: {
    sets: { include: { exercise: true } };
  };
}>;

export type SessionListItemBase = SessionGetPayload<{
  include: {
    _count: { select: { sets: true } };
    sets: { select: { exercise: { select: { nameFr: true } } } };
  };
}>;

export type SessionListItem = SessionListItemBase & {
  hasFilledSets: boolean;
  exerciseCount: number;
};

export type ExerciseGroup = {
  exercise: SessionWithSets["sets"][0]["exercise"];
  sets: SessionWithSets["sets"];
};

export interface SessionsViewProps {
  sessions: SessionListItem[];
}

export interface SessionDetailViewProps {
  session: SessionWithSets;
  setsByExercise: Record<string, ExerciseGroup>;
}
