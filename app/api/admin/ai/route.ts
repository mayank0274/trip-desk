import { aiRegistry, AIType } from "@/lib/ai/registry";
import { SummaryPayloadSchema } from "@/lib/validators/ai";
import { requireRole } from "@/lib/auth/require-role";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, payload } = body;

    const handler = aiRegistry[type as AIType];

    if (!handler) {
      return Response.json({ message: "Invalid type" }, { status: 400 });
    }

    let validatedPayload;

    switch (type) {
      case "summary":
        validatedPayload = SummaryPayloadSchema.safeParse(payload);
        break;

      default:
        return Response.json({ message: "Invalid type" }, { status: 400 });
    }

    if (!validatedPayload.success) {
      const errorMessage = validatedPayload.error.issues
        .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
        .join("\n");
      return Response.json({ message: errorMessage }, { status: 400 });
    }

    const auth = await requireRole(["admin", "sales"]);

    if (!auth) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const result = await handler(validatedPayload.data);

    return Response.json(
      { data: { res: result, type }, message: "success" },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { message: error?.message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
