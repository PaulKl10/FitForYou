"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteSession } from "@/features/sessions/services/sessions";

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteSession(sessionId);
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Supprimer la séance"
          />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Supprimer la séance</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Cette action est irréversible. Tous les exercices et séries associés
          seront définitivement supprimés.
        </p>
        <div className="flex gap-3 justify-end mt-2">
          <DialogClose render={<Button variant="outline" />}>
            Annuler
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
