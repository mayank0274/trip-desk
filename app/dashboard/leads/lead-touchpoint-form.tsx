"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    AlertCircle,
    Phone,
    MessageCircle,
    Mail,
} from "lucide-react";

import { Field } from "@/app/dashboard/trips/create-trip";

interface IProps {
    leadId: string;
    userId: string;
    open: boolean;
    onOpenChange: (val: boolean) => void;
}

export function CreateLeadTouchpointDialog({
    leadId,
    userId,
    open,
    onOpenChange,
}: IProps) {
    const [contactVia, setContactVia] = useState("");

    const mutation = useMutation({
        mutationFn: async (payload: {
            lead_id: string;
            user_id: string;
            contact_via: string;
            note: string;
            next_action?: string;
        }) => {
            const response = await axios.post(
                "/api/admin/leads/touchpoints",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        },
    });

    function handleOpenChange(next: boolean) {
        if (!next) {
            mutation.reset();
            setContactVia("");
        }

        onOpenChange(next);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        mutation.mutate({
            lead_id: leadId,
            user_id: userId,
            contact_via: String(formData.get("contact_via")),
            note: String(formData.get("note")),
            next_action: String(formData.get("next_action") || ""),
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add Lead Touchpoint</DialogTitle>
                </DialogHeader>

                {mutation.isSuccess ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                        <CheckCircle2 className="size-12 text-green-500" />
                        <p className="text-lg font-semibold">
                            Touchpoint added!
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Lead touchpoint has been created successfully.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 pt-1"
                    >
                        {mutation.isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="size-4" />
                                <AlertDescription>
                                    {(mutation.error as Error)?.message ??
                                        "Something went wrong."}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <label
                                    htmlFor="contact_via"
                                    className="text-sm font-medium"
                                >
                                    Contact Via
                                </label>

                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer gap-1"
                                    onClick={() => setContactVia("call")}
                                >
                                    <Phone className="size-3" />
                                    Call
                                </Badge>

                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer gap-1"
                                    onClick={() => setContactVia("whatsapp")}
                                >
                                    <MessageCircle className="size-3" />
                                    WhatsApp
                                </Badge>

                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer gap-1"
                                    onClick={() => setContactVia("email")}
                                >
                                    <Mail className="size-3" />
                                    Email
                                </Badge>
                            </div>

                            <Input
                                id="contact_via"
                                name="contact_via"
                                value={contactVia}
                                onChange={(e) => setContactVia(e.target.value)}
                                required
                            />
                        </div>

                        <Field label="Note" htmlFor="note">
                            <Textarea
                                id="note"
                                name="note"
                                rows={4}
                                placeholder="Enter touchpoint notes..."
                                required
                            />
                        </Field>

                        <Field label="Next Action" htmlFor="next_action">
                            <Textarea
                                id="next_action"
                                name="next_action"
                                rows={3}
                                placeholder="Optional follow-up action..."
                            />
                        </Field>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending
                                ? "Saving..."
                                : "Add Touchpoint"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}