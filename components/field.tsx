import { Label } from "./ui/label";

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