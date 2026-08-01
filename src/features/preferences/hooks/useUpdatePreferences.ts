import { useMutation } from "@tanstack/react-query";
import { updatePreferences } from "../api/preferencesApi";
import { queryClient } from "@/src/lib/queryClient";

export function useUpdatePreferences() {
  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["preferences"],
      });
    },
  })
}
