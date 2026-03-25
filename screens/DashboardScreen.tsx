import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { DashboardView } from "@/features/dashboard/View/DashboardView";

export async function DashboardScreen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profile, recentSessions, totalSets] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 5,
      include: { _count: { select: { sets: true } } },
    }),
    prisma.set.count({
      where: { session: { userId: user.id } },
    }),
  ]);

  if (!profile) redirect("/login");

  return (
    <DashboardView
      profileName={profile.name}
      recentSessions={recentSessions}
      totalSets={totalSets}
    />
  );
}
