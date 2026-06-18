import { z } from "zod";
import { Pagination } from "../trips/types";
import { editLeadSchema } from "@/lib/validators/leads";

export const LEAD_STATUS = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  QUALIFIED: "QUALIFIED",
  VIBE_CHECK_SENT: "VIBE_CHECK_SENT",
  CONFIRMED: "CONFIRMED",
  NOT_A_FIT: "NOT_A_FIT",
} as const;

export type LeadStatus = (typeof LEAD_STATUS)[keyof typeof LEAD_STATUS];

export const GROUP_TYPE = {
  SOLO: "SOLO",
  FRIENDS: "FRIENDS",
  COUPLE: "COUPLE",
  FAMILY: "FAMILY",
} as const;

export type GroupType = (typeof GROUP_TYPE)[keyof typeof GROUP_TYPE];

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;

  trip_id: string | null;

  group_type: GroupType;

  preferred_month: string;

  enquirer_note: string | null;

  status: LeadStatus;

  owner_id: string | null;

  created_at: string;
  updated_at: string;
}

export interface LeadWithTrip extends Omit<Lead, "trip_id"> {
  trip_id: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface LeadsResponse {
  data: {
    leads: LeadWithTrip[];
    pagination: Pagination;
  };
  message: string;
}

export type EditLead = z.infer<typeof editLeadSchema>;

export interface AssignableTeamMembersResponse {
  team: {
    id: string;
    full_name: string;
  }[];
  message: string;
}

export interface LeadTouchPoints {
  lead_id: string;
  contact_via: string;
  note: string;
  id: string;
  next_action: string;
  created_at: string;
}

export interface LeadTouchPointsResponse {
  touchpoints: LeadTouchPoints[];
  message: string;
}

export type AIRequest = {
  type: "summary";
  payload: Pick<LeadTouchPoints, "contact_via" | "next_action" | "note">[];
};

export type AiResponse = {
  data: {
    type: "summary";
    res: { summary: string };
  };
  message: string;
};
