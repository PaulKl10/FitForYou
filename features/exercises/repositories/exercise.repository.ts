import { prisma } from "@/lib/prisma";

interface ExerciseFilters {
  q?: string;
  muscle?: string[];
  equipment?: string[];
  page?: number;
  favoritesOnly?: boolean;
}

function buildWhere(filters: ExerciseFilters, favoriteIds: string[]) {
  const { q, muscle, equipment, favoritesOnly } = filters;
  return {
    ...(favoritesOnly && favoriteIds.length > 0 && { id: { in: favoriteIds } }),
    ...(favoritesOnly && favoriteIds.length === 0 && { id: "none" }),
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

export async function getExercisePage(
  filters: ExerciseFilters,
  favoriteIds: string[] = [],
  pageSize = 24,
) {
  const where = buildWhere(filters, favoriteIds);
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

export async function getExerciseById(id: string) {
  return prisma.exercise.findUnique({
    where: { id },
    include: {
      muscles: {
        include: { muscle: true },
        orderBy: { isPrimary: "desc" },
      },
    },
  });
}

export async function getExerciseProgress(exerciseId: string, userId: string) {
  const sets = await prisma.set.findMany({
    where: { exerciseId, session: { userId } },
    select: {
      weightKg: true,
      reps: true,
      session: { select: { id: true, date: true, name: true } },
    },
    orderBy: { session: { date: "asc" } },
  });

  // Group by session, keep max weight and max reps per session
  const map = new Map<
    string,
    { date: Date; maxWeightKg: number | null; maxReps: number | null; sessionName: string | null }
  >();
  for (const set of sets) {
    const key = set.session.id;
    if (!map.has(key)) {
      map.set(key, {
        date: set.session.date,
        maxWeightKg: set.weightKg,
        maxReps: set.reps,
        sessionName: set.session.name,
      });
    } else {
      const cur = map.get(key)!;
      if (set.weightKg != null && (cur.maxWeightKg == null || set.weightKg > cur.maxWeightKg)) {
        cur.maxWeightKg = set.weightKg;
      }
      if (set.reps != null && (cur.maxReps == null || set.reps > cur.maxReps)) {
        cur.maxReps = set.reps;
      }
    }
  }

  return Array.from(map.values());
}

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { favoriteExercises: { select: { exerciseId: true } } },
  });
  return profile?.favoriteExercises.map((f) => f.exerciseId) ?? [];
}
