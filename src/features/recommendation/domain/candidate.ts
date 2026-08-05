import { Videogame } from "../../videogames/domain/videogame";

export type Candidate = Pick<
  Videogame,
  | "id"
  | "name"
  | "summary"
  | "timeToBeat"
  | "totalRatingCount"
  | "firstReleaseDate"
  | "ageRatings"
  | "genres"
  | "platforms"
  | "languageSupport"
  | "involvedCompanies"
> & {
  coverUrl: string;
};
