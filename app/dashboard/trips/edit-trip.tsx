"use client";
import { useMutation, } from "@tanstack/react-query";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import { CreateTripInput } from "@/lib/validators/trip";
import { Field } from "./create-trip";
import { Trip, TripsResponse } from "./page";
import { queryClient } from "@/app/TanstackQueryProvider"
import { useSearchParams } from "next/navigation";

interface IProps {
    trip: Trip,
    open: boolean,
    onOpenChange: (val: boolean) => void
}


export function EditTripDialog({ trip, open, onOpenChange }: IProps) {
    const searchParams = useSearchParams()
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const state = searchParams.get("state") || "all"

    const mutation = useMutation({
        mutationFn: async (payload: CreateTripInput) => {
            try {
                const response = await axios.patch(`/api/trips/${trip.id}`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                return response.data;
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ??
                    "Failed to edit trip. Please try again.";

                throw new Error(message);
            }
        },
        onSuccess: (apiRes) => {

            queryClient.setQueryData(
                ["trips", page, limit, state],
                (oldData: TripsResponse["data"] | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        trips: oldData.trips.map(
                            (trip) => {
                                if (trip.id === apiRes.data.id) {
                                    return apiRes.data;
                                }

                                return trip;
                            }
                        ),
                        pagination: {
                            ...oldData.pagination,
                        },
                    };
                }
            );
        },
    });


    function handleOpenChange(next: boolean) {
        if (!next) {
            mutation.reset();
        }
        onOpenChange(next);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        mutation.mutate({
            name: String(formData.get("name")),
            slug: trip.slug,
            origin: String(formData.get("origin")),
            destination: String(formData.get("destination")),
            start_date: String(formData.get("start_date")),
            end_date: String(formData.get("end_date")),
            price: Number(formData.get("price")),
            total_seats: Number(formData.get("total_seats")),
            description: String(formData.get("description")),
            status: String(formData.get("status")) as "open" | "closed",
            thumbnail: String(formData.get("thumbnail"))
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer flex items-center gap-2">
                    <Plus className="size-4" />
                    <span>Add Trip</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Trip</DialogTitle>
                </DialogHeader>

                {mutation.isSuccess ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                        <CheckCircle2 className="size-12 text-green-500" />
                        <p className="text-lg font-semibold">Trip edited!</p>
                        <p className="text-sm text-muted-foreground">
                            Your new trip has been edited successfully.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 pt-1">

                        {mutation.isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="size-4" />
                                <AlertDescription>
                                    {(mutation.error as Error)?.message ?? "Something went wrong."}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Field label="Trip Name" htmlFor="name">
                            <Input
                                defaultValue={trip.name}
                                id="name"
                                name="name"
                                placeholder="e.g. Himalayan Adventure"
                                required
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Origin" htmlFor="origin">
                                <Input
                                    defaultValue={trip.origin}
                                    id="origin"
                                    name="origin"
                                    placeholder="e.g. Delhi"
                                    required
                                />
                            </Field>

                            <Field label="Destination" htmlFor="destination">
                                <Input
                                    defaultValue={trip.destination}
                                    id="destination"
                                    name="destination"
                                    placeholder="e.g. Manali"
                                    required
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Start Date" htmlFor="start_date">
                                <Input
                                    defaultValue={trip.start_date}
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    required
                                />
                            </Field>

                            <Field label="End Date" htmlFor="end_date">
                                <Input
                                    defaultValue={trip.end_date}
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    required
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Price (₹)" htmlFor="price">
                                <Input
                                    defaultValue={trip.price}
                                    id="price"
                                    name="price"
                                    type="number"
                                    min={1}
                                    placeholder="e.g. 4999"
                                    required
                                />
                            </Field>

                            <Field label="Total Seats" htmlFor="total_seats">
                                <Input
                                    defaultValue={trip.total_seats}
                                    id="total_seats"
                                    name="total_seats"
                                    type="number"
                                    min={1}
                                    placeholder="e.g. 20"
                                    required
                                />
                            </Field>
                        </div>

                        <Field label="Description" htmlFor="description">
                            <Textarea
                                defaultValue={trip.description}
                                id="description"
                                name="description"
                                placeholder="Describe the trip itinerary, highlights, and what's included…"
                                rows={3}
                                minLength={10}
                                required
                            />
                        </Field>

                        <Field label="Status" htmlFor="status">
                            <select
                                id="status"
                                name="status"
                                defaultValue={trip.status}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </Field>

                        <Field label="Thumbnail Url" htmlFor="thumbnail">
                            <Input
                                defaultValue={trip.thumbnail}
                                id="thumbnail"
                                name="thumbnail"
                                type="url"
                                placeholder="https://cdn.abc.com/image.webp"
                                required
                            />
                        </Field>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Editing..." : "Edit Trip"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}