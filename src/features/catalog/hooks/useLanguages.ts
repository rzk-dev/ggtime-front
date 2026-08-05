import { useQuery } from "@tanstack/react-query";
import { fetchLanguages } from "../api/languageApi";

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages
  })
}
