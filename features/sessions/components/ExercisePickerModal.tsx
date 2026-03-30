"use client";

import {
  useState,
  useEffect,
  useTransition,
  useCallback,
  useRef,
} from "react";
import {
  Search,
  Heart,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Plus,
} from "lucide-react";
import { ExerciseGif } from "@/features/exercises/components/ExerciseGif";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FilterMultiSelect } from "@/components/ui/filter-multi-select";
import {
  getPickerInitialData,
  fetchPickerExercises,
} from "@/features/exercises/services/picker";
import type { Exercise } from "@/features/exercises/types";

interface PickedExercise {
  id: string;
  nameFr: string;
  targetMuscle: string;
  equipment: string | null;
}

interface ExercisePickerModalProps {
  onAdd: (exercises: PickedExercise[]) => void;
  disabledIds?: string[];
  children: React.ReactNode;
}

interface PickerState {
  exercises: Exercise[];
  totalPages: number;
  currentPage: number;
  totalExercises: number;
}

export function ExercisePickerModal({
  onAdd,
  disabledIds = [],
  children,
}: ExercisePickerModalProps) {
  const [open, setOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Filter options
  const [allMuscles, setAllMuscles] = useState<string[]>([]);
  const [allEquipments, setAllEquipments] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Active filters
  const [query, setQuery] = useState("");
  const [muscles, setMuscles] = useState<string[]>([]);
  const [equipments, setEquipments] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Results
  const [state, setState] = useState<PickerState>({
    exercises: [],
    totalPages: 1,
    currentPage: 1,
    totalExercises: 0,
  });

  // Selection
  const [selected, setSelected] = useState<PickedExercise[]>([]);

  const [isInit, startInit] = useTransition();
  const [isFetching, startFetch] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load filter options and favorites when modal first opens
  useEffect(() => {
    if (!open || initialized) return;
    startInit(async () => {
      const data = await getPickerInitialData();
      setAllMuscles(data.muscles);
      setAllEquipments(data.equipments);
      setFavoriteIds(data.favoriteIds);
      setInitialized(true);
    });
  }, [open, initialized]);

  // Fetch exercises when filters change
  const fetchExercises = useCallback(
    (
      q: string,
      muscleFilter: string[],
      equipmentFilter: string[],
      fav: boolean,
      pageNum: number,
      favIds: string[],
    ) => {
      startFetch(async () => {
        const result = await fetchPickerExercises(
          {
            q: q || undefined,
            muscle: muscleFilter.length > 0 ? muscleFilter : undefined,
            equipment:
              equipmentFilter.length > 0 ? equipmentFilter : undefined,
            favoritesOnly: fav || undefined,
            page: pageNum,
          },
          favIds,
        );
        setState(result);
      });
    },
    [],
  );

  useEffect(() => {
    if (!initialized) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchExercises(query, muscles, equipments, favoritesOnly, page, favoriteIds);
    }, query ? 300 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [initialized, query, muscles, equipments, favoritesOnly, page, favoriteIds, fetchExercises]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [query, muscles, equipments, favoritesOnly]);

  function toggleSelect(exercise: Exercise) {
    setSelected((prev) => {
      const exists = prev.some((e) => e.id === exercise.id);
      if (exists) return prev.filter((e) => e.id !== exercise.id);
      return [
        ...prev,
        {
          id: exercise.id,
          nameFr: exercise.nameFr,
          targetMuscle: exercise.targetMuscle,
          equipment: exercise.equipment,
        },
      ];
    });
  }

  function handleConfirm() {
    onAdd(selected);
    setOpen(false);
    // Reset state for next open
    setSelected([]);
    setQuery("");
    setMuscles([]);
    setEquipments([]);
    setFavoritesOnly(false);
    setPage(1);
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setSelected([]);
      setQuery("");
      setMuscles([]);
      setEquipments([]);
      setFavoritesOnly(false);
      setPage(1);
    }
  }

  const isSelected = (id: string) => selected.some((e) => e.id === id);
  const isDisabled = (id: string) => disabledIds.includes(id);
  const isLoading = isInit || isFetching;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as React.ReactElement} />

      <DialogContent
        className="p-0 max-w-4xl w-[95vw] h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* ── Left panel: search + results ── */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Header */}
            <DialogHeader className="px-4 pt-4 pb-3 mb-0 border-b border-border/60 shrink-0">
              <DialogTitle>Ajouter des exercices</DialogTitle>
            </DialogHeader>

            {/* Filters */}
            <div className="px-4 py-3 space-y-2 border-b border-border/60 shrink-0">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un exercice..."
                  className="pl-9 pr-9"
                />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground animate-spin" />
                )}
              </div>

              {/* Muscle + Equipment filters */}
              <div className="grid grid-cols-2 gap-2">
                <FilterMultiSelect
                  placeholder="Muscles"
                  options={allMuscles.map((m) => ({ value: m, label: m }))}
                  value={muscles}
                  onChange={setMuscles}
                />
                <FilterMultiSelect
                  placeholder="Équipement"
                  options={allEquipments.map((e) => ({ value: e, label: e }))}
                  value={equipments}
                  onChange={setEquipments}
                />
              </div>

              {/* Favorites toggle */}
              <Button
                type="button"
                variant={favoritesOnly ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-1.5 h-8 text-xs",
                  favoritesOnly && "bg-rose-500 hover:bg-rose-600 border-rose-500",
                )}
                onClick={() => setFavoritesOnly((v) => !v)}
              >
                <Heart
                  className={cn(
                    "size-3.5",
                    favoritesOnly ? "fill-white" : "fill-none",
                  )}
                />
                Favoris
              </Button>
            </div>

            {/* Exercise grid */}
            <div className="flex-1 overflow-y-auto">
              {isInit ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : state.exercises.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4">
                  <Search className="size-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Aucun exercice trouvé</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {favoritesOnly
                      ? "Tu n'as pas encore de favoris"
                      : "Essaie d'autres filtres"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                  {state.exercises.map((exercise) => {
                    const selected = isSelected(exercise.id);
                    const disabled = isDisabled(exercise.id);
                    const isFav = favoriteIds.includes(exercise.id);

                    return (
                      <button
                        key={exercise.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && toggleSelect(exercise)}
                        className={cn(
                          "relative rounded-xl border text-left transition-all overflow-hidden",
                          disabled
                            ? "opacity-40 cursor-not-allowed border-border/40"
                            : selected
                              ? "border-primary ring-2 ring-primary/30 cursor-pointer"
                              : "border-border/60 hover:border-primary/50 cursor-pointer",
                        )}
                      >
                        {/* GIF / placeholder */}
                        <div className="aspect-square bg-muted/50 overflow-hidden">
                          {exercise.gifUrl ? (
                            <ExerciseGif
                              src={exercise.gifUrl}
                              alt={exercise.nameFr}
                              className="w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Dumbbell className="size-8 text-muted-foreground/40" />
                            </div>
                          )}

                          {/* Selected overlay */}
                          {selected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="size-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="size-5 text-primary-foreground fill-none stroke-current stroke-2"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            </div>
                          )}

                          {/* Already added badge */}
                          {disabled && (
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                              <Badge variant="outline" className="text-xs">
                                Ajouté
                              </Badge>
                            </div>
                          )}

                          {/* Favorite heart */}
                          {isFav && !disabled && (
                            <div className="absolute top-1.5 right-1.5">
                              <Heart className="size-3.5 fill-rose-500 text-rose-500 drop-shadow" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-2">
                          <p className="text-xs font-semibold truncate leading-tight">
                            {exercise.nameFr}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {exercise.targetMuscle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {state.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2 border-t border-border/60 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {page} / {state.totalPages}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={page >= state.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {/* ── Right panel (desktop): selected exercises ── */}
          <div className="hidden md:flex flex-col w-64 shrink-0 border-l border-border/60">
            <div className="px-4 py-3 border-b border-border/60 shrink-0">
              <p className="text-sm font-semibold">
                Sélectionnés{" "}
                {selected.length > 0 && (
                  <span className="text-primary">({selected.length})</span>
                )}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {selected.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                  <Plus className="size-6 text-muted-foreground/40 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Clique sur un exercice pour le sélectionner
                  </p>
                </div>
              ) : (
                <ul className="p-3 space-y-1.5">
                  {selected.map((ex) => (
                    <li
                      key={ex.id}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {ex.nameFr}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {ex.targetMuscle}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSelected((prev) =>
                            prev.filter((e) => e.id !== ex.id),
                          )
                        }
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-3 border-t border-border/60 shrink-0">
              <Button
                type="button"
                className="w-full"
                disabled={selected.length === 0}
                onClick={handleConfirm}
              >
                Ajouter{selected.length > 0 ? ` (${selected.length})` : ""}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Mobile bottom bar ── */}
        {selected.length > 0 && (
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-t border-border/60 bg-background shrink-0">
            <p className="flex-1 text-sm font-medium">
              {selected.length} exercice{selected.length > 1 ? "s" : ""}{" "}
              sélectionné{selected.length > 1 ? "s" : ""}
            </p>
            <Button type="button" size="sm" onClick={handleConfirm}>
              Ajouter
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
