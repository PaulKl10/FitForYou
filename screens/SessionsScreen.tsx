import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { SessionsView } from "@/features/sessions/View/SessionsView";

export async function SessionsScreen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sessions = await prisma.session.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    include: {
      _count: { select: { sets: true } },
      sets: {
        select: { exercise: { select: { nameFr: true } } },
        distinct: ["exerciseId"],
        take: 3,
      },
    },
  });

  return <SessionsView sessions={sessions} />;
}
