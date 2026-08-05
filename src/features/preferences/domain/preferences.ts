import { Genre } from "@/src/domain/catalog/genre"
import { Language } from "@/src/domain/catalog/language"
import { Platform } from "@/src/domain/catalog/platform"

export type Preference = {
  id: number,
  gamingHours: number,
  genres: Genre[],
  platforms: Platform[],
  languages: Language[]
}
