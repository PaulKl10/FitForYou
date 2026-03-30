import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import exercisesData from "../lib/exercises-fr-corrige.json";

interface RawExercise {
  id: string;
  name: string;
  name_en: string;
  gifUrl: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  instructions: string[];
}

const exercises = exercisesData as RawExercise[];

async function main() {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  console.log("🧹 Nettoyage des données existantes...");
  await prisma.set.deleteMany();
  await prisma.favoriteExercise.deleteMany();
  await prisma.exerciseMuscle.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.muscle.deleteMany();

  // ── 1. Créer les muscles ────────────────────────────────────────────────
  console.log("💪 Création des muscles...");
  const allMuscleNames = new Set<string>();
  for (const ex of exercises) {
    ex.primaryMuscles.forEach((m) => allMuscleNames.add(m));
    ex.secondaryMuscles.forEach((m) => allMuscleNames.add(m));
  }

  await prisma.muscle.createMany({
    data: [...allMuscleNames].sort().map((name) => ({ name })),
  });

  const muscleRecords = await prisma.muscle.findMany();
  const muscleMap = new Map(muscleRecords.map((m) => [m.name, m.id]));
  console.log(`  → ${muscleRecords.length} muscles créés`);

  // ── 2. Créer tous les exercices en bulk ─────────────────────────────────
  console.log(`🏋️  Création de ${exercises.length} exercices...`);
  await prisma.exercise.createMany({
    data: exercises.map((ex) => ({
      externalId: ex.id,
      nameFr: ex.name,
      nameEn: ex.name_en,
      category: ex.bodyParts[0] ?? "",
      bodyPart: ex.bodyParts[0] ?? "",
      targetMuscle: ex.primaryMuscles[0] ?? "",
      equipment: ex.equipments[0] ?? null,
      level: null,
      force: null,
      mechanic: null,
      instructionsFr: ex.instructions.join("\n") ?? null,
      gifUrl: ex.gifUrl ?? null,
    })),
  });
  console.log(`  → ${exercises.length} exercices créés`);

  // ── 3. Récupérer les IDs créés ──────────────────────────────────────────
  const createdExercises = await prisma.exercise.findMany({
    select: { id: true, externalId: true },
  });
  const exerciseMap = new Map(createdExercises.map((e) => [e.externalId, e.id]));

  // ── 4. Créer les relations exercice ↔ muscle ────────────────────────────
  console.log("🔗 Création des relations exercice ↔ muscle...");
  const exerciseMuscleData: {
    exerciseId: string;
    muscleId: string;
    isPrimary: boolean;
  }[] = [];

  for (const ex of exercises) {
    const exerciseId = exerciseMap.get(ex.id);
    if (!exerciseId) continue;

    const primarySet = new Set(ex.primaryMuscles);

    for (const muscle of ex.primaryMuscles) {
      const muscleId = muscleMap.get(muscle);
      if (muscleId) exerciseMuscleData.push({ exerciseId, muscleId, isPrimary: true });
    }
    for (const muscle of ex.secondaryMuscles) {
      if (primarySet.has(muscle)) continue;
      const muscleId = muscleMap.get(muscle);
      if (muscleId) exerciseMuscleData.push({ exerciseId, muscleId, isPrimary: false });
    }
  }

  await prisma.exerciseMuscle.createMany({ data: exerciseMuscleData });
  console.log(`  → ${exerciseMuscleData.length} relations créées`);

  console.log("✅ Seed terminé avec succès !");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
