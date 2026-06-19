import { requireRole } from "@/lib/auth/require-role";
import { editTripSchema } from "@/lib/validators/trip";
import { supabaseAdmin } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function DELETE(
    req: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        if (!id) {
            return Response.json(
                { message: "Trip id is required to delete" },
                { status: 400 }
            );
        }

        const auth = await requireRole(["admin", "sales"]);
        if (!auth) {
            return Response.json(
                { message: "Forbidden", data: {} },
                { status: 403 }
            );
        }

        const supabase = supabaseAdmin;

        const { error } = await supabase
            .from("trips")
            .delete()
            .eq("id", id);

        if (error) {
            return Response.json(
                { message: error.message },
                { status: 500 }
            );
        }

        return Response.json({
            message: "Trip deleted successfully",
        });
    } catch {
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: RouteParams
) {
    try {
        const { id } = await params;

        if (!id) {
            return Response.json(
                { message: "Trip id is required to edit", data: {} },
                { status: 500 }
            );
        }

        const auth = await requireRole(["admin", "sales"]);
        if (!auth) {
            return Response.json(
                { message: "Forbidden", data: {} },
                { status: 403 }
            );
        }

        const payload = await req.json();

        const result = await editTripSchema.safeParseAsync(payload);

        if (!result.success) {
            const errorMessage = result.error.issues
                .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
                .join("\n");

            return Response.json(
                { message: errorMessage, data: {} },
                { status: 400 }
            );
        }

        const { start_date, end_date } = result.data;

        if (
            new Date(end_date).getTime() <
            new Date(start_date).getTime()
        ) {
            return Response.json(
                {
                    message:
                        "End date cannot be earlier than start date",
                    data: {},
                },
                { status: 400 }
            );
        }

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from("trips")
            .update(result.data)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return Response.json(
                { message: error.message },
                { status: 500 }
            );
        }

        return Response.json(
            {
                message: "Trip edited successfully",
                data,
            },
            { status: 200 }
        );
    } catch {
        return Response.json(
            { message: "Some unexpected error occured", data: {} },
            { status: 500 }
        );
    }
}