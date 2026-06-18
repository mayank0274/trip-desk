import { z } from "zod";

export const LeadSummarySchema = z.object({
  summary: z.string(),
});
