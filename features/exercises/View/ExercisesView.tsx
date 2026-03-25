import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import type { ExercisesViewProps } from "@/types";

export function ExercisesView({
  exercises,
  allMuscles,
  allEquipments,
  filters,
}: ExercisesViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bibliothèque d&apos;exercices</h1>
        <p className="text-muted-foreground">
          Parcours et filtre tous les exercices disponibles
        </p>
      </div>

      <form className="flex flex-col sm:flex-row gap-3">
        <Input
          name="q"
          placeholder="Rechercher un exercice..."
          defaultValue={filters.q}
          className="flex-1"
        />
        <select
          name="muscle"
          defaultValue={filters.muscle ?? ""}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">Tous les muscles</option>
          {allMuscles.map((muscle) => (
            <option key={muscle} value={muscle}>
              {muscle}
            </option>
          ))}
        </select>
        <select
          name="equipment"
          defaultValue={filters.equipment ?? ""}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">Tout l&apos;équipement</option>
          {allEquipments.map((eq) => (
            <option key={eq} value={eq}>
              {eq}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Filtrer
        </button>
      </form>

      {exercises.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          Aucun exercice trouvé.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="overflow-hidden">
              {exercise.gifUrl && (
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Image
                    src={exercise.gifUrl}
                    alt={exercise.nameFr}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{exercise.nameFr}</CardTitle>
                <CardDescription>{exercise.nameEn}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{exercise.bodyPart}</Badge>
                  <Badge variant="outline">{exercise.targetMuscle}</Badge>
                  <Badge variant="outline">{exercise.equipment}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
