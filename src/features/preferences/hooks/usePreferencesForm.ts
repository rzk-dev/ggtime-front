import { useEffect, useState } from "react";
import { useGenres } from "../../catalog/hooks/useGenres"
import { usePlatforms } from "../../catalog/hooks/usePlatforms"
import { useCreatePreferences } from "./useCreatePreferences"
import { usePreferences } from "./usePreferences"
import { useUpdatePreferences } from "./useUpdatePreferences";
import { Platform } from "@/src/domain/catalog/platform";
import { Genre } from "@/src/domain/catalog/genre";
import { useLanguages } from "../../catalog/hooks/useLanguages";
import { Language } from "@/src/domain/catalog/language";

export function usePreferencesForm() {
  const { data: preferences } = usePreferences();
  const { data: platforms = [] } = usePlatforms();
  const { data: genres = [] } = useGenres();
  const { data: languages = [] } = useLanguages();

  const createMutation = useCreatePreferences();
  const updateMutation = useUpdatePreferences();

  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [weeklyGamingHours, setWeeklyGamingHours] = useState<string>("0");

  useEffect(() => {
    if (!preferences) { return; }

    setSelectedPlatforms(platforms.map((p: Platform) => p.id));
    setSelectedGenres(genres.map((g: Genre) => g.id));
    setSelectedLanguages(languages.map((l: Language) => l.id))

    setWeeklyGamingHours(preferences.gamingHours.toString());

  }, [preferences]);

  const togglePlatform = (id: number) => {
    setSelectedPlatforms(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
    )
  }

  const toggleGenre = (id: number) => {
    setSelectedGenres(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id])
  }

  const toggleLanguages = (id: number) => {
    setSelectedLanguages(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
    )
  }

  async function save() {
    const gamingHours: number = Number(weeklyGamingHours) > 0
      ? Number(weeklyGamingHours)
      : preferences?.gamingHours ?? 0

    const payload = {
      id: preferences?.id ?? 0,
      gamingHours,
      genres: genres.filter(g => selectedGenres.includes(g.id)),
      platforms: platforms.filter(p => selectedPlatforms.includes(p.id)),
      languages: languages.filter(p => selectedLanguages.includes(p.id))
    }

    if (preferences) {
      await updateMutation.mutateAsync(payload)
    }
    else {
      const { id, ...createInput } = payload
      await createMutation.mutateAsync(createInput)
    }
  }

  return {
    platforms,
    genres,

    selectedPlatforms,
    selectedGenres,
    weeklyGamingHours,

    setWeeklyGamingHours,
    togglePlatform,
    toggleGenre,
    save,

    isLoading:
      createMutation.isPending ||
      updateMutation.isPending,
  };
}

