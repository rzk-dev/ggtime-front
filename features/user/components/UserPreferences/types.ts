// ─── Shared Types ─────────────────────────────────────────────────────────────

export type Genre = { id: number; name: string; slug: string };
export type Platform = { id: number; name: string; slug: string };

export type LanguageVariant = { id: number; locale: string; name: string };
export type LanguageGroup = {
  label: string;       // e.g. "English"
  variants: LanguageVariant[];
};

export type PlatformCategory = {
  label: string;
  icon: any;
  platforms: Platform[];
};

export type OnApplyPayload = {
  selectedPlatforms: string[];
  selectedGenres: string[];
  selectedLanguages: string[];
  weeklyPlayTime: string;
};
