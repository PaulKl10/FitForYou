"use client";

import Link from "next/link";
import { ArrowLeft, Dumbbell, GripVertical, Plus } from "lucide-react";
import { useForm, useStore } from "@tanstack/react-form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ExercisePickerModal } from "@/features/sessions/components/ExercisePickerModal";
import {
  SessionExerciseCard,
  type SessionExerciseData,
  type SetData,
  type SetFieldErrors,
} from "@/features/sessions/components/SessionExerciseCard";
import { Separator } from "@/components/ui/separator";
import {
  sessionFormSchema,
  buildErrorMap,
} from "@/features/sessions/schemas/sessionFormSchema";

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

// ── Sortable wrapper around SessionExerciseCard ──────────────────────────────

interface SortableExerciseCardProps {
  exercise: SessionExerciseData;
  onRemove: () => void;
  onSetChange: (setIndex: number, field: "reps" | "weightKg", value: string) => void;
  onAddSet: () => void;
  onRemoveSet: (setIndex: number) => void;
  setErrors?: SetFieldErrors[];
}

function SortableExerciseCard({
  exercise,
  onRemove,
  onSetChange,
  onAddSet,
  onRemoveSet,
  setErrors,
}: SortableExerciseCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.exerciseId });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
    >
      <SessionExerciseCard
        exercise={exercise}
        onRemove={onRemove}
        onSetChange={onSetChange}
        onAddSet={onAddSet}
        onRemoveSet={onRemoveSet}
        setErrors={setErrors}
        dragHandle={
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="touch-none cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0 -ml-1 px-0.5"
            aria-label="Réordonner"
          >
            <GripVertical className="size-4" />
          </button>
        }
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function SessionForm({
  initialValues,
  onSubmit,
  isPending,
  submitLabel,
  pageTitle,
  pageSubtitle,
  backHref,
}: SessionFormProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const form = useForm({
    defaultValues: {
      name: initialValues.name,
      date: initialValues.date,
      duration: initialValues.duration,
      notes: initialValues.notes,
      exercises: initialValues.exercises,
    },
    validators: {
      onSubmit: ({ value }: { value: SessionFormValues }) => {
        const result = sessionFormSchema.safeParse(value);
        if (result.success) return undefined;
        // Retourne la Map d'erreurs, récupérée via errorMap.onSubmit
        return buildErrorMap(result.error);
      },
    },
    onSubmit: ({ value }: { value: SessionFormValues }) => {
      onSubmit(value);
    },
  });

  // Souscriptions réactives à l'état du formulaire
  const exercises = useStore(form.store, (s) => s.values.exercises);
  const validationErrors = useStore(form.store, (s) => {
    const raw = s.errorMap.onSubmit;
    return raw instanceof Map ? (raw as Map<string, string>) : new Map<string, string>();
  });

  // Dérive les erreurs par série pour un exercice donné
  function getSetErrors(exIndex: number): SetFieldErrors[] {
    const sets = exercises[exIndex]?.sets ?? [];
    return sets.map((_: SetData, si: number) => ({
      reps: validationErrors.get(`exercises.${exIndex}.sets.${si}.reps`),
      weightKg: validationErrors.get(`exercises.${exIndex}.sets.${si}.weightKg`),
    }));
  }

  const globalError =
    validationErrors.get("exercises") ??
    validationErrors.get("date") ??
    validationErrors.get("duration");

  // ── DnD ────────────────────────────────────────────────────────────────────

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = exercises.findIndex(
        (e: SessionExerciseData) => e.exerciseId === active.id,
      );
      const newIndex = exercises.findIndex(
        (e: SessionExerciseData) => e.exerciseId === over.id,
      );
      form.setFieldValue("exercises", arrayMove(exercises, oldIndex, newIndex));
    }
  }

  // ── Exercise mutations ──────────────────────────────────────────────────────

  function handleAddExercises(
    picked: {
      id: string;
      nameFr: string;
      targetMuscle: string;
      equipment: string | null;
    }[],
  ) {
    form.setFieldValue("exercises", [
      ...picked.map((ex) => ({
        exerciseId: ex.id,
        nameFr: ex.nameFr,
        targetMuscle: ex.targetMuscle,
        equipment: ex.equipment,
        sets: [{ reps: "", weightKg: "" }],
      })),
      ...exercises,
    ]);
  }

  function handleRemoveExercise(index: number) {
    form.setFieldValue(
      "exercises",
      exercises.filter((_: SessionExerciseData, i: number) => i !== index),
    );
  }

  function handleSetChange(
    exIndex: number,
    setIndex: number,
    field: "reps" | "weightKg",
    value: string,
  ) {
    form.setFieldValue(
      "exercises",
      exercises.map((ex: SessionExerciseData, i: number) =>
        i !== exIndex
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s: SetData, j: number) =>
                j === setIndex ? { ...s, [field]: value } : s,
              ),
            },
      ),
    );
  }

  function handleAddSet(exIndex: number) {
    form.setFieldValue(
      "exercises",
      exercises.map((ex: SessionExerciseData, i: number) =>
        i !== exIndex
          ? ex
          : { ...ex, sets: [...ex.sets, { reps: "", weightKg: "" }] },
      ),
    );
  }

  function handleRemoveSet(exIndex: number, setIndex: number) {
    form.setFieldValue(
      "exercises",
      exercises.map((ex: SessionExerciseData, i: number) =>
        i !== exIndex
          ? ex
          : {
              ...ex,
              sets: ex.sets.filter((_: SetData, j: number) => j !== setIndex),
            },
      ),
    );
  }

  const addedIds = exercises.map((e: SessionExerciseData) => e.exerciseId);

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
          {/* Name */}
          <form.Field name="name">
            {(field) => (
              <div className="col-span-2 space-y-2">
                <Label htmlFor="session-name" className="text-sm font-semibold">
                  Nom de la séance (optionnel)
                </Label>
                <Input
                  id="session-name"
                  type="text"
                  placeholder="Ex: Jambes, Full body, Push..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          {/* Date */}
          <form.Field name="date">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="session-date" className="text-sm font-semibold">
                  Date
                </Label>
                <DatePicker
                  id="session-date"
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                />
                {validationErrors.get("date") && (
                  <p className="text-xs text-destructive">
                    {validationErrors.get("date")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Duration */}
          <form.Field name="duration">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="session-duration" className="text-sm font-semibold">
                  Durée (optionnel)
                </Label>
                <div className="relative">
                  <Input
                    id="session-duration"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="60"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={!!validationErrors.get("duration")}
                    className="pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    min
                  </span>
                </div>
                {validationErrors.get("duration") && (
                  <p className="text-xs text-destructive">
                    {validationErrors.get("duration")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Notes */}
          <form.Field name="notes">
            {(field) => (
              <div className="col-span-2 space-y-2">
                <Label htmlFor="session-notes" className="text-sm font-semibold">
                  Notes (optionnel)
                </Label>
                <textarea
                  id="session-notes"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Ressenti, contexte, objectifs..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-card dark:bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            )}
          </form.Field>
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={exercises.map((e: SessionExerciseData) => e.exerciseId)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {exercises.map((exercise: SessionExerciseData, exIndex: number) => (
                    <SortableExerciseCard
                      key={exercise.exerciseId}
                      exercise={exercise}
                      onRemove={() => handleRemoveExercise(exIndex)}
                      onSetChange={(setIndex, field, value) =>
                        handleSetChange(exIndex, setIndex, field, value)
                      }
                      onAddSet={() => handleAddSet(exIndex)}
                      onRemoveSet={(setIndex) =>
                        handleRemoveSet(exIndex, setIndex)
                      }
                      setErrors={getSetErrors(exIndex)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Global error */}
      {globalError && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
          {globalError}
        </p>
      )}

      {/* Submit */}
      <Button
        type="button"
        className="w-full"
        disabled={isPending}
        onClick={() => form.handleSubmit()}
      >
        {isPending ? "Enregistrement..." : submitLabel}
      </Button>
    </div>
  );
}
