import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Dumbbell, TrendingUp, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { DashboardViewProps } from "@/types";

export function DashboardView({
  profileName,
  recentSessions,
  totalSets,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {profileName} 👋</h1>
          <p className="text-muted-foreground">
            Prêt pour l&apos;entraînement du jour ?
          </p>
        </div>
        <Button render={<Link href="/sessions/new" />} nativeButton={false}>
          <Plus className="mr-2 size-4" />
          Nouvelle séance
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Séances totales
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSessions.length}</div>
            <p className="text-xs text-muted-foreground">toutes séances</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Séries effectuées
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSets}</div>
            <p className="text-xs text-muted-foreground">au total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Dernière séance
            </CardTitle>
            <Dumbbell className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentSessions[0]
                ? formatDistanceToNow(recentSessions[0].date, {
                    addSuffix: true,
                    locale: fr,
                  })
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {recentSessions[0] ? "dernière activité" : "aucune séance"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Séances récentes</CardTitle>
          <CardDescription>Tes 5 dernières séances</CardDescription>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Dumbbell className="size-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                Aucune séance pour l&apos;instant
              </p>
              <Button
                render={<Link href="/sessions/new" />}
                nativeButton={false}
                className="mt-4"
                variant="outline"
              >
                Commencer une séance
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentSessions.map((session) => (
                <li key={session.id}>
                  <Link
                    href={`/sessions/${session.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium">
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
                    <span className="text-muted-foreground">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
