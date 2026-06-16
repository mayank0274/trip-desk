"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { TripCard } from "@/components/trip-card"
import { TripCardSkeleton } from "@/components/trip-card-skeleton"
import type { TripsResponse } from "@/app/dashboard/trips/types"

const DEFAULT_LIMIT = 12

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || DEFAULT_LIMIT)

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["public-trips", page, limit],
    queryFn: async () => {
      const response = await axios.get<TripsResponse>(
        `/api/trips?page=${page}&limit=${limit}`
      )
      return response.data.data
    },
  })

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(newPage))
    params.set("limit", String(limit))
    router.push(`${pathname}?${params.toString()}`)
  }

  if (isPending) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 w-56 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <TripCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {(error as Error).message}
          </div>
        </div>
      </main>
    )
  }

  const { trips, pagination } = data ?? { trips: [], pagination: null }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Discover Trips
          </h1>

          <p className="mt-2 text-muted-foreground">
            Explore upcoming trips and find your next adventure.
          </p>
        </section>

        {trips.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </section>
        ) : (
          <section className="py-16 text-center">
            <h2 className="text-xl font-semibold">
              No trips available
            </h2>

            <p className="mt-2 text-muted-foreground">
              Check back later for new trips.
            </p>
          </section>
        )}

        {pagination && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrevious}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              disabled={!pagination.hasNext}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}