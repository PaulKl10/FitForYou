"use client";

import { useTransition } from "react";
import {
  SessionForm,
  type SessionFormValues,
} from "@/features/sessions/components/SessionForm";
import { updateSession } from "@/features/sessions/services/sessions";
import type { SessionWithSets } from "@/features/sessions/types";

interface EditSessionViewProps {
  session: SessionWithSets;
}

export function EditSessionView({ session }: EditSessionViewProps) {
  const [isPending, startTransition] = useTransition();

  // Build grouped exercises from flat sets
  const exercisesMap = new Map<
    string,
    { exerciseId: string; nameFr: string; targetMuscle: string; equipment: string | null; sets: { reps: string; weightKg: string }[] }
  >();

  for (const set of session.sets) {
    const key = set.exerciseId;
    if (!exercisesMap.has(key)) {
      exercisesMap.set(key, {
        exerciseId: key,
        nameFr: set.exercise.nameFr,
        targetMuscle: set.exercise.targetMuscle,
        equipment: set.exercise.equipment,
        sets: [],
      });
    }
    exercisesMap.get(key)!.sets.push({
      reps: set.reps != null ? String(set.reps) : "",
      weightKg: set.weightKg != null ? String(set.weightKg) : "",
    });
  }

  function handleSubmit(values: SessionFormValues) {
    startTransition(async () => {
      await updateSession(session.id, {
        name: values.name || undefined,
        date: values.date,
        durationMinutes: values.duration ? Number(values.duration) : undefined,
        notes: values.notes || undefined,
        exercises: values.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets.map((s) => ({
            reps: s.reps ? Number(s.reps) : undefined,
            weightKg: s.weightKg ? Number(s.weightKg.replace(",", ".")) : undefined,
          })),
        })),
      });
    });
  }

  return (
    <SessionForm
      initialValues={{
        name: session.name ?? "",
        date: new Date(session.date).toISOString().split("T")[0],
        duration: session.durationMinutes != null ? String(session.durationMinutes) : "",
        notes: session.notes ?? "",
        exercises: Array.from(exercisesMap.values()),
      }}
      onSubmit={handleSubmit}
      isPending={isPending}
      submitLabel="Enregistrer les modifications"
      pageTitle="Modifier la séance"
      pageSubtitle="Retour à la séance"
      backHref={`/sessions/${session.id}`}
    />
  );
}
