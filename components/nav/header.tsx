"use client";

import { ModeToggle } from "@/components/nav/mode-toggle";
import { UserMenu } from "@/components/nav/user-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export function Header({ name, email, avatarUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-7" />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3 px-4">
        <ModeToggle />
        <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}
