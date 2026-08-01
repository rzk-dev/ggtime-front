import { GamePlatforms } from "./platform";

export type Videogame = {
  id: number;
  name: string;
  //slug: string;
  //ageRatings: string[];
  coverUrl: string;
  platforms: GamePlatforms[];
}
