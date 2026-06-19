import { requireRole } from "@/lib/auth/require-role";
import { LeadQuerySchema } from "@/lib/validators/leads";
import { supabaseAdmin } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

export async function GET(req: Request) {
  try {
    const auth = await requireRole(["admin", "sales"]);
    if (!auth) {
      return Response.json({ message: "Forbidden", data: {} }, { status: 403 });
    }

    const supabase = supabaseAdmin;

    const { searchParams } = new URL(req.url);

    const parsed = LeadQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status") || undefined,
      owner: searchParams.get("owner") || undefined,
      search: searchParams.get("search") || undefined,
    });

    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
        .join("\n");
      return Response.json({ message: errorMessage }, { status: 400 });
    }

    const { page, limit, status, owner, search } = parsed.data;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const query = supabase
      .from("leads")
      .select("*, trip_id(id, name, slug)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (auth.role !== "admin") {
      query.eq("owner_id", auth.user.id);
    }

    if (search?.trim()) {
      query.or(
        `name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    if (status) {
      query.eq("status", status);
    }

    if (owner && auth.role === "admin") {
      query.eq("owner_id", owner);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json({
      data: {
        leads: data,
        pagination: {
          page,
          limit,
          total: count ?? 0,
          totalPages: Math.ceil((count ?? 0) / limit),
          hasNext: page * limit < (count ?? 0),
          hasPrevious: page > 1,
        },
        role: auth.role,
      },
      message: "Leads loaded successfully",
    });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
