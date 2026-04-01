"use client";

import { Heart } from "lucide-react";
import { FilterSearchInput } from "@/components/ui/filter-search-input";
import { FilterMultiSelect } from "@/components/ui/filter-multi-select";
import { ExercisesPagination } from "@/features/exercises/components/ExercisesPagination";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";

type ExercisesFiltersProps = {
  allMuscles: string[];
  allEquipments: string[];
  currentPage: number;
  totalPages: number;
};

export function ExercisesFilters({
  allMuscles,
  allEquipments,
  currentPage,
  totalPages,
}: ExercisesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const muscleFromUrl = searchParams.getAll("muscle");
  const equipmentFromUrl = searchParams.getAll("equipment");
  const favoritesOnlyFromUrl = searchParams.get("favoritesOnly") === "true";

  const [muscle, setOptimisticMuscle] = useOptimistic(muscleFromUrl);
  const [equipment, setOptimisticEquipment] = useOptimistic(equipmentFromUrl);
  const [favoritesOnly, setOptimisticFavoritesOnly] =
    useOptimistic(favoritesOnlyFromUrl);

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const deferredQ = useDeferredValue(q);

  const replaceURL = useCallback(
    (next: URLSearchParams) => {
      const nextQuery = next.toString();
      if (nextQuery !== searchParams.toString()) {
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
          scroll: false,
        });
      }
    },
    [searchParams, pathname, router],
  );

  const handleMuscleChange = useCallback(
    (values: string[]) => {
      startTransition(() => {
        setOptimisticMuscle(values);
        const next = new URLSearchParams(searchParams.toString());
        next.delete("muscle");
        for (const v of values) next.append("muscle", v);
        next.delete("page");
        replaceURL(next);
      });
    },
    [searchParams, replaceURL, setOptimisticMuscle],
  );

  const handleEquipmentChange = useCallback(
    (values: string[]) => {
      startTransition(() => {
        setOptimisticEquipment(values);
        const next = new URLSearchParams(searchParams.toString());
        next.delete("equipment");
        for (const v of values) next.append("equipment", v);
        next.delete("page");
        replaceURL(next);
      });
    },
    [searchParams, replaceURL, setOptimisticEquipment],
  );

  const handleFavoritesToggle = useCallback(() => {
    const nextValue = !favoritesOnlyFromUrl;
    startTransition(() => {
      setOptimisticFavoritesOnly(nextValue);
      const next = new URLSearchParams(searchParams.toString());
      if (nextValue) next.set("favoritesOnly", "true");
      else next.delete("favoritesOnly");
      next.delete("page");
      replaceURL(next);
    });
  }, [
    searchParams,
    favoritesOnlyFromUrl,
    replaceURL,
    setOptimisticFavoritesOnly,
  ]);

  const createPageHref = (page: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    const query = next.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  useEffect(() => {
    const normalizedQ = deferredQ.trim();
    const currentQ = searchParams.get("q") ?? "";
    if (normalizedQ === currentQ) return;
    const next = new URLSearchParams(searchParams.toString());
    if (normalizedQ) next.set("q", normalizedQ);
    else next.delete("q");
    next.delete("page");
    replaceURL(next);
  }, [deferredQ, searchParams, replaceURL]);

  return (
    <div className="sticky top-14 z-30 flex flex-wrap justify-between gap-2 bg-background py-2">
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
              onChange={handleMuscleChange}
            />
          </div>
          <div className="flex-1">
            <FilterMultiSelect
              value={equipment}
              placeholder="Tout l'équipement"
              options={allEquipments.map((eq) => ({ value: eq, label: eq }))}
              onChange={handleEquipmentChange}
            />
          </div>
          <button
            type="button"
            onClick={handleFavoritesToggle}
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
