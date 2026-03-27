import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionsByUser } from "@/features/sessions/repositories/session.repository";
import { SessionsView } from "@/features/sessions/View/SessionsView";

export async function SessionsScreen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sessions = await getSessionsByUser(user.id);

  return <SessionsView sessions={sessions} />;
}
