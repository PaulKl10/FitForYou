"use client";

import { cn } from "@/lib/utils";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";

type InlineEditProps = {
  value: string;
  onSave: (value: string) => Promise<void>;
  as?: "input" | "textarea";
  type?: "text" | "number" | "date";
  placeholder?: string;
  emptyText?: string;
  renderDisplay?: (value: string) => ReactNode;
  className?: string;
  inputClassName?: string;
};

export function InlineEdit({
  value,
  onSave,
  as = "input",
  type = "text",
  placeholder,
  emptyText = "—",
  renderDisplay,
  className,
  inputClassName,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!editing) return;
    ref.current?.focus();
    if (type !== "date") ref.current?.select();
  }, [editing, type]);

  function save() {
    setEditing(false);
    const normalized = type === "number" ? draft : draft.trim();
    if (normalized === value) return;
    startTransition(() => onSave(normalized));
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && as !== "textarea") save();
    if (e.key === "Enter" && as === "textarea" && (e.metaKey || e.ctrlKey))
      save();
    if (e.key === "Escape") cancel();
  }

  if (editing) {
    const sharedProps = {
      ref,
      value: draft,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setDraft(e.target.value),
      onBlur: save,
      onKeyDown: handleKeyDown,
      placeholder,
      className: cn(
        "w-full rounded-md border border-input bg-background px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
        inputClassName,
      ),
    };

    if (as === "textarea") return <textarea {...sharedProps} rows={3} />;
    return <input type={type} {...sharedProps} />;
  }

  const displayContent = renderDisplay ? renderDisplay(draft) : draft || emptyText;

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        "inline-flex cursor-pointer rounded-md px-1.5 py-0.5 -mx-1.5 text-left transition-colors hover:bg-muted/60",
        className,
      )}
    >
      {displayContent}
    </button>
  );
}
