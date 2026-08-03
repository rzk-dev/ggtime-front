import { Platform } from "@/src/domain/catalog/platform";
import { AgeRating } from "./ageRating";
import { Genre } from "@/src/domain/catalog/genre";
import { Language } from "@/src/domain/catalog/language";
import { TimeToBeat } from "./timeToBeat";
import { Company } from "./company";

export interface Videogame {
  id: number;
  name: string;
  summary: string;
  coverUrl: string,
  firstReleaseDate: number;
  timeToBeat: TimeToBeat
  genres: Genre[]
  platforms: Platform[]
  totalRatingCount: number;
  keywords: string[]
  ageRatings: AgeRating[];
  languageSupports: Language[]
  involvedCompanies: Company[]
}

export type VideogamePreview = Pick<
  Videogame,
  | "id"
  | "name"
  | "coverUrl"
  | "ageRatings"
  | "platforms"
>;
