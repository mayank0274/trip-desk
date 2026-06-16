import { createSupabaseServerClient } from "@/supabase/server";

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export async function GET(
    _req: Request,
    { params }: Props
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return Response.json(
                { message: "Trip slug is required to get details" },
                { status: 400 }
            );
        }

        const supabase = await createSupabaseServerClient();

        const { data, error } = await supabase
            .from("trips")
            .select("*")
            .eq("slug", slug)
            .eq("status", "open")
            .single();

        if (error || !data) {
            return Response.json(
                { message: "Trip not found" },
                { status: 404 }
            );
        }

        return Response.json({
            trip: data,
            message: "Trip loaded successfully",
        }, { status: 200 });
    } catch (error) {
        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}