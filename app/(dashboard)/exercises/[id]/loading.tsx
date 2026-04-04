import { Skeleton } from "@/components/ui/skeleton";

export default function ExerciseDetailLoading() {
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Back button */}
      <Skeleton className="h-8 w-28 rounded-lg" />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: GIF + meta */}
        <div className="space-y-6">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Right: info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="size-9 rounded-lg" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>

          {/* Muscles */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>

          {/* Progress chart */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
