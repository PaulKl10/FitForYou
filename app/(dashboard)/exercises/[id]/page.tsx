import { ExerciseDetailScreen } from "@/screens/ExerciseDetailScreen";

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = await params;
  return <ExerciseDetailScreen id={id} />;
}
