import { Genre } from "@/src/domain/catalog/genre";
import { api } from "@/src/lib/fetchClient";

const genresEndpoints = {
  root: `/api/genres`
}

export async function fetchGenres(): Promise<Genre[]> {
  const endpoint = genresEndpoints.root
  return await api.get(endpoint)
}
