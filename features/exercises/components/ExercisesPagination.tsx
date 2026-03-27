"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Fragment, useMemo } from "react";

type ExercisesPaginationProps = {
  currentPage: number;
  totalPages: number;
  createPageHref: (page: number) => string;
};

export function ExercisesPagination({
  currentPage,
  totalPages,
  createPageHref,
}: ExercisesPaginationProps) {
  const pageItems = useMemo(() => {
    if (totalPages <= 1) return [];
    const items = new Set<number>([
      1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      totalPages,
    ]);
    return [...items]
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageHref(Math.max(1, currentPage - 1))}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageItems.map((page, index) => {
          const prev = pageItems[index - 1];
          const hasGap = prev !== undefined && page - prev > 1;

          return (
            <Fragment key={page}>
              {hasGap && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href={createPageHref(page)} isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            </Fragment>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={createPageHref(Math.min(totalPages, currentPage + 1))}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
