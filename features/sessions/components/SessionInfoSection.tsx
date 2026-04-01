"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useStore } from "@tanstack/react-form";
import { ArrowLeft, CheckIcon, Clock, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DeleteSessionButton } from "@/features/sessions/components/DeleteSessionButton";
import { DuplicateSessionModal } from "@/features/sessions/components/DuplicateSessionModal";
import { updateSessionInfo } from "@/features/sessions/services/sessions";
import type { SessionWithSets } from "@/features/sessions/types";

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toIsoDate(date: string | Date) {
  return new Date(date).toISOString().slice(0, 10);
}

interface SessionInfoSectionProps {
  session: SessionWithSets;
  exerciseCount: number;
  onBack: () => void;
  isNavigatingBack: boolean;
}

export function SessionInfoSection({
  session,
  exerciseCount,
  onBack,
  isNavigatingBack,
}: SessionInfoSectionProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    defaultValues: {
      name: session.name ?? "",
      date: toIsoDate(session.date),
      duration:
        session.durationMinutes != null ? String(session.durationMinutes) : "",
      notes: session.notes ?? "",
    },
    onSubmit: async ({ value }) => {
      await updateSessionInfo(session.id, {
        name: value.name || null,
        date: value.date,
        durationMinutes: value.duration ? Number(value.duration) : null,
        notes: value.notes || null,
      });
      setIsEditing(false);
      router.refresh();
    },
  });

  const formValues = useStore(form.store, (s) => s.values);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  const isDirty =
    formValues.name !== (session.name ?? "") ||
    formValues.date !== toIsoDate(session.date) ||
    formValues.duration !==
      (session.durationMinutes != null
        ? String(session.durationMinutes)
        : "") ||
    formValues.notes !== (session.notes ?? "");

  function syncToSession() {
    form.setFieldValue("name", session.name ?? "");
    form.setFieldValue("date", toIsoDate(session.date));
    form.setFieldValue(
      "duration",
      session.durationMinutes != null ? String(session.durationMinutes) : "",
    );
    form.setFieldValue("notes", session.notes ?? "");
  }

  function handleEditClick() {
    if (!isEditing) {
      syncToSession();
      setIsEditing(true);
      return;
    }
    if (!isDirty) {
      syncToSession();
      setIsEditing(false);
      return;
    }
    form.handleSubmit();
  }

  return (
    <div className="flex items-start gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="mt-1 shrink-0"
        aria-label="Retour aux séances"
        isLoading={isNavigatingBack}
        onClick={onBack}
      >
        {!isNavigatingBack && <ArrowLeft className="size-4" />}
      </Button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">
          Détail de la séance
        </p>

        {isEditing ? (
          <div className="space-y-2">
            <form.Field name="name">
              {(field) => (
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Nom de la séance"
                  className="h-9 max-w-sm"
                />
              )}
            </form.Field>
            <div className="flex flex-wrap gap-2">
              <form.Field name="date">
                {(field) => (
                  <Input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-9 w-44"
                  />
                )}
              </form.Field>
              <form.Field name="duration">
                {(field) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Durée (min)"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-9 w-32"
                  />
                )}
              </form.Field>
            </div>
            <form.Field name="notes">
              {(field) => (
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  placeholder="Notes..."
                  className="w-full max-w-xl rounded-lg border border-input bg-card dark:bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              )}
            </form.Field>
          </div>
        ) : (
          <>
            {session.name ? (
              <h1 className="text-2xl font-extrabold tracking-tight">
                {session.name}
              </h1>
            ) : (
              <h1 className="text-2xl font-extrabold tracking-tight capitalize">
                {formatDate(session.date)}
              </h1>
            )}
            <p className="text-sm text-muted-foreground mt-0.5 capitalize">
              {formatDate(session.date)}
            </p>
          </>
        )}

        <div className="flex items-center gap-3 mt-2">
          <Badge variant="secondary">
            {exerciseCount} exercice{exerciseCount > 1 ? "s" : ""}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-nowrap">
            <Clock className="size-3.5" />
            <span>{session.durationMinutes ?? "—"}</span>
            <span>min</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-nowrap">
            <span>{session.sets.length}</span>
            <span>série{session.sets.length > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-1 shrink-0">
        <DuplicateSessionModal sessionId={session.id} />
        <Button
          variant={isEditing && isDirty ? "default" : "outline"}
          size="icon"
          onClick={handleEditClick}
          isLoading={isSubmitting}
        >
          {!isSubmitting &&
            (isEditing && isDirty ? (
              <CheckIcon className="size-4" />
            ) : (
              <Pencil className="size-4" />
            ))}
        </Button>
        <DeleteSessionButton sessionId={session.id} />
      </div>
    </div>
  );
}
