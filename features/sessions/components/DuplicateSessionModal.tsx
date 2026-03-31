"use client";

import { useState, useTransition } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { duplicateSession } from "@/features/sessions/services/sessions";

interface DuplicateSessionModalProps {
  sessionId: string;
}

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

export function DuplicateSessionModal({ sessionId }: DuplicateSessionModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayISODate());
  const [isPending, startTransition] = useTransition();

  function handleDuplicate() {
    startTransition(async () => {
      await duplicateSession(sessionId, date);
    });
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (value) setDate(todayISODate());
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
            aria-label="Dupliquer la séance"
          />
        }
      >
        <Copy className="size-4" />
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Dupliquer la séance</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Choisir la date pour la nouvelle séance. Les exercices seront
          dupliqués sans les séries remplies.
        </p>

        <div className="py-2">
          <DatePicker value={date} onChange={setDate} />
        </div>

        <div className="flex gap-3 justify-end">
          <DialogClose render={<Button variant="outline" />}>
            Annuler
          </DialogClose>
          <Button isLoading={isPending} onClick={handleDuplicate}>
            {isPending ? "Duplication..." : "Dupliquer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
