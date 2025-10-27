import { Platform } from "../videogames/platform";
import { Genre } from "../videogames/genres";

export type User = {
  gamingHours: number;
  genres: Genre[];
  platforms: Platform[];
};