"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  History,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/exercises", label: "Exercices", icon: BookOpen },
  { href: "/sessions", label: "Séances", icon: History },
  { href: "/profile", label: "Profil", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const loadingHref = isPending ? pendingHref : null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm z-50">
      <div className="flex items-center justify-around px-2 pt-3 pb-6">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const isLoading = loadingHref === href;
          return (
            <button
              key={href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (isActive || isPending) return;
                setPendingHref(href);
                startTransition(() => router.push(href));
              }}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive || isLoading
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Icon className="size-5" />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
