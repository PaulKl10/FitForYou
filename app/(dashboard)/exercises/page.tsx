import { ExercisesScreen } from "@/screens/ExercisesScreen";

interface ExercisesPageProps {
  searchParams: Promise<{
    muscle?: string | string[];
    equipment?: string | string[];
    q?: string | string[];
    page?: string | string[];
    favoritesOnly?: string;
  }>;
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
  const params = await searchParams;

  const toArray = (value?: string | string[]) =>
    !value ? [] : Array.isArray(value) ? value : [value];

  const first = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const toPositiveInt = (value?: string) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  };

  const filters = {
    q: first(params.q),
    muscle: toArray(params.muscle),
    equipment: toArray(params.equipment),
    page: toPositiveInt(first(params.page)),
    favoritesOnly: params.favoritesOnly === "true",
  };

  return <ExercisesScreen filters={filters} />;
}
