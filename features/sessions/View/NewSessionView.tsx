"use client";

import { useTransition } from "react";
import {
  SessionForm,
  type SessionFormValues,
} from "@/features/sessions/components/SessionForm";
import { createSession } from "@/features/sessions/services/sessions";

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

export function NewSessionView() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(values: SessionFormValues) {
    startTransition(async () => {
      await createSession({
        name: values.name || undefined,
        date: values.date,
        durationMinutes: values.duration ? Number(values.duration) : undefined,
        notes: values.notes || undefined,
        exercises: values.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets.map((s) => ({
            reps: s.reps ? Number(s.reps) : undefined,
            weightKg: s.weightKg ? Number(s.weightKg) : undefined,
          })),
        })),
      });
    });
  }

  return (
    <SessionForm
      initialValues={{
        name: "",
        date: todayISODate(),
        duration: "",
        notes: "",
        exercises: [],
      }}
      onSubmit={handleSubmit}
      isPending={isPending}
      submitLabel="Sauvegarder la séance"
      pageTitle="Nouvelle séance"
      pageSubtitle="Retour aux séances"
      backHref="/sessions"
    />
  );
}
