import { Cover } from "./cover";
import { GamePlatforms } from "./platform";

export type Videogame = {
  id: number;
  name: string;
  slug: string;
  ageRatings: string[];
  cover: Cover
  platforms: GamePlatforms[];
}
