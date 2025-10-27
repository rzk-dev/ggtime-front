import { Genre } from "@/domain/videogames/genres";
import { getGenres } from "@/features/genres/api";

let genresCache: Genre[] | null = null;

export async function fetchGenres(token: string): Promise<Genre[]> {
  if (genresCache) {
    console.log("Using genres from cache:", genresCache);
    return genresCache;
  }

  const data = await getGenres(token);
  genresCache = data;
  console.log("Using genres from API:", data);
  return data;
}

export function getCachedGenres(): Genre[] | null {
  return genresCache;
}

export function clearGenresCache() {
  genresCache = null;
  console.log("CACHE CLEAN ---> GENRES");
}
