import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Pencil, StickyNote, Dumbbell } from "lucide-react";
import type { SessionDetailViewProps } from "@/features/sessions/types";

export function SessionDetailView({ session, setsByExercise }: SessionDetailViewProps) {
  const exerciseGroups = Object.values(setsByExercise);

  const dateLabel = new Date(session.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/sessions" />}
          nativeButton={false}
          className="mt-1 shrink-0"
          aria-label="Retour aux séances"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Détail de la séance
          </p>
          {session.name ? (
            <>
              <h1 className="text-2xl font-extrabold tracking-tight">
                {session.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5 capitalize">
                {dateLabel}
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-extrabold tracking-tight capitalize">
              {dateLabel}
            </h1>
          )}
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="secondary">
              {session.sets.length} série{session.sets.length > 1 ? "s" : ""}
            </Badge>
            {session.durationMinutes && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                {session.durationMinutes} min
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              {exerciseGroups.length} exercice{exerciseGroups.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          render={<Link href={`/sessions/${session.id}/edit`} />}
          nativeButton={false}
          className="mt-1 shrink-0"
          aria-label="Modifier la séance"
        >
          <Pencil className="size-4" />
        </Button>
      </div>

      {session.notes && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card text-sm">
          <StickyNote className="size-4 mt-0.5 text-primary shrink-0" />
          <p className="text-muted-foreground leading-relaxed">{session.notes}</p>
        </div>
      )}

      <div className="space-y-5">
        {exerciseGroups.map(({ exercise, sets }) => (
          <div key={exercise.id} className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 bg-muted/30">
              <div className="flex items-center justify-center size-7 rounded-md bg-primary/10 shrink-0">
                <Dumbbell className="size-3.5 text-primary" />
              </div>
              <h2 className="font-semibold text-sm">{exercise.nameFr}</h2>
              {exercise.equipment && (
                <Badge variant="outline" className="text-xs border-border/60 ml-auto">
                  {exercise.equipment}
                </Badge>
              )}
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
                    <td className="px-4 py-3 text-right font-medium">
                      {set.reps != null ? (
                        <span>{set.reps} <span className="text-muted-foreground text-xs">reps</span></span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {set.weightKg != null ? (
                        <span className="text-accent font-semibold">{set.weightKg} <span className="text-muted-foreground text-xs font-normal">kg</span></span>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
