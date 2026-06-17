export const GROUP_TYPES = {
  SOLO: "SOLO",
  FRIENDS: "FRIENDS",
  COUPLE: "COUPLE",
  FAMILY: "FAMILY",
} as const;

export const GROUP_TYPE_OPTIONS = [
  { value: GROUP_TYPES.SOLO, label: "Solo" },
  { value: GROUP_TYPES.FRIENDS, label: "Friends" },
  { value: GROUP_TYPES.COUPLE, label: "Couple" },
  { value: GROUP_TYPES.FAMILY, label: "Family" },
] as const;

export type GroupType = keyof typeof GROUP_TYPES;
