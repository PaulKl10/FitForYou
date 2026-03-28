"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Dumbbell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ExercisePickerModal } from "@/features/sessions/components/ExercisePickerModal";
import {
  SessionExerciseCard,
  type SessionExerciseData,
} from "@/features/sessions/components/SessionExerciseCard";
import { Separator } from "@/components/ui/separator";

export interface SessionFormValues {
  name: string;
  date: string;
  duration: string;
  notes: string;
  exercises: SessionExerciseData[];
}

interface SessionFormProps {
  initialValues: SessionFormValues;
  onSubmit: (values: SessionFormValues) => void;
  isPending: boolean;
  submitLabel: string;
  pageTitle: string;
  pageSubtitle: string;
  backHref: string;
}

export function SessionForm({
  initialValues,
  onSubmit,
  isPending,
  submitLabel,
  pageTitle,
  pageSubtitle,
  backHref,
}: SessionFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [date, setDate] = useState(initialValues.date);
  const [duration, setDuration] = useState(initialValues.duration);
  const [notes, setNotes] = useState(initialValues.notes);
  const [exercises, setExercises] = useState<SessionExerciseData[]>(
    initialValues.exercises,
  );
  const [error, setError] = useState<string | null>(null);

  function handleAddExercises(
    picked: {
      id: string;
      nameFr: string;
      targetMuscle: string;
      equipment: string | null;
    }[],
  ) {
    setExercises((prev) => [
      ...prev,
      ...picked.map((ex) => ({
        exerciseId: ex.id,
        nameFr: ex.nameFr,
        targetMuscle: ex.targetMuscle,
        equipment: ex.equipment,
        sets: [{ reps: "", weightKg: "" }],
      })),
    ]);
  }

  function handleRemoveExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSetChange(
    exIndex: number,
    setIndex: number,
    field: "reps" | "weightKg",
    value: string,
  ) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIndex
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j === setIndex ? { ...s, [field]: value } : s,
              ),
            },
      ),
    );
  }

  function handleAddSet(exIndex: number) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIndex
          ? ex
          : { ...ex, sets: [...ex.sets, { reps: "", weightKg: "" }] },
      ),
    );
  }

  function handleRemoveSet(exIndex: number, setIndex: number) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIndex
          ? ex
          : { ...ex, sets: ex.sets.filter((_, j) => j !== setIndex) },
      ),
    );
  }

  function handleSubmit() {
    if (exercises.length === 0) {
      setError("Ajoute au moins un exercice.");
      return;
    }
    setError(null);
    onSubmit({ name, date, duration, notes, exercises });
  }

  const addedIds = exercises.map((e) => e.exerciseId);

  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        {pageSubtitle}
      </Link>

      {/* Title */}
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
          Séances
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">{pageTitle}</h1>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-stretch flex-1">
        {/* Metadata */}
        <div className="grid grid-cols-2 h-fit gap-4">
          {/* Name — full width */}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="session-name" className="text-sm font-semibold">
              Nom de la séance (optionnel)
            </Label>
            <Input
              id="session-name"
              type="text"
              placeholder="Ex: Jambes, Full body, Push..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-date" className="text-sm font-semibold">
              Date
            </Label>
            <DatePicker
              id="session-date"
              value={date}
              onChange={setDate}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-duration" className="text-sm font-semibold">
              Durée (optionnel)
            </Label>
            <div className="relative">
              <Input
                id="session-duration"
                type="number"
                min="0"
                placeholder="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                min
              </span>
            </div>
          </div>

          {/* Notes — full width */}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="session-notes" className="text-sm font-semibold">
              Notes (optionnel)
            </Label>
            <textarea
              id="session-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ressenti, contexte, objectifs..."
              rows={3}
              className="w-full rounded-lg border border-input bg-card dark:bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="hidden md:block md:self-stretch"
        />

        {/* Exercise section */}
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Exercices</Label>
            <ExercisePickerModal onAdd={handleAddExercises} disabledIds={addedIds}>
              <Button type="button" variant="outline" className="w-full gap-2">
                <Plus className="size-4" />
                Ajouter des exercices
              </Button>
            </ExercisePickerModal>
          </div>

          {exercises.length === 0 ? (
            <Card className="border-dashed border-border/60">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Dumbbell className="size-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Recherche et ajoute tes exercices ci-dessus
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {exercises.map((exercise, exIndex) => (
                <SessionExerciseCard
                  key={exercise.exerciseId}
                  exercise={exercise}
                  onRemove={() => handleRemoveExercise(exIndex)}
                  onSetChange={(setIndex, field, value) =>
                    handleSetChange(exIndex, setIndex, field, value)
                  }
                  onAddSet={() => handleAddSet(exIndex)}
                  onRemoveSet={(setIndex) => handleRemoveSet(exIndex, setIndex)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
          {error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="button"
        className="w-full"
        disabled={isPending}
        onClick={handleSubmit}
      >
        {isPending ? "Enregistrement..." : submitLabel}
      </Button>
    </div>
  );
}
