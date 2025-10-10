import { getUserPreferences } from "@/features/user/api";
import { useSupabase } from "@/lib/SupabaseProvider";
import { useQuery } from "@tanstack/react-query";
import { userPreferencesStore } from "./usePreferencesStore";
import { useEffect } from "react";

export function useUserPreferences() {
  const { session } = useSupabase();
  const token = session?.access_token ?? "";

  const setPlatforms = userPreferencesStore((state) => state.setPlatforms);
  const setGenres = userPreferencesStore((state) => state.setGenres);
  const setGamingHours = userPreferencesStore((state) => state.setGamingHours);

  const {
    isLoading,
    isError,
    data: preferences,
  } = useQuery({
    queryKey: ["user-preferences", token],
    queryFn: async () => getUserPreferences(token),
    enabled: !!token,
  });

  useEffect(() => {
    if (preferences) {
      setPlatforms(preferences.platforms ?? []);
      setGenres(preferences.genres ?? []);
      setGamingHours(preferences.gamingHours ?? 0);
    }
  }, [preferences, setPlatforms, setGenres, setGamingHours]);

  return { isLoading, isError };
}
