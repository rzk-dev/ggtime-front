import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "../api/genresApi";

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres
  })
}
