import { Languages } from "../videogames/languages"
import { Genre } from "../videogames/genres"
import { GamePlatforms } from "../videogames/platform"

export type UserPreference = {
    id: number | null,
    gamingHours: number,
    genres: Genre[],
    platforms: GamePlatforms[],
    languages: Languages[]
}