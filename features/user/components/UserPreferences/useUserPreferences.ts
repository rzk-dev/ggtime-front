import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/SupabaseProvider";
import { userPreferencesStore } from "@/hooks/usePreferencesStore";
import {
  getUserPreferences,
  createUserPreferences,
  updateUserPreferences,
} from "@/features/user/api";
import { PLATFORM_CATEGORIES, LANGUAGE_GROUPS } from "./constants";
import type { Genre, Platform, UserPreferencesPayload } from "@/features/user/api";
import type { OnApplyPayload } from "./types";

export function useUserPreferences(
  onApply: (p: OnApplyPayload) => void,
  onClose: () => void,
) {
  const [selectedPlatformCategories, setSelectedPlatformCategories] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres]                         = useState<Genre[]>([]);
  const [selectedLanguageGroups, setSelectedLanguageGroups]         = useState<string[]>([]);
  const [weeklyPlayTime, setWeeklyPlayTime]                         = useState("");
  const [preferencesExist, setPreferencesExist]                     = useState(false);
  const [isLoading, setIsLoading]                                   = useState(true);

  const { session } = useSupabase();
  const { setPlatforms, setGenres, setGamingHours, setLanguages } = userPreferencesStore();

  // ── Fetch existing preferences on mount ───────────────────────────────────

  useEffect(() => {
    if (!session?.access_token) return;

    (async () => {
      try {
        const data = await getUserPreferences(session.access_token);

        const isEmpty =
          !data ||
          ((!data.genres || data.genres.length === 0) &&
            (!data.platforms || data.platforms.length === 0) &&
            (!data.languages || data.languages.length === 0) &&
            !data.gamingHours);

        setPreferencesExist(!isEmpty);
      } catch {
        // GET failed or returned nothing → treat as no preferences yet
        setPreferencesExist(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session?.access_token]);

  // ── Toggles ────────────────────────────────────────────────────────────────

  const togglePlatformCategory = (label: string) =>
    setSelectedPlatformCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );

  const toggleGenre = (genre: Genre) =>
    setSelectedGenres((prev) =>
      prev.some((g) => g.id === genre.id)
        ? prev.filter((g) => g.id !== genre.id)
        : [...prev, genre],
    );

  const toggleLanguageGroup = (label: string) =>
    setSelectedLanguageGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );

  // ── Derived selections ─────────────────────────────────────────────────────

  const getSelectedPlatforms = (): Platform[] =>
    PLATFORM_CATEGORIES.filter((cat) =>
      selectedPlatformCategories.includes(cat.label),
    ).flatMap((cat) => cat.platforms);

  const getSelectedLanguageVariants = () =>
    LANGUAGE_GROUPS.filter((g) =>
      selectedLanguageGroups.includes(g.label),
    ).flatMap((g) => g.variants);

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleApply = async () => {
    try {
      const selectedPlatforms = getSelectedPlatforms();
      const selectedLanguages = getSelectedLanguageVariants();

      const payload = {
        gamingHours: Number(weeklyPlayTime) || 0,
        genres:      selectedGenres,
        platforms:   selectedPlatforms,
        languages:   selectedLanguages,
      };

      const response = preferencesExist
        ? await updateUserPreferences(session?.access_token ?? "", payload)
        : await createUserPreferences(session?.access_token ?? "", payload);

      console.log("Preferencias guardadas:", response);

      setPlatforms(selectedPlatforms.map((p) => p.name));
      setGenres(selectedGenres.map((g) => g.name));
      setGamingHours(Number(weeklyPlayTime) || 0);
      setLanguages(selectedLanguages.map((l) => l.name));

      onApply({
        selectedPlatforms:  selectedPlatforms.map((p) => p.name),
        selectedGenres:     selectedGenres.map((g) => g.name),
        selectedLanguages:  selectedLanguages.map((l) => l.name),
        weeklyPlayTime,
      });
      onClose();
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
    }
  };

  return {
    // State
    selectedPlatformCategories,
    selectedGenres,
    selectedLanguageGroups,
    weeklyPlayTime,
    isLoading,
    setWeeklyPlayTime,
    // Toggles
    togglePlatformCategory,
    toggleGenre,
    toggleLanguageGroup,
    // Actions
    handleApply,
  };
}