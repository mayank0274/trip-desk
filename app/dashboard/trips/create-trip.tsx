"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import { CreateTripInput } from "@/lib/validators/trip";
import slugify from "slugify";
import { useSearchParams } from "next/navigation";
import { TripsResponse } from "./page";
import { queryClient } from "@/app/TanstackQueryProvider";

export function Field({
    label,
    htmlFor,
    children,
}: {
    label: string;
    htmlFor: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor={htmlFor} className="text-sm font-medium">
                {label}
            </Label>
            {children}
        </div>
    );
}

export function CreateTripDialog() {
    const searchParams = useSearchParams()
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const state = searchParams.get("state") || "all"
    const [open, setOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: async (payload: CreateTripInput) => {
            try {
                const response = await axios.post("/api/admin/trips", payload, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                return response.data;
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ??
                    "Failed to create trip. Please try again.";

                throw new Error(message);
            }
        },
        onSuccess: (apiRes) => {
            queryClient.setQueryData(
                ["trips", page, limit, state],
                (oldData: TripsResponse["data"] | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        trips: [apiRes.data, ...oldData.trips],
                        pagination: {
                            ...oldData.pagination,
                            total: oldData.pagination.total + 1
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
        setOpen(next);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        mutation.mutate({
            name: String(formData.get("name")),
            slug: slugify(String(formData.get("name")), {
                lower: true,
                strict: true,
            }),
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
                    <DialogTitle>Create Trip</DialogTitle>
                </DialogHeader>

                {mutation.isSuccess ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                        <CheckCircle2 className="size-12 text-green-500" />
                        <p className="text-lg font-semibold">Trip created!</p>
                        <p className="text-sm text-muted-foreground">
                            Your new trip has been added successfully.
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
                                id="name"
                                name="name"
                                placeholder="e.g. Himalayan Adventure"
                                required
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Origin" htmlFor="origin">
                                <Input
                                    id="origin"
                                    name="origin"
                                    placeholder="e.g. Delhi"
                                    required
                                />
                            </Field>

                            <Field label="Destination" htmlFor="destination">
                                <Input
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
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    required
                                />
                            </Field>

                            <Field label="End Date" htmlFor="end_date">
                                <Input
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
                                defaultValue="open"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </Field>

                        <Field label="Thumbnail Url" htmlFor="thumbnail">
                            <Input
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
                            {mutation.isPending ? "Creating…" : "Create Trip"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}