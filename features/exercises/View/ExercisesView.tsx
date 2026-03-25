import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExercisesViewProps } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";

export function ExercisesView({
  exercises,
  allMuscles,
  allEquipments,
  filters,
}: ExercisesViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
          Bibliothèque
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">Exercices</h1>
        <p className="text-muted-foreground mt-1">
          {exercises.length} exercice{exercises.length > 1 ? "s" : ""}{" "}
          disponible{exercises.length > 1 ? "s" : ""}
        </p>
      </div>

      <form className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Rechercher un exercice..."
            defaultValue={filters.q}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            name="muscle"
            defaultValue={filters.muscle ?? ""}
            className="h-9 flex-1 sm:flex-none rounded-lg border border-input bg-card px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          >
            <option value="">Tous les muscles</option>
            {allMuscles.map((muscle: string) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </select>
          <select
            name="equipment"
            defaultValue={filters.equipment ?? ""}
            className="h-9 flex-1 sm:flex-none rounded-lg border border-input bg-card px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
          >
            <option value="">Tout l&apos;équipement</option>
            {allEquipments.map((eq: string) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 shrink-0"
          >
            <SlidersHorizontal className="size-3.5" />
            Filtrer
          </button>
        </div>
      </form>

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="size-10 text-muted-foreground mb-3" />
          <p className="font-semibold mb-1">Aucun exercice trouvé</p>
          <p className="text-sm text-muted-foreground">
            Essaie d&apos;autres filtres
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise: ExercisesViewProps["exercises"][0]) => (
            <Card
              key={exercise.id}
              className="overflow-hidden border-border/60 hover:border-primary/40 transition-colors group"
            >
              {exercise.gifUrl && (
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={exercise.gifUrl}
                    alt={exercise.nameFr}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-tight">
                  {exercise.nameFr}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {exercise.nameEn}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className="text-xs bg-primary/15 text-primary border-0 hover:bg-primary/20">
                    {exercise.bodyPart}
                  </Badge>
                  <Badge className="text-xs bg-accent/15 text-accent border-0 hover:bg-accent/20">
                    {exercise.targetMuscle}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-border/60">
                    {exercise.equipment}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
