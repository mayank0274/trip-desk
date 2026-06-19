import { requireRole } from "@/lib/auth/require-role";
import { supabaseAdmin } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        if (!id) {
            return Response.json({ message: "Lead id is required" }, { status: 400 });
        }

        const auth = await requireRole(["admin", "sales"]);
        if (!auth) {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }

        const supabase = supabaseAdmin;

        const { data, error } = await supabase
            .from("lead_touchpoints")
            .select("*")
            .eq("lead_id", id)
            .order("created_at", { ascending: false });

        if (error) {
            return Response.json({ message: error.message }, { status: 500 });
        }

        return Response.json({ data: { touchpoints: data }, message: "Touchpoints loaded" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
