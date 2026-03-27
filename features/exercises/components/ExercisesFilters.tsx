"use client";

import { FilterSearchInput } from "@/components/ui/filter-search-input";
import { FilterMultiSelect } from "@/components/ui/filter-multi-select";
import { ExercisesPagination } from "@/features/exercises/components/ExercisesPagination";
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
  const [debouncedQ, setDebouncedQ] = useState(filters.q ?? "");
  const hasMounted = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q);
    }, 300);

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

    if (normalizedQ) next.set("q", normalizedQ);
    else next.delete("q");

    next.delete("muscle");
    for (const value of muscle) {
      next.append("muscle", value);
    }

    next.delete("equipment");
    for (const value of equipment) {
      next.append("equipment", value);
    }

    const filtersChanged =
      normalizedQ !== currentQ ||
      muscle.join("||") !== currentMuscles.join("||") ||
      equipment.join("||") !== currentEquipments.join("||");

    // Reset pagination only when filters changed, not when navigating pages.
    if (filtersChanged) {
      next.delete("page");
    }

    const currentQuery = searchParams.toString();
    const nextQuery = next.toString();

    if (nextQuery !== currentQuery) {
      const url = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(url, { scroll: false });
    }
  }, [debouncedQ, muscle, equipment, pathname, router, searchParams]);

  const createPageHref = (page: number) => {
    const next = new URLSearchParams(searchParams.toString());
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    const query = next.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2">
      <div className="flex flex-col md:flex-row gap-2">
        <FilterSearchInput
          name="q"
          placeholder="Rechercher un exercice..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="flex justify-between w-full md:w-fit gap-2">
          <div className="flex-1">
            <FilterMultiSelect
              value={muscle}
              placeholder="Tous les muscles"
              options={allMuscles.map((targetMuscle) => ({
                value: targetMuscle,
                label: targetMuscle,
              }))}
              onChange={setMuscle}
            />
          </div>
          <div className="flex-1">
            <FilterMultiSelect
              value={equipment}
              placeholder="Tout l'équipement"
              options={allEquipments.map((eq) => ({
                value: eq,
                label: eq,
              }))}
              onChange={setEquipment}
            />
          </div>
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
