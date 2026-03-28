import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell, Clock, ChevronRight } from "lucide-react";
import type { SessionsViewProps } from "@/features/sessions/types";

export function SessionsView({ sessions }: SessionsViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Historique
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">Mes séances</h1>
          <p className="text-muted-foreground mt-1">
            Historique de tes séances
          </p>
        </div>
        <Button render={<Link href="/sessions/new" />} nativeButton={false}>
          <Plus className="size-4" />
          Nouvelle séance
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center size-16 rounded-2xl bg-muted mb-5">
              <Dumbbell className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-1">Aucune séance</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Lance ta première séance !
            </p>
            <Button render={<Link href="/sessions/new" />} nativeButton={false}>
              <Plus className="size-4" />
              Commencer une séance
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const date = new Date(session.date);
            const uniqueExercises = [
              ...new Set(
                session.sets.map(
                  ({ exercise }: { exercise: { nameFr: string } }) =>
                    exercise.nameFr
                )
              ),
            ] as string[];

            return (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className="block group"
              >
                <div className="p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                        <Dumbbell className="size-4.5 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        {session.name ? (
                          <>
                            <p className="font-semibold">{session.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {date.toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </>
                        ) : (
                          <p className="font-semibold capitalize">
                            {date.toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                        <div className="flex items-center flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {session._count.sets} série
                            {session._count.sets > 1 ? "s" : ""}
                          </Badge>
                          {session.durationMinutes && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              {session.durationMinutes} min
                            </span>
                          )}
                        </div>
                        {uniqueExercises.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {uniqueExercises.slice(0, 3).map((name) => (
                              <Badge
                                key={name}
                                variant="outline"
                                className="text-xs border-border/60"
                              >
                                {name}
                              </Badge>
                            ))}
                            {uniqueExercises.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs border-border/60 text-muted-foreground"
                              >
                                +{uniqueExercises.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
