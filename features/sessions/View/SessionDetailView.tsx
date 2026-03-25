import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, StickyNote } from "lucide-react";
import type { SessionDetailViewProps } from "@/types";

export function SessionDetailView({ session, setsByExercise }: SessionDetailViewProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href="/sessions" />}
          nativeButton={false}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {new Date(session.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            {session.durationMinutes && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="size-3.5" />
                {session.durationMinutes} min
              </span>
            )}
            <Badge variant="secondary">
              {session.sets.length} série{session.sets.length > 1 ? "s" : ""}
            </Badge>
          </div>
        </div>
      </div>

      {session.notes && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted text-sm">
          <StickyNote className="size-4 mt-0.5 text-muted-foreground shrink-0" />
          <p>{session.notes}</p>
        </div>
      )}

      <div className="space-y-6">
        {Object.values(setsByExercise).map(({ exercise, sets }) => (
          <div key={exercise.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">{exercise.nameFr}</h2>
              <Badge variant="outline" className="text-xs">
                {exercise.equipment}
              </Badge>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                      Série
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">
                      Reps
                    </th>
                    <th className="text-right px-4 py-2 font-medium text-muted-foreground">
                      Poids
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sets.map((set, i) => (
                    <>
                      <tr key={set.id} className="hover:bg-muted/30">
                        <td className="px-4 py-2">#{set.setNumber}</td>
                        <td className="px-4 py-2 text-right">
                          {set.reps ?? "—"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {set.weightKg != null ? `${set.weightKg} kg` : "—"}
                        </td>
                      </tr>
                      {i < sets.length - 1 && (
                        <tr key={`sep-${set.id}`}>
                          <td colSpan={3} className="p-0">
                            <Separator />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
