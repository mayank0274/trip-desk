"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

import { GROUP_TYPE_OPTIONS, GroupType } from "./constants";
import { CreateLeadInput } from "@/lib/validators/leads";
import { Field } from "@/components/field";


type Props = {
    tripId: string;
};

export function LeadForm({ tripId }: Props) {
    const mutation = useMutation({
        mutationFn: async (payload: CreateLeadInput) => {
            try {
                const response = await axios.post("/api/leads", payload, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                return response.data;
            } catch (error: any) {
                const message =
                    error?.response?.data?.message ??
                    "Failed to post enquiry. Please try again.";

                throw new Error(message);
            }
        },

    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        mutation.mutate({
            trip_id: tripId,
            name: String(formData.get("name")),
            phone: String(formData.get("phone")),
            email: String(formData.get("email")),
            group_type: String(formData.get("group_type")) as GroupType,
            preferred_month: String(formData.get("preferred_month")),
            enquirer_note: String(formData.get("enquirer_note")),
        });
    }

    if (mutation.isSuccess) {
        return (
            <div className="rounded-2xl border bg-white p-8 text-center">
                <CheckCircle2 className="mx-auto mb-4 size-12 text-green-500" />
                <h3 className="text-lg font-semibold">
                    Enquiry submitted
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    We'll get in touch shortly.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold">
                Interested in this trip?
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {mutation.isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                            {(mutation.error as Error)?.message ?? "Something went wrong."}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name" htmlFor="name">
                        <Input
                            id="name"
                            name="name"
                            required
                        />
                    </Field>

                    <Field label="Phone" htmlFor="phone">
                        <Input
                            id="phone"
                            name="phone"
                            required
                        />
                    </Field>
                </div>

                <Field label="Email" htmlFor="email">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                    />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field
                        label="Group Type"
                        htmlFor="group_type"
                    >
                        <select
                            id="group_type"
                            name="group_type"
                            required
                            className="w-full rounded-md border px-3 py-1"
                        >
                            {GROUP_TYPE_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field
                        label="Preferred Month"
                        htmlFor="preferred_month"
                    >
                        <Input
                            id="preferred_month"
                            name="preferred_month"
                            type="date"
                            required
                        />
                    </Field>
                </div>

                <Field
                    label="What are you hoping this trip feels like?"
                    htmlFor="enquirer_note"
                >
                    <Textarea
                        id="enquirer_note"
                        name="enquirer_note"
                        rows={5}
                        placeholder="Relaxed, adventurous, social, offbeat, luxury..."
                    />
                </Field>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending
                        ? "Submitting..."
                        : "Send Enquiry"}
                </Button>
            </form>
        </div>
    );
}