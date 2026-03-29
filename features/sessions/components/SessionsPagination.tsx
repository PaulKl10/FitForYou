"use client";

import { ExercisesPagination } from "@/features/exercises/components/ExercisesPagination";

interface SessionsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function SessionsPagination({ currentPage, totalPages }: SessionsPaginationProps) {
  return (
    <ExercisesPagination
      currentPage={currentPage}
      totalPages={totalPages}
      createPageHref={(page) => `/sessions?page=${page}`}
    />
  );
}
