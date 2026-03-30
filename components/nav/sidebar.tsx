"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  History,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/exercises", label: "Exercices", icon: BookOpen },
  { href: "/sessions", label: "Séances", icon: History },
  { href: "/profile", label: "Profil", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Image
            src="/fit-for-you-01.png"
            alt="FitForYou logo"
            width={32}
            height={32}
            className="rounded-lg shrink-0"
          />
          <Image
            src="/fit-for-you-04.png"
            alt="Fit For You"
            width={96}
            height={24}
            className="dark:invert h-8! w-auto max-w-none object-contain object-left shrink-0"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  pathname === href || pathname.startsWith(href + "/");
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={(props) => <Link href={href} aria-current={isActive ? "page" : undefined} {...props} />}
                      isActive={isActive}
                    >
                      <Icon
                        className={cn({
                          "size-5 text-primary": isActive,
                          "size-5 text-muted-foreground": !isActive,
                        })}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "dark:text-white text-black" : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
