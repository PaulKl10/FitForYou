import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell, ChevronRight } from "lucide-react";
import type { RecentSession } from "@/features/dashboard/types";

interface RecentSessionsListProps {
  sessions: RecentSession[];
}

export function RecentSessionsList({ sessions }: RecentSessionsListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Séances récentes</h2>
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/sessions" />}
          nativeButton={false}
          className="text-primary hover:text-primary"
        >
          Voir tout
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex items-center justify-center size-14 rounded-2xl bg-muted mb-4">
              <Dumbbell className="size-7 text-muted-foreground" />
            </div>
            <p className="font-semibold mb-1">
              Aucune séance pour l&apos;instant
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Lance ta première séance !
            </p>
            <Button render={<Link href="/sessions/new" />} nativeButton={false}>
              <Plus className="size-4" />
              Commencer une séance
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 shrink-0">
                  <Dumbbell className="size-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold capitalize">{session.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {session.exerciseCount} exercice
                  {session.exerciseCount === 1 ? "" : "s"}
                </Badge>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
