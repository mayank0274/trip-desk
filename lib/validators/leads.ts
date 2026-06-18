import { z } from "zod";
import { GROUP_TYPE, LEAD_STATUS } from "@/types/leads";

export const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(100, "Name is too long"),

  phone: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian mobile number",
    ),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  trip_id: z.uuid("Invalid trip"),

  group_type: z.enum(Object.values(GROUP_TYPE)),

  preferred_month: z.string().date(),

  enquirer_note: z.string().trim().max(1000, "Message is too long").optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const LeadQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  status: z.enum(Object.values(LEAD_STATUS)).optional(),
  owner: z.string().uuid("Invalid owner ID").optional(),
  search: z.string().optional(),
});

export type LeadQueryInput = z.infer<typeof LeadQuerySchema>;

export const editLeadSchema = createLeadSchema.partial().extend({
  status: z.enum(Object.values(LEAD_STATUS)).optional(),
  owner_id: z.string().nullable().optional(),
});

export const CreateLeadTouchPointSchema = z.object({
  lead_id: z.string().uuid("Invalid lead id"),
  user_id: z.string().uuid("Invalid user id").nullable().optional(),

  contact_via: z.string().trim().min(1, "Contact method is required"),

  note: z.string().trim().min(1, "Note is required"),

  next_action: z.string().trim().optional(),
});

export type CreateLeadTouchPointInput = z.infer<
  typeof CreateLeadTouchPointSchema
>;
