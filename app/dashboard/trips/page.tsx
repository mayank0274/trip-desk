"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExternalLink, Loader2, Pencil, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CreateTripDialog } from "@/app/dashboard/trips/create-trip"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { SkeletonTable } from "@/components/table-skeleton-loader"
import { queryClient } from "@/app/TanstackQueryProvider"
import { EditTripDialog } from "./edit-trip"
import Image from "next/image"
import Link from "next/link"
import { Trip, TripsResponse } from "@/types/trips"


export default function TripsPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const state = searchParams.get("state") || "all"

    const tripIdToDelete = useRef<string | null>(null);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["trips", page, limit, state],
        queryFn: async () => {
            try {
                const response = await axios.get<TripsResponse>(
                    `/api/admin/trips?page=${page}&limit=${limit}&state=${state}`
                )
                return response.data.data
            } catch (error: any) {
                throw new Error(
                    error?.response?.data?.message ??
                    "Failed to fetch trips"
                )
            }
        }
    })

    const setPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        params.set("limit", String(limit))
        router.push(`${pathname}?${params.toString()}`)
    }

    // delete mutation
    const { mutateAsync: deleteTrip, isPending: isRemoving } = useMutation({
        mutationFn: async (tripId: string) => {
            try {
                const response = await axios.delete(
                    `/api/admin/trips/${tripId}`
                )
                return response.data.data
            } catch (error: any) {
                throw new Error(
                    error?.response?.data?.message ??
                    "Failed to delete trip"
                )
            }
        },
        onError: (error) => {
            alert(error.message)
        },
        onSuccess: (_, tripId) => {
            tripIdToDelete.current = null;
            queryClient.setQueryData(
                ["trips", page, limit, state],
                (oldData: TripsResponse["data"] | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        trips: oldData.trips.filter(
                            (trip) => trip.id !== tripId
                        ),
                        pagination: {
                            ...oldData.pagination,
                            total: oldData.pagination.total - 1,
                        },
                    };
                }
            );
        },
    })

    if (isPending) {
        return <SkeletonTable rows={10} />
    }

    if (isError) {
        return (
            <div className="text-red-500">
                {(error as Error).message}
            </div>
        )
    }

    const { trips, pagination } = data ?? { trips: [], pagination: null }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Trips</h1>
                <CreateTripDialog />
            </div>

            <div className="rounded-xl border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Trip</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Seats</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {trips.map((trip) => (
                            <TableRow key={trip.slug}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-14 w-14 overflow-hidden rounded border bg-muted shrink-0">
                                            <Image
                                                src={trip.thumbnail || "/placeholder-trip.jpg"}
                                                alt={trip.name}
                                                fill
                                                className="object-cover"
                                                loading="lazy"
                                            />
                                        </div>

                                        <Link
                                            href={`/trip/${trip.slug}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline transition-colors"
                                        >
                                            <span>{trip.name}</span>
                                            <ExternalLink className="size-3.5" />
                                        </Link>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {trip.origin} → {trip.destination}
                                </TableCell>
                                <TableCell>
                                    {new Date(trip.start_date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                    {" - "}
                                    {new Date(trip.end_date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell>
                                    ₹ {trip.price.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {trip.total_seats}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={trip.status === "open" ? "default" : "secondary"}>
                                        {trip.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="align-middle">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedTrip(trip)}
                                        >
                                            <Pencil className="size-3" />
                                            Edit
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={isRemoving}
                                            onClick={async () => {
                                                tripIdToDelete.current = trip.id;
                                                await deleteTrip(trip.id);
                                            }}
                                        >
                                            {isRemoving && trip.id === tripIdToDelete.current ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Trash2 className="size-3" />
                                                    Delete
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={!pagination.hasPrevious}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </Button>

                        <Button
                            variant="outline"
                            disabled={!pagination.hasNext}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {selectedTrip && (
                <EditTripDialog
                    trip={selectedTrip}
                    open={!!selectedTrip}
                    onOpenChange={(open) => {
                        if (!open) setSelectedTrip(null);
                    }}
                />
            )}
        </div>
    )
}