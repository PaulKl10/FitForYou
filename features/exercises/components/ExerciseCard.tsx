import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FavoriteButton } from "@/features/exercises/components/FavoriteButton";
import type { Exercise } from "@/features/exercises/types";

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite: boolean;
}

export function ExerciseCard({ exercise, isFavorite }: ExerciseCardProps) {
  return (
    <div className="transition-transform hover:-translate-y-0.5">
      <Card className="group h-full ring-0 relative pt-0 border-border/60">
        {/* Lien étendu sur toute la card */}
        <Link
          href={`/exercises/${exercise.id}`}
          className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={exercise.nameFr}
        />

        {/* Bouton favori au-dessus du lien */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            exerciseId={exercise.id}
            isFavorite={isFavorite}
            size="sm"
          />
        </div>

        {exercise.gifUrl && (
          <div className="relative aspect-square bg-muted overflow-hidden rounded-t-xl pointer-events-none">
            <Image
              src={exercise.gifUrl}
              alt={exercise.nameFr}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <CardHeader className="pb-2">
          <h3 className="text-base font-semibold leading-tight">
            {exercise.nameFr}
          </h3>
          <p className="text-xs text-muted-foreground">{exercise.nameEn}</p>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            <Badge className="text-xs bg-primary/15 text-primary border-0">
              {exercise.bodyPart}
            </Badge>
            <Badge className="text-xs bg-accent/15 text-foreground border-0">
              {exercise.targetMuscle}
            </Badge>
            <Badge variant="outline" className="text-xs border-border/60">
              {exercise.equipment}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
