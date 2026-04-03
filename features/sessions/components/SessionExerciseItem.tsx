import Link from "next/link";
import { Dumbbell, Pencil, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ExerciseGroup } from "@/features/sessions/types";

interface SessionExerciseItemProps {
  exercise: ExerciseGroup["exercise"];
  sets: ExerciseGroup["sets"];
  onEdit: () => void;
  onAddSet: () => void;
}

export function SessionExerciseItem({
  exercise,
  sets,
  onEdit,
  onAddSet,
}: SessionExerciseItemProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex w-full min-w-0 items-center gap-3 px-4 py-3 border-b border-border/60 bg-muted/30">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex items-center justify-center size-7 rounded-md bg-primary/10 shrink-0">
            <Dumbbell className="size-3.5 text-primary" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center">
            <Link
              href={`/exercises/${exercise.id}`}
              className="flex-1 min-w-0 truncate text-sm font-semibold transition-colors hover:text-primary"
            >
              {exercise.nameFr}
            </Link>
            {exercise.targetMuscle && (
              <Badge
                variant="default"
                className="max-w-24 truncate text-xs border-border/60 shrink-0 md:ml-auto"
              >
                {exercise.targetMuscle}
              </Badge>
            )}
            {exercise.equipment && (
              <Badge
                variant="outline"
                className="max-w-24 truncate text-xs border-border/60 shrink-0 md:ml-auto"
              >
                {exercise.equipment}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="icon"
            className="size-8 text-xs"
            onClick={onAddSet}
            aria-label="Ajouter une série"
          >
            <Plus className="size-3.5" color="white" strokeWidth={3} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 text-xs"
            onClick={onEdit}
            aria-label="Modifier l'exercice"
          >
            <Pencil className="size-3.5" />
          </Button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40">
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Série
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Reps
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Poids
            </th>
          </tr>
        </thead>
        <tbody>
          {sets.map((set, i) => (
            <tr
              key={set.id}
              className={`hover:bg-muted/20 transition-colors ${i < sets.length - 1 ? "border-b border-border/30" : ""}`}
            >
              <td className="px-4 py-3">
                <span className="inline-flex items-center justify-center size-6 rounded-md bg-primary/10 text-primary text-xs font-bold">
                  {set.setNumber}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {set.reps != null ? (
                  <span className="font-medium">
                    {set.reps}{" "}
                    <span className="text-muted-foreground text-xs">reps</span>
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {set.weightKg != null ? (
                  <span className="text-accent font-semibold">
                    {set.weightKg}{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      kg
                    </span>
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
