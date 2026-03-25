import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell } from "lucide-react";
import type { SessionsViewProps } from "@/types";

export function SessionsView({ sessions }: SessionsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes séances</h1>
          <p className="text-muted-foreground">
            Historique de tes entraînements
          </p>
        </div>
        <Button render={<Link href="/sessions/new" />} nativeButton={false}>
          <Plus className="mr-2 size-4" />
          Nouvelle séance
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Dumbbell className="size-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">Aucune séance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Lance ta première séance d&apos;entraînement !
            </p>
            <Button render={<Link href="/sessions/new" />} nativeButton={false}>
              Commencer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link key={session.id} href={`/sessions/${session.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {new Date(session.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardTitle>
                    <Badge variant="secondary">
                      {session._count.sets} série
                      {session._count.sets > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  {session.durationMinutes && (
                    <CardDescription>
                      Durée : {session.durationMinutes} min
                    </CardDescription>
                  )}
                </CardHeader>
                {session.sets.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {session.sets.map(
                        (
                          { exercise }: { exercise: { nameFr: string } },
                          i: number
                        ) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {exercise.nameFr}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
