import { ExercisesScreen } from "@/screens/ExercisesScreen";

interface ExercisesPageProps {
  searchParams: Promise<{
    muscle?: string;
    equipment?: string;
    q?: string;
  }>;
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
  const filters = await searchParams;
  return <ExercisesScreen filters={filters} />;
}
