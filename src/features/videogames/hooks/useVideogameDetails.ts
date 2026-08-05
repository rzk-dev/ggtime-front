import { useQuery } from "@tanstack/react-query";
import { fetchVideogame } from "../api/videogamesApi";

export function useVideogameDetails(id: number) {
  return useQuery({
    queryKey: ["videogames", id],
    queryFn: () => fetchVideogame(id)
  })
}
