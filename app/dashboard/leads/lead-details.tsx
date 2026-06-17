"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Calendar,
    Mail,
    Phone,
    Plane,
    Users,
    MessageSquare,
} from "lucide-react";

import { LeadWithTrip, LeadTouchPointsResponse } from "./types";

interface Props {
    lead: LeadWithTrip | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LeadDetailsSheet({
    lead,
    open,
    onOpenChange,
}: Props) {
    const { data, isLoading, error } = useQuery<LeadTouchPointsResponse>({
        queryKey: ["lead-touchpoints", lead?.id],
        enabled: !!lead?.id && open,
        queryFn: async () => {
            try {
                const response = await axios.get(
                    `/api/admin/leads/${lead!.id}/touchpoints`
                );

                return response.data.data;
            } catch (err: any) {
                throw new Error(
                    err?.response?.data?.message ?? "Failed to fetch call logs"
                )
            }
        },
    });

    if (error) {
        return <p className="text-red-500">{error.message}</p>
    }

    if (!lead) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-175 sm:max-w-175 overflow-y-auto p-0">
                <div className="p-6">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-xl">
                            {lead.name}
                        </SheetTitle>

                        <SheetDescription>
                            Lead Details & Activity Timeline
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                        <Card>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">
                                        Lead Information
                                    </h3>

                                    <Badge
                                        variant={"default"}
                                        className="capitalize"
                                    >
                                        {lead.status}
                                    </Badge>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="size-4 text-muted-foreground" />
                                        <span>{lead.phone}</span>
                                    </div>

                                    {lead.email && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="size-4 text-muted-foreground" />
                                            <span>{lead.email}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="size-4 text-muted-foreground" />
                                        <span className="capitalize">
                                            {lead.group_type}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="size-4 text-muted-foreground" />
                                        <span>
                                            Preferred Month:{" "}
                                            {new Date(
                                                lead.preferred_month
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {lead.trip_id && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Plane className="size-4 text-muted-foreground" />
                                            <span>
                                                {lead.trip_id.name}
                                            </span>
                                        </div>
                                    )}

                                    {lead.enquirer_note && (
                                        <>
                                            <Separator />

                                            <div>
                                                <p className="text-xs text-muted-foreground mb-2">
                                                    Enquiry Note
                                                </p>

                                                <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                                                    {lead.enquirer_note}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div>
                            <h3 className="font-semibold mb-5">
                                Touchpoint Timeline
                            </h3>

                            {isLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-28 w-full" />
                                    <Skeleton className="h-28 w-full" />
                                </div>
                            ) : !data?.touchpoints.length ? (
                                <Card>
                                    <CardContent className="p-8 text-center text-sm text-muted-foreground">
                                        No touchpoints added yet.
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="relative pl-8">
                                    <div className="absolute left-[10px] top-0 bottom-0 w-px bg-border" />

                                    {data.touchpoints.map((touchpoint) => (
                                        <div
                                            key={touchpoint.id}
                                            className="relative mb-6"
                                        >
                                            <div className="absolute -left-[30px] top-6 h-5 w-5 rounded-full border-4 border-background bg-primary shadow-sm" />

                                            <Card className="shadow-sm">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <Badge
                                                            variant="secondary"
                                                            className="capitalize"
                                                        >
                                                            {
                                                                touchpoint.contact_via
                                                            }
                                                        </Badge>

                                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {new Date(`${touchpoint.created_at}Z`).toLocaleString("en-IN", {
                                                                timeZone: "Asia/Kolkata",
                                                                dateStyle: "medium",
                                                                timeStyle: "short",
                                                            })}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 flex gap-3">
                                                        <MessageSquare className="size-4 mt-0.5 text-muted-foreground shrink-0" />

                                                        <p className="text-sm leading-relaxed">
                                                            {
                                                                touchpoint.note
                                                            }
                                                        </p>
                                                    </div>

                                                    {touchpoint.next_action && (
                                                        <div className="mt-4 rounded-xl bg-muted p-4">
                                                            <p className="text-xs font-medium text-muted-foreground mb-1">
                                                                Next Action
                                                            </p>

                                                            <p className="text-sm">
                                                                {
                                                                    touchpoint.next_action
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}