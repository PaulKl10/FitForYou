"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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

  redirect(`/sessions/${session.id}`);
}

export async function updateSession(sessionId: string, input: SessionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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

  redirect(`/sessions/${sessionId}`);
}

export async function duplicateSession(sessionId: string, newDate: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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

  redirect("/sessions");
}

export async function deleteSession(sessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const existing = await prisma.session.findUnique({
    where: { id: sessionId, userId: user.id },
    select: { id: true },
  });
  if (!existing) return;

  await prisma.session.delete({ where: { id: sessionId } });

  redirect("/sessions");
}
