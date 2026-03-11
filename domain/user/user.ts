import type {
  Genre,
  Language,
  Platform,
} from "@/features/user/api";

export type User = {
  id: number;
  gamingHours: number;
  genres: Genre[];
  platforms: Platform[];
  languages: Language[];
};