import { SessionsScreen } from "@/screens/SessionsScreen";

interface SessionsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SessionsPage({ searchParams }: SessionsPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  return <SessionsScreen page={currentPage} />;
}
