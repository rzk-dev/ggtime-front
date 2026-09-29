import { Cover } from "./cover";
import { Companies } from "./involvedCompanies";
import { GamePlatforms } from "./platform";
import { Languages } from "./languages";
import { TimeToBeat } from "./timeToBeat";
import { Genre } from "@/src/domain/catalog/genre";

export type VideogameDetail = {
  id: number;
  name: string;
  slug: string;
  ageRatings: string[];
  cover: Cover;
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
