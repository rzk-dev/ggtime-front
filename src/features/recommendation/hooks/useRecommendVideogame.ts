import { useMutation } from "@tanstack/react-query";
import { recommendVideogame } from "../api/recommendationApi";
import { usePreferences } from "../../preferences/hooks/usePreferences";

export function useRecommendVideogame() {
  const { data: preferences } = usePreferences()

  return useMutation({
    mutationFn: async () => {
      if (!preferences) {
        throw new Error("User preferences not loaded");
      }

      return recommendVideogame(preferences);
    },
  });
}
