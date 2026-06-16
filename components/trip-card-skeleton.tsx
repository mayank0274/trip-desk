import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TripCardSkeleton() {
  return (
    <Card size="sm" className="overflow-hidden border-border/70 [--card-spacing:0]">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />

      <CardHeader className="gap-2 pb-0">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>

      <CardContent className="grid gap-4 pt-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border/60 bg-muted/40 p-3">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="mt-2 h-4 w-16" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3 border-t bg-muted/30 p-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
