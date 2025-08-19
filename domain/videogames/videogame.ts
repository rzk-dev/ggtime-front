import { Cover } from "./cover";
import { Companies } from "./involvedCompanies";
import { Platform } from "./platform";

export type Videogame = {
  id: number;
  name: string;
  slug: string;
  ageRatings: string[];
  cover: Cover;
  platforms: Platform[];
  genres: string[];
  keywords: string[];
  playerPerspectives: string;
  involvedCompanies: Companies[];
  storyline: string;
  totalRatingCount: number;
  languageSupports: string[];
  firstReleaseDate: number;
}
