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
