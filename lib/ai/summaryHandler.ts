import { generateText, Output } from "ai";
import { model } from "./client";
import { LeadSummarySchema } from "./schema";

type Conversation = {
  contact_via: string;
  note: string;
  next_action: string;
};

export function buildLeadSummaryPrompt(conversations: Conversation[]) {
  const formattedLog = conversations
    .map((c, i) =>
      `
Entry ${i + 1}
Contact Via: ${c.contact_via}
Note: ${c.note}
Next Action: ${c.next_action}
      `.trim(),
    )
    .join("\n\n");

  return `
You are a CRM assistant responsible for summarising lead activity.

TASK:
Summarise the entire call log into ONE concise sentence.

OUTPUT RULES:
- Exactly one sentence
- Describe: where the lead stands + next action
- No bullet points
- No labels or formatting
- Clear, business-ready tone

CALL LOG:
${formattedLog}
  `.trim();
}

export async function summaryHandler(payload: Conversation[]) {
  const prompt = buildLeadSummaryPrompt(payload);

  const result = await generateText({
    model,
    prompt,
    output: Output.object({
      schema: LeadSummarySchema,
    }),
  });

  return result.output;
}
