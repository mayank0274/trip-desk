import { requireRole } from "@/lib/auth/require-role";
import { CreateLeadTouchPointSchema } from "@/lib/validators/leads";
import { createSupabaseServerClient } from "@/supabase/server";

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        const result = await CreateLeadTouchPointSchema.safeParseAsync(
            payload
        );

        if (!result.success) {
            const errorMessage = result.error.issues
                .map(
                    (issue) =>
                        `${issue.path.join(".")} : ${issue.message}`
                )
                .join("\n");

            return Response.json(
                { message: errorMessage },
                { status: 400 }
            );
        }

        const auth = await requireRole(["admin", "sales"]);

        if (!auth) {
            return Response.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const supabase = await createSupabaseServerClient();

        const { data, error } = await supabase
            .from("lead_touchpoints")
            .insert(result.data)
            .select()
            .single();

        if (error) {
            return Response.json(
                { message: error.message },
                { status: 500 }
            );
        }

        const { error: leadError } = await supabase
            .from("leads")
            .update({
                updated_at: new Date().toISOString(),
            })
            .eq("id", result.data.lead_id);

        if (leadError) {
            return Response.json(
                {
                    message:
                        "Touchpoint created but failed to update lead activity.",
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                message: "Touchpoint created",
                data,
            },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}