import { GROUP_TYPE, GroupType } from "@/types/leads";

export const GROUP_TYPE_OPTIONS = [
  { value: GROUP_TYPE.SOLO, label: "Solo" },
  { value: GROUP_TYPE.FRIENDS, label: "Friends" },
  { value: GROUP_TYPE.COUPLE, label: "Couple" },
  { value: GROUP_TYPE.FAMILY, label: "Family" },
] as const;

export type { GroupType };
