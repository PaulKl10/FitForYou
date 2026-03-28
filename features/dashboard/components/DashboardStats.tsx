import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Dumbbell, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { RecentSession } from "@/features/dashboard/types";

interface DashboardStatsProps {
  sessionCount: number;
  totalSets: number;
  lastSession: RecentSession | undefined;
}

export function DashboardStats({
  sessionCount,
  totalSets,
  lastSession,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="border-border/60">
        <CardHeader>
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
          <div className="text-3xl font-extrabold">{sessionCount}</div>
          <p className="text-xs text-muted-foreground mt-0.5">
            séances enregistrées
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
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
          <p className="text-xs text-muted-foreground mt-0.5">
            séries au total
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
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
            {lastSession
              ? formatDistanceToNow(lastSession.date, {
                  addSuffix: true,
                  locale: fr,
                })
              : "—"}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lastSession ? "ta dernière séance" : "aucune séance"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
