"use client";

import { ModeToggle } from "@/components/nav/mode-toggle";
import { UserMenu } from "@/components/nav/user-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dumbbell } from "lucide-react";

interface HeaderProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export function Header({ name, email, avatarUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4">
        <div className="flex items-center gap-2 px-2 py-1 md:hidden">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground shrink-0">
            <Dumbbell className="size-4" />
          </div>
          <span className="font-bold text-base">FitForYou</span>
        </div>
        <SidebarTrigger className="-ml-1 hidden md:block" />
        <Separator orientation="vertical" className="h-7 hidden md:block" />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3 px-4">
        <ModeToggle />
        <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
