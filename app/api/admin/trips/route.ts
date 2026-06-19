import { requireRole } from "@/lib/auth/require-role";
import { createTripSchema, TripQuerySchema } from "@/lib/validators/trip";
import { supabaseAdmin } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

export async function POST(req: Request) {
    try {

        const payload = await req.json();
        const result = await createTripSchema.safeParseAsync(payload);
        if (!result.success) {
            const errorMessage = result.error.issues
                .map(issue => `${issue.path.join(".")} : ${issue.message}`)
                .join("\n");
            return Response.json(
                { message: errorMessage, data: {} },
                { status: 400 }
            );
        }

        const { start_date, end_date } = result.data;
        if (new Date(end_date).getTime() < new Date(start_date).getTime()) {
            return Response.json(
                { message: "End date cannot be earlier than start date", data: {} },
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

        const client = supabaseAdmin

        const { data, error } = await client
            .from("trips")
            .insert(result.data)
            .select()
            .single();

        if (error) {
            return Response.json(
                {
                    message: error.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                message: "Trip created successfully",
                data,
            },
            { status: 201 }
        );

    } catch (error) {
        return Response.json(
            { message: "Some unexpected error occured", data: {} },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const supabase = supabaseAdmin;

        const { searchParams } = new URL(req.url);

        const parsed = TripQuerySchema.safeParse({
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
            state: searchParams.get("state") ?? "all",
        });

        if (!parsed.success) {
            return Response.json(
                {
                    message: parsed.error.message,
                },
                { status: 400 }
            );
        }

        const { page, limit, state } = parsed.data;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from("trips")
            .select("*", { count: "exact" });

        if (state !== "all") {
            query = query.eq("status", state);
        }

        const { data, error, count } = await query
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) {
            return Response.json(
                { message: error.message },
                { status: 500 }
            );
        }

        return Response.json({
            data: {
                trips: data,
                pagination: {
                    page,
                    limit,
                    total: count ?? 0,
                    totalPages: Math.ceil((count ?? 0) / limit),
                    hasNext: page * limit < (count ?? 0),
                    hasPrevious: page > 1,
                },
            },
            message: "Trip loading success",
        })
    } catch (error) {
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

