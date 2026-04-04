import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-36" />
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-border/60 bg-card">
        {/* Card header with avatar */}
        <div className="p-6 flex items-center gap-4">
          <Skeleton className="size-16 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>

        <div className="h-px bg-border/60" />

        {/* Profile fields */}
        <div className="p-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-36" />
            </div>
          ))}
        </div>
      </div>

      {/* Weight chart */}
      <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}
