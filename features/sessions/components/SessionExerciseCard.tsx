"use client";

import { Dumbbell, Plus, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  onSetChange: (setIndex: number, field: "reps" | "weightKg", value: string) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  dragHandle?: React.ReactNode;
  setErrors?: SetFieldErrors[];
}

export function SessionExerciseCard({
  exercise,
  onRemove,
  onSetChange,
  onAddSet,
  onRemoveSet,
  dragHandle,
  setErrors,
}: SessionExerciseCardProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-border/60 bg-muted/30">
        {dragHandle}
        <div className="flex items-center justify-center size-7 rounded-md bg-primary/10 shrink-0">
          <Dumbbell className="size-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{exercise.nameFr}</p>
          <p className="text-xs text-muted-foreground">{exercise.targetMuscle}</p>
        </div>
        {exercise.equipment && (
          <Badge variant="outline" className="text-xs border-border/60 shrink-0">
            {exercise.equipment}
          </Badge>
        )}
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

      {/* Sets */}
      <div className="p-3 space-y-2">
        {exercise.sets.length > 0 && (
          <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 px-1">
            <span className="text-xs font-semibold text-muted-foreground text-center">#</span>
            <span className="text-xs font-semibold text-muted-foreground">Reps</span>
            <span className="text-xs font-semibold text-muted-foreground">Poids (kg)</span>
            <span />
          </div>
        )}

        {exercise.sets.map((set, i) => {
          const err = setErrors?.[i];
          const hasError = !!(err?.reps || err?.weightKg);

          return (
            <div key={i} className="space-y-1">
              <div className={cn("grid grid-cols-[2rem_1fr_1fr_2rem] gap-2", hasError ? "items-start" : "items-center")}>
                <span className={cn("flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary text-xs font-bold mx-auto", hasError && "mt-1")}>
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
                    className={cn("h-8 text-sm", err?.reps && "border-destructive focus-visible:ring-destructive")}
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
                    onChange={(e) => onSetChange(i, "weightKg", e.target.value)}
                    aria-invalid={!!err?.weightKg}
                    className={cn("h-8 text-sm", err?.weightKg && "border-destructive focus-visible:ring-destructive")}
                  />
                  {err?.weightKg && (
                    <p className="text-xs text-destructive">{err.weightKg}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn("size-7 text-muted-foreground hover:text-destructive", hasError && "mt-1")}
                  onClick={() => onRemoveSet(i)}
                  aria-label="Supprimer la série"
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>
          );
        })}

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
