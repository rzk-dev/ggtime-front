import { Genre } from "./genre";
import { Platform } from "./platform";

export type Videogame = {
  id: number;
  name: string;
  slug: string;
  releaseDate: number;
  summary: string;
  usersRating: number;
  criticsRating: number;
  genres: Genre[];
  platforms: Platform[];
}
