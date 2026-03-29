import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { RecentExercise } from "@/features/dashboard/types";

interface RecentExercisesListProps {
  exercises: RecentExercise[];
}

export function RecentExercisesList({ exercises }: RecentExercisesListProps) {
  if (exercises.length === 0) return null;

  return (
    <section aria-labelledby="exercises-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="exercises-heading" className="text-lg font-bold">Derniers exercices</h2>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/exercises" />}
          nativeButton={false}
          className="text-primary hover:text-primary"
        >
          Bibliothèque
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map(({ exercise, session, sets }) => (
          <Link
            key={exercise.id}
            href={`/exercises/${exercise.id}`}
            aria-label={`Voir l'exercice ${exercise.nameFr}`}
            className="block group min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
          >
            <div className="h-full p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all overflow-hidden">
              {/* Exercise header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                  <Dumbbell className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {exercise.nameFr}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {exercise.targetMuscle}
                  </p>
                </div>
              </div>

              {/* Sets */}
              {sets.length === 0 ? (
                <p className="text-xs text-muted-foreground italic mb-3">
                  Aucune série remplie
                </p>
              ) : (
                <div className="space-y-1 mb-3">
                  {sets.slice(0, 4).map((set) => (
                    <div
                      key={set.setNumber}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center justify-center size-5 rounded bg-muted text-xs font-bold text-muted-foreground shrink-0">
                        {set.setNumber}
                      </span>
                      <div className="flex items-center gap-3 text-xs">
                        {set.reps != null ? (
                          <span>
                            <span className="font-medium">{set.reps}</span>{" "}
                            <span className="text-muted-foreground">reps</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">— reps</span>
                        )}
                        {set.weightKg != null ? (
                          <span>
                            <span className="font-semibold">
                              {set.weightKg}
                            </span>{" "}
                            <span className="text-muted-foreground">kg</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">— kg</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {sets.length > 4 && (
                    <p className="text-xs text-muted-foreground pl-0.5">
                      +{sets.length - 4} série{sets.length - 4 > 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}

              {/* Session info */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border/40">
                <Clock className="size-3 shrink-0" />
                <span className="truncate">
                  {session.name ? `${session.name} · ` : ""}
                  {formatDistanceToNow(new Date(session.date), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
