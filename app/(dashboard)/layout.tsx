import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/nav/sidebar";
import { UserMenu } from "@/components/nav/user-menu";
import { Toaster } from "@/components/ui/sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MobileNav } from "@/components/nav/mobile-nav";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
          </div>
          <div className="flex-1" />
          <div className="px-4">
            <UserMenu
              name={profile.name}
              email={user.email ?? ""}
              avatarUrl={profile.avatarUrl}
            />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
        <MobileNav />
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
