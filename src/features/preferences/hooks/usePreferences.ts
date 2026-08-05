import { useQuery } from "@tanstack/react-query";
import { fetchPreferences } from "../api/preferencesApi";

export function usePreferences() {
  return useQuery({
    queryKey: ["preferences"],
    queryFn: fetchPreferences
  })
}
