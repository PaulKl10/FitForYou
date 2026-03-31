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
    <>
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Aller au contenu
    </a>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header
          name={profile.name}
          email={user.email ?? ""}
          avatarUrl={profile.avatarUrl}
        />
        <main id="main-content" className="flex-1 px-4 pt-6 pb-28 md:px-6 md:py-6">
          {children}
        </main>
        <MobileNav />
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
    </>
  );
}
