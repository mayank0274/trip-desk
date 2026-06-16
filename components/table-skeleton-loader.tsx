import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

interface SkeletonTableProps {
    rows?: number;
}

export function SkeletonTable({
    rows = 10,
}: SkeletonTableProps) {
    return (
        <Table>
            <TableBody>
                {Array.from({ length: rows }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-5 w-40" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-5 w-32" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-5 w-48" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-5 w-20" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-5 w-10" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>

                        <TableCell>
                            <Skeleton className="h-9 w-16 rounded-md" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}