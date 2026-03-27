"use client";

import Image from "next/image";
import { ReactElement, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { AVATAR_OPTIONS } from "@/lib/avatars";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AvatarPickerModalProps {
  selectedUrl: string | null;
  onSelect: (url: string) => void;
  children: React.ReactNode;
}

export function AvatarPickerModal({
  selectedUrl,
  onSelect,
  children,
}: AvatarPickerModalProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const totalPages = Math.ceil(AVATAR_OPTIONS.length / pageSize);

  const avatars = useMemo(() => {
    const start = (page - 1) * pageSize;
    return AVATAR_OPTIONS.slice(start, start + pageSize);
  }, [page]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setPage(1);
        }
      }}
    >
      <DialogTrigger render={children as ReactElement} />
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Choisir un avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-3">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => {
                onSelect(avatar.url);
                setOpen(false);
              }}
              className={cn(
                "rounded-full ring-2 ring-offset-2 ring-offset-background transition-all focus:outline-none w-fit",
                selectedUrl === avatar.url
                  ? "ring-primary"
                  : "ring-transparent hover:ring-muted-foreground",
              )}
            >
              <Image
                src={avatar.url}
                alt={`Avatar ${avatar.id}`}
                width={64}
                height={64}
                className="rounded-full"
                unoptimized
              />
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="flex-1"
          >
            Precedent
          </Button>
          <p className="text-xs text-muted-foreground">
            Page {page} / {totalPages}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="flex-1"
          >
            Suivant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
