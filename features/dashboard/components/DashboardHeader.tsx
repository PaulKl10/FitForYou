"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  profileName: string;
}

export function DashboardHeader({ profileName }: DashboardHeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(href: string) {
    startTransition(() => router.push(href));
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
          Tableau de bord
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Bonjour, {profileName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Prêt pour ta séance du jour ?
        </p>
      </div>
      <Button isLoading={isPending} onClick={() => navigate("/sessions/new")} className="hidden md:flex">
        {!isPending && <Plus className="size-4" />}
        Nouvelle séance
      </Button>
    </div>
  );
}
