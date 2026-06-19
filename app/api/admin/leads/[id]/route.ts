import { requireRole } from "@/lib/auth/require-role";
import { editLeadSchema } from "@/lib/validators/leads";
import { supabaseAdmin } from "@/supabase/admin";
import { createSupabaseServerClient } from "@/supabase/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { message: "Lead id is required to edit", data: {} },
        { status: 400 },
      );
    }

    const auth = await requireRole(["admin", "sales"]);
    if (!auth) {
      return Response.json({ message: "Forbidden", data: {} }, { status: 403 });
    }

    const payload = await req.json();

    const result = await editLeadSchema.safeParseAsync(payload);

    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
        .join("\n");

      return Response.json(
        { message: errorMessage, data: {} },
        { status: 400 },
      );
    }

    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("leads")
      .update(result.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(
      {
        message: "Lead edited successfully",
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { message: "Some unexpected error occured", data: {} },
      { status: 500 },
    );
  }
}
