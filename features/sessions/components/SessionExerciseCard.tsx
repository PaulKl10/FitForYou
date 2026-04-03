"use client";

import { useEffect, useState } from "react";
import { Dumbbell, Plus, Trash2, X, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getExerciseLastHistory,
  type ExerciseHistory,
} from "@/features/sessions/services/exercise-history";

export interface SetData {
  reps: string;
  weightKg: string;
}

export interface SetFieldErrors {
  reps?: string;
  weightKg?: string;
}

export interface SessionExerciseData {
  exerciseId: string;
  nameFr: string;
  targetMuscle: string;
  equipment: string | null;
  sets: SetData[];
}

interface SessionExerciseCardProps {
  exercise: SessionExerciseData;
  onRemove: () => void;
  onSetChange: (
    setIndex: number,
    field: "reps" | "weightKg",
    value: string,
  ) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  dragHandle?: React.ReactNode;
  setErrors?: SetFieldErrors[];
  currentSessionId?: string;
}

function formatSet(set: ExerciseHistory["sets"][number]) {
  const parts: string[] = [];
  if (set.reps != null) parts.push(`${set.reps} reps`);
  if (set.weightKg != null) parts.push(`${set.weightKg} kg`);
  return parts.length > 0 ? parts.join(" · ") : "—";
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function SessionExerciseCard({
  exercise,
  onRemove,
  onSetChange,
  onAddSet,
  onRemoveSet,
  dragHandle,
  setErrors,
  currentSessionId,
}: SessionExerciseCardProps) {
  const [history, setHistory] = useState<ExerciseHistory | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!currentSessionId) return;
    getExerciseLastHistory(exercise.exerciseId, currentSessionId).then(
      setHistory,
    );
  }, [exercise.exerciseId, currentSessionId]);

  return (
    <div className="rounded-xl border border-border/60 bg-card">
      {/* Header */}
      <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-3 border-b border-border/60 bg-muted/30">
        {dragHandle}
        <div className="flex min-w-0 flex-1 gap-2 items-center">
          <div className="flex items-center justify-center size-7 rounded-md bg-primary/10 shrink-0">
            <Dumbbell className="size-3.5 text-primary" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 items-stretch overflow-hidden md:flex-row md:items-center">
            <p className="min-w-0 font-semibold text-sm truncate md:flex-1">
              {exercise.nameFr}
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              {exercise.targetMuscle && (
                <Badge
                  variant="default"
                  className="text-xs border-border/60 shrink-0"
                >
                  {exercise.targetMuscle}
                </Badge>
              )}
              {exercise.equipment && (
                <Badge
                  variant="outline"
                  className="text-xs border-border/60 shrink-0"
                >
                  {exercise.equipment}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-destructive shrink-0"
          onClick={onRemove}
          aria-label="Supprimer l'exercice"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {/* Last session history */}
      {currentSessionId && (
        <div className="px-3 py-2 border-b border-border/40 bg-muted/10">
          {history === undefined ? (
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-40 rounded bg-muted animate-pulse" />
            </div>
          ) : history === null ? (
            <p className="text-xs text-muted-foreground/60 italic">
              Aucun historique
            </p>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <History className="size-3" />
                <span className="font-medium">
                  {history.sessionName ?? formatDate(history.sessionDate)}
                </span>
                {history.sessionName && (
                  <span className="text-muted-foreground/60">
                    · {formatDate(history.sessionDate)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {history.sets.map((set) => (
                  <span
                    key={set.setNumber}
                    className="text-xs text-muted-foreground"
                  >
                    <span className="text-muted-foreground/60 mr-1">
                      {set.setNumber}.
                    </span>
                    {formatSet(set)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sets */}
      <div className="p-3 space-y-2">
        <div className="max-h-[50vh] overflow-y-auto space-y-2">
          {exercise.sets.length > 0 && (
            <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 px-1">
              <span className="text-xs font-semibold text-muted-foreground text-center">
                #
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                Reps
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                Poids (kg)
              </span>
              <span />
            </div>
          )}
          {exercise.sets.map((set, i) => {
            const err = setErrors?.[i];
            const hasError = !!(err?.reps || err?.weightKg);
            return (
              <div key={i} className="space-y-1">
                <div
                  className={cn(
                    "grid grid-cols-[2rem_1fr_1fr_2rem] gap-2",
                    hasError ? "items-start" : "items-center",
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary text-xs font-bold mx-auto",
                      hasError && "mt-1",
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="—"
                      value={set.reps}
                      onChange={(e) => onSetChange(i, "reps", e.target.value)}
                      aria-invalid={!!err?.reps}
                      className={cn(
                        "h-8 text-base",
                        err?.reps &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {err?.reps && (
                      <p className="text-xs text-destructive">{err.reps}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*[.,]?[0-9]*"
                      placeholder="—"
                      value={set.weightKg}
                      onChange={(e) =>
                        onSetChange(i, "weightKg", e.target.value)
                      }
                      aria-invalid={!!err?.weightKg}
                      className={cn(
                        "h-8 text-base",
                        err?.weightKg &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {err?.weightKg && (
                      <p className="text-xs text-destructive">{err.weightKg}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-7 text-muted-foreground hover:text-destructive",
                      hasError && "mt-1",
                    )}
                    onClick={() => onRemoveSet(i)}
                    aria-label="Supprimer la série"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground h-8 border border-dashed border-border/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5"
          onClick={onAddSet}
        >
          <Plus className="size-3.5" />
          Ajouter une série
        </Button>
      </div>
    </div>
  );
}
