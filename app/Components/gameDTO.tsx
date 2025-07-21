export interface GenreDTO {
  id: number;
  name: string;
  slug: string;
}

export interface PlatformDTO {
  id: number;
  name: string;
  slug: string;
}

export interface GameDTO {
  id: number;
  name: string;
  slug: string;
  releaseDate: number;
  summary: string;
  usersRating: number;
  criticsRating: number;
  genres: GenreDTO[];
  platforms: PlatformDTO[];
}