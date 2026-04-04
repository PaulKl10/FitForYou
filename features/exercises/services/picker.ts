"use server";

import { getOptionalUser } from "@/lib/auth/server";
import {
  getExerciseFilterOptions,
  getExercisePage,
  getFavoriteIds,
} from "@/features/exercises/repositories/exercise.repository";

export async function getPickerInitialData() {
  const user = await getOptionalUser();

  const [filterOptions, favoriteIds] = await Promise.all([
    getExerciseFilterOptions(),
    user ? getFavoriteIds(user.id) : Promise.resolve<string[]>([]),
  ]);

  return { ...filterOptions, favoriteIds };
}

interface PickerFilters {
  q?: string;
  muscle?: string[];
  equipment?: string[];
  page?: number;
  favoritesOnly?: boolean;
}

export async function fetchPickerExercises(
  filters: PickerFilters,
  favoriteIds: string[],
) {
  return getExercisePage(filters, favoriteIds, 12);
}
