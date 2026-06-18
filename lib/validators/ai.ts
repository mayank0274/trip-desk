import { z } from "zod";

const conversation = z.object({
  contact_via: z.string(),
  note: z.string(),
  next_action: z.string(),
});

export const SummaryPayloadSchema = z.array(conversation);
