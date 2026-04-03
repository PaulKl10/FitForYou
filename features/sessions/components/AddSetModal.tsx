"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  setSchema,
  buildErrorMap,
} from "@/features/sessions/schemas/sessionFormSchema";

interface AddSetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseName: string;
  isPending: boolean;
  onConfirm: (reps: number | null, weightKg: number | null) => void;
}

export function AddSetModal({
  open,
  onOpenChange,
  exerciseName,
  isPending,
  onConfirm,
}: AddSetModalProps) {
  const form = useForm({
    defaultValues: { reps: "", weightKg: "" },
    validators: {
      onSubmit: ({ value }: { value: { reps: string; weightKg: string } }) => {
        const result = setSchema.safeParse(value);
        if (result.success) return undefined;
        return buildErrorMap(result.error);
      },
    },
    onSubmit: ({ value }: { value: { reps: string; weightKg: string } }) => {
      const parsedReps = value.reps ? Number(value.reps) : null;
      const parsedWeight = value.weightKg
        ? Number(value.weightKg.replace(",", "."))
        : null;
      onConfirm(parsedReps, parsedWeight);
    },
  });

  const errors = useStore(form.store, (s) => {
    const raw = s.errorMap.onSubmit;
    return raw instanceof Map
      ? (raw as Map<string, string>)
      : new Map<string, string>();
  });

  function handleOpenChange(value: boolean) {
    onOpenChange(value);
    if (!value) form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Ajouter une série</DialogTitle>
        </DialogHeader>

        <p className="text-sm font-medium text-muted-foreground truncate mb-2">
          {exerciseName}
        </p>

        <div className="flex gap-4">
          <form.Field name="reps">
            {(field) => (
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="add-set-reps">Reps</Label>
                <Input
                  id="add-set-reps"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="ex. 10"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={!!errors.get("reps")}
                />
                {errors.get("reps") && (
                  <p className="text-xs text-destructive">
                    {errors.get("reps")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="weightKg">
            {(field) => (
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="add-set-weight">Poids (kg)</Label>
                <Input
                  id="add-set-weight"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  placeholder="ex. 60"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={!!errors.get("weightKg")}
                />
                {errors.get("weightKg") && (
                  <p className="text-xs text-destructive">
                    {errors.get("weightKg")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={() => form.handleSubmit()}
            isLoading={isPending}
            className="flex-1"
          >
            {isPending ? "Ajout..." : "Ajouter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
