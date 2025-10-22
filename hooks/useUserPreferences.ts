import { getUserPreferences } from "@/features/user/api";
import { useSupabase } from "@/lib/SupabaseProvider";
import { useQuery } from "@tanstack/react-query";
import { userPreferencesStore } from "./usePreferencesStore";
import { useEffect } from "react";

export function useUserPreferences() {
  console.log("useUserPreferences hook called");
  const { session } = useSupabase();
  const token = session?.access_token ?? "";

  const setPlatforms = userPreferencesStore((state) => state.setPlatforms);
  const setGenres = userPreferencesStore((state) => state.setGenres);
  const setGamingHours = userPreferencesStore((state) => state.setGamingHours);

  const {
    isLoading,
    isError,
    error,
    data: preferences,
  } = useQuery({
    queryKey: ["user-preferences", token],
    queryFn: async () => {
      console.log("Fetching user preferences with token:", token);
      const data = await getUserPreferences(token);
      console.log("Fetched preferences:", data);
      return data;
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (preferences) {
      setPlatforms(preferences.platforms ?? []);
      setGenres(preferences.genres ?? []);
      setGamingHours(preferences.gamingHours ?? 0);
    }
  }, [preferences, setPlatforms, setGenres, setGamingHours]);

  if (isError) console.error("useUserPreferences error:", error);

  return { isLoading, isError };
}
