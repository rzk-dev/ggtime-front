import { Languages } from "../videogames/languages"
import { Genre } from "../videogames/genres"
import { GamePlatforms } from "../videogames/platform"

export type UserPreference = {
    gamingHours: number,
    genres: Genre[],
    platforms: GamePlatforms[],
    languages: Languages[]
}