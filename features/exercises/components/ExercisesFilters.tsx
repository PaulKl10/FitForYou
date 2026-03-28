"use client";

import { Heart } from "lucide-react";
import { FilterSearchInput } from "@/components/ui/filter-search-input";
import { FilterMultiSelect } from "@/components/ui/filter-multi-select";
import { ExercisesPagination } from "@/features/exercises/components/ExercisesPagination";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ExercisesFiltersProps = {
  allMuscles: string[];
  allEquipments: string[];
  currentPage: number;
  totalPages: number;
  filters: {
    q?: string;
    muscle?: string[];
    equipment?: string[];
    page?: number;
    favoritesOnly?: boolean;
  };
};

export function ExercisesFilters({
  allMuscles,
  allEquipments,
  currentPage,
  totalPages,
  filters,
}: ExercisesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(filters.q ?? "");
  const [muscle, setMuscle] = useState<string[]>(filters.muscle ?? []);
  const [equipment, setEquipment] = useState<string[]>(filters.equipment ?? []);
  const [favoritesOnly, setFavoritesOnly] = useState(filters.favoritesOnly ?? false);
  const [debouncedQ, setDebouncedQ] = useState(filters.q ?? "");
  const hasMounted = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(q), 300);
    return () => window.clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const next = new URLSearchParams(searchParams.toString());
    const normalizedQ = debouncedQ.trim();
    const currentQ = searchParams.get("q") ?? "";
    const currentMuscles = searchParams.getAll("muscle");
    const currentEquipments = searchParams.getAll("equipment");
    const currentFavoritesOnly = searchParams.get("favoritesOnly") === "true";

    if (normalizedQ) next.set("q", normalizedQ);
    else next.delete("q");

    next.delete("muscle");
    for (const value of muscle) next.append("muscle", value);

    next.delete("equipment");
    for (const value of equipment) next.append("equipment", value);

    if (favoritesOnly) next.set("favoritesOnly", "true");
    else next.delete("favoritesOnly");

    const filtersChanged =
      normalizedQ !== currentQ ||
      muscle.join("||") !== currentMuscles.join("||") ||
      equipment.join("||") !== currentEquipments.join("||") ||
      favoritesOnly !== currentFavoritesOnly;

    if (filtersChanged) next.delete("page");

    const nextQuery = next.toString();
    if (nextQuery !== searchParams.toString()) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [debouncedQ, muscle, equipment, favoritesOnly, pathname, router, searchParams]);

  const createPageHref = (page: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    const query = next.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <div className="flex justify-between gap-2 sticky top-0 bg-background z-50 py-2 flex-wrap">
      <div className="flex flex-col md:flex-row gap-2">
        <FilterSearchInput
          name="q"
          placeholder="Rechercher un exercice..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex justify-between w-full md:w-fit gap-2 flex-wrap">
          <div className="flex-1">
            <FilterMultiSelect
              value={muscle}
              placeholder="Tous les muscles"
              options={allMuscles.map((m) => ({ value: m, label: m }))}
              onChange={setMuscle}
            />
          </div>
          <div className="flex-1">
            <FilterMultiSelect
              value={equipment}
              placeholder="Tout l'équipement"
              options={allEquipments.map((eq) => ({ value: eq, label: eq }))}
              onChange={setEquipment}
            />
          </div>
          <button
            type="button"
            onClick={() => setFavoritesOnly((prev) => !prev)}
            aria-label="Voir mes favoris"
            aria-pressed={favoritesOnly}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              favoritesOnly
                ? "border-red-500/40 bg-red-500/10 text-red-500"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            <Heart className={cn("size-4", favoritesOnly && "fill-red-500")} />
            Favoris
          </button>
        </div>
      </div>
      <ExercisesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageHref={createPageHref}
      />
    </div>
  );
}
