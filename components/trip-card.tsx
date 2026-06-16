"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Trip } from "@/app/dashboard/trips/types"
import { Calendar1Icon } from "lucide-react"

type TripCardProps = {
  trip: Trip
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })
}

export function TripCard({ trip }: TripCardProps) {
  const isOpen = trip.status === "open"

  return (
    <Link href={`/trip/${trip.slug}`} className="block h-full">
      <Card className="group h-full overflow-hidden border border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl [--card-spacing:0]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={trip.thumbnail || "/placeholder-trip.jpg"}
            alt={trip.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={isOpen ? "default" : "secondary"}>
              {trip.total_seats} seats
            </Badge>
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="line-clamp-2 text-lg font-semibold text-white">
              {trip.name}
            </h3>

            <p className="text-xs text-white/80">
              {trip.origin} → {trip.destination}
            </p>
          </div>
        </div>

        <div className="space-y-2 p-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex gap-1 items-center">
              <Calendar1Icon className="w-3 h-3" />
              <span>
                {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
              </span>
            </div>

            <span className="font-medium text-foreground">
              ₹{trip.price.toLocaleString()}
            </span>
          </div>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {trip.description}
          </p>
        </div>
      </Card>
    </Link>
  )
}