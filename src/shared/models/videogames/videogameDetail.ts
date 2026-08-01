import { Cover } from "./cover";
import { Companies } from "./involvedCompanies";
import { GamePlatforms } from "./platform";
import { Genre } from "./genres";
import { Languages } from "./languages";
import { AgeRating } from "./ageRating";

export type VideogameDetail = {
  id: number;
  name: string;
  //slug: string;
  ageRatings: AgeRating[];
  coverUrl: string;
  platforms: GamePlatforms[];
  genres: Genre[];
  keywords: string[];
  playerPerspectives: string;
  involvedCompanies: Companies[];
  summary: string;
  totalRatingCount: number;
  languageSupports: Languages[];
  firstReleaseDate: number;
}
