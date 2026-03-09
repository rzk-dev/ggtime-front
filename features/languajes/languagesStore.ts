import { Languages } from "@/domain/videogames/languages";
import { getLanguages } from "@/features/languajes/api";

let languagesCache: Languages[] | null = null;

export async function fetchLanguages(token: string): Promise<Languages[]> {
  if (languagesCache) {
    console.log("Using languages from cache:", languagesCache);
    return languagesCache;
  }

  const data = await getLanguages(token);
  languagesCache = data;
  console.log("Using languages from API:", data);
  return data;
}

export function getCachedLanguages(): Languages[] | null {
  return languagesCache;
}

export function clearLanguagesCache() {
  languagesCache = null;
  console.log("CACHE CLEAN ---> LANGUAGES");
}
