export const MENU = {
  HOME: "",
  SECRET: "secret",
  TRASH: "trash",
  COMMUNITY: "community",
  CALENDAR: "calendar",
  CATEGORY: "category",
  SETTINGS: "settings",
} as const;

export const VALID_MENU_FROM: readonly string[] = [MENU.HOME, MENU.SECRET, MENU.TRASH, MENU.COMMUNITY];

/** 노트 기본 배경색 (amber-50) */
export const DEFAULT_NOTE_COLOR = "#fef3c7";
