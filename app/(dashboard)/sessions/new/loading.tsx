import { Skeleton } from "@/components/ui/skeleton";

export default function NewSessionLoading() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-48" />
      </div>

      {/* Form fields */}
      <div className="rounded-xl border border-border/60 bg-card p-6 space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Exercises section */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>

      {/* Submit button */}
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}
