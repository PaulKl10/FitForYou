import { requireUser } from "@/lib/auth/server";
import { getSessionsByUser } from "@/features/sessions/repositories/session.repository";
import { SessionsView } from "@/features/sessions/View/SessionsView";

interface SessionsScreenProps {
  page: number;
}

export async function SessionsScreen({ page }: SessionsScreenProps) {
  const user = await requireUser();

  const { sessions, total, totalPages } = await getSessionsByUser(user.id, page);

  return (
    <SessionsView
      sessions={sessions}
      currentPage={page}
      totalPages={totalPages}
      total={total}
    />
  );
}
