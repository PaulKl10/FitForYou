import { Skeleton } from "@/components/ui/skeleton";

export default function SessionDetailLoading() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Session info section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Add exercise button */}
      <Skeleton className="h-9 w-full rounded-lg" />

      {/* Exercise cards */}
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex gap-3">
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
