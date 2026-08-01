import { useMutation } from "@tanstack/react-query";
import { createPreferences } from "../api/preferencesApi";
import { queryClient } from "@/src/lib/queryClient";

export function useCreatePreferences() {
  return useMutation({
    mutationFn: createPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["preferences"]
      })
    }
  })
}
