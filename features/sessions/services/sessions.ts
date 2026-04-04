"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { requireUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

interface SetInput {
  reps?: number;
  weightKg?: number;
}

interface ExerciseInput {
  exerciseId: string;
  sets: SetInput[];
}

interface SessionInput {
  name?: string;
  date: string;
  durationMinutes?: number;
  notes?: string;
  exercises: ExerciseInput[];
}

export async function createSession(input: SessionInput) {
  const user = await requireUser();

  const session = await prisma.$transaction(async (tx) => {
    const created = await tx.session.create({
      data: {
        userId: user.id,
        name: input.name || null,
        date: new Date(input.date),
        durationMinutes: input.durationMinutes ?? null,
        notes: input.notes || null,
      },
    });

    const setsData = input.exercises.flatMap(({ exerciseId, sets }) =>
      sets.map((set, i) => ({
        sessionId: created.id,
        exerciseId,
        setNumber: i + 1,
        reps: set.reps ?? null,
        weightKg: set.weightKg ?? null,
      })),
    );

    if (setsData.length > 0) {
      await tx.set.createMany({ data: setsData });
    }

    return created;
  });

  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  redirect(`/sessions/${session.id}`);
}

export async function updateSession(sessionId: string, input: SessionInput) {
  const user = await requireUser();

  await prisma.$transaction(async (tx) => {
    // Verify ownership
    const existing = await tx.session.findUnique({
      where: { id: sessionId, userId: user.id },
      select: { id: true },
    });
    if (!existing) throw new Error("Session not found");

    // Update metadata
    await tx.session.update({
      where: { id: sessionId },
      data: {
        name: input.name || null,
        date: new Date(input.date),
        durationMinutes: input.durationMinutes ?? null,
        notes: input.notes || null,
      },
    });

    // Replace all sets atomically
    await tx.set.deleteMany({ where: { sessionId } });

    const setsData = input.exercises.flatMap(({ exerciseId, sets }) =>
      sets.map((set, i) => ({
        sessionId,
        exerciseId,
        setNumber: i + 1,
        reps: set.reps ?? null,
        weightKg: set.weightKg ?? null,
      })),
    );

    if (setsData.length > 0) {
      await tx.set.createMany({ data: setsData });
    }
  });

  updateTag(`session-${sessionId}`);
  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  redirect(`/sessions/${sessionId}`);
}

export async function duplicateSession(sessionId: string, newDate: string) {
  const user = await requireUser();

  const original = await prisma.session.findUnique({
    where: { id: sessionId, userId: user.id },
    include: {
      sets: {
        orderBy: [{ exerciseId: "asc" }, { setNumber: "asc" }],
        select: { exerciseId: true, setNumber: true },
      },
    },
  });
  if (!original) redirect("/sessions");

  // Group sets by exercise to know how many sets each exercise had
  const setsByExercise = new Map<string, number>();
  for (const set of original.sets) {
    setsByExercise.set(set.exerciseId, (setsByExercise.get(set.exerciseId) ?? 0) + 1);
  }

  const copy = await prisma.$transaction(async (tx) => {
    const created = await tx.session.create({
      data: {
        userId: user.id,
        name: original.name,
        date: new Date(newDate),
        durationMinutes: null,
        notes: null,
      },
    });

    const setsData = Array.from(setsByExercise.entries()).flatMap(
      ([exerciseId, count]) =>
        Array.from({ length: count }, (_, i) => ({
          sessionId: created.id,
          exerciseId,
          setNumber: i + 1,
          reps: null,
          weightKg: null,
        })),
    );

    if (setsData.length > 0) {
      await tx.set.createMany({ data: setsData });
    }

    return created;
  });

  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  redirect("/sessions");
}

export async function updateSessionInfo(
  sessionId: string,
  data: {
    name?: string | null;
    date?: string;
    durationMinutes?: number | null;
    notes?: string | null;
  },
) {
  const user = await requireUser();

  const existing = await prisma.session.findUnique({
    where: { id: sessionId, userId: user.id },
    select: { id: true },
  });
  if (!existing) throw new Error("Session introuvable");

  const updateData: Record<string, unknown> = {};
  if ("name" in data) updateData.name = data.name || null;
  if ("date" in data) updateData.date = new Date(data.date!);
  if ("durationMinutes" in data) updateData.durationMinutes = data.durationMinutes;
  if ("notes" in data) updateData.notes = data.notes || null;

  await prisma.session.update({
    where: { id: sessionId },
    data: updateData,
  });

  updateTag(`session-${sessionId}`);
  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
}

export async function updateSet(
  setId: string,
  data: {
    reps?: number | null;
    weightKg?: number | null;
  },
) {
  const user = await requireUser();

  const set = await prisma.set.findUnique({
    where: { id: setId },
    include: { session: { select: { userId: true, id: true } } },
  });
  if (!set || set.session.userId !== user.id) throw new Error("Set introuvable");

  await prisma.set.update({
    where: { id: setId },
    data,
  });

  updateTag(`session-${set.session.id}`);
  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
}

export async function updateSessionExercise(
  sessionId: string,
  exerciseId: string,
  sets: { reps?: number | null; weightKg?: number | null }[],
) {
  const user = await requireUser();

  const existing = await prisma.session.findUnique({
    where: { id: sessionId, userId: user.id },
    select: { id: true },
  });
  if (!existing) throw new Error("Session introuvable");

  await prisma.$transaction(async (tx) => {
    await tx.set.deleteMany({ where: { sessionId, exerciseId } });
    if (sets.length > 0) {
      await tx.set.createMany({
        data: sets.map((set, i) => ({
          sessionId,
          exerciseId,
          setNumber: i + 1,
          reps: set.reps ?? null,
          weightKg: set.weightKg ?? null,
        })),
      });
    }
  });

  updateTag(`session-${sessionId}`);
  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
}

export async function addExercisesToSession(sessionId: string, exerciseIds: string[]) {
  const user = await requireUser();

  const existing = await prisma.session.findUnique({
    where: { id: sessionId, userId: user.id },
    select: { id: true },
  });
  if (!existing) throw new Error("Session introuvable");

  const alreadyAdded = await prisma.set.findMany({
    where: { sessionId, exerciseId: { in: exerciseIds } },
    select: { exerciseId: true },
    distinct: ["exerciseId"],
  });
  const existingIds = new Set(alreadyAdded.map((s) => s.exerciseId));
  const toInsert = exerciseIds.filter((id) => !existingIds.has(id));

  if (toInsert.length > 0) {
    await prisma.set.createMany({
      data: toInsert.map((exerciseId) => ({
        sessionId,
        exerciseId,
        setNumber: 1,
        reps: null,
        weightKg: null,
      })),
    });
  }

  updateTag(`session-${sessionId}`);
  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
}

export async function removeExerciseFromSession(sessionId: string, exerciseId: string) {
  const user = await requireUser();

  const existing = await prisma.session.findUnique({
    where: { id: sessionId, userId: user.id },
    select: { id: true },
  });
  if (!existing) throw new Error("Session introuvable");

  await prisma.set.deleteMany({ where: { sessionId, exerciseId } });

  updateTag(`session-${sessionId}`);
  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
}

export async function deleteSession(sessionId: string) {
  const user = await requireUser();

  const existing = await prisma.session.findUnique({
    where: { id: sessionId, userId: user.id },
    select: { id: true },
  });
  if (!existing) return;

  await prisma.session.delete({ where: { id: sessionId } });

  updateTag(`session-${sessionId}`);
  updateTag(`sessions-${user.id}`);
  updateTag(`dashboard-${user.id}`);
  redirect("/sessions");
}
