import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TripCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border border-border/70 bg-card shadow-sm [--card-spacing:0]">
      <div className="relative aspect-16/10 overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />

        <div className="absolute left-3 top-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <div className="absolute bottom-3 left-3 right-3 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </Card>
  );
}