import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSupabase } from "@/lib/SupabaseProvider";
import { userPreferencesStore } from "@/hooks/usePreferencesStore";
import {
  getUserPreferences,
  createUserPreferences,
  updateUserPreferences,
} from "@/features/user/api";
import { PLATFORM_CATEGORIES, LANGUAGE_GROUPS } from "./constants";
import type { Genre, Platform } from "@/features/user/api";
import type { OnApplyPayload } from "./types";

export function useUserPreferences(
  onApply: (p: OnApplyPayload) => void,
  onClose: () => void,
) {
  const [selectedPlatformCategories, setSelectedPlatformCategories] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres]                         = useState<Genre[]>([]);
  const [selectedLanguageGroups, setSelectedLanguageGroups]         = useState<string[]>([]);
  const [weeklyPlayTime, setWeeklyPlayTime]                         = useState("");

  const { session } = useSupabase();
  const { setPlatforms, setGenres, setGamingHours, setLanguages } = userPreferencesStore();

  // ── GET existing preferences ───────────────────────────────────────────────

  const { data: existingPreferences, isPending: isLoading } = useQuery({
    queryKey: ["userPreferences", session?.access_token],
    queryFn: () => getUserPreferences(session!.access_token),
    enabled: !!session?.access_token,
    retry: false,
  });

  const preferencesExist =
    !!existingPreferences &&
    (
      (existingPreferences.genres?.length   ?? 0) > 0 ||
      (existingPreferences.platforms?.length ?? 0) > 0 ||
      (existingPreferences.languages?.length ?? 0) > 0 ||
      !!existingPreferences.gamingHours
    );

  // ── POST / PUT mutation ────────────────────────────────────────────────────

  const { mutateAsync: savePreferences } = useMutation({
    mutationFn: (payload: Parameters<typeof createUserPreferences>[1]) =>
      preferencesExist
        ? updateUserPreferences(session?.access_token ?? "", payload)
        : createUserPreferences(session?.access_token ?? "", payload),
    onSuccess: (response) => {
      console.log("Preferencias guardadas:", response);
    },
    onError: (error) => {
      console.error("Error al guardar preferencias:", error);
    },
  });

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
    const selectedPlatforms = getSelectedPlatforms();
    const selectedLanguages = getSelectedLanguageVariants();

    const payload = {
      gamingHours: Number(weeklyPlayTime) || 0,
      genres:      selectedGenres,
      platforms:   selectedPlatforms,
      languages:   selectedLanguages,
    };

    await savePreferences(payload);

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