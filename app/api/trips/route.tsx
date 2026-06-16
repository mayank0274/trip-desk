import { TripPublicQuerySchema } from "@/lib/validators/trip";
import { createSupabaseServerClient } from "@/supabase/server";

export async function GET(req: Request) {
    try {
        const supabase = await createSupabaseServerClient();

        const { searchParams } = new URL(req.url);

        const parsed = TripPublicQuerySchema.safeParse({
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
        });

        if (!parsed.success) {
            return Response.json(
                {
                    message: parsed.error.message,
                },
                { status: 400 }
            );
        }

        const { page, limit } = parsed.data;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from("trips")
            .select("*", { count: "exact" }).eq("status", "open");

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
        console.error(error);

        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

