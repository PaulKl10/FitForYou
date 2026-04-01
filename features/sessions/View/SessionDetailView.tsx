"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import {
  addExercisesToSession,
  removeExerciseFromSession,
  updateSessionExercise,
} from "@/features/sessions/services/sessions";
import { ExercisePickerModal } from "@/features/sessions/components/ExercisePickerModal";
import {
  SessionExerciseCard,
  type SessionExerciseData,
} from "@/features/sessions/components/SessionExerciseCard";
import { SessionInfoSection } from "@/features/sessions/components/SessionInfoSection";
import { SessionExerciseItem } from "@/features/sessions/components/SessionExerciseItem";
import type { SessionDetailViewProps } from "@/features/sessions/types";

export function SessionDetailView({
  session,
  setsByExercise,
}: SessionDetailViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] =
    useState<SessionExerciseData | null>(null);

  const exerciseGroups = Object.values(setsByExercise);
  const exerciseIds = exerciseGroups.map(({ exercise }) => exercise.id);
  const isNavigatingBack = isPending && pendingHref === "/sessions";

  function navigateBack() {
    setPendingHref("/sessions");
    startTransition(() => router.push("/sessions"));
  }

  // ── Exercise editing ───────────────────────────────────────────────────────

  function openExerciseModal(exerciseId: string) {
    const group = setsByExercise[exerciseId];
    if (!group) return;
    setEditingExercise({
      exerciseId: group.exercise.id,
      nameFr: group.exercise.nameFr,
      targetMuscle: group.exercise.targetMuscle,
      equipment: group.exercise.equipment,
      sets: group.sets.map((set) => ({
        reps: set.reps != null ? String(set.reps) : "",
        weightKg: set.weightKg != null ? String(set.weightKg) : "",
      })),
    });
    setExerciseModalOpen(true);
  }

  function handleExerciseSetChange(
    setIndex: number,
    field: "reps" | "weightKg",
    value: string,
  ) {
    if (!editingExercise) return;
    setEditingExercise({
      ...editingExercise,
      sets: editingExercise.sets.map((set, i) =>
        i === setIndex ? { ...set, [field]: value } : set,
      ),
    });
  }

  function handleExerciseAddSet() {
    if (!editingExercise) return;
    setEditingExercise({
      ...editingExercise,
      sets: [...editingExercise.sets, { reps: "", weightKg: "" }],
    });
  }

  function handleExerciseRemoveSet(setIndex: number) {
    if (!editingExercise) return;
    setEditingExercise({
      ...editingExercise,
      sets: editingExercise.sets.filter((_, i) => i !== setIndex),
    });
  }

  function handleExerciseSave() {
    if (!editingExercise) return;
    startTransition(async () => {
      await updateSessionExercise(
        session.id,
        editingExercise.exerciseId,
        editingExercise.sets.map((set) => ({
          reps: set.reps ? Number(set.reps) : null,
          weightKg: set.weightKg
            ? Number(set.weightKg.replace(",", "."))
            : null,
        })),
      );
      setExerciseModalOpen(false);
      setEditingExercise(null);
      router.refresh();
    });
  }

  function handleExerciseRemove() {
    if (!editingExercise) return;
    startTransition(async () => {
      await removeExerciseFromSession(session.id, editingExercise.exerciseId);
      setExerciseModalOpen(false);
      setEditingExercise(null);
      router.refresh();
    });
  }

  function handleAddExercises(
    exercises: {
      id: string;
      nameFr: string;
      targetMuscle: string;
      equipment: string | null;
    }[],
  ) {
    startTransition(async () => {
      await addExercisesToSession(
        session.id,
        exercises.map((e) => e.id),
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <SessionInfoSection
        session={session}
        exerciseCount={exerciseGroups.length}
        onBack={navigateBack}
        isNavigatingBack={isNavigatingBack}
      />

      <ExercisePickerModal onAdd={handleAddExercises} disabledIds={exerciseIds}>
        <Button variant="default" className="gap-2 w-full">
          <Plus className="size-4" />
          Ajouter exercice(s)
        </Button>
      </ExercisePickerModal>

      <div className="space-y-5">
        {exerciseGroups.map(({ exercise, sets }) => (
          <SessionExerciseItem
            key={exercise.id}
            exercise={exercise}
            sets={sets}
            onEdit={() => openExerciseModal(exercise.id)}
          />
        ))}
      </div>

      <Dialog open={exerciseModalOpen} onOpenChange={setExerciseModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;exercice</DialogTitle>
          </DialogHeader>
          {editingExercise && (
            <div className="space-y-3">
              <SessionExerciseCard
                exercise={editingExercise}
                onRemove={handleExerciseRemove}
                onSetChange={handleExerciseSetChange}
                onAddSet={handleExerciseAddSet}
                onRemoveSet={handleExerciseRemoveSet}
                currentSessionId={session.id}
              />
              <Button
                className="w-full"
                onClick={handleExerciseSave}
                isLoading={isPending}
              >
                Valider les modifications
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
