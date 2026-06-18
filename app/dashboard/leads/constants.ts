import { LEAD_STATUS, LeadStatus } from "@/types/leads";

export const LEAD_STATUS_OPTIONS: Array<{ value: LeadStatus; label: string }> =
  [
    { value: LEAD_STATUS.NEW, label: "New" },
    { value: LEAD_STATUS.CONTACTED, label: "Contacted" },
    { value: LEAD_STATUS.QUALIFIED, label: "Qualified" },
    { value: LEAD_STATUS.VIBE_CHECK_SENT, label: "Vibe Check Sent" },
    { value: LEAD_STATUS.CONFIRMED, label: "Confirmed" },
    { value: LEAD_STATUS.NOT_A_FIT, label: "Not a Fit" },
  ] as const;
