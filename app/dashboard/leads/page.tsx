"use client"

import { Suspense, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { SkeletonTable } from "@/components/table-skeleton-loader"
import { queryClient } from "@/app/TanstackQueryProvider"
import { EditLead, LeadWithTrip, LeadsResponse } from "./types"
import { LEAD_STATUS_OPTIONS } from "./constants"
import { LeadStatus } from "@/types/leads"
import Link from "next/link"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { AssignableTeamMembersResponse } from "./types"
import { CreateLeadTouchpointDialog } from "./lead-touchpoint-form"
import { LeadDetailsSheet } from "./lead-details"
import { Input } from "@/components/ui/input"
import { debounce } from "@/lib/utils"
import { toast } from "sonner"

function Leads() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const status = searchParams.get("status") || "all"
    const owner = searchParams.get("owner") || "all"
    const search = searchParams.get("search") || ""

    const [selectedLead, setSelectedLead] = useState<LeadWithTrip | null>(null);
    const mode = useRef<"edit" | "view" | null>(null);

    const { data, isPending, isError, error } = useQuery({
        queryKey: ["leads", page, limit, status, owner, search],
        queryFn: async () => {
            try {
                let url = `/api/admin/leads?page=${page}&limit=${limit}`
                if (status !== "all") url += `&status=${status}`
                if (owner !== "all") url += `&owner=${owner}`
                if (search !== "") url += `&search=${search}`
                const response = await axios.get<LeadsResponse>(url)
                return response.data.data
            } catch (error: any) {
                throw new Error(
                    error?.response?.data?.message ?? "Failed to fetch leads"
                )
            }
        },
    })

    const { data: assignableData, isError: isAssignableError, isPending: isAssignablePending } =
        useQuery({
            queryKey: ["assignable-team"],
            queryFn: async () => {
                try {
                    const res = await axios.get<AssignableTeamMembersResponse>(
                        `/api/admin/teams/assignable`
                    )
                    return res.data.team
                } catch (error: any) {
                    throw new Error(
                        error?.response?.data?.message ?? "Failed to fetch assignable team"
                    )
                }
            },
        })

    const setPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        params.set("limit", String(limit))
        router.push(`${pathname}?${params.toString()}`)
    }

    const updateSearch = debounce((value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value.trim()) {
            params.set("search", value);
        } else {
            params.delete("search");
        }

        router.replace(`?${params.toString()}`);
    }, 500);

    const leadToEdit = useRef<string | null>(null)

    const { mutateAsync: editLead, isPending: isEditing } = useMutation({
        mutationFn: async ({ lead, leadId }: { lead: EditLead; leadId: string }) => {
            try {
                const response = await axios.patch(`/api/admin/leads/${leadId}`, lead, {
                    headers: { "Content-Type": "application/json" },
                })
                return response.data
            } catch (error: any) {
                throw new Error(
                    error?.response?.data?.message ?? "Failed to edit lead. Please try again."
                )
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (apiRes) => {
            leadToEdit.current = null
            queryClient.setQueryData(
                ["leads", page, limit, status, owner, search],
                (oldData: LeadsResponse["data"] | undefined) => {
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        leads: oldData.leads.map((lead) =>
                            lead.id === apiRes.data.id ? { ...apiRes.data, trip_id: lead.trip_id } : lead
                        ),
                        pagination: { ...oldData.pagination },
                    }
                }
            )
        },
    })

    const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
        leadToEdit.current = leadId
        await editLead({ lead: { status: newStatus }, leadId })
    }

    const handleOwnerChange = async (leadId: string, newOwnerId: string) => {
        leadToEdit.current = leadId
        await editLead({
            lead: { owner_id: newOwnerId === "unassigned" ? null : newOwnerId },
            leadId,
        })
    }

    if (isPending) return <SkeletonTable rows={10} />

    if (isError) return <div className="text-red-500">{(error as Error).message}</div>

    const { leads, pagination, role } = data ?? { leads: [], pagination: null, role: "admin" }

    return (
        <div className="flex flex-col gap-6 md:w-[97%] w-full min-w-0">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <h1 className="text-3xl font-semibold">Leads</h1>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Search
                        </label>
                        <Input
                            className="w-full sm:w-72"
                            defaultValue={search}
                            type="search"
                            placeholder="Name, email or phone"
                            onChange={(e) => updateSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Status
                        </label>
                        <Select
                            value={status}
                            onValueChange={(value) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("status", value);
                                router.push(`${pathname}?${params.toString()}`);
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {LEAD_STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                            Owner
                        </label>
                        <Select
                            defaultValue={owner}
                            onValueChange={(value) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("owner", value);
                                router.push(`${pathname}?${params.toString()}`);
                            }}
                        >
                            <SelectTrigger
                                className="w-full sm:w-48"
                                disabled={isAssignablePending || role != "admin"}
                            >
                                <SelectValue placeholder="Assign owner" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {assignableData?.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.full_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border overflow-x-auto">
                <Table className="w-full text-sm">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-32.5">Traveller</TableHead>
                            <TableHead className="min-w-35">Trip</TableHead>
                            {role === "admin" && <TableHead className="min-w-40">Owner</TableHead>}
                            <TableHead className="min-w-37.5">Status</TableHead>
                            <TableHead className="min-w-25">Created</TableHead>
                            <TableHead className="min-w-25">Last contact at</TableHead>
                            <TableHead className="min-w-25">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {leads.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={10}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No leads found
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="font-medium whitespace-nowrap">
                                        {lead.name} - {lead.phone}
                                    </TableCell>

                                    <TableCell className="max-w-35">
                                        {lead.trip_id ? (
                                            <Link
                                                href={`/trip/${lead.trip_id.slug}`}
                                                target="_blank"
                                                className="block truncate font-medium text-primary hover:underline"
                                            >
                                                {lead.trip_id.name}
                                            </Link>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>

                                    {role === "admin" && <TableCell>
                                        <Select
                                            defaultValue={lead.owner_id ?? "unassigned"}
                                            onValueChange={(value) => handleOwnerChange(lead.id, value)}
                                        >
                                            <SelectTrigger
                                                size="sm"
                                                className="w-40"
                                                disabled={
                                                    (isEditing && leadToEdit.current === lead.id) ||
                                                    isAssignablePending || isAssignableError
                                                }
                                            >
                                                <SelectValue placeholder="Assign owner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                                {assignableData?.map(
                                                    (m: { id: string; full_name: string }) => (
                                                        <SelectItem key={m.id} value={m.id}>
                                                            {m.full_name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>}

                                    <TableCell>
                                        <Select
                                            value={lead.status}
                                            onValueChange={(value) =>
                                                handleStatusChange(lead.id, value as LeadStatus)
                                            }
                                            disabled={isEditing && leadToEdit.current === lead.id}
                                        >
                                            <SelectTrigger className="h-9 w-36">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LEAD_STATUS_OPTIONS.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {new Date(lead.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </TableCell>

                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {new Date(`${lead.updated_at}Z`).toLocaleString("en-IN", {
                                            timeZone: "Asia/Kolkata",
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </TableCell>

                                    <TableCell className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                mode.current = "edit";
                                                setSelectedLead(lead);
                                            }}
                                        >
                                            Add Lead Toucpoints
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                mode.current = "view";
                                                setSelectedLead(lead);
                                            }}
                                        >
                                            See Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
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

            {
                selectedLead && mode.current === "edit" && <CreateLeadTouchpointDialog userId={selectedLead.owner_id!} leadId={selectedLead.id} open={!!selectedLead} onOpenChange={(next: boolean) => {
                    if (!next) {
                        setSelectedLead(null);
                        mode.current = null;
                    }
                }} />
            }

            {
                selectedLead && mode.current === "view" && <LeadDetailsSheet lead={selectedLead} open={!!selectedLead} onOpenChange={(open) => {
                    if (!open) {
                        setSelectedLead(null);
                        mode.current = null;
                    }
                }} />
            }
        </div>
    )
}

export default function LeadsPage() {
    return <Suspense fallback={<SkeletonTable />}><Leads /></Suspense>
}
