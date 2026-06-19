import { createSupabaseServerClient } from "@/supabase/server";
import { createLeadSchema } from "@/lib/validators/leads";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const result = await createLeadSchema.safeParseAsync(payload);
    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
        .join("\n");
      return Response.json(
        { message: errorMessage, data: {} },
        { status: 400 },
      );
    }

    const client = await createSupabaseServerClient();

    const { data, error } = await client
      .from("leads")
      .insert(result.data);

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(
      { message: "Lead created successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { message: "Some unexpected error occured", data: {} },
      { status: 500 },
    );
  }
}
