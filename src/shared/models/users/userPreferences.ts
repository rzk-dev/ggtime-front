import { Platform } from "react-native"
import { Languages } from "../../videogames/languages"
import { Genre } from "../../videogames/genres"

export type UserPreference = {
    gamingHours: number,
    genres: Genre[],
    platforms: Platform[],
    languages: Languages[]
}