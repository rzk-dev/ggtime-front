import { Cover } from "./cover";
import { Companies } from "./involvedCompanies";
import { Platform } from "./platform";
import { Genre } from "./genres";

export type VideogameDetail = {
  id: number;
  name: string;
  slug: string;
  ageRatings: string[];
  cover: Cover;
  platforms: Platform[];
  genres: Genre[];
  keywords: string[];
  playerPerspectives: string;
  involvedCompanies: Companies[];
  summary: string;
  totalRatingCount: number;
  languageSupports: string[];
  firstReleaseDate: number;
}
