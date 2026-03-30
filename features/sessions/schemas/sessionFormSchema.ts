import { z } from "zod";

const positiveIntegerString = z
  .string()
  .refine((v) => v === "" || /^\d+$/.test(v), {
    message: "Entier positif requis",
  });

const positiveDecimalString = z
  .string()
  .refine((v) => v === "" || /^\d*[.,]?\d*$/.test(v), {
    message: "Nombre positif requis",
  });

export const setSchema = z.object({
  reps: positiveIntegerString,
  weightKg: positiveDecimalString,
});

const exerciseSchema = z.object({
  exerciseId: z.string(),
  nameFr: z.string(),
  targetMuscle: z.string(),
  equipment: z.string().nullable(),
  sets: z.array(setSchema),
});

export const sessionFormSchema = z.object({
  name: z.string(),
  date: z.string().min(1, "La date est requise"),
  duration: positiveIntegerString,
  notes: z.string(),
  exercises: z
    .array(exerciseSchema)
    .min(1, "Ajoute au moins un exercice"),
});

/** Construit un dictionnaire chemin → premier message d'erreur. */
export function buildErrorMap(error: z.ZodError): Map<string, string> {
  const map = new Map<string, string>();
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!map.has(key)) map.set(key, issue.message);
  }
  return map;
}
