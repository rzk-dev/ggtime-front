import { Genre, Language, Platform } from "@/src/domain/videogames/catalog"

export type Preference = {
  id: number,
  gamingHours: number,
  genres: Genre[],
  platforms: Platform[],
  languages: Language[]
}
