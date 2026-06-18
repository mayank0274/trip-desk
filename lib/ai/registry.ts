import { summaryHandler } from "./summaryHandler";

export const aiRegistry = {
  summary: summaryHandler,
} as const;

export type AIType = keyof typeof aiRegistry;
