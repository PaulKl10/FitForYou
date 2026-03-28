import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/features/profile/repositories/profile.repository";
import { AppSidebar } from "@/components/nav/sidebar";
import { Header } from "@/components/nav/header";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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

  const profile = await getProfile(user.id);

  if (!profile) redirect("/login");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header
          name={profile.name}
          email={user.email ?? ""}
          avatarUrl={profile.avatarUrl}
        />
        <main className="flex-1 px-4 pt-6 pb-20 md:px-6 md:py-6">
          {children}
        </main>
        <MobileNav />
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
