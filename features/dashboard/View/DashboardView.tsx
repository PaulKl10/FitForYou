import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell, TrendingUp, Calendar, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { DashboardViewProps } from "@/types";

export function DashboardView({
  profileName,
  recentSessions,
  totalSets,
}: DashboardViewProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Tableau de bord
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Bonjour, {profileName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Prêt pour l&apos;entraînement du jour ?
          </p>
        </div>
        <Button render={<Link href="/sessions/new" />} nativeButton={false}>
          <Plus className="size-4" />
          Nouvelle séance
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Séances totales
              </CardTitle>
              <div className="flex items-center justify-center size-8 rounded-lg bg-primary/15">
                <Calendar className="size-4 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{recentSessions.length}</div>
            <p className="text-xs text-muted-foreground mt-0.5">entraînements</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Séries effectuées
              </CardTitle>
              <div className="flex items-center justify-center size-8 rounded-lg bg-accent/15">
                <TrendingUp className="size-4 text-accent" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{totalSets}</div>
            <p className="text-xs text-muted-foreground mt-0.5">séries au total</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dernière séance
              </CardTitle>
              <div className="flex items-center justify-center size-8 rounded-lg bg-secondary/40">
                <Dumbbell className="size-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold leading-tight">
              {recentSessions[0]
                ? formatDistanceToNow(recentSessions[0].date, {
                    addSuffix: true,
                    locale: fr,
                  })
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {recentSessions[0] ? "dernière activité" : "aucune séance"}
            </p>
          </CardContent>
        </Card>
      </div>

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

        {recentSessions.length === 0 ? (
          <Card className="border-dashed border-border/60">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center size-14 rounded-2xl bg-muted mb-4">
                <Dumbbell className="size-7 text-muted-foreground" />
              </div>
              <p className="font-semibold mb-1">Aucune séance pour l&apos;instant</p>
              <p className="text-sm text-muted-foreground mb-5">
                Lance ta première séance d&apos;entraînement !
              </p>
              <Button render={<Link href="/sessions/new" />} nativeButton={false}>
                <Plus className="size-4" />
                Commencer une séance
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentSessions.map((session) => (
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
                    <p className="font-semibold capitalize">
                      {new Date(session.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session._count.sets} série
                      {session._count.sets > 1 ? "s" : ""}
                      {session.durationMinutes &&
                        ` · ${session.durationMinutes} min`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {session._count.sets} séries
                  </Badge>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
