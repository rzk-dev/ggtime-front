import { Platform } from "@/domain/videogames/platform";
import { getPlatforms } from "@/features/platforms/api";

let platformsCache: Platform[] | null = null;

export async function fetchPlatforms(token: string): Promise<Platform[]> {
  if (platformsCache) {
    console.log("Using platforms from CACHE:", platformsCache);
    return platformsCache;
  }

  const data = await getPlatforms(token);
  platformsCache = data;
  console.log("Using platforms from API:", data);
  return data;
}

export function getCachedPlatforms(): Platform[] | null {
  return platformsCache;
}

export function clearPlatformsCache() {
  platformsCache = null;
  console.log("CACHE CLEAN ---> PLATFORMS");
}


/* Cache use example */
{/* 
    import { fetchGenres, getCachedGenres } from "@/features/genres/genresStore";

    const genres = await fetchGenres(session?.access_token ?? "");
    console.log("Available genres:", genres);
*/}