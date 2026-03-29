import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionsByUser } from "@/features/sessions/repositories/session.repository";
import { SessionsView } from "@/features/sessions/View/SessionsView";

interface SessionsScreenProps {
  page: number;
}

export async function SessionsScreen({ page }: SessionsScreenProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
