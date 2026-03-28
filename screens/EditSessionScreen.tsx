import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionById } from "@/features/sessions/repositories/session.repository";
import { EditSessionView } from "@/features/sessions/View/EditSessionView";
import type { ExerciseGroup } from "@/features/sessions/types";

interface EditSessionScreenProps {
  id: string;
}

export async function EditSessionScreen({ id }: EditSessionScreenProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const session = await getSessionById(id, user.id);
  if (!session) notFound();

  return <EditSessionView session={session} />;
}
