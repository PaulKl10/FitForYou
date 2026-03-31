"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, History, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/exercises", label: "Exercices", icon: BookOpen },
  { href: "/sessions", label: "Séances", icon: History },
  { href: "/profile", label: "Profil", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm z-50">
      <div className="flex items-center justify-around px-2 pt-3 pb-6">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          const isLoading = loadingHref === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                if (!isActive) setLoadingHref(href);
              }}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive || isLoading ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
