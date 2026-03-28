"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { searchExercises } from "@/features/exercises/services/search";

interface SearchResult {
  id: string;
  nameFr: string;
  targetMuscle: string;
  equipment: string | null;
}

interface ExerciseSearchProps {
  onAdd: (exercise: SearchResult) => void;
  disabledIds: string[];
}

export function ExerciseSearch({ onAdd, disabledIds }: ExerciseSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce + search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchExercises(query);
        setResults(res);
        setOpen(true);
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(exercise: SearchResult) {
    if (disabledIds.includes(exercise.id)) return;
    onAdd(exercise);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un exercice à ajouter..."
          className="pl-9 pr-9"
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
          {results.map((exercise) => {
            const disabled = disabledIds.includes(exercise.id);
            return (
              <button
                key={exercise.id}
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(exercise)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-primary/20 cursor-pointer",
                )}
              >
                <div>
                  <p className="font-medium">{exercise.nameFr}</p>
                  <p className="text-xs text-muted-foreground">
                    {exercise.targetMuscle}
                    {exercise.equipment && ` · ${exercise.equipment}`}
                  </p>
                </div>
                {!disabled && <Plus className="size-4 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
