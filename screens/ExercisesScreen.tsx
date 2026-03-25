import { prisma } from "@/lib/prisma";
import { ExercisesView } from "@/features/exercises/View/ExercisesView";

interface ExercisesScreenProps {
  filters: {
    q?: string;
    muscle?: string;
    equipment?: string;
  };
}

export async function ExercisesScreen({ filters }: ExercisesScreenProps) {
  const { muscle, equipment, q } = filters;

  const [exercises, allMusclesRaw, allEquipmentsRaw] = await Promise.all([
    prisma.exercise.findMany({
      where: {
        ...(muscle && {
          targetMuscle: { contains: muscle, mode: "insensitive" },
        }),
        ...(equipment && {
          equipment: { contains: equipment, mode: "insensitive" },
        }),
        ...(q && {
          OR: [
            { nameFr: { contains: q, mode: "insensitive" } },
            { nameEn: { contains: q, mode: "insensitive" } },
            { bodyPart: { contains: q, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { nameFr: "asc" },
      take: 50,
    }),
    prisma.exercise.findMany({
      select: { targetMuscle: true },
      distinct: ["targetMuscle"],
      orderBy: { targetMuscle: "asc" },
    }),
    prisma.exercise.findMany({
      select: { equipment: true },
      distinct: ["equipment"],
      orderBy: { equipment: "asc" },
    }),
  ]);

  return (
    <ExercisesView
      exercises={exercises}
      allMuscles={allMusclesRaw.map((r) => r.targetMuscle)}
      allEquipments={allEquipmentsRaw.map((r) => r.equipment)}
      filters={filters}
    />
  );
}
