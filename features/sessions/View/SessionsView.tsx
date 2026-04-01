"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { SessionsPagination } from "@/features/sessions/components/SessionsPagination";
import type { SessionsViewProps } from "@/features/sessions/types";

function groupByMonth(sessions: SessionsViewProps["sessions"]) {
  const groups = new Map<
    string,
    { label: string; sessions: typeof sessions }
  >();
  for (const session of sessions) {
    const date = new Date(session.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups.has(key)) {
      groups.set(key, {
        label: date.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        }),
        sessions: [],
      });
    }
    groups.get(key)!.sessions.push(session);
  }
  return Array.from(groups.values());
}

export function SessionsView({
  sessions,
  currentPage,
  totalPages,
  total,
}: SessionsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const loadingHref = isPending ? pendingHref : null;

  function navigate(href: string) {
    setPendingHref(href);
    startTransition(() => router.push(href));
  }

  const groups = groupByMonth(sessions);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Historique
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Mes séances
          </h1>
          <p className="text-muted-foreground mt-1">
            {total} séance{total > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          isLoading={loadingHref === "/sessions/new"}
          onClick={() => navigate("/sessions/new")}
        >
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
            <Button
              isLoading={loadingHref === "/sessions/new"}
              onClick={() => navigate("/sessions/new")}
            >
              {!loadingHref && <Plus className="size-4" />}
              {!loadingHref && "Commencer une séance"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-8">
            {groups.map(({ label, sessions: groupSessions }) => (
              <section key={label}>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-sm font-semibold capitalize text-muted-foreground">
                    {label}
                  </h2>
                  <span className="text-xs text-muted-foreground/60">
                    {groupSessions.length} séance
                    {groupSessions.length > 1 ? "s" : ""}
                  </span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>

                <div className="space-y-2">
                  {groupSessions.map((session) => {
                    const date = new Date(session.date);
                    const uniqueExercises = [
                      ...new Set(
                        session.sets.map(
                          ({ exercise }: { exercise: { nameFr: string } }) =>
                            exercise.nameFr,
                        ),
                      ),
                    ] as string[];

                    return (
                      <Link
                        key={session.id}
                        href={`/sessions/${session.id}`}
                        className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                      >
                        <div className="p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0 mt-0.5">
                                <Dumbbell className="size-4.5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                {session.name ? (
                                  <>
                                    <p className="font-semibold">
                                      {session.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground capitalize">
                                      {date.toLocaleDateString("fr-FR", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                      })}
                                    </p>
                                  </>
                                ) : (
                                  <p className="font-semibold capitalize">
                                    {date.toLocaleDateString("fr-FR", {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                    })}
                                  </p>
                                )}
                                <div className="flex items-center flex-wrap gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {session.exerciseCount} exercice
                                    {session.exerciseCount === 1 ? "" : "s"}
                                  </Badge>
                                  {session.durationMinutes && (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="size-3" />
                                      {session.durationMinutes} min
                                    </span>
                                  )}
                                  {session._count.sets > 0 &&
                                    !session.hasFilledSets && (
                                      <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                                        <AlertCircle className="size-3" />À
                                        compléter
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
              </section>
            ))}
          </div>
          <SessionsPagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
