import { requireRole } from "@/lib/auth/require-role";
import { supabaseAdmin } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

export async function GET() {
  try {
    const auth = await requireRole(["admin"]);
    if (!auth) {
      return Response.json({ message: "Forbidden", data: {} }, { status: 403 });
    }

    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("team")
      .select("id, full_name")
      .eq("role", "sales");

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(
      { team: data, message: "Sales members loaded" },
      { status: 200 },
    );
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
