import { prisma } from "@/lib/prisma";

interface ExerciseFilters {
  q?: string;
  muscle?: string[];
  equipment?: string[];
  page?: number;
}

function buildWhere(filters: ExerciseFilters) {
  const { q, muscle, equipment } = filters;
  return {
    ...(muscle && muscle.length > 0 && { targetMuscle: { in: muscle } }),
    ...(equipment && equipment.length > 0 && { equipment: { in: equipment } }),
    ...(q && {
      OR: [
        { nameFr: { contains: q, mode: "insensitive" as const } },
        { nameEn: { contains: q, mode: "insensitive" as const } },
        { bodyPart: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };
}

export async function getExercisePage(filters: ExerciseFilters, pageSize = 24) {
  const where = buildWhere(filters);
  const currentPage = filters.page ?? 1;

  const total = await prisma.exercise.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const exercises = await prisma.exercise.findMany({
    where,
    orderBy: { nameFr: "asc" },
    skip: (safePage - 1) * pageSize,
    take: pageSize,
  });

  return { exercises, totalExercises: total, totalPages, currentPage: safePage };
}

export async function getExerciseFilterOptions() {
  const [musclesRaw, equipmentsRaw] = await Promise.all([
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

  return {
    muscles: musclesRaw.map((r) => r.targetMuscle),
    equipments: equipmentsRaw.map((r) => r.equipment).filter((e): e is string => e !== null),
  };
}
