import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
                <Skeleton className="absolute inset-0 h-full w-full" />
                <div className="absolute left-5 top-5 md:left-10 md:top-8">
                    <Skeleton className="h-9 w-28 rounded-full" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 md:px-10 md:pb-10">
                    <div className="mx-auto max-w-6xl space-y-3">
                        <Skeleton className="h-6 w-32 rounded-full" />
                        <Skeleton className="h-10 w-2/3" />
                        <Skeleton className="h-5 w-1/3" />
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border bg-white p-4 shadow-sm space-y-3"
                                >
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl border bg-white p-5 shadow-sm space-y-5">
                            <Skeleton className="h-4 w-20" />

                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-3 w-10" />
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>

                                <div className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-3 w-12" />
                                </div>

                                <div className="space-y-2 flex-1 text-right">
                                    <Skeleton className="h-3 w-10 ml-auto" />
                                    <Skeleton className="h-6 w-32 ml-auto" />
                                    <Skeleton className="h-3 w-24 ml-auto" />
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-11/12" />
                                <Skeleton className="h-4 w-10/12" />
                                <Skeleton className="h-4 w-9/12" />
                            </div>
                        </div>
                    </div>
                    <div className="h-fit lg:sticky lg:top-8">
                        <div className="rounded-2xl border bg-white p-6 shadow-lg space-y-5">

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-40" />
                            </div>

                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </div>

                            <Skeleton className="h-12 w-full rounded-xl" />

                            <Skeleton className="h-3 w-48 mx-auto" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}