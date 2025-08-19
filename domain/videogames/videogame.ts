import { Cover } from "./cover";
import { Platform } from "./platform";

export type Videogame = {
  id: number;
  name: string;
  slug: string;
  ageRatings: string[];
  cover: Cover
  platforms: Platform[];
}
