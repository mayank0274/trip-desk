import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    CalendarDays,
    Clock,
    Users,
    MapPin,
    ArrowRight,
    ChevronLeft,
} from "lucide-react";
import { Trip } from "@/app/dashboard/trips/types";

type Props = {
    params: Promise<{ slug: string }>;
};

async function getTrip(slug: string): Promise<Trip> {
    try {
        const { data } = await axios.get<{ trip: Trip; message: string }>(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/trips/${slug}`,
            { headers: { "Content-Type": "application/json" } }
        );
        return data.trip;
    } catch {
        notFound();
    }
}

function formatDate(value: string, short = false) {
    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        ...(short ? {} : { year: "numeric" }),
    });
}

function getDuration(start: string, end: string) {
    const days = Math.round(
        (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000
    );
    return `${days} day${days !== 1 ? "s" : ""}`;
}

export default async function TripDetailPage({ params }: Props) {
    const { slug } = await params;
    const trip = await getTrip(slug);

    const isOpen = trip.status === "open";
    const duration = getDuration(trip.start_date, trip.end_date);
    const lowSeats = trip.total_seats <= 5;

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
                <Image
                    src={trip.thumbnail}
                    alt={trip.name}
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
                <div className="absolute left-5 top-5 md:left-10 md:top-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        All Trips
                    </Link>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 md:px-10 md:pb-10">
                    <div className="mx-auto max-w-6xl">
                        <Badge
                            className={
                                isOpen
                                    ? "mb-3 border-0 bg-emerald-500 text-white hover:bg-emerald-500"
                                    : "mb-3 border-0 bg-neutral-500 text-white hover:bg-neutral-500"
                            }
                        >
                            {isOpen ? "● Booking Open" : "● Closed"}
                        </Badge>
                        <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
                            {trip.name}
                        </h1>
                        <div className="mt-2 flex items-center gap-2 text-white/75">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span>{trip.origin}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                            <span>{trip.destination}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                {
                                    icon: CalendarDays,
                                    label: "Departure",
                                    value: formatDate(trip.start_date, true),
                                },
                                {
                                    icon: Clock,
                                    label: "Duration",
                                    value: duration,
                                },
                                {
                                    icon: Users,
                                    label: "Seats",
                                    value: `${trip.total_seats} left`,
                                },
                            ].map(({ icon: Icon, label, value }) => (
                                <div
                                    key={label}
                                    className="rounded-xl border bg-white p-4 shadow-sm"
                                >
                                    <div className="mb-1.5 flex items-center gap-1.5 text-muted-foreground">
                                        <Icon className="h-3.5 w-3.5" />
                                        <span className="text-xs font-medium uppercase tracking-wide">
                                            {label}
                                        </span>
                                    </div>
                                    <p className="font-semibold">{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl border bg-white p-5 shadow-sm">
                            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Route
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">From</p>
                                    <p className="mt-0.5 text-xl font-bold">{trip.origin}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDate(trip.start_date)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-px w-10 bg-border" />
                                        <div className="rounded-full bg-primary/10 p-1.5">
                                            <ArrowRight className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="h-px w-10 bg-border" />
                                    </div>
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        {duration}
                                    </p>
                                </div>

                                <div className="flex-1 text-right">
                                    <p className="text-xs text-muted-foreground">To</p>
                                    <p className="mt-0.5 text-xl font-bold">{trip.destination}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {formatDate(trip.end_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm md:p-8">
                            <h2 className="mb-4 text-xl font-semibold">About this Trip</h2>
                            <p className="whitespace-pre-line leading-8 text-muted-foreground">
                                {trip.description}
                            </p>
                        </div>
                    </div>
                    <div className="h-fit lg:sticky lg:top-8">
                        <div className="rounded-2xl border bg-white p-6 shadow-lg space-y-5">
                            <div>
                                <p className="text-sm text-muted-foreground">Price per person</p>
                                <p className="mt-1 text-4xl font-bold tracking-tight">
                                    ₹{trip.price.toLocaleString("en-IN")}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-3 text-sm">
                                {[
                                    { label: "Departure", value: formatDate(trip.start_date) },
                                    { label: "Return", value: formatDate(trip.end_date) },
                                    { label: "Duration", value: duration },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex justify-between">
                                        <span className="text-muted-foreground">{label}</span>
                                        <span className="font-medium">{value}</span>
                                    </div>
                                ))}

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Seats left</span>
                                    <span
                                        className={`font-semibold ${lowSeats ? "text-rose-500" : "text-emerald-600"
                                            }`}
                                    >
                                        {trip.total_seats} {lowSeats && "— hurry!"}
                                    </span>
                                </div>
                            </div>

                            <Separator />

                            <Button
                                size="lg"
                                disabled={!isOpen}
                                className="w-full text-base font-semibold"
                            >
                                {isOpen ? "Book this Trip" : "Booking Closed"}
                            </Button>

                            {isOpen && (
                                <p className="text-center text-xs text-muted-foreground">
                                    No payment charged yet — reserve your spot first.
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}